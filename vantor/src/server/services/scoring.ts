import { db } from "@/server/db";

interface ScoringFactors {
  hasPhone: boolean;
  hasEmail: boolean;
  hasCompany: boolean;
  source: string | null;
  activityCount: number;
  daysSinceCreated: number;
  daysSinceLastContact: number | null;
  taskCompletionRate: number;
  stagePosition: number;
  totalStages: number;
}

function calculateScore(factors: ScoringFactors): number {
  let score = 0;

  // Contact completeness (0-15)
  if (factors.hasPhone) score += 5;
  if (factors.hasEmail) score += 5;
  if (factors.hasCompany) score += 5;

  // Source quality (0-15)
  const highValueSources = ["referido", "llamada", "formulario web"];
  const medValueSources = ["whatsapp", "facebook"];
  const sourceLower = (factors.source || "").toLowerCase();
  if (highValueSources.some((s) => sourceLower.includes(s))) score += 15;
  else if (medValueSources.some((s) => sourceLower.includes(s))) score += 10;
  else score += 5;

  // Engagement (0-25)
  if (factors.activityCount >= 10) score += 25;
  else if (factors.activityCount >= 5) score += 20;
  else if (factors.activityCount >= 3) score += 15;
  else if (factors.activityCount >= 1) score += 10;

  // Recency of contact (0-20)
  if (factors.daysSinceLastContact !== null) {
    if (factors.daysSinceLastContact <= 1) score += 20;
    else if (factors.daysSinceLastContact <= 3) score += 15;
    else if (factors.daysSinceLastContact <= 7) score += 10;
    else if (factors.daysSinceLastContact <= 14) score += 5;
  }

  // Pipeline progress (0-15)
  if (factors.totalStages > 0) {
    const progress = factors.stagePosition / (factors.totalStages - 1);
    score += Math.round(progress * 15);
  }

  // Freshness penalty (0 to -10)
  if (factors.daysSinceCreated > 30) score -= 10;
  else if (factors.daysSinceCreated > 14) score -= 5;

  // Task follow-through (0-10)
  score += Math.round(factors.taskCompletionRate * 10);

  return Math.max(0, Math.min(100, score));
}

function scoreToPriority(score: number): "HIGH" | "MEDIUM" | "LOW" {
  if (score >= 65) return "HIGH";
  if (score >= 35) return "MEDIUM";
  return "LOW";
}

export async function scoreLeadsForOrg(orgId: string) {
  const stages = await db.pipelineStage.findMany({
    where: { orgId },
    orderBy: { position: "asc" },
  });

  const leads = await db.lead.findMany({
    where: { orgId, status: { notIn: ["WON", "LOST"] } },
    include: {
      stage: true,
      _count: { select: { activities: true } },
      tasks: { select: { status: true } },
    },
  });

  const now = Date.now();
  let updated = 0;

  for (const lead of leads) {
    const completedTasks = lead.tasks.filter((t) => t.status === "COMPLETED").length;
    const totalTasks = lead.tasks.length;

    const factors: ScoringFactors = {
      hasPhone: !!lead.phone,
      hasEmail: !!lead.email,
      hasCompany: !!lead.company,
      source: lead.source,
      activityCount: lead._count.activities,
      daysSinceCreated: (now - lead.createdAt.getTime()) / 86400000,
      daysSinceLastContact: lead.lastContactAt
        ? (now - lead.lastContactAt.getTime()) / 86400000
        : null,
      taskCompletionRate: totalTasks > 0 ? completedTasks / totalTasks : 0,
      stagePosition: lead.stage.position,
      totalStages: stages.length,
    };

    const score = calculateScore(factors);
    const newPriority = scoreToPriority(score);

    if (newPriority !== lead.priority) {
      await db.lead.update({
        where: { id: lead.id },
        data: { priority: newPriority },
      });
      updated++;
    }
  }

  return { total: leads.length, updated };
}

export async function getLeadScore(leadId: string): Promise<{ score: number; factors: Record<string, number> }> {
  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: {
      stage: true,
      _count: { select: { activities: true } },
      tasks: { select: { status: true } },
      organization: {
        include: { pipelineStages: { orderBy: { position: "asc" } } },
      },
    },
  });

  if (!lead) return { score: 0, factors: {} };

  const now = Date.now();
  const completedTasks = lead.tasks.filter((t) => t.status === "COMPLETED").length;
  const totalTasks = lead.tasks.length;

  const factors: ScoringFactors = {
    hasPhone: !!lead.phone,
    hasEmail: !!lead.email,
    hasCompany: !!lead.company,
    source: lead.source,
    activityCount: lead._count.activities,
    daysSinceCreated: (now - lead.createdAt.getTime()) / 86400000,
    daysSinceLastContact: lead.lastContactAt
      ? (now - lead.lastContactAt.getTime()) / 86400000
      : null,
    taskCompletionRate: totalTasks > 0 ? completedTasks / totalTasks : 0,
    stagePosition: lead.stage.position,
    totalStages: lead.organization.pipelineStages.length,
  };

  return {
    score: calculateScore(factors),
    factors: {
      contacto: (factors.hasPhone ? 5 : 0) + (factors.hasEmail ? 5 : 0) + (factors.hasCompany ? 5 : 0),
      fuente: factors.source ? 10 : 5,
      engagement: Math.min(25, factors.activityCount * 5),
      recencia: factors.daysSinceLastContact !== null && factors.daysSinceLastContact <= 3 ? 15 : 5,
      progreso: Math.round((factors.stagePosition / Math.max(factors.totalStages - 1, 1)) * 15),
      seguimiento: Math.round(factors.taskCompletionRate * 10),
    },
  };
}
