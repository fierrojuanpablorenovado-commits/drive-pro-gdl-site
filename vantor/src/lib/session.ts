import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  orgId: string;
  orgName: string;
  orgSlug: string;
}

export async function getSessionUser(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user as unknown as SessionUser;
}

export function canManageTeam(role: string): boolean {
  return ["OWNER", "ADMIN", "MANAGER"].includes(role);
}

export function canConfigureSystem(role: string): boolean {
  return ["OWNER", "ADMIN"].includes(role);
}

export function canViewAllLeads(role: string): boolean {
  return ["OWNER", "ADMIN", "MANAGER", "SUPERVISOR"].includes(role);
}

export function canDeleteLeads(role: string): boolean {
  return ["OWNER", "ADMIN"].includes(role);
}
