import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const sellerFilter = user.role === "SELLER" ? { assignedToId: user.id } : {};

  const leads = await db.lead.findMany({
    where: {
      orgId: user.orgId,
      ...sellerFilter,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      company: true,
      stage: { select: { name: true, color: true } },
    },
    take: 8,
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    results: leads.map((l) => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      email: l.email,
      company: l.company,
      stage: l.stage.name,
      stageColor: l.stage.color,
      type: "lead",
    })),
  });
}
