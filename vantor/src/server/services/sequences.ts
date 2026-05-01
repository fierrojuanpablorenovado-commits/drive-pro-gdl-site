import { db } from "@/server/db";

export interface SequenceStep {
  dayOffset: number;
  type: "CALL" | "WHATSAPP" | "EMAIL" | "FOLLOW_UP";
  title: string;
}

export interface SequenceTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  steps: SequenceStep[];
}

export const SEQUENCE_TEMPLATES: SequenceTemplate[] = [
  {
    id: "inmobiliaria-standard",
    name: "Inmobiliaria - Seguimiento estándar",
    description: "Secuencia para prospectos de bienes raíces con 7 puntos de contacto en 14 días",
    industry: "inmobiliaria",
    steps: [
      { dayOffset: 0, type: "WHATSAPP", title: "WhatsApp de bienvenida + info del inmueble" },
      { dayOffset: 1, type: "CALL", title: "Llamada de presentación y calificación" },
      { dayOffset: 3, type: "EMAIL", title: "Enviar brochure o ficha técnica" },
      { dayOffset: 5, type: "WHATSAPP", title: "Preguntar disponibilidad para visita" },
      { dayOffset: 7, type: "CALL", title: "Llamada de seguimiento post-visita" },
      { dayOffset: 10, type: "WHATSAPP", title: "Enviar comparativa o nueva opción" },
      { dayOffset: 14, type: "CALL", title: "Llamada de cierre o reactivación" },
    ],
  },
  {
    id: "financiera-credito",
    name: "Financiera - Proceso de crédito",
    description: "Secuencia para solicitudes de crédito con documentación",
    industry: "financiera",
    steps: [
      { dayOffset: 0, type: "CALL", title: "Llamada inicial - verificar datos y pre-calificar" },
      { dayOffset: 1, type: "WHATSAPP", title: "Enviar lista de documentos requeridos" },
      { dayOffset: 3, type: "FOLLOW_UP", title: "Seguimiento de documentación pendiente" },
      { dayOffset: 5, type: "CALL", title: "Llamada para resolver dudas de documentación" },
      { dayOffset: 7, type: "WHATSAPP", title: "Confirmar recepción completa de documentos" },
      { dayOffset: 10, type: "CALL", title: "Informar resultado de pre-aprobación" },
      { dayOffset: 12, type: "EMAIL", title: "Enviar propuesta formal" },
      { dayOffset: 14, type: "CALL", title: "Llamada de cierre" },
    ],
  },
  {
    id: "servicios-general",
    name: "Servicios - Seguimiento general",
    description: "Secuencia genérica para empresas de servicios",
    industry: "servicios",
    steps: [
      { dayOffset: 0, type: "WHATSAPP", title: "Mensaje de bienvenida y confirmación" },
      { dayOffset: 1, type: "CALL", title: "Llamada de descubrimiento de necesidades" },
      { dayOffset: 3, type: "EMAIL", title: "Enviar propuesta o cotización" },
      { dayOffset: 5, type: "FOLLOW_UP", title: "Seguimiento de propuesta" },
      { dayOffset: 7, type: "CALL", title: "Llamada para resolver objeciones" },
      { dayOffset: 10, type: "WHATSAPP", title: "Recordatorio o nueva oferta" },
    ],
  },
  {
    id: "reclutamiento-candidato",
    name: "Reclutamiento - Seguimiento a candidato",
    description: "Secuencia para mantener engagement con candidatos",
    industry: "reclutamiento",
    steps: [
      { dayOffset: 0, type: "EMAIL", title: "Confirmación de recepción de CV" },
      { dayOffset: 1, type: "CALL", title: "Entrevista telefónica inicial" },
      { dayOffset: 3, type: "WHATSAPP", title: "Confirmar entrevista presencial/virtual" },
      { dayOffset: 5, type: "FOLLOW_UP", title: "Seguimiento post-entrevista" },
      { dayOffset: 7, type: "CALL", title: "Informar resultado o siguiente paso" },
    ],
  },
  {
    id: "clinica-paciente",
    name: "Clínica - Seguimiento a paciente",
    description: "Secuencia para convertir consultas en citas",
    industry: "clinica",
    steps: [
      { dayOffset: 0, type: "WHATSAPP", title: "Responder consulta + disponibilidad" },
      { dayOffset: 1, type: "CALL", title: "Llamada para agendar cita" },
      { dayOffset: 2, type: "WHATSAPP", title: "Confirmar cita y enviar indicaciones" },
      { dayOffset: 4, type: "FOLLOW_UP", title: "Recordatorio de cita (día anterior)" },
      { dayOffset: 7, type: "WHATSAPP", title: "Seguimiento post-consulta" },
    ],
  },
  {
    id: "educacion-prospecto",
    name: "Educación - Inscripción",
    description: "Secuencia para convertir interesados en inscritos",
    industry: "educacion",
    steps: [
      { dayOffset: 0, type: "WHATSAPP", title: "Enviar información del programa" },
      { dayOffset: 1, type: "CALL", title: "Llamada de asesoría educativa" },
      { dayOffset: 3, type: "EMAIL", title: "Enviar plan de estudios y costos" },
      { dayOffset: 5, type: "WHATSAPP", title: "Invitar a clase muestra o recorrido" },
      { dayOffset: 7, type: "CALL", title: "Seguimiento de dudas" },
      { dayOffset: 10, type: "FOLLOW_UP", title: "Recordar fecha límite de inscripción" },
      { dayOffset: 14, type: "CALL", title: "Última llamada de cierre" },
    ],
  },
];

export async function applySequenceToLead(
  orgId: string,
  leadId: string,
  assigneeId: string,
  creatorId: string,
  templateId: string,
) {
  const template = SEQUENCE_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return { error: "Secuencia no encontrada" };

  const now = new Date();
  const tasks = template.steps.map((step) => ({
    orgId,
    leadId,
    assigneeId,
    creatorId,
    title: step.title,
    type: step.type as any,
    priority: "MEDIUM" as const,
    status: "PENDING" as const,
    dueDate: new Date(now.getTime() + step.dayOffset * 24 * 60 * 60 * 1000),
  }));

  await db.task.createMany({ data: tasks });

  return { success: true, tasksCreated: tasks.length };
}
