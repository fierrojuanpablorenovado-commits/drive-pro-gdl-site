import { getTasks, completeTask } from "@/server/actions/tasks";
import { getTeamMembers } from "@/server/actions/leads";
import { TasksClient } from "./tasks-client";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const period = (params.period as any) || "today";

  const [tasks, team] = await Promise.all([
    getTasks({ period, assigneeId: params.assigneeId, type: params.type }),
    getTeamMembers(),
  ]);

  const overdueTasks = await getTasks({ period: "overdue" });

  return (
    <TasksClient
      tasks={tasks as any}
      overdueTasks={overdueTasks as any}
      team={team}
      currentPeriod={period}
    />
  );
}
