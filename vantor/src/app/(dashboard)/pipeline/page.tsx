import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";
import { PipelineClient } from "./pipeline-client";

export default async function PipelinePage() {
  const user = await getSessionUser();

  const stages = await db.pipelineStage.findMany({
    where: { orgId: user.orgId },
    orderBy: { position: "asc" },
    include: {
      leads: {
        where: user.role === "SELLER" ? { assignedToId: user.id } : {},
        include: {
          assignedTo: { select: { id: true, name: true, avatar: true } },
          tags: { include: { tag: { select: { id: true, name: true, color: true } } } },
        },
        orderBy: [
          { priority: "asc" },
          { updatedAt: "desc" },
        ],
      },
      _count: {
        select: {
          leads: user.role === "SELLER"
            ? { where: { assignedToId: user.id } }
            : true,
        },
      },
    },
  });

  return <PipelineClient stages={stages as any} />;
}
