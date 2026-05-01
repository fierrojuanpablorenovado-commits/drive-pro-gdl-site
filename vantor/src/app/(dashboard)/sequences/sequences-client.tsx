"use client";

import {
  Phone,
  MessageSquare,
  Mail,
  RefreshCw,
  Building2,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
  Wrench,
} from "lucide-react";
import type { SequenceTemplate } from "@/server/services/sequences";

const typeIcons: Record<string, any> = {
  CALL: Phone,
  WHATSAPP: MessageSquare,
  EMAIL: Mail,
  FOLLOW_UP: RefreshCw,
};

const typeColors: Record<string, string> = {
  CALL: "text-blue-600 bg-blue-50",
  WHATSAPP: "text-green-600 bg-green-50",
  EMAIL: "text-purple-600 bg-purple-50",
  FOLLOW_UP: "text-orange-600 bg-orange-50",
};

const industryIcons: Record<string, any> = {
  inmobiliaria: Building2,
  financiera: Briefcase,
  servicios: Wrench,
  reclutamiento: Users,
  clinica: Heart,
  educacion: GraduationCap,
};

export function SequencesClient({ templates }: { templates: SequenceTemplate[] }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Secuencias de seguimiento</h1>
        <p className="text-sm text-gray-500 mt-1">
          Templates de seguimiento por industria. Aplícalos a un lead para crear tareas automáticas.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {templates.map((template) => {
          const IndustryIcon = industryIcons[template.industry] || Wrench;
          return (
            <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                  <IndustryIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                {template.steps.map((step, i) => {
                  const StepIcon = typeIcons[step.type] || RefreshCw;
                  const color = typeColors[step.type] || "text-gray-600 bg-gray-50";
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-12 shrink-0">
                        Día {step.dayOffset}
                      </span>
                      <div className={`p-1 rounded ${color}`}>
                        <StepIcon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs text-gray-700">{step.title}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {template.steps.length} pasos · {template.steps[template.steps.length - 1].dayOffset} días
                </span>
                <span className="text-xs font-medium text-brand-600">
                  Aplicar desde el detalle del lead
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
