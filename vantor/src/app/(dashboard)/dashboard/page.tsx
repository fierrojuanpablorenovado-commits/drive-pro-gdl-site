import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await getSessionUser();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  const sellerFilter = user.role === "SELLER" ? { assignedToId: user.id } : {};

  const [
    newLeadsToday,
    newLeadsWeek,
    unattendedLeads,
    overdueTasks,
    closedWon,
    closedLost,
    totalActive,
    activeAlerts,
    stagesWithCounts,
    leadsBySource,
    recentActivity,
  ] = await Promise.all([
    db.lead.count({
      where: { orgId: user.orgId, createdAt: { gte: todayStart }, ...sellerFilter },
    }),
    db.lead.count({
      where: { orgId: user.orgId, createdAt: { gte: weekStart }, ...sellerFilter },
    }),
    db.lead.count({
      where: { orgId: user.orgId, status: "NEW", firstContactAt: null, ...sellerFilter },
    }),
    db.task.count({
      where: {
        orgId: user.orgId,
        status: { in: ["PENDING", "IN_PROGRESS"] },
        dueDate: { lt: now },
        ...(user.role === "SELLER" ? { assigneeId: user.id } : {}),
      },
    }),
    db.lead.count({
      where: { orgId: user.orgId, status: "WON", closedAt: { gte: weekStart }, ...sellerFilter },
    }),
    db.lead.count({
      where: { orgId: user.orgId, status: "LOST", closedAt: { gte: weekStart }, ...sellerFilter },
    }),
    db.lead.count({
      where: { orgId: user.orgId, status: { notIn: ["WON", "LOST"] }, ...sellerFilter },
    }),
    db.alert.count({
      where: {
        orgId: user.orgId,
        isRead: false,
        ...(user.role === "SELLER" ? { userId: user.id } : {}),
      },
    }),
    db.pipelineStage.findMany({
      where: { orgId: user.orgId },
      orderBy: { position: "asc" },
      select: {
        name: true,
        color: true,
        _count: { select: { leads: { where: { orgId: user.orgId, ...sellerFilter } } } },
      },
    }),
    db.lead.groupBy({
      by: ["source"],
      where: { orgId: user.orgId, source: { not: null }, ...sellerFilter },
      _count: true,
      orderBy: { _count: { source: "desc" } },
      take: 10,
    }),
    db.activity.findMany({
      where: {
        lead: { orgId: user.orgId, ...sellerFilter },
      },
      include: {
        lead: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const conversionRate = totalActive + closedWon + closedLost > 0
    ? Math.round((closedWon / (totalActive + closedWon + closedLost)) * 100)
    : 0;

  const stats = {
    newLeadsToday,
    newLeadsWeek,
    unattendedLeads,
    overdueTasks,
    closedWonPeriod: closedWon,
    closedLostPeriod: closedLost,
    conversionRate,
    activeAlerts,
    leadsByStage: stagesWithCounts.map((s) => ({
      stage: s.name,
      count: s._count.leads,
      color: s.color,
    })),
    leadsBySource: leadsBySource.map((s) => ({
      source: s.source || "Otro",
      count: s._count,
    })),
    recentActivity: recentActivity as any,
  };

  return <DashboardClient stats={stats} userName={user.name} />;
}
