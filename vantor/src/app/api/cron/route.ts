import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { runAlertChecks } from "@/server/services/alerts";
import { scoreLeadsForOrg } from "@/server/services/scoring";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgs = await db.organization.findMany({
    where: {
      subscription: { status: { in: ["ACTIVE", "TRIAL"] } },
    },
    select: { id: true, name: true },
  });

  const results = [];

  for (const org of orgs) {
    try {
      await runAlertChecks(org.id);
      const scoring = await scoreLeadsForOrg(org.id);
      results.push({
        org: org.name,
        alerts: "ok",
        scoring: `${scoring.updated}/${scoring.total} updated`,
      });
    } catch (error: any) {
      results.push({ org: org.name, error: error.message });
    }
  }

  return NextResponse.json({ processed: orgs.length, results });
}
