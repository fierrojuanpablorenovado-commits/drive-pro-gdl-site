"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";
import { createAuditLog } from "@/server/services/audit";

interface ImportRow {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  source?: string;
  interest?: string;
}

export async function importLeads(data: {
  rows: ImportRow[];
  assigneeId?: string;
  source?: string;
  tagIds?: string[];
}) {
  const user = await getSessionUser();

  if (!["OWNER", "ADMIN", "MANAGER"].includes(user.role)) {
    return { error: "No tienes permiso para importar leads" };
  }

  if (!data.rows || data.rows.length === 0) {
    return { error: "No hay datos para importar" };
  }

  if (data.rows.length > 1000) {
    return { error: "Máximo 1,000 leads por importación" };
  }

  const defaultStage = await db.pipelineStage.findFirst({
    where: { orgId: user.orgId, isDefault: true },
  });

  if (!defaultStage) {
    return { error: "No hay etapa por defecto configurada" };
  }

  let created = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (let i = 0; i < data.rows.length; i++) {
    const row = data.rows[i];

    if (!row.name || row.name.trim().length === 0) {
      skipped++;
      errors.push(`Fila ${i + 1}: nombre vacío`);
      continue;
    }

    try {
      const lead = await db.lead.create({
        data: {
          orgId: user.orgId,
          name: row.name.trim(),
          phone: row.phone?.trim() || null,
          email: row.email?.trim() || null,
          company: row.company?.trim() || null,
          source: row.source?.trim() || data.source || "Importación CSV",
          interest: row.interest?.trim() || null,
          priority: "MEDIUM",
          status: "NEW",
          stageId: defaultStage.id,
          assignedToId: data.assigneeId || user.id,
          createdById: user.id,
        },
      });

      if (data.tagIds?.length) {
        await db.leadTag.createMany({
          data: data.tagIds.map((tagId) => ({ leadId: lead.id, tagId })),
        });
      }

      created++;
    } catch (err: any) {
      skipped++;
      errors.push(`Fila ${i + 1}: ${err.message}`);
    }
  }

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "Lead",
    entityId: "bulk_import",
    action: "imported",
    changes: { created, skipped, total: data.rows.length },
  });

  revalidatePath("/leads");
  revalidatePath("/pipeline");
  revalidatePath("/dashboard");

  return {
    success: true,
    created,
    skipped,
    total: data.rows.length,
    errors: errors.slice(0, 10),
  };
}
