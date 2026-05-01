import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  const leads = await db.lead.findMany({
    where: {
      orgId: user.orgId,
      ...(user.role === "SELLER" ? { assignedToId: user.id } : {}),
    },
    include: {
      assignedTo: { select: { name: true } },
      stage: { select: { name: true } },
      tags: { include: { tag: { select: { name: true } } } },
      lostReason: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Nombre",
    "Teléfono",
    "Email",
    "Empresa",
    "Fuente",
    "Interés",
    "Prioridad",
    "Estado",
    "Etapa",
    "Responsable",
    "Etiquetas",
    "Primer contacto",
    "Último contacto",
    "Motivo de pérdida",
    "Fecha de creación",
  ];

  const rows = leads.map((lead) => [
    lead.name,
    lead.phone || "",
    lead.email || "",
    lead.company || "",
    lead.source || "",
    lead.interest || "",
    lead.priority,
    lead.status,
    lead.stage.name,
    lead.assignedTo?.name || "",
    lead.tags.map((lt) => lt.tag.name).join(", "),
    lead.firstContactAt?.toISOString() || "",
    lead.lastContactAt?.toISOString() || "",
    lead.lostReason?.name || "",
    lead.createdAt.toISOString(),
  ]);

  function escapeCSV(val: string): string {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  }

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  const BOM = "﻿";

  return new NextResponse(BOM + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="vantor-leads-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
