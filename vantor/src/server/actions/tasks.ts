"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations";
import { createAuditLog } from "@/server/services/audit";

export async function getTasks(filters?: {
  status?: string;
  assigneeId?: string;
  type?: string;
  period?: "today" | "overdue" | "upcoming" | "all";
}) {
  const user = await getSessionUser();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const where: any = { orgId: user.orgId };

  if (user.role === "SELLER") {
    where.assigneeId = user.id;
  } else if (filters?.assigneeId) {
    where.assigneeId = filters.assigneeId;
  }

  if (filters?.status) where.status = filters.status;
  if (filters?.type) where.type = filters.type;

  if (filters?.period === "today") {
    where.dueDate = { gte: todayStart, lt: todayEnd };
    where.status = { in: ["PENDING", "IN_PROGRESS"] };
  } else if (filters?.period === "overdue") {
    where.dueDate = { lt: todayStart };
    where.status = { in: ["PENDING", "IN_PROGRESS"] };
  } else if (filters?.period === "upcoming") {
    where.dueDate = { gte: todayEnd };
    where.status = { in: ["PENDING", "IN_PROGRESS"] };
  }

  return db.task.findMany({
    where,
    include: {
      lead: { select: { id: true, name: true, phone: true } },
      assignee: { select: { id: true, name: true, avatar: true } },
      creator: { select: { id: true, name: true } },
    },
    orderBy: [{ dueDate: "asc" }, { priority: "asc" }],
  });
}

export async function createTask(formData: FormData) {
  const user = await getSessionUser();

  const raw = {
    leadId: formData.get("leadId") as string,
    assigneeId: (formData.get("assigneeId") as string) || user.id,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as string,
    priority: (formData.get("priority") as string) || "MEDIUM",
    dueDate: formData.get("dueDate") as string,
  };

  const parsed = createTaskSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const task = await db.task.create({
    data: {
      orgId: user.orgId,
      leadId: parsed.data.leadId || null,
      assigneeId: parsed.data.assigneeId,
      creatorId: user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      type: parsed.data.type as any,
      priority: parsed.data.priority as any,
      dueDate: new Date(parsed.data.dueDate),
    },
  });

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "Task",
    entityId: task.id,
    action: "created",
    changes: { title: task.title },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function completeTask(taskId: string) {
  const user = await getSessionUser();

  const task = await db.task.findFirst({
    where: { id: taskId, orgId: user.orgId },
  });
  if (!task) return { error: "Tarea no encontrada" };

  await db.task.update({
    where: { id: taskId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  if (task.leadId) {
    await db.activity.create({
      data: {
        leadId: task.leadId,
        userId: user.id,
        type: task.type as any,
        description: `Tarea completada: ${task.title}`,
      },
    });

    await db.lead.update({
      where: { id: task.leadId },
      data: { lastContactAt: new Date() },
    });
  }

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "Task",
    entityId: taskId,
    action: "completed",
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  if (task.leadId) revalidatePath(`/leads/${task.leadId}`);
  return { success: true };
}
