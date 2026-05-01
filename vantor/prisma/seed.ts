import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await hash("password123", 12);

  // Organization
  const org = await prisma.organization.create({
    data: {
      name: "Inmobiliaria Progreso GDL",
      slug: "progreso-gdl",
      phone: "33 1234 5678",
      email: "contacto@progresogdl.com",
      timezone: "America/Mexico_City",
    },
  });

  // Pipeline stages
  const stages = await Promise.all([
    prisma.pipelineStage.create({ data: { orgId: org.id, name: "Nuevo", position: 0, color: "#6B7280", isDefault: true } }),
    prisma.pipelineStage.create({ data: { orgId: org.id, name: "Contactado", position: 1, color: "#3B82F6" } }),
    prisma.pipelineStage.create({ data: { orgId: org.id, name: "Interesado", position: 2, color: "#8B5CF6" } }),
    prisma.pipelineStage.create({ data: { orgId: org.id, name: "En seguimiento", position: 3, color: "#F59E0B" } }),
    prisma.pipelineStage.create({ data: { orgId: org.id, name: "Cita / Reunión", position: 4, color: "#EC4899" } }),
    prisma.pipelineStage.create({ data: { orgId: org.id, name: "Propuesta", position: 5, color: "#14B8A6" } }),
    prisma.pipelineStage.create({ data: { orgId: org.id, name: "Negociación", position: 6, color: "#F97316" } }),
    prisma.pipelineStage.create({ data: { orgId: org.id, name: "Cerrado ganado", position: 7, color: "#10B981", isClosedWon: true } }),
    prisma.pipelineStage.create({ data: { orgId: org.id, name: "Cerrado perdido", position: 8, color: "#EF4444", isClosedLost: true } }),
  ]);

  // Lost reasons
  const lostReasons = await Promise.all([
    prisma.lostReason.create({ data: { orgId: org.id, name: "Precio" } }),
    prisma.lostReason.create({ data: { orgId: org.id, name: "Competencia" } }),
    prisma.lostReason.create({ data: { orgId: org.id, name: "No responde" } }),
    prisma.lostReason.create({ data: { orgId: org.id, name: "No calificado" } }),
    prisma.lostReason.create({ data: { orgId: org.id, name: "Timing inadecuado" } }),
    prisma.lostReason.create({ data: { orgId: org.id, name: "Otro" } }),
  ]);

  // Lead sources
  await Promise.all([
    prisma.leadSource.create({ data: { orgId: org.id, name: "WhatsApp", type: "messaging" } }),
    prisma.leadSource.create({ data: { orgId: org.id, name: "Facebook", type: "social" } }),
    prisma.leadSource.create({ data: { orgId: org.id, name: "Instagram", type: "social" } }),
    prisma.leadSource.create({ data: { orgId: org.id, name: "Formulario web", type: "form" } }),
    prisma.leadSource.create({ data: { orgId: org.id, name: "Referido", type: "referral" } }),
    prisma.leadSource.create({ data: { orgId: org.id, name: "Llamada", type: "phone" } }),
  ]);

  // Tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { orgId: org.id, name: "VIP", color: "#F59E0B" } }),
    prisma.tag.create({ data: { orgId: org.id, name: "Urgente", color: "#EF4444" } }),
    prisma.tag.create({ data: { orgId: org.id, name: "Recontactar", color: "#8B5CF6" } }),
    prisma.tag.create({ data: { orgId: org.id, name: "Referido", color: "#10B981" } }),
    prisma.tag.create({ data: { orgId: org.id, name: "Campaña Mayo", color: "#3B82F6" } }),
  ]);

  // Subscription
  await prisma.subscription.create({
    data: {
      orgId: org.id,
      plan: "GROWTH",
      status: "ACTIVE",
      maxUsers: 10,
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Users
  const owner = await prisma.user.create({
    data: {
      email: "admin@progresogdl.com",
      name: "Carlos Mendoza",
      passwordHash,
      role: "OWNER",
      phone: "33 1111 2222",
      orgId: org.id,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "gerente@progresogdl.com",
      name: "Ana Rodríguez",
      passwordHash,
      role: "MANAGER",
      phone: "33 3333 4444",
      orgId: org.id,
    },
  });

  const sellers = await Promise.all([
    prisma.user.create({
      data: { email: "luis@progresogdl.com", name: "Luis García", passwordHash, role: "SELLER", phone: "33 5555 6666", orgId: org.id },
    }),
    prisma.user.create({
      data: { email: "maria@progresogdl.com", name: "María López", passwordHash, role: "SELLER", phone: "33 7777 8888", orgId: org.id },
    }),
    prisma.user.create({
      data: { email: "pedro@progresogdl.com", name: "Pedro Sánchez", passwordHash, role: "SELLER", phone: "33 9999 0000", orgId: org.id },
    }),
  ]);

  const allSellers = [owner, manager, ...sellers];

  // Leads - realistic data for a real estate company in GDL
  const leadData = [
    { name: "Roberto Hernández", phone: "33 2100 3456", email: "roberto.h@gmail.com", company: "Grupo Constructor", source: "WhatsApp", interest: "Departamento en Providencia", priority: "HIGH" as const, stageIdx: 5 },
    { name: "Sofía Martínez", phone: "33 4521 7890", email: "sofia.mtz@outlook.com", company: "", source: "Facebook", interest: "Casa en Zapopan", priority: "HIGH" as const, stageIdx: 4 },
    { name: "Fernando Torres", phone: "33 6789 1234", email: "ftorres@empresa.mx", company: "Torres & Asociados", source: "Referido", interest: "Local comercial", priority: "MEDIUM" as const, stageIdx: 3 },
    { name: "Alejandra Ríos", phone: "33 8901 2345", email: "ale.rios@gmail.com", company: "", source: "Instagram", interest: "Departamento amueblado", priority: "MEDIUM" as const, stageIdx: 2 },
    { name: "Miguel Ángel Díaz", phone: "33 1234 5670", email: "mad@hotmail.com", company: "Díaz Inmuebles", source: "Formulario web", interest: "Terreno en Tlajomulco", priority: "LOW" as const, stageIdx: 1 },
    { name: "Patricia Vega", phone: "33 3456 7891", email: "pvega@yahoo.com", company: "", source: "WhatsApp", interest: "Renta departamento Chapalita", priority: "HIGH" as const, stageIdx: 6 },
    { name: "Javier Moreno", phone: "33 5678 9012", email: "jmoreno@gmail.com", company: "Constructora Moreno", source: "Referido", interest: "Nave industrial", priority: "MEDIUM" as const, stageIdx: 3 },
    { name: "Laura Castillo", phone: "33 7890 1230", email: "lcastillo@live.com", company: "", source: "Facebook", interest: "Casa en coto cerrado", priority: "HIGH" as const, stageIdx: 7 },
    { name: "Ricardo Peña", phone: "33 0123 4560", email: "rp@empresa.com", company: "Grupo Peña", source: "Llamada", interest: "Oficina corporativa", priority: "MEDIUM" as const, stageIdx: 5 },
    { name: "Diana Flores", phone: "33 2345 6781", email: "dflores@gmail.com", company: "", source: "Instagram", interest: "Loft en Col. Americana", priority: "LOW" as const, stageIdx: 0 },
    { name: "Andrés Salazar", phone: "33 4567 8902", email: "asalazar@outlook.com", company: "Salazar Legal", source: "WhatsApp", interest: "Departamento 2 recámaras", priority: "MEDIUM" as const, stageIdx: 2 },
    { name: "Gabriela Ruiz", phone: "33 6780 1234", email: "gruiz@empresa.mx", company: "", source: "Formulario web", interest: "Casa nueva Tlajomulco", priority: "LOW" as const, stageIdx: 0 },
    { name: "Eduardo Jiménez", phone: "33 8902 3456", email: "ejimenez@gmail.com", company: "Jiménez Corp", source: "Facebook", interest: "Penthouse zona Real", priority: "HIGH" as const, stageIdx: 4 },
    { name: "Carmen Delgado", phone: "33 1235 6789", email: "cdelgado@yahoo.com", company: "", source: "Referido", interest: "Terreno para construir", priority: "MEDIUM" as const, stageIdx: 1 },
    { name: "Óscar Medina", phone: "33 3457 8901", email: "omedina@hotmail.com", company: "", source: "WhatsApp", interest: "Renta oficina Andares", priority: "HIGH" as const, stageIdx: 3 },
    { name: "Valentina Cruz", phone: "33 5679 0123", email: "vcruz@gmail.com", company: "", source: "Instagram", interest: "Studio en Providencia", priority: "LOW" as const, stageIdx: 8, lost: true },
    { name: "Héctor Ramírez", phone: "33 7891 2345", email: "hramirez@live.com", company: "Ramírez & Hijos", source: "Llamada", interest: "Bodega industrial", priority: "MEDIUM" as const, stageIdx: 8, lost: true },
    { name: "Natalia Ortega", phone: "33 9012 3456", email: "northega@gmail.com", company: "", source: "Facebook", interest: "Casa en Santa Anita", priority: "LOW" as const, stageIdx: 0 },
    { name: "Arturo León", phone: "33 1236 7890", email: "aleon@empresa.com", company: "León Trading", source: "Formulario web", interest: "Local en plaza comercial", priority: "MEDIUM" as const, stageIdx: 2 },
    { name: "Isabela Chávez", phone: "33 3458 9012", email: "ichavez@outlook.com", company: "", source: "WhatsApp", interest: "Departamento pet-friendly", priority: "HIGH" as const, stageIdx: 1 },
  ];

  const now = new Date();
  const leads = [];

  for (let i = 0; i < leadData.length; i++) {
    const d = leadData[i];
    const assignee = allSellers[i % allSellers.length];
    const createdDaysAgo = Math.floor(Math.random() * 30) + 1;
    const createdAt = new Date(now.getTime() - createdDaysAgo * 24 * 60 * 60 * 1000);
    const lastContactDaysAgo = Math.floor(Math.random() * createdDaysAgo);
    const hasContact = d.stageIdx > 0;

    const lead = await prisma.lead.create({
      data: {
        orgId: org.id,
        name: d.name,
        phone: d.phone,
        email: d.email,
        company: d.company || null,
        source: d.source,
        interest: d.interest,
        priority: d.priority,
        status: d.lost ? "LOST" : d.stageIdx === 7 ? "WON" : d.stageIdx > 1 ? "QUALIFIED" : d.stageIdx === 1 ? "CONTACTED" : "NEW",
        stageId: stages[d.stageIdx].id,
        assignedToId: assignee.id,
        createdById: manager.id,
        lostReasonId: d.lost ? lostReasons[Math.floor(Math.random() * lostReasons.length)].id : null,
        closedAt: d.lost || d.stageIdx === 7 ? new Date(now.getTime() - lastContactDaysAgo * 24 * 60 * 60 * 1000) : null,
        firstContactAt: hasContact ? new Date(createdAt.getTime() + 2 * 60 * 60 * 1000) : null,
        lastContactAt: hasContact ? new Date(now.getTime() - lastContactDaysAgo * 24 * 60 * 60 * 1000) : null,
        nextActionAt: !d.lost && d.stageIdx < 7 ? new Date(now.getTime() + (Math.random() * 5 - 2) * 24 * 60 * 60 * 1000) : null,
        nextActionNote: !d.lost && d.stageIdx < 7 ? "Dar seguimiento" : null,
        createdAt,
      },
    });
    leads.push(lead);

    // Add tags to some leads
    if (d.priority === "HIGH") {
      await prisma.leadTag.create({ data: { leadId: lead.id, tagId: tags[0].id } });
    }
    if (d.stageIdx === 0 && createdDaysAgo > 2) {
      await prisma.leadTag.create({ data: { leadId: lead.id, tagId: tags[1].id } });
    }
    if (d.source === "Referido") {
      await prisma.leadTag.create({ data: { leadId: lead.id, tagId: tags[3].id } });
    }
  }

  // Activities for leads
  const activityTypes = ["CALL", "WHATSAPP", "EMAIL", "MEETING", "NOTE"] as const;
  const activityDescs: Record<string, string[]> = {
    CALL: ["Llamada de presentación", "Seguimiento por teléfono", "Llamada para confirmar cita", "Llamada de cierre"],
    WHATSAPP: ["Envío de información por WhatsApp", "Respuesta a consulta por WhatsApp", "Envío de fotos del inmueble", "Seguimiento por WhatsApp"],
    EMAIL: ["Envío de brochure por correo", "Propuesta enviada por email", "Confirmación de cita por email"],
    MEETING: ["Reunión presencial en oficina", "Visita al inmueble", "Recorrido por la zona"],
    NOTE: ["Cliente interesado en financiamiento", "Necesita estacionamiento para 2 autos", "Preguntar por documentación"],
  };

  for (const lead of leads) {
    const numActivities = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < numActivities; j++) {
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const descs = activityDescs[type];
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          userId: allSellers[Math.floor(Math.random() * allSellers.length)].id,
          type,
          description: descs[Math.floor(Math.random() * descs.length)],
          createdAt: new Date(now.getTime() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  // Notes for some leads
  const noteContents = [
    "Cliente muy interesado, darle prioridad esta semana",
    "Tiene pre-aprobado de Infonavit, buen prospecto",
    "Pidió descuento del 5%, consultar con dirección",
    "Quiere mudarse antes de agosto",
    "Comparando con otra inmobiliaria, actuar rápido",
    "Necesita espacio para home office",
    "Presupuesto máximo $3.5M MXN",
    "Referido por cliente anterior, dar buen servicio",
  ];

  for (let i = 0; i < 12; i++) {
    const lead = leads[Math.floor(Math.random() * leads.length)];
    await prisma.note.create({
      data: {
        leadId: lead.id,
        userId: allSellers[Math.floor(Math.random() * allSellers.length)].id,
        content: noteContents[i % noteContents.length],
        createdAt: new Date(now.getTime() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Tasks
  const taskTitles = [
    { title: "Llamar para dar seguimiento", type: "CALL" as const },
    { title: "Enviar información por WhatsApp", type: "WHATSAPP" as const },
    { title: "Enviar propuesta por correo", type: "EMAIL" as const },
    { title: "Agendar visita al inmueble", type: "MEETING" as const },
    { title: "Recorrido por la zona", type: "VISIT" as const },
    { title: "Solicitar documentación", type: "DOCUMENT" as const },
    { title: "Seguimiento semanal", type: "FOLLOW_UP" as const },
    { title: "Confirmar cita de mañana", type: "CALL" as const },
    { title: "Enviar comparativa de precios", type: "EMAIL" as const },
    { title: "Recontactar la próxima semana", type: "FOLLOW_UP" as const },
  ];

  for (let i = 0; i < 25; i++) {
    const lead = leads[Math.floor(Math.random() * leads.length)];
    const assignee = allSellers[Math.floor(Math.random() * allSellers.length)];
    const taskDef = taskTitles[i % taskTitles.length];
    const dueDaysFromNow = Math.floor(Math.random() * 10) - 3;
    const isOverdue = dueDaysFromNow < 0;
    const isCompleted = Math.random() > 0.6;

    await prisma.task.create({
      data: {
        orgId: org.id,
        leadId: lead.id,
        assigneeId: assignee.id,
        creatorId: manager.id,
        title: taskDef.title,
        type: taskDef.type,
        priority: ["HIGH", "MEDIUM", "LOW"][Math.floor(Math.random() * 3)] as any,
        status: isCompleted ? "COMPLETED" : isOverdue ? "PENDING" : "PENDING",
        dueDate: new Date(now.getTime() + dueDaysFromNow * 24 * 60 * 60 * 1000),
        completedAt: isCompleted ? new Date(now.getTime() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000) : null,
        createdAt: new Date(now.getTime() - (Math.abs(dueDaysFromNow) + 3) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Alerts
  const alertLeads = leads.filter((l) => leadData[leads.indexOf(l)]?.stageIdx === 0);
  for (const lead of alertLeads) {
    await prisma.alert.create({
      data: {
        orgId: org.id,
        leadId: lead.id,
        type: "LEAD_UNATTENDED",
        message: `Lead "${leadData[leads.indexOf(lead)]?.name}" sin atender desde hace más de 2 horas`,
      },
    });
  }

  // Audit logs
  for (const lead of leads.slice(0, 10)) {
    await prisma.auditLog.create({
      data: {
        orgId: org.id,
        userId: allSellers[Math.floor(Math.random() * allSellers.length)].id,
        entityType: "Lead",
        entityId: lead.id,
        action: "created",
        changes: { name: leadData[leads.indexOf(lead)]?.name },
        createdAt: lead.createdAt,
      },
    });
  }

  console.log(`Seed complete:`);
  console.log(`  - 1 organization: ${org.name}`);
  console.log(`  - ${allSellers.length} users (password: password123)`);
  console.log(`  - ${stages.length} pipeline stages`);
  console.log(`  - ${leads.length} leads`);
  console.log(`  - ${tags.length} tags`);
  console.log(`  - Tasks, activities, notes, alerts created`);
  console.log(`\nLogin credentials:`);
  console.log(`  Owner:   admin@progresogdl.com / password123`);
  console.log(`  Manager: gerente@progresogdl.com / password123`);
  console.log(`  Seller:  luis@progresogdl.com / password123`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
