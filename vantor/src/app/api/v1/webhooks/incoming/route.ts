import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { createAuditLog } from "@/server/services/audit";

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing x-api-key header" },
        { status: 401 }
      );
    }

    const org = await db.organization.findFirst({
      where: { slug: apiKey },
      include: {
        pipelineStages: { where: { isDefault: true }, take: 1 },
      },
    });

    if (!org) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Field 'name' is required" },
        { status: 400 }
      );
    }

    const defaultStage = org.pipelineStages[0];
    if (!defaultStage) {
      return NextResponse.json(
        { error: "No default pipeline stage configured" },
        { status: 500 }
      );
    }

    let assignedToId: string | null = null;
    if (body.assignedToEmail) {
      const user = await db.user.findFirst({
        where: { orgId: org.id, email: body.assignedToEmail, isActive: true },
      });
      assignedToId = user?.id || null;
    }

    if (!assignedToId && body.autoAssign !== false) {
      const sellers = await db.user.findMany({
        where: { orgId: org.id, role: "SELLER", isActive: true },
        select: {
          id: true,
          _count: { select: { assignedLeads: { where: { status: { notIn: ["WON", "LOST"] } } } } },
        },
      });

      if (sellers.length > 0) {
        sellers.sort((a, b) => a._count.assignedLeads - b._count.assignedLeads);
        assignedToId = sellers[0].id;
      }
    }

    const lead = await db.lead.create({
      data: {
        orgId: org.id,
        name: body.name,
        phone: body.phone || null,
        email: body.email || null,
        company: body.company || null,
        source: body.source || "Webhook",
        interest: body.interest || null,
        priority: ["HIGH", "MEDIUM", "LOW"].includes(body.priority) ? body.priority : "MEDIUM",
        status: "NEW",
        stageId: defaultStage.id,
        assignedToId,
        customFields: body.customFields || null,
      },
    });

    if (body.tags && Array.isArray(body.tags)) {
      for (const tagName of body.tags) {
        const tag = await db.tag.findFirst({
          where: { orgId: org.id, name: tagName },
        });
        if (tag) {
          await db.leadTag.create({
            data: { leadId: lead.id, tagId: tag.id },
          });
        }
      }
    }

    await createAuditLog({
      orgId: org.id,
      entityType: "Lead",
      entityId: lead.id,
      action: "created_via_webhook",
      changes: { source: body.source || "Webhook", name: body.name },
    });

    return NextResponse.json(
      {
        success: true,
        lead: {
          id: lead.id,
          name: lead.name,
          status: lead.status,
          assignedToId: lead.assignedToId,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/v1/webhooks/incoming",
    description: "Create a lead from external source",
    headers: { "x-api-key": "Your organization slug" },
    body: {
      name: "string (required)",
      phone: "string (optional)",
      email: "string (optional)",
      company: "string (optional)",
      source: "string (optional, default: 'Webhook')",
      interest: "string (optional)",
      priority: "HIGH | MEDIUM | LOW (optional, default: MEDIUM)",
      assignedToEmail: "string (optional, auto-assigns if omitted)",
      tags: "string[] (optional, must match existing tag names)",
      customFields: "object (optional)",
    },
  });
}
