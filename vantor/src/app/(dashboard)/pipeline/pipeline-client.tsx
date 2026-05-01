"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Clock, User } from "lucide-react";
import { cn, getInitials, getUrgencyColor, formatRelativeTime } from "@/lib/utils";
import { moveLeadStage } from "@/server/actions/leads";

interface PipelineClientProps {
  stages: {
    id: string;
    name: string;
    color: string;
    position: number;
    isClosedWon: boolean;
    isClosedLost: boolean;
    leads: any[];
    _count: { leads: number };
  }[];
}

const urgencyStyles = {
  green: "bg-success-500",
  yellow: "bg-warning-500",
  red: "bg-danger-500",
};

export function PipelineClient({ stages }: PipelineClientProps) {
  const router = useRouter();
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  function handleDragStart(e: React.DragEvent, leadId: string) {
    setDraggedLead(leadId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", leadId);
  }

  function handleDragOver(e: React.DragEvent, stageId: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stageId);
  }

  function handleDragLeave() {
    setDragOverStage(null);
  }

  async function handleDrop(e: React.DragEvent, stageId: string) {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain");
    setDraggedLead(null);
    setDragOverStage(null);

    if (leadId) {
      await moveLeadStage(leadId, stageId);
      router.refresh();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            Arrastra los leads entre etapas para actualizar su progreso
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={cn(
              "flex-shrink-0 w-72 bg-gray-50 rounded-xl border-2 transition-colors",
              dragOverStage === stage.id
                ? "border-brand-400 bg-brand-50"
                : "border-transparent"
            )}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Column header */}
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {stage.name}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                  {stage._count.leads}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
              {stage.leads.map((lead: any) => {
                const urgency = getUrgencyColor(lead.lastContactAt);
                return (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onClick={() => router.push(`/leads/${lead.id}`)}
                    className={cn(
                      "bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all",
                      draggedLead === lead.id && "opacity-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {lead.name}
                        </p>
                        {lead.interest && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {lead.interest}
                          </p>
                        )}
                      </div>
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full shrink-0 mt-1",
                          urgencyStyles[urgency]
                        )}
                        title={
                          urgency === "green"
                            ? "Contacto reciente"
                            : urgency === "yellow"
                            ? "Necesita seguimiento"
                            : "Sin contacto / urgente"
                        }
                      />
                    </div>

                    <div className="flex items-center gap-3 mt-2.5">
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Phone className="h-3 w-3" />
                          <span className="text-[10px]">{lead.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
                      {lead.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded-full bg-brand-100 text-brand-800 text-[8px] font-bold flex items-center justify-center">
                            {getInitials(lead.assignedTo.name)}
                          </div>
                          <span className="text-[10px] text-gray-500">
                            {lead.assignedTo.name.split(" ")[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400">Sin asignar</span>
                      )}

                      {lead.lastContactAt && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px]">
                            {formatRelativeTime(lead.lastContactAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {lead.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {lead.tags.map((lt: any) => (
                          <span
                            key={lt.tag.id}
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: `${lt.tag.color}20`,
                              color: lt.tag.color,
                            }}
                          >
                            {lt.tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {stage.leads.length === 0 && (
                <div className="flex items-center justify-center h-24 text-xs text-gray-400">
                  Sin leads
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
