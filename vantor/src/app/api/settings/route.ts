import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  const org = await db.organization.findUnique({
    where: { id: user.orgId },
    include: {
      subscription: true,
      pipelineStages: { orderBy: { position: "asc" } },
      tags: { orderBy: { name: "asc" } },
      leadSources: { orderBy: { name: "asc" } },
      lostReasons: { orderBy: { name: "asc" } },
    },
  });

  return NextResponse.json({ org });
}
