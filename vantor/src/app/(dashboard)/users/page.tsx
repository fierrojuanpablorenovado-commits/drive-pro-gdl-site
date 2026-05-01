import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";
import { UsersClient } from "./users-client";

export default async function UsersPage() {
  const user = await getSessionUser();

  const users = await db.user.findMany({
    where: { orgId: user.orgId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      _count: {
        select: {
          assignedLeads: { where: { status: { notIn: ["WON", "LOST"] } } },
          tasks: { where: { status: "PENDING" } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const sub = await db.subscription.findUnique({ where: { orgId: user.orgId } });

  return (
    <UsersClient
      users={users as any}
      currentUserId={user.id}
      currentRole={user.role}
      maxUsers={sub?.maxUsers || 3}
    />
  );
}
