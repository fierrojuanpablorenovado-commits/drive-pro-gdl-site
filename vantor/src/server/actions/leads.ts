"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";
import { createLeadSchema, updateLeadSchema } from "@/lib/validations";
import { createAuditLog } from "@/server/services/audit";

export async function getLeads(filters?: {
  search?: string;
  status?: string;
  source?: string;
  assignedToId?: string;
  priority?: string;
  stageId?: string;
  tagId?: string;
}) {
  const user = await getSessionUser();

  const where: any = { orgId: user.orgId };

  if (user.role === "SELLER") {
    where.assignedToId = user.id;
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
      { company: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters?.status) where.status = filters.status;
  if (filters?.source) where.source = filters.source;
  if (filters?.assignedToId) where.assignedToId = filters.assignedToId;
  if (filters?.priority) where.priority = filters.priority;
  if (filters?.stageId) where.stageId = filters.stageId;
  if (filters?.tagId) {
    where.tags = { some: { tagId: filters.tagId } };
  }

  return db.lead.findMany({
    where,
    include: {
      assignedTo: { select: { id: true, name: true, avatar: true } },
      stage: { select: { id: true, name: true, color: true, position: true } },
      tags: { include: { tag: { select: { id: true, name: true, color: true } } } },
      _count: { select: { tasks: true, activities: true, notes: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createLead(formData: FormData) {
  const user = await getSessionUser();

  const raw = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    company: formData.get("company") as string,
    source: formData.get("source") as string,
    interest: formData.get("interest") as string,
    priority: (formData.get("priority") as string) || "MEDIUM",
    assignedToId: formData.get("assignedToId") as string,
  };

  const parsed = createLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const defaultStage = await db.pipelineStage.findFirst({
    where: { orgId: user.orgId, isDefault: true },
  });

  if (!defaultStage) {
    return { error: "No hay etapa por defecto configurada" };
  }

  const lead = await db.lead.create({
    data: {
      orgId: user.orgId,
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      company: parsed.data.company || null,
      source: parsed.data.source || null,
      interest: parsed.data.interest || null,
      priority: parsed.data.priority as any,
      assignedToId: parsed.data.assignedToId || user.id,
      createdById: user.id,
      stageId: defaultStage.id,
      status: "NEW",
    },
  });

  if (parsed.data.tags?.length) {
    await db.leadTag.createMany({
      data: parsed.data.tags.map((tagId) => ({ leadId: lead.id, tagId })),
    });
  }

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "Lead",
    entityId: lead.id,
    action: "created",
    changes: { name: lead.name },
  });

  revalidatePath("/leads");
  revalidatePath("/pipeline");
  revalidatePath("/dashboard");
  return { success: true, leadId: lead.id };
}

export async function updateLead(leadId: string, formData: FormData) {
  const user = await getSessionUser();

  const raw: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (value !== "") raw[key] = value;
  }

  const parsed = updateLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const existing = await db.lead.findFirst({
    where: { id: leadId, orgId: user.orgId },
  });
  if (!existing) return { error: "Lead no encontrado" };

  const lead = await db.lead.update({
    where: { id: leadId },
    data: {
      ...parsed.data,
      updatedAt: new Date(),
    },
  });

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "Lead",
    entityId: lead.id,
    action: "updated",
    changes: parsed.data,
  });

  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/pipeline");
  return { success: true };
}

export async function deleteLead(leadId: string) {
  const user = await getSessionUser();

  if (!["OWNER", "ADMIN"].includes(user.role)) {
    return { error: "No tienes permiso para eliminar leads" };
  }

  const existing = await db.lead.findFirst({
    where: { id: leadId, orgId: user.orgId },
  });
  if (!existing) return { error: "Lead no encontrado" };

  await db.lead.delete({ where: { id: leadId } });

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "Lead",
    entityId: leadId,
    action: "deleted",
    changes: { name: existing.name },
  });

  revalidatePath("/leads");
  revalidatePath("/pipeline");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function moveLeadStage(leadId: string, stageId: string) {
  const user = await getSessionUser();

  const lead = await db.lead.findFirst({
    where: { id: leadId, orgId: user.orgId },
    include: { stage: true },
  });
  if (!lead) return { error: "Lead no encontrado" };

  const newStage = await db.pipelineStage.findFirst({
    where: { id: stageId, orgId: user.orgId },
  });
  if (!newStage) return { error: "Etapa no encontrada" };

  const updateData: any = {
    stageId,
    updatedAt: new Date(),
  };

  if (newStage.isClosedWon) {
    updateData.status = "WON";
    updateData.closedAt = new Date();
  } else if (newStage.isClosedLost) {
    updateData.status = "LOST";
    updateData.closedAt = new Date();
  } else if (lead.status === "NEW" && !newStage.isDefault) {
    updateData.status = "CONTACTED";
    if (!lead.firstContactAt) {
      updateData.firstContactAt = new Date();
    }
  }

  updateData.lastContactAt = new Date();

  await db.lead.update({ where: { id: leadId }, data: updateData });

  await db.activity.create({
    data: {
      leadId,
      userId: user.id,
      type: "STAGE_CHANGE",
      description: `Movido de "${lead.stage.name}" a "${newStage.name}"`,
    },
  });

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "Lead",
    entityId: leadId,
    action: "stage_changed",
    changes: { from: lead.stage.name, to: newStage.name },
  });

  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/pipeline");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getLeadSources() {
  const user = await getSessionUser();
  return db.leadSource.findMany({ where: { orgId: user.orgId } });
}

export async function getTeamMembers() {
  const user = await getSessionUser();
  return db.user.findMany({
    where: { orgId: user.orgId, isActive: true },
    select: { id: true, name: true, role: true, avatar: true },
    orderBy: { name: "asc" },
  });
}

export async function getTags() {
  const user = await getSessionUser();
  return db.tag.findMany({ where: { orgId: user.orgId }, orderBy: { name: "asc" } });
}

export async function getPipelineStages() {
  const user = await getSessionUser();
  return db.pipelineStage.findMany({
    where: { orgId: user.orgId },
    orderBy: { position: "asc" },
  });
}
