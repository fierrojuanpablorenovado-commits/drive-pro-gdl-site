import { db } from "@/server/db";

interface AuditParams {
  orgId: string;
  userId?: string;
  entityType: string;
  entityId: string;
  action: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
}

export async function createAuditLog(params: AuditParams) {
  return db.auditLog.create({
    data: {
      orgId: params.orgId,
      userId: params.userId,
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      changes: params.changes ?? undefined,
      ipAddress: params.ipAddress,
    },
  });
}
