"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";

export async function markAlertRead(alertId: string) {
  const user = await getSessionUser();

  await db.alert.updateMany({
    where: { id: alertId, orgId: user.orgId },
    data: { isRead: true, readAt: new Date() },
  });

  revalidatePath("/alerts");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markAllAlertsRead() {
  const user = await getSessionUser();

  await db.alert.updateMany({
    where: {
      orgId: user.orgId,
      isRead: false,
      ...(user.role === "SELLER" ? { userId: user.id } : {}),
    },
    data: { isRead: true, readAt: new Date() },
  });

  revalidatePath("/alerts");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function dismissAlert(alertId: string) {
  const user = await getSessionUser();

  await db.alert.deleteMany({
    where: { id: alertId, orgId: user.orgId },
  });

  revalidatePath("/alerts");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getAlertCount() {
  const user = await getSessionUser();

  return db.alert.count({
    where: {
      orgId: user.orgId,
      isRead: false,
      ...(user.role === "SELLER" ? { userId: user.id } : {}),
    },
  });
}
