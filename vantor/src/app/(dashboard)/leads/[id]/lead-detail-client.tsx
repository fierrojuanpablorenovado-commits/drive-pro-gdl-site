"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  Tag,
  Clock,
  User,
  MessageSquare,
  CheckSquare,
  FileText,
  Plus,
  Send,
} from "lucide-react";
import { cn, formatDateTime, formatRelativeTime, getInitials, getUrgencyColor } from "@/lib/utils";
import { moveLeadStage } from "@/server/actions/leads";
import { createActivity, createNote, reassignLead } from "@/server/actions/activities";
import { createTask } from "@/server/actions/tasks";

interface LeadDetailClientProps {
  lead: any;
  stages: any[];
  team: any[];
  currentUserId: string;
}

const activityIcons: Record<string, any> = {
  CALL: Phone,
  WHATSAPP: MessageSquare,
  EMAIL: Mail,
  MEETING: User,
  VISIT: Building2,
  NOTE: FileText,
  STAGE_CHANGE: Tag,
  ASSIGNMENT: User,
  DOCUMENT: FileText,
  OTHER: Clock,
};

const activityLabels: Record<string, string> = {
  CALL: "Llamada",
  WHATSAPP: "WhatsApp",
  EMAIL: "Correo",
  MEETING: "Reunión",
  VISIT: "Visita",
  NOTE: "Nota",
  STAGE_CHANGE: "Cambio de etapa",
  ASSIGNMENT: "Asignación",
  DOCUMENT: "Documento",
  OTHER: "Otro",
};

const taskStatusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

