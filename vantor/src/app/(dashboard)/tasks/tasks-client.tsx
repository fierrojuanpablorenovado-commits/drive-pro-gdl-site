"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Phone,
  MessageSquare,
  Mail,
  Users as UsersIcon,
  MapPin,
  FileText,
  RefreshCw,
} from "lucide-react";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { completeTask } from "@/server/actions/tasks";

interface TasksClientProps {
  tasks: any[];
  overdueTasks: any[];
  team: any[];
  currentPeriod: string;
}

const typeIcons: Record<string, any> = {
  CALL: Phone,
  WHATSAPP: MessageSquare,
  EMAIL: Mail,
  MEETING: UsersIcon,
  VISIT: MapPin,
  DOCUMENT: FileText,
  FOLLOW_UP: RefreshCw,
  OTHER: Clock,
};

const typeLabels: Record<string, string> = {
  CALL: "Llamada",
  WHATSAPP: "WhatsApp",
  EMAIL: "Correo",
  MEETING: "Reunión",
  VISIT: "Visita",
  DOCUMENT: "Documento",
  FOLLOW_UP: "Seguimiento",
  OTHER: "Otro",
};

const priorityDot = {
  HIGH: "bg-danger-500",
  MEDIUM: "bg-warning-500",
  LOW: "bg-gray-400",
};

export function TasksClient({ tasks, overdueTasks, team, currentPeriod }: TasksClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setPeriod(period: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    router.push(`/tasks?${params.toString()}`);
  }

  async function handleComplete(taskId: string) {
    await completeTask(taskId);
    router.refresh();
  }

  const periods = [
    { key: "today", label: "Hoy", icon: Calendar },
    { key: "overdue", label: `Vencidas (${overdueTasks.length})`, icon: AlertTriangle },
    { key: "upcoming", label: "Próximas", icon: Clock },
    { key: "all", label: "Todas", icon: CheckCircle2 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi día</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tasks.length} {tasks.length === 1 ? "tarea" : "tareas"}
            {overdueTasks.length > 0 && currentPeriod !== "overdue" && (
              <span className="text-danger-600 font-medium">
                {" "}&middot; {overdueTasks.length} vencidas
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Period tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              currentPeriod === p.key
                ? "bg-brand-800 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            )}
          >
            <p.icon className="h-4 w-4" />
            {p.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {tasks.map((task) => {
          const isOverdue = task.status !== "COMPLETED" && new Date(task.dueDate) < new Date();
          const Icon = typeIcons[task.type] || Clock;

          return (
            <div
              key={task.id}
              className={cn(
                "bg-white rounded-xl border p-4 flex items-start gap-4 transition-all hover:shadow-sm",
                isOverdue ? "border-danger-200" : "border-gray-200"
              )}
            >
              <button
                onClick={() => handleComplete(task.id)}
                disabled={task.status === "COMPLETED"}
                className={cn(
                  "mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  task.status === "COMPLETED"
                    ? "border-success-500 bg-success-500"
                    : "border-gray-300 hover:border-brand-500"
                )}
              >
                {task.status === "COMPLETED" && (
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={cn("text-sm font-medium", task.status === "COMPLETED" ? "text-gray-400 line-through" : "text-gray-900")}>
                      {task.title}
                    </p>
                    {task.lead && (
                      <Link
                        href={`/leads/${task.lead.id}`}
                        className="text-xs text-brand-600 hover:underline mt-0.5 inline-block"
                      >
                        {task.lead.name}
                        {task.lead.phone && ` · ${task.lead.phone}`}
                      </Link>
                    )}
                  </div>
                  <span className={cn("h-2 w-2 rounded-full shrink-0 mt-2", priorityDot[task.priority as keyof typeof priorityDot])} />
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-xs">{typeLabels[task.type]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className={cn("text-xs", isOverdue ? "text-danger-600 font-medium" : "text-gray-400")}>
                      {formatDateTime(task.dueDate)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{task.assignee.name}</span>
                </div>
              </div>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle2 className="h-12 w-12 text-gray-200 mx-auto" />
            <p className="mt-4 text-gray-500 font-medium">
              {currentPeriod === "today"
                ? "No tienes tareas para hoy"
                : currentPeriod === "overdue"
                ? "Sin tareas vencidas"
                : "No hay tareas"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
