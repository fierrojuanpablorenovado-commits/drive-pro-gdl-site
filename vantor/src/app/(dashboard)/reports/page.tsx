import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
  const user = await getSessionUser();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    leadsBySource,
    leadsByStatus,
    closedWon,
    closedLost,
    totalLeads,
    stages,
    sellerPerformance,
    lostReasons,
  ] = await Promise.all([
    db.lead.groupBy({
      by: ["source"],
      where: { orgId: user.orgId, source: { not: null } },
      _count: true,
      orderBy: { _count: { source: "desc" } },
    }),
    db.lead.groupBy({
      by: ["status"],
      where: { orgId: user.orgId },
      _count: true,
    }),
    db.lead.count({ where: { orgId: user.orgId, status: "WON" } }),
    db.lead.count({ where: { orgId: user.orgId, status: "LOST" } }),
    db.lead.count({ where: { orgId: user.orgId } }),
    db.pipelineStage.findMany({
      where: { orgId: user.orgId },
      orderBy: { position: "asc" },
      select: {
        name: true,
        color: true,
        _count: { select: { leads: true } },
      },
    }),
    db.user.findMany({
      where: { orgId: user.orgId, role: "SELLER", isActive: true },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            assignedLeads: true,
            activities: true,
            tasks: { where: { status: "COMPLETED" } },
          },
        },
        assignedLeads: {
          where: { status: "WON" },
          select: { id: true },
        },
      },
    }),
    db.lead.findMany({
      where: { orgId: user.orgId, status: "LOST", lostReasonId: { not: null } },
      select: { lostReason: { select: { name: true } } },
    }),
  ]);

  const lostReasonCounts: Record<string, number> = {};
  lostReasons.forEach((l) => {
    const name = l.lostReason?.name || "Sin motivo";
    lostReasonCounts[name] = (lostReasonCounts[name] || 0) + 1;
  });

  const reports = {
    leadsBySource: leadsBySource.map((s) => ({
      source: s.source || "Sin fuente",
      count: s._count,
    })),
    leadsByStatus: leadsByStatus.map((s) => ({
      status: s.status,
      count: s._count,
    })),
    conversionRate: totalLeads > 0 ? Math.round((closedWon / totalLeads) * 100) : 0,
    totalLeads,
    closedWon,
    closedLost,
    stageDistribution: stages.map((s) => ({
      stage: s.name,
      count: s._count.leads,
      color: s.color,
    })),
    sellerPerformance: sellerPerformance.map((s) => ({
      name: s.name,
      totalLeads: s._count.assignedLeads,
      closedWon: s.assignedLeads.length,
      activities: s._count.activities,
      tasksCompleted: s._count.tasks,
      conversionRate: s._count.assignedLeads > 0
        ? Math.round((s.assignedLeads.length / s._count.assignedLeads) * 100)
        : 0,
    })),
    lostReasons: Object.entries(lostReasonCounts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count),
  };

  return <ReportsClient reports={reports} />;
}
