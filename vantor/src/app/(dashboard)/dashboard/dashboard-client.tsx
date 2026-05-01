"use client";

import Link from "next/link";
import {
  Users,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Bell,
  Clock,
  Target,
} from "lucide-react";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";

interface DashboardClientProps {
  stats: {
    newLeadsToday: number;
    newLeadsWeek: number;
    unattendedLeads: number;
    overdueTasks: number;
    closedWonPeriod: number;
    closedLostPeriod: number;
    conversionRate: number;
    activeAlerts: number;
    leadsByStage: { stage: string; count: number; color: string }[];
    leadsBySource: { source: string; count: number }[];
    recentActivity: any[];
  };
  userName: string;
}

export function DashboardClient({ stats, userName }: DashboardClientProps) {
  const greeting = getGreeting();
  const totalFunnel = stats.leadsByStage.reduce((acc, s) => acc + s.count, 0);

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {userName.split(" ")[0]}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Aquí está tu resumen comercial del día
        </p>
      </div>

      {/* Alert banner */}
      {(stats.unattendedLeads > 0 || stats.overdueTasks > 0) && (
        <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-danger-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-danger-800">Atención requerida</p>
            <p className="text-xs text-danger-600 mt-0.5">
              {stats.unattendedLeads > 0 && `${stats.unattendedLeads} leads sin atender`}
              {stats.unattendedLeads > 0 && stats.overdueTasks > 0 && " · "}
              {stats.overdueTasks > 0 && `${stats.overdueTasks} tareas vencidas`}
            </p>
          </div>
          <div className="flex gap-2">
            {stats.unattendedLeads > 0 && (
              <Link href="/leads?status=NEW" className="text-xs font-medium text-danger-700 hover:underline">
                Ver leads
              </Link>
            )}
            {stats.overdueTasks > 0 && (
              <Link href="/tasks?period=overdue" className="text-xs font-medium text-danger-700 hover:underline">
                Ver tareas
              </Link>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Leads nuevos hoy"
          value={stats.newLeadsToday}
          subtitle={`${stats.newLeadsWeek} esta semana`}
          icon={UserPlus}
          color="text-brand-600 bg-brand-50"
          href="/leads"
        />
        <KPICard
          title="Sin atender"
          value={stats.unattendedLeads}
          subtitle="Requieren contacto"
          icon={Users}
          color={stats.unattendedLeads > 0 ? "text-danger-600 bg-danger-50" : "text-success-600 bg-success-50"}
          href="/leads?status=NEW"
        />
        <KPICard
          title="Tareas vencidas"
          value={stats.overdueTasks}
          subtitle="Pendientes de completar"
          icon={Clock}
          color={stats.overdueTasks > 0 ? "text-warning-600 bg-warning-50" : "text-success-600 bg-success-50"}
          href="/tasks?period=overdue"
        />
        <KPICard
          title="Cierres (7d)"
          value={stats.closedWonPeriod}
          subtitle={`${stats.closedLostPeriod} perdidos · ${stats.conversionRate}% conv.`}
          icon={Target}
          color="text-success-600 bg-success-50"
          href="/reports"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Funnel */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Embudo comercial</h2>
            <Link href="/pipeline" className="text-xs text-brand-600 hover:underline">
              Ver pipeline
            </Link>
          </div>
          <div className="space-y-3">
            {stats.leadsByStage.map((s) => (
              <div key={s.stage} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-32 truncate">{s.stage}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: totalFunnel > 0 ? `${Math.max((s.count / totalFunnel) * 100, 2)}%` : "0%",
                      backgroundColor: s.color,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leads by source */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Leads por fuente</h2>
          <div className="space-y-3">
            {stats.leadsBySource.map((s) => (
              <div key={s.source} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{s.source}</span>
                <span className="text-sm font-semibold text-gray-900">{s.count}</span>
              </div>
            ))}
            {stats.leadsBySource.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Sin datos</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Actividad reciente</h2>
        <div className="space-y-3">
          {stats.recentActivity.map((act: any) => (
            <div key={act.id} className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                {getInitials(act.user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">
                  <span className="font-medium">{act.user.name}</span>
                  {" · "}
                  {act.description || act.type}
                </p>
                {act.lead && (
                  <Link href={`/leads/${act.lead.id}`} className="text-xs text-brand-600 hover:underline">
                    {act.lead.name}
                  </Link>
                )}
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {formatRelativeTime(act.createdAt)}
              </span>
            </div>
          ))}
          {stats.recentActivity.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Sin actividad reciente</p>
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  href,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: any;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{title}</span>
        <div className={cn("p-1.5 rounded-lg", color)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </Link>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}
