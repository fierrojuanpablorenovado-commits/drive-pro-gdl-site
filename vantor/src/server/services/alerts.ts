import { db } from "@/server/db";
import type { AlertType } from "@prisma/client";

export async function checkUnattendedLeads(orgId: string) {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const unattended = await db.lead.findMany({
    where: {
      orgId,
      status: "NEW",
      firstContactAt: null,
      createdAt: { lt: twoHoursAgo },
    },
    select: { id: true, name: true },
  });

  for (const lead of unattended) {
    const existing = await db.alert.findFirst({
      where: {
        orgId,
        leadId: lead.id,
        type: "LEAD_UNATTENDED",
        isRead: false,
      },
    });

    if (!existing) {
      await db.alert.create({
        data: {
          orgId,
          leadId: lead.id,
          type: "LEAD_UNATTENDED",
          message: `Lead "${lead.name}" sin atender desde hace más de 2 horas`,
        },
      });
    }
  }
}

export async function checkOverdueTasks(orgId: string) {
  const now = new Date();

  const overdue = await db.task.findMany({
    where: {
      orgId,
      status: { in: ["PENDING", "IN_PROGRESS"] },
      dueDate: { lt: now },
    },
    include: {
      lead: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
    },
  });

  for (const task of overdue) {
    const existing = await db.alert.findFirst({
      where: {
        orgId,
        type: "TASK_OVERDUE",
        isRead: false,
        message: { contains: task.id },
      },
    });

    if (!existing) {
      await db.alert.create({
        data: {
          orgId,
          leadId: task.lead?.id,
          userId: task.assignee.id,
          type: "TASK_OVERDUE",
          message: `Tarea "${task.title}" vencida (asignada a ${task.assignee.name}) [${task.id}]`,
        },
      });
    }
  }
}

export async function checkStagnantLeads(orgId: string) {
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

  const stagnant = await db.lead.findMany({
    where: {
      orgId,
      status: { notIn: ["WON", "LOST"] },
      updatedAt: { lt: fiveDaysAgo },
    },
    select: { id: true, name: true, assignedToId: true },
  });

  for (const lead of stagnant) {
    const existing = await db.alert.findFirst({
      where: {
        orgId,
        leadId: lead.id,
        type: "LEAD_STAGNANT",
        isRead: false,
      },
    });

    if (!existing) {
      await db.alert.create({
        data: {
          orgId,
          leadId: lead.id,
          userId: lead.assignedToId,
          type: "LEAD_STAGNANT",
          message: `Lead "${lead.name}" sin movimiento por más de 5 días`,
        },
      });
    }
  }
}

export async function runAlertChecks(orgId: string) {
  await Promise.all([
    checkUnattendedLeads(orgId),
    checkOverdueTasks(orgId),
    checkStagnantLeads(orgId),
  ]);
}
