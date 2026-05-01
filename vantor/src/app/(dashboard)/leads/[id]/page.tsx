import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";
import { LeadDetailClient } from "./lead-detail-client";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();

  const lead = await db.lead.findFirst({
    where: { id, orgId: user.orgId },
    include: {
      assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
      createdBy: { select: { id: true, name: true } },
      stage: true,
      lostReason: true,
      tags: { include: { tag: true } },
      activities: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      notes: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      },
      tasks: {
        include: {
          assignee: { select: { id: true, name: true, avatar: true } },
          creator: { select: { id: true, name: true } },
        },
        orderBy: { dueDate: "asc" },
      },
    },
  });

  if (!lead) notFound();

  const stages = await db.pipelineStage.findMany({
    where: { orgId: user.orgId },
    orderBy: { position: "asc" },
  });

  const team = await db.user.findMany({
    where: { orgId: user.orgId, isActive: true },
    select: { id: true, name: true, role: true, avatar: true },
  });

  return (
    <LeadDetailClient
      lead={lead as any}
      stages={stages}
      team={team}
      currentUserId={user.id}
    />
  );
}
