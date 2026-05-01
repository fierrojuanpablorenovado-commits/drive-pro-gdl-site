"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";
import { createActivitySchema, createNoteSchema } from "@/lib/validations";
import { createAuditLog } from "@/server/services/audit";

export async function createActivity(formData: FormData) {
  const user = await getSessionUser();

  const raw = {
    leadId: formData.get("leadId") as string,
    type: formData.get("type") as string,
    description: formData.get("description") as string,
  };

  const parsed = createActivitySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const lead = await db.lead.findFirst({
    where: { id: parsed.data.leadId, orgId: user.orgId },
  });
  if (!lead) return { error: "Lead no encontrado" };

  const activity = await db.activity.create({
    data: {
      leadId: parsed.data.leadId,
      userId: user.id,
      type: parsed.data.type as any,
      description: parsed.data.description || null,
    },
  });

  const updateData: any = { lastContactAt: new Date(), updatedAt: new Date() };
  if (!lead.firstContactAt) {
    updateData.firstContactAt = new Date();
    if (lead.status === "NEW") {
      updateData.status = "CONTACTED";
    }
  }

  await db.lead.update({
    where: { id: parsed.data.leadId },
    data: updateData,
  });

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "Activity",
    entityId: activity.id,
    action: "created",
    changes: { type: parsed.data.type, leadId: parsed.data.leadId },
  });

  revalidatePath(`/leads/${parsed.data.leadId}`);
  revalidatePath("/leads");
  revalidatePath("/pipeline");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function createNote(formData: FormData) {
  const user = await getSessionUser();

  const raw = {
    leadId: formData.get("leadId") as string,
    content: formData.get("content") as string,
  };

  const parsed = createNoteSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const lead = await db.lead.findFirst({
    where: { id: parsed.data.leadId, orgId: user.orgId },
  });
  if (!lead) return { error: "Lead no encontrado" };

  await db.note.create({
    data: {
      leadId: parsed.data.leadId,
      userId: user.id,
      content: parsed.data.content,
    },
  });

  await db.activity.create({
    data: {
      leadId: parsed.data.leadId,
      userId: user.id,
      type: "NOTE",
      description: parsed.data.content.slice(0, 100),
    },
  });

  revalidatePath(`/leads/${parsed.data.leadId}`);
  return { success: true };
}

export async function reassignLead(leadId: string, newAssigneeId: string) {
  const user = await getSessionUser();

  if (!["OWNER", "ADMIN", "MANAGER"].includes(user.role)) {
    return { error: "No tienes permiso para reasignar leads" };
  }

  const lead = await db.lead.findFirst({
    where: { id: leadId, orgId: user.orgId },
    include: { assignedTo: { select: { name: true } } },
  });
  if (!lead) return { error: "Lead no encontrado" };

  const newAssignee = await db.user.findFirst({
    where: { id: newAssigneeId, orgId: user.orgId, isActive: true },
  });
  if (!newAssignee) return { error: "Usuario no encontrado" };

  await db.lead.update({
    where: { id: leadId },
    data: { assignedToId: newAssigneeId, updatedAt: new Date() },
  });

  await db.activity.create({
    data: {
      leadId,
      userId: user.id,
      type: "ASSIGNMENT",
      description: `Reasignado de ${lead.assignedTo?.name || "sin asignar"} a ${newAssignee.name}`,
    },
  });

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "Lead",
    entityId: leadId,
    action: "reassigned",
    changes: { from: lead.assignedToId, to: newAssigneeId },
  });

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
  revalidatePath("/pipeline");
  return { success: true };
}
