"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";
import { createAuditLog } from "@/server/services/audit";

export async function createTag(formData: FormData) {
  const user = await getSessionUser();
  if (!["OWNER", "ADMIN"].includes(user.role)) return { error: "Sin permiso" };

  const name = (formData.get("name") as string)?.trim();
  const color = (formData.get("color") as string) || "#3B82F6";
  if (!name) return { error: "El nombre es requerido" };

  const existing = await db.tag.findFirst({ where: { orgId: user.orgId, name } });
  if (existing) return { error: "Ya existe una etiqueta con ese nombre" };

  await db.tag.create({ data: { orgId: user.orgId, name, color } });
  revalidatePath("/settings");
  return { success: true };
}

export async function deleteTag(tagId: string) {
  const user = await getSessionUser();
  if (!["OWNER", "ADMIN"].includes(user.role)) return { error: "Sin permiso" };

  await db.leadTag.deleteMany({ where: { tagId } });
  await db.tag.deleteMany({ where: { id: tagId, orgId: user.orgId } });
  revalidatePath("/settings");
  return { success: true };
}

export async function createLeadSource(formData: FormData) {
  const user = await getSessionUser();
  if (!["OWNER", "ADMIN"].includes(user.role)) return { error: "Sin permiso" };

  const name = (formData.get("name") as string)?.trim();
  const type = (formData.get("type") as string) || "other";
  if (!name) return { error: "El nombre es requerido" };

  const existing = await db.leadSource.findFirst({ where: { orgId: user.orgId, name } });
  if (existing) return { error: "Ya existe esa fuente" };

  await db.leadSource.create({ data: { orgId: user.orgId, name, type } });
  revalidatePath("/settings");
  return { success: true };
}

export async function deleteLeadSource(sourceId: string) {
  const user = await getSessionUser();
  if (!["OWNER", "ADMIN"].includes(user.role)) return { error: "Sin permiso" };

  await db.leadSource.deleteMany({ where: { id: sourceId, orgId: user.orgId } });
  revalidatePath("/settings");
  return { success: true };
}

export async function createLostReason(formData: FormData) {
  const user = await getSessionUser();
  if (!["OWNER", "ADMIN"].includes(user.role)) return { error: "Sin permiso" };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "El nombre es requerido" };

  const existing = await db.lostReason.findFirst({ where: { orgId: user.orgId, name } });
  if (existing) return { error: "Ya existe ese motivo" };

  await db.lostReason.create({ data: { orgId: user.orgId, name } });
  revalidatePath("/settings");
  return { success: true };
}

export async function deleteLostReason(reasonId: string) {
  const user = await getSessionUser();
  if (!["OWNER", "ADMIN"].includes(user.role)) return { error: "Sin permiso" };

  await db.lostReason.deleteMany({ where: { id: reasonId, orgId: user.orgId } });
  revalidatePath("/settings");
  return { success: true };
}

export async function updateOrgSettings(formData: FormData) {
  const user = await getSessionUser();
  if (!["OWNER", "ADMIN"].includes(user.role)) return { error: "Sin permiso" };

  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();

  if (!name) return { error: "El nombre es requerido" };

  await db.organization.update({
    where: { id: user.orgId },
    data: { name, phone: phone || null, email: email || null },
  });

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "Organization",
    entityId: user.orgId,
    action: "settings_updated",
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function inviteUser(formData: FormData) {
  const user = await getSessionUser();
  if (!["OWNER", "ADMIN"].includes(user.role)) return { error: "Sin permiso" };

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const role = formData.get("role") as string;

  if (!name || !email) return { error: "Nombre y email son requeridos" };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "Ya existe un usuario con ese email" };

  const sub = await db.subscription.findUnique({ where: { orgId: user.orgId } });
  const userCount = await db.user.count({ where: { orgId: user.orgId, isActive: true } });
  if (sub && userCount >= sub.maxUsers) {
    return { error: `Tu plan permite máximo ${sub.maxUsers} usuarios. Actualiza tu plan para agregar más.` };
  }

  const { hash } = await import("bcryptjs");
  const tempPassword = Math.random().toString(36).slice(-8);
  const passwordHash = await hash(tempPassword, 12);

  await db.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: role as any,
      orgId: user.orgId,
    },
  });

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "User",
    entityId: email,
    action: "invited",
    changes: { role },
  });

  revalidatePath("/users");
  return { success: true, tempPassword };
}

export async function toggleUserActive(userId: string) {
  const user = await getSessionUser();
  if (!["OWNER", "ADMIN"].includes(user.role)) return { error: "Sin permiso" };

  if (userId === user.id) return { error: "No puedes desactivarte a ti mismo" };

  const target = await db.user.findFirst({ where: { id: userId, orgId: user.orgId } });
  if (!target) return { error: "Usuario no encontrado" };
  if (target.role === "OWNER") return { error: "No puedes desactivar al dueño" };

  await db.user.update({
    where: { id: userId },
    data: { isActive: !target.isActive },
  });

  revalidatePath("/users");
  return { success: true };
}
