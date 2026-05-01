import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/types";

export async function requireAuth(): Promise<SessionUser> {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user as SessionUser;
}

export async function requireRole(
  allowedRoles: string[]
): Promise<SessionUser> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  return user;
}

export async function requireManager(): Promise<SessionUser> {
  return requireRole(["OWNER", "ADMIN", "MANAGER"]);
}

export async function requireAdmin(): Promise<SessionUser> {
  return requireRole(["OWNER", "ADMIN"]);
}
