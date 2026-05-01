"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import { createLead } from "@/server/actions/leads";

interface LeadsClientProps {
  leads: any[];
  team: any[];
  sources: any[];
  tags: any[];
  stages: any[];
}

const priorityColors = {
  HIGH: "bg-danger-50 text-danger-600",
  MEDIUM: "bg-warning-50 text-warning-600",
  LOW: "bg-gray-100 text-gray-600",
};

const priorityLabels = { HIGH: "Alta", MEDIUM: "Media", LOW: "Baja" };
const statusLabels: Record<string, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  QUALIFIED: "Calificado",
  WON: "Ganado",
  LOST: "Perdido",
};

export function LeadsClient({ leads, team, sources, tags, stages }: LeadsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/leads?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilter("search", search);
  }

  function clearFilters() {
    router.push("/leads");
    setSearch("");
  }

  async function handleCreate(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await createLead(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setShowModal(false);
      setLoading(false);
    }
  }

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-brand-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-900 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo lead
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, teléfono, email..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Buscar
            </button>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              showFilters || hasFilters
                ? "bg-brand-50 text-brand-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <Filter className="h-4 w-4" />
            Filtros
            {hasFilters && (
              <span className="bg-brand-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                !
              </span>
            )}
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
            <select
              value={searchParams.get("status") || ""}
              onChange={(e) => applyFilter("status", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
            >
              <option value="">Todos los estados</option>
              <option value="NEW">Nuevo</option>
              <option value="CONTACTED">Contactado</option>
              <option value="QUALIFIED">Calificado</option>
              <option value="WON">Ganado</option>
              <option value="LOST">Perdido</option>
            </select>
            <select
              value={searchParams.get("source") || ""}
              onChange={(e) => applyFilter("source", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
            >
              <option value="">Todas las fuentes</option>
              {sources.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <select
              value={searchParams.get("assignedToId") || ""}
              onChange={(e) => applyFilter("assignedToId", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
            >
              <option value="">Todos los vendedores</option>
              {team.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <select
              value={searchParams.get("priority") || ""}
              onChange={(e) => applyFilter("priority", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
            >
              <option value="">Todas las prioridades</option>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Media</option>
              <option value="LOW">Baja</option>
            </select>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left font-medium text-gray-500 px-4 py-3">Lead</th>
                <th className="text-left font-medium text-gray-500 px-4 py-3 hidden md:table-cell">Contacto</th>
                <th className="text-left font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">Fuente</th>
                <th className="text-left font-medium text-gray-500 px-4 py-3">Etapa</th>
                <th className="text-left font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Prioridad</th>
                <th className="text-left font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">Responsable</th>
                <th className="text-left font-medium text-gray-500 px-4 py-3 hidden xl:table-cell">Últ. contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/leads/${lead.id}`)}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      {lead.company && (
                        <p className="text-xs text-gray-500">{lead.company}</p>
                      )}
                      {lead.interest && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                          {lead.interest}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="space-y-1">
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Phone className="h-3 w-3" />
                          <span className="text-xs">{lead.phone}</span>
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span className="text-xs truncate max-w-[160px]">{lead.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-600">{lead.source || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${lead.stage.color}15`,
                        color: lead.stage.color,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: lead.stage.color }}
                      />
                      {lead.stage.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={cn("text-xs font-medium px-2 py-1 rounded-full", priorityColors[lead.priority as keyof typeof priorityColors])}>
                      {priorityLabels[lead.priority as keyof typeof priorityLabels]}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {lead.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold flex items-center justify-center">
                          {getInitials(lead.assignedTo.name)}
                        </div>
                        <span className="text-xs text-gray-600">{lead.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-xs text-gray-500">
                      {lead.lastContactAt ? formatRelativeTime(lead.lastContactAt) : "Sin contacto"}
                    </span>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    No se encontraron leads
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Nuevo lead</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-danger-50 text-danger-600 text-sm">
                {error}
              </div>
            )}

            <form action={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-danger-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Nombre del prospecto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="33 1234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  name="company"
                  type="text"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Nombre de la empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interés</label>
                <input
                  name="interest"
                  type="text"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="¿Qué busca el prospecto?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuente</label>
                  <select
                    name="source"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white"
                  >
                    <option value="">Seleccionar</option>
                    {sources.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select
                    name="priority"
                    defaultValue="MEDIUM"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white"
                  >
                    <option value="HIGH">Alta</option>
                    <option value="MEDIUM">Media</option>
                    <option value="LOW">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <select
                  name="assignedToId"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white"
                >
                  <option value="">Asignarme a mí</option>
                  {team.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-brand-800 rounded-lg hover:bg-brand-900 disabled:opacity-50"
                >
                  {loading ? "Creando..." : "Crear lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
