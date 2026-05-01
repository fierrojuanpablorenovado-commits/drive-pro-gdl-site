"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/session";
import { applySequenceToLead, SEQUENCE_TEMPLATES } from "@/server/services/sequences";
import { createAuditLog } from "@/server/services/audit";

export async function getSequenceTemplates() {
  return SEQUENCE_TEMPLATES;
}

export async function applySequence(leadId: string, templateId: string) {
  const user = await getSessionUser();

  const result = await applySequenceToLead(
    user.orgId,
    leadId,
    user.id,
    user.id,
    templateId
  );

  if (result.error) return result;

  await createAuditLog({
    orgId: user.orgId,
    userId: user.id,
    entityType: "Lead",
    entityId: leadId,
    action: "sequence_applied",
    changes: { templateId, tasksCreated: result.tasksCreated },
  });

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/tasks");
  return result;
}
