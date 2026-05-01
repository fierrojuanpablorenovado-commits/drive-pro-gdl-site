import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;

  const alertCount = await db.alert.count({
    where: {
      orgId: user.orgId,
      isRead: false,
      ...(user.role === "SELLER" ? { userId: user.id } : {}),
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <Header
          userName={user.name}
          orgName={user.orgName}
          alertCount={alertCount}
        />
        <main className="p-4 lg:p-6 pb-20 lg:pb-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