export function LeadDetailClient({ lead, stages, team, currentUserId }: LeadDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"activity" | "notes" | "tasks">("activity");
  const urgency = getUrgencyColor(lead.lastContactAt);

  async function handleStageChange(stageId: string) {
    await moveLeadStage(lead.id, stageId);
    router.refresh();
  }

  const urgencyColors = {
    green: "text-success-500",
    yellow: "text-warning-500",
    red: "text-danger-500",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <span
              className={cn("h-3 w-3 rounded-full", {
                "bg-success-500": urgency === "green",
                "bg-warning-500": urgency === "yellow",
                "bg-danger-500": urgency === "red",
              })}
              title={urgency === "red" ? "Urgente" : urgency === "yellow" ? "Necesita seguimiento" : "OK"}
            />
          </div>
          {lead.company && <p className="text-sm text-gray-500">{lead.company}</p>}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Info panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Lead info card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Información</h3>

            <div className="space-y-3">
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${lead.phone}`} className="text-sm text-brand-600 hover:underline">{lead.phone}</a>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${lead.email}`} className="text-sm text-brand-600 hover:underline truncate">{lead.email}</a>
                </div>
              )}
              {lead.company && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.company}</span>
                </div>
              )}
              {lead.interest && (
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-700">{lead.interest}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {lead.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {lead.tags.map((lt: any) => (
                  <span
                    key={lt.tag.id}
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${lt.tag.color}20`, color: lt.tag.color }}
                  >
                    {lt.tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stage & Priority */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Etapa</h3>
            <select
              value={lead.stageId}
              onChange={(e) => handleStageChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            {/* Stage progress */}
            <div className="flex gap-1">
              {stages.map((s) => (
                <div
                  key={s.id}
                  className="flex-1 h-2 rounded-full"
                  style={{
                    backgroundColor: s.position <= (stages.find((st: any) => st.id === lead.stageId)?.position ?? 0)
                      ? s.color
                      : "#E5E7EB",
                  }}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400">Prioridad</span>
                <p className="font-medium text-gray-700 mt-0.5">
                  {lead.priority === "HIGH" ? "Alta" : lead.priority === "MEDIUM" ? "Media" : "Baja"}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Estado</span>
                <p className="font-medium text-gray-700 mt-0.5">
                  {lead.status === "NEW" ? "Nuevo" : lead.status === "CONTACTED" ? "Contactado" : lead.status === "QUALIFIED" ? "Calificado" : lead.status === "WON" ? "Ganado" : "Perdido"}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Fuente</span>
                <p className="font-medium text-gray-700 mt-0.5">{lead.source || "—"}</p>
              </div>
              <div>
                <span className="text-gray-400">Creado</span>
                <p className="font-medium text-gray-700 mt-0.5">{formatRelativeTime(lead.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Assigned to */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Responsable</h3>
            {lead.assignedTo ? (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-800 text-sm font-bold flex items-center justify-center">
                  {getInitials(lead.assignedTo.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.assignedTo.name}</p>
                  <p className="text-xs text-gray-500">{lead.assignedTo.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Sin asignar</p>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-100">
              <div>
                <span className="text-gray-400">Primer contacto</span>
                <p className="font-medium text-gray-700 mt-0.5">
                  {lead.firstContactAt ? formatDateTime(lead.firstContactAt) : "Pendiente"}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Último contacto</span>
                <p className={cn("font-medium mt-0.5", urgencyColors[urgency])}>
                  {lead.lastContactAt ? formatRelativeTime(lead.lastContactAt) : "Sin contacto"}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="text-xs text-gray-400">Reasignar</label>
              <select
                value={lead.assignedToId || ""}
                onChange={async (e) => {
                  if (e.target.value && e.target.value !== lead.assignedToId) {
                    await reassignLead(lead.id, e.target.value);
                    router.refresh();
                  }
                }}
                className="w-full mt-1 px-2 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
              >
                <option value="">Sin asignar</option>
                {team.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right: Activity, Notes, Tasks */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex border-b border-gray-200">
              {[
                { key: "activity", label: "Actividad", icon: Clock, count: lead.activities.length },
                { key: "notes", label: "Notas", icon: FileText, count: lead.notes.length },
                { key: "tasks", label: "Tareas", icon: CheckSquare, count: lead.tasks.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.key
                      ? "border-brand-600 text-brand-800"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Activity timeline */}
              {activeTab === "activity" && (
                <div className="space-y-4">
                  {lead.activities.map((act: any) => {
                    const Icon = activityIcons[act.type] || Clock;
                    return (
                      <div key={act.id} className="flex gap-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {act.user.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {activityLabels[act.type]}
                            </span>
                            <span className="text-xs text-gray-400 ml-auto">
                              {formatDateTime(act.createdAt)}
                            </span>
                          </div>
                          {act.description && (
                            <p className="text-sm text-gray-600 mt-0.5">{act.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {lead.activities.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-8">Sin actividad registrada</p>
                  )}
                </div>
              )}

              {/* Notes */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  {lead.notes.map((note: any) => (
                    <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold flex items-center justify-center">
                          {getInitials(note.user.name)}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{note.user.name}</span>
                        <span className="text-xs text-gray-400 ml-auto">{formatDateTime(note.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                  {lead.notes.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-8">Sin notas</p>
                  )}
                </div>
              )}

              {/* Tasks */}
              {activeTab === "tasks" && (
                <div className="space-y-3">
                  {lead.tasks.map((task: any) => {
                    const isOverdue = task.status === "PENDING" && new Date(task.dueDate) < new Date();
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border",
                          task.status === "COMPLETED"
                            ? "bg-success-50/50 border-success-200"
                            : isOverdue
                            ? "bg-danger-50/50 border-danger-200"
                            : "bg-white border-gray-200"
                        )}
                      >
                        <div
                          className={cn(
                            "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                            task.status === "COMPLETED"
                              ? "border-success-500 bg-success-500"
                              : isOverdue
                              ? "border-danger-400"
                              : "border-gray-300"
                          )}
                        >
                          {task.status === "COMPLETED" && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-medium", task.status === "COMPLETED" ? "text-gray-400 line-through" : "text-gray-900")}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500">{task.assignee.name}</span>
                            <span className={cn("text-xs", isOverdue ? "text-danger-600 font-medium" : "text-gray-400")}>
                              {formatDateTime(task.dueDate)}
                            </span>
                          </div>
                        </div>
                        <span
                          className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", {
                            "bg-gray-100 text-gray-600": task.status === "PENDING" && !isOverdue,
                            "bg-danger-50 text-danger-600": isOverdue,
                            "bg-success-50 text-success-600": task.status === "COMPLETED",
                            "bg-warning-50 text-warning-600": task.status === "IN_PROGRESS",
                          })}
                        >
                          {isOverdue && task.status !== "COMPLETED" ? "Vencida" : taskStatusLabels[task.status]}
                        </span>
                      </div>
                    );
                  })}
                  {lead.tasks.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-8">Sin tareas</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Acción rápida</h3>

            {/* Add activity */}
            <form
              action={async (formData: FormData) => {
                formData.set("leadId", lead.id);
                await createActivity(formData);
                router.refresh();
              }}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <select name="type" defaultValue="CALL" className="px-2 py-2 rounded-lg border border-gray-300 text-xs bg-white">
                  <option value="CALL">Llamada</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">Correo</option>
                  <option value="MEETING">Reunión</option>
                  <option value="VISIT">Visita</option>
                  <option value="DOCUMENT">Documento</option>
                  <option value="OTHER">Otro</option>
                </select>
                <input
                  name="description"
                  type="text"
                  placeholder="Descripción de la actividad..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-brand-800 text-white text-xs font-semibold rounded-lg hover:bg-brand-900 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Add note */}
            <form
              action={async (formData: FormData) => {
                formData.set("leadId", lead.id);
                await createNote(formData);
                router.refresh();
              }}
              className="mt-3 flex gap-2"
            >
              <input
                name="content"
                type="text"
                placeholder="Agregar nota..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
