import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
  phone: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  source: z.string().max(100).optional(),
  interest: z.string().max(500).optional().or(z.literal("")),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  assignedToId: z.string().optional(),
  stageId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"]).optional(),
  lostReasonId: z.string().optional(),
  nextActionAt: z.string().datetime().optional().nullable(),
  nextActionNote: z.string().max(500).optional().nullable(),
});

export const moveLeadStageSchema = z.object({
  leadId: z.string(),
  stageId: z.string(),
});

export const createTaskSchema = z.object({
  leadId: z.string().optional(),
  assigneeId: z.string().min(1, "Asigna un responsable"),
  title: z.string().min(1, "El título es requerido").max(300),
  description: z.string().max(2000).optional().or(z.literal("")),
  type: z.enum([
    "CALL",
    "WHATSAPP",
    "EMAIL",
    "MEETING",
    "VISIT",
    "DOCUMENT",
    "FOLLOW_UP",
    "OTHER",
  ]),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  dueDate: z.string().min(1, "La fecha es requerida"),
});

export const updateTaskSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  title: z.string().min(1).max(300).optional(),
  description: z.string().max(2000).optional().nullable(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

export const createActivitySchema = z.object({
  leadId: z.string(),
  type: z.enum([
    "CALL",
    "WHATSAPP",
    "EMAIL",
    "MEETING",
    "VISIT",
    "NOTE",
    "DOCUMENT",
    "OTHER",
  ]),
  description: z.string().max(2000).optional().or(z.literal("")),
});

export const createNoteSchema = z.object({
  leadId: z.string(),
  content: z.string().min(1, "La nota no puede estar vacía").max(5000),
});

export const registerSchema = z.object({
  orgName: z.string().min(2, "El nombre de la empresa es requerido").max(200),
  name: z.string().min(2, "Tu nombre es requerido").max(200),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  phone: z.string().max(20).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const inviteUserSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "El nombre es requerido").max(200),
  role: z.enum(["ADMIN", "MANAGER", "SUPERVISOR", "SELLER"]),
});

export const updatePipelineStageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  slaHours: z.number().int().positive().optional().nullable(),
  position: z.number().int().min(0),
});

export const importLeadsSchema = z.object({
  leads: z.array(
    z.object({
      name: z.string().min(1),
      phone: z.string().optional(),
      email: z.string().optional(),
      company: z.string().optional(),
      source: z.string().optional(),
      interest: z.string().optional(),
    })
  ),
  assigneeId: z.string().optional(),
  stageId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});
