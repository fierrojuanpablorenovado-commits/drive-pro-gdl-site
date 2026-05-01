"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  UserX,
  TrendingDown,
  CheckCircle2,
  Users,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";

interface AlertsClientProps {
  alerts: any[];
}

const alertConfig: Record<string, { icon: any; color: string; label: string }> = {
  LEAD_UNATTENDED: { icon: UserX, color: "text-danger-500 bg-danger-50", label: "Lead sin atender" },
  LEAD_NO_FOLLOWUP: { icon: Clock, color: "text-warning-500 bg-warning-50", label: "Sin seguimiento" },
  LEAD_STAGNANT: { icon: TrendingDown, color: "text-warning-500 bg-warning-50", label: "Lead estancado" },
  TASK_OVERDUE: { icon: AlertTriangle, color: "text-danger-500 bg-danger-50", label: "Tarea vencida" },
  LEAD_AT_RISK: { icon: AlertTriangle, color: "text-danger-500 bg-danger-50", label: "Lead en riesgo" },
  LEAD_OVERLOAD: { icon: Users, color: "text-warning-500 bg-warning-50", label: "Sobrecarga" },
  CONVERSION_DROP: { icon: TrendingDown, color: "text-danger-500 bg-danger-50", label: "Caída de conversión" },
};

export function AlertsClient({ alerts }: AlertsClientProps) {
  const unread = alerts.filter((a) => !a.isRead);
  const read = alerts.filter((a) => a.isRead);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unread.length > 0
              ? `${unread.length} alertas sin leer`
              : "Sin alertas nuevas"}
          </p>
        </div>
      </div>

      {unread.length === 0 && read.length === 0 && (
        <div className="text-center py-16">
          <CheckCircle2 className="h-12 w-12 text-success-200 mx-auto" />
          <p className="mt-4 text-gray-500 font-medium">Todo en orden</p>
          <p className="text-sm text-gray-400 mt-1">No hay alertas activas</p>
        </div>
      )}

      {/* Unread */}
      {unread.length > 0 && (
        <div className="space-y-2 mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Nuevas</h2>
          {unread.map((alert) => {
            const config = alertConfig[alert.type] || alertConfig.LEAD_AT_RISK;
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4 hover:shadow-sm transition-all"
              >
                <div className={cn("p-2 rounded-lg shrink-0", config.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase">
                        {config.label}
                      </span>
                      <p className="text-sm text-gray-900 mt-0.5">{alert.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {formatRelativeTime(alert.createdAt)}
                    </span>
                  </div>
                  {alert.lead && (
                    <Link
                      href={`/leads/${alert.lead.id}`}
                      className="inline-flex items-center gap-1 mt-2 text-xs text-brand-600 hover:underline font-medium"
                    >
                      Ver lead: {alert.lead.name}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Read */}
      {read.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Anteriores</h2>
          {read.map((alert) => {
            const config = alertConfig[alert.type] || alertConfig.LEAD_AT_RISK;
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-4 opacity-60"
              >
                <div className="p-2 rounded-lg bg-gray-100 text-gray-400 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <span className="text-xs text-gray-400">{formatRelativeTime(alert.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
