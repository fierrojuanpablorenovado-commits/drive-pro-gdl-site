"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  XCircle,
} from "lucide-react";

interface ReportsClientProps {
  reports: {
    leadsBySource: { source: string; count: number }[];
    leadsByStatus: { status: string; count: number }[];
    conversionRate: number;
    totalLeads: number;
    closedWon: number;
    closedLost: number;
    stageDistribution: { stage: string; count: number; color: string }[];
    sellerPerformance: {
      name: string;
      totalLeads: number;
      closedWon: number;
      activities: number;
      tasksCompleted: number;
      conversionRate: number;
    }[];
    lostReasons: { reason: string; count: number }[];
  };
}

const statusLabels: Record<string, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  QUALIFIED: "Calificado",
  WON: "Ganado",
  LOST: "Perdido",
};

export function ReportsClient({ reports }: ReportsClientProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
        <p className="text-sm text-gray-500 mt-1">Métricas y resultados de tu operación comercial</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-brand-500" />
            <span className="text-xs font-medium text-gray-500">Total leads</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{reports.totalLeads}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-success-500" />
            <span className="text-xs font-medium text-gray-500">Cerrados ganados</span>
          </div>
          <p className="text-3xl font-bold text-success-600">{reports.closedWon}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-danger-500" />
            <span className="text-xs font-medium text-gray-500">Cerrados perdidos</span>
          </div>
          <p className="text-3xl font-bold text-danger-600">{reports.closedLost}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-brand-500" />
            <span className="text-xs font-medium text-gray-500">Tasa de conversión</span>
          </div>
          <p className="text-3xl font-bold text-brand-800">{reports.conversionRate}%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Leads by source */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Leads por fuente</h2>
          <div className="space-y-3">
            {reports.leadsBySource.map((s) => {
              const maxCount = Math.max(...reports.leadsBySource.map((x) => x.count));
              return (
                <div key={s.source} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-28 truncate">{s.source}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${(s.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Distribución por etapa</h2>
          <div className="space-y-3">
            {reports.stageDistribution.map((s) => {
              const maxCount = Math.max(...reports.stageDistribution.map((x) => x.count), 1);
              return (
                <div key={s.stage} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-32 truncate">{s.stage}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(s.count / maxCount) * 100}%`, backgroundColor: s.color }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Seller performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Rendimiento por vendedor</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left font-medium text-gray-500 pb-3">Vendedor</th>
                <th className="text-center font-medium text-gray-500 pb-3">Leads</th>
                <th className="text-center font-medium text-gray-500 pb-3">Ganados</th>
                <th className="text-center font-medium text-gray-500 pb-3">Conversión</th>
                <th className="text-center font-medium text-gray-500 pb-3">Actividades</th>
                <th className="text-center font-medium text-gray-500 pb-3">Tareas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.sellerPerformance.map((s) => (
                <tr key={s.name}>
                  <td className="py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="py-3 text-center text-gray-700">{s.totalLeads}</td>
                  <td className="py-3 text-center text-success-600 font-semibold">{s.closedWon}</td>
                  <td className="py-3 text-center">
                    <span className={cn("font-semibold", s.conversionRate >= 20 ? "text-success-600" : s.conversionRate >= 10 ? "text-warning-600" : "text-gray-600")}>
                      {s.conversionRate}%
                    </span>
                  </td>
                  <td className="py-3 text-center text-gray-700">{s.activities}</td>
                  <td className="py-3 text-center text-gray-700">{s.tasksCompleted}</td>
                </tr>
              ))}
              {reports.sellerPerformance.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">Sin vendedores</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lost reasons */}
      {reports.lostReasons.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Motivos de pérdida</h2>
          <div className="space-y-3">
            {reports.lostReasons.map((r) => {
              const maxCount = Math.max(...reports.lostReasons.map((x) => x.count), 1);
              return (
                <div key={r.reason} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-32 truncate">{r.reason}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-danger-400 rounded-full"
                      style={{ width: `${(r.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{r.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
