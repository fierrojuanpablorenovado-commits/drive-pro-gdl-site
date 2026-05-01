import type {
  Lead,
  User,
  Task,
  Activity,
  Alert,
  PipelineStage,
  Tag,
  Note,
  Organization,
} from "@prisma/client";

// Lead with relations
export type LeadWithRelations = Lead & {
  assignedTo: Pick<User, "id" | "name" | "avatar"> | null;
  stage: Pick<PipelineStage, "id" | "name" | "color" | "position">;
  tags: { tag: Pick<Tag, "id" | "name" | "color"> }[];
  _count?: {
    tasks: number;
    activities: number;
    notes: number;
  };
};

// Lead detail (full view)
export type LeadDetail = Lead & {
  assignedTo: Pick<User, "id" | "name" | "email" | "avatar"> | null;
  createdBy: Pick<User, "id" | "name"> | null;
  stage: PipelineStage;
  tags: { tag: Tag }[];
  activities: (Activity & {
    user: Pick<User, "id" | "name" | "avatar">;
  })[];
  notes: (Note & {
    user: Pick<User, "id" | "name" | "avatar">;
  })[];
  tasks: (Task & {
    assignee: Pick<User, "id" | "name" | "avatar">;
  })[];
  lostReason: { id: string; name: string } | null;
};

// Pipeline view
export type PipelineColumn = PipelineStage & {
  leads: LeadWithRelations[];
  _count: { leads: number };
};

// Task with relations
export type TaskWithRelations = Task & {
  lead: Pick<Lead, "id" | "name" | "phone"> | null;
  assignee: Pick<User, "id" | "name" | "avatar">;
  creator: Pick<User, "id" | "name">;
};

// Dashboard stats
export interface DashboardStats {
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
  recentActivity: (Activity & {
    lead: Pick<Lead, "id" | "name">;
    user: Pick<User, "id" | "name">;
  })[];
}

// Report types
export interface ConversionReport {
  stages: {
    name: string;
    entered: number;
    exited: number;
    conversionRate: number;
    avgTimeHours: number;
  }[];
  overall: {
    totalLeads: number;
    totalWon: number;
    totalLost: number;
    conversionRate: number;
  };
}

export interface PerformanceReport {
  sellers: {
    user: Pick<User, "id" | "name" | "avatar">;
    totalLeads: number;
    closedWon: number;
    closedLost: number;
    conversionRate: number;
    avgResponseTimeHours: number;
    activitiesCount: number;
    tasksCompleted: number;
    tasksOverdue: number;
  }[];
}

export interface LeadsBySourceReport {
  sources: {
    source: string;
    total: number;
    won: number;
    lost: number;
    active: number;
    conversionRate: number;
  }[];
}

// Session user
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  orgId: string;
  orgName: string;
  orgSlug: string;
}

// Form schemas (Zod inferred types go here after schema definition)
export type CreateLeadInput = {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  source?: string;
  interest?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  assignedToId?: string;
  stageId?: string;
  tags?: string[];
};

export type CreateTaskInput = {
  leadId?: string;
  assigneeId: string;
  title: string;
  description?: string;
  type: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  dueDate: string;
};
