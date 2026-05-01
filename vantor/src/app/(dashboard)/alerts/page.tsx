import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";
import { AlertsClient } from "./alerts-client";

export default async function AlertsPage() {
  const user = await getSessionUser();

  const alerts = await db.alert.findMany({
    where: {
      orgId: user.orgId,
      ...(user.role === "SELLER" ? { userId: user.id } : {}),
    },
    include: {
      lead: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <AlertsClient alerts={alerts as any} />;
}
