import { getLeads, getTeamMembers, getLeadSources, getTags, getPipelineStages } from "@/server/actions/leads";
import { LeadsClient } from "./leads-client";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const [leads, team, sources, tags, stages] = await Promise.all([
    getLeads({
      search: params.search,
      status: params.status,
      source: params.source,
      assignedToId: params.assignedToId,
      priority: params.priority,
      stageId: params.stageId,
    }),
    getTeamMembers(),
    getLeadSources(),
    getTags(),
    getPipelineStages(),
  ]);

  return (
    <LeadsClient
      leads={leads as any}
      team={team}
      sources={sources}
      tags={tags}
      stages={stages}
    />
  );
}
