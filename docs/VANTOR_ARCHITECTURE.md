# VANTOR — Arquitectura Completa de Producto y Sistema

**Plataforma de Ejecución Comercial SaaS**
**Versión:** 1.0
**Fecha:** Mayo 2026

---

## 1. Resumen Ejecutivo del Producto

Vantor es una plataforma SaaS de ejecución comercial diseñada para equipos de ventas en México y LATAM que operan con WhatsApp, formularios, redes sociales y referidos.

No es un CRM genérico. No es una bandeja de mensajes. Es un sistema que convierte seguimiento en ventas ejecutadas.

**Propuesta de valor:** Vantor ayuda a empresas que venden por WhatsApp, redes, formularios y referidos a ordenar su proceso comercial, priorizar acciones, evitar fugas y cerrar más ventas con control real.

**Promesa:** Más control. Más seguimiento. Menos fugas. Más cierres.

**Diferenciador:** El mercado está lleno de herramientas que administran leads. Vantor no solo administra leads. Vantor ejecuta ventas.

**Modelo de negocio:** SaaS B2B con suscripción mensual por empresa. Tres planes (Starter, Growth, Pro) desde $499 hasta $6,900 MXN/mes.

---

## 2. Problema de Negocio que Resuelve

Muchas empresas creen que su problema es "falta de clientes". Pero en realidad pierden ventas por mala ejecución comercial:

| Problema | Impacto |
|----------|---------|
| Leads olvidados | Oportunidades que nunca se contactan |
| Seguimientos no realizados | Prospectos que se enfrían |
| Chats dispersos | Sin trazabilidad ni contexto |
| Respuestas tardías | Pérdida de urgencia del prospecto |
| Poca visibilidad del pipeline | Dirección sin datos para decidir |
| Mala asignación de responsables | Sobrecarga o abandono de leads |
| Vendedores sin orden | Improvisación constante |
| Directivos sin información | Decisiones a ciegas |

**Vantor entra justo ahí.** No busca complicar la operación. Busca corregir la fuga comercial diaria.

---

## 3. Perfil de Usuarios

### Roles principales

| Rol | Necesidad principal | Acción clave |
|-----|-------------------|--------------|
| **Dueño / Director** | Visibilidad del equipo, métricas, control del pipeline | Ver dashboard, reportes, fugas |
| **Gerente comercial** | Supervisar vendedores, reasignar, medir desempeño | Gestionar equipo, ver prioridades |
| **Vendedor / Asesor** | No olvidar seguimientos, saber a quién contactar hoy | Ejecutar tareas, registrar actividad |
| **Coordinador / Admin** | Configurar sistema, cargar datos, gestionar usuarios | Administrar plataforma |
| **Supervisor** | Monitorear ejecución, detectar retrasos | Revisar alertas, auditar actividad |

### Industrias objetivo

- Inmobiliarias
- Financieras / Créditos
- Reclutamiento / Headhunting
- Clínicas / Salud
- Arrendamiento
- Educación privada
- Servicios profesionales
- Negocios con leads de Meta Ads
- Negocios con ventas por WhatsApp

---

## 4. Casos de Uso Principales

### CU-01: Captura de lead
**Actor:** Sistema / Vendedor
**Flujo:** Lead entra por WhatsApp, formulario web, campaña de Meta, CSV o alta manual → Sistema registra con canal de origen → Se asigna responsable (manual o automático) → Lead aparece en pipeline como "Nuevo"

### CU-02: Seguimiento diario
**Actor:** Vendedor
**Flujo:** Vendedor abre app → Ve lista "Mi día" con tareas pendientes y leads prioritarios → Contacta al prospecto → Registra actividad (llamada, WhatsApp, cita) → Agenda siguiente acción → Pipeline se actualiza

### CU-03: Movimiento en pipeline
**Actor:** Vendedor
**Flujo:** Vendedor mueve lead de etapa (ej: "Contactado" → "Interesado") → Sistema registra cambio en bitácora → Actualiza métricas de conversión → Si lead se estanca, activa alerta

### CU-04: Detección de fuga
**Actor:** Sistema
**Flujo:** Sistema detecta lead sin contacto > 24h, o sin movimiento > 3 días, o tarea vencida → Genera alerta visible en dashboard → Notifica al vendedor y gerente → Escala si no se atiende

### CU-05: Supervisión ejecutiva
**Actor:** Dueño / Gerente
**Flujo:** Abre dashboard → Ve leads nuevos, sin atender, seguimientos vencidos, cierres del periodo → Filtra por vendedor, canal, fecha → Identifica focos rojos → Toma acción (reasignar, escalar, intervenir)

### CU-06: Reporte de conversión
**Actor:** Gerente / Director
**Flujo:** Accede a reportes → Selecciona periodo → Ve tasa de conversión por etapa, canal, vendedor → Identifica cuellos de botella → Detecta motivos de pérdida → Ajusta estrategia

### CU-07: Importación masiva
**Actor:** Admin / Coordinador
**Flujo:** Sube archivo CSV/Excel → Sistema mapea columnas → Valida datos → Crea leads en lote → Asigna según reglas → Leads aparecen en pipeline

### CU-08: Configuración de pipeline
**Actor:** Admin
**Flujo:** Accede a configuración → Define etapas del pipeline → Establece SLAs por etapa → Configura campos personalizados → Guarda → Pipeline refleja nueva estructura

---

## 5. Arquitectura Funcional

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                     │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │Dashboard │ │ Pipeline │ │  Leads   │ │ Detalle Prospecto│   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │  Tareas  │ │ Alertas  │ │Reportes  │ │  Configuración   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        CAPA DE APLICACIÓN                       │
│                                                                 │
│  ┌──────────────┐ ┌───────────────┐ ┌────────────────────┐     │
│  │ API REST /   │ │ Motor de      │ │ Motor de Alertas   │     │
│  │ Server Acts  │ │ Seguimiento   │ │ y Notificaciones   │     │
│  └──────────────┘ └───────────────┘ └────────────────────┘     │
│  ┌──────────────┐ ┌───────────────┐ ┌────────────────────┐     │
│  │ Asignación   │ │ Scoring de    │ │ Reportes y         │     │
│  │ de Leads     │ │ Prioridad     │ │ Analítica          │     │
│  └──────────────┘ └───────────────┘ └────────────────────┘     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        CAPA DE DATOS                            │
│                                                                 │
│  ┌──────────────┐ ┌───────────────┐ ┌────────────────────┐     │
│  │ PostgreSQL   │ │ Redis         │ │ S3 / R2            │     │
│  │ (Principal)  │ │ (Cache/Queue) │ │ (Archivos)         │     │
│  └──────────────┘ └───────────────┘ └────────────────────┘     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    CAPA DE INTEGRACIONES                        │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │WhatsApp  │ │Meta Leads│ │ Google   │ │  Webhooks /      │   │
│  │Business  │ │  API     │ │ Sheets   │ │  Formularios     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Módulos del Sistema

### 6.1 Dashboard General
- Leads nuevos hoy/semana
- Leads sin atender (foco rojo)
- Seguimientos vencidos
- Cierres del periodo
- Tasa de conversión general
- Vendedores activos
- Focos rojos (alertas críticas)
- Gráfica de embudo simplificada

### 6.2 Leads
- Alta manual con formulario rápido
- Importación CSV/Excel con mapeo de columnas
- Entrada automática desde formularios web (webhook)
- Entrada desde WhatsApp Business API
- Entrada desde Meta Lead Ads
- Asignación automática (round-robin) o manual
- Etiquetas personalizables
- Canal de origen (WhatsApp, Facebook, Instagram, web, referido, otro)
- Estado del lead (nuevo, contactado, calificado, perdido, ganado)
- Score de prioridad básico (alto, medio, bajo)

### 6.3 Pipeline Comercial
- Vista Kanban drag-and-drop
- Etapas configurables por defecto:
  - Nuevo → Contactado → Interesado → En seguimiento → Cita/Reunión → Propuesta → Negociación → Cerrado Ganado / Cerrado Perdido
- Filtros: vendedor, canal, fecha, etiqueta, prioridad
- Semáforo de urgencia por tiempo en etapa (verde/amarillo/rojo)
- Contador de leads por etapa
- Vista compacta y expandida

### 6.4 Detalle del Prospecto
- Datos: nombre, teléfono, correo, empresa, canal origen, interés
- Etapa actual con línea de tiempo visual
- Responsable asignado
- Etiquetas
- Historial de contacto completo
- Notas internas
- Tareas pendientes y completadas
- Documentos adjuntos
- Última interacción (fecha y tipo)
- Próxima acción sugerida
- Score de prioridad

### 6.5 Seguimiento y Tareas
- Lista "Mi día": tareas de hoy priorizadas
- Tareas vencidas (destacadas)
- Tareas futuras
- Tipos de acción: llamada, WhatsApp, correo, reunión, cita, visita, documento pendiente
- Recordatorios con fecha y hora
- SLA de respuesta por etapa
- Comentarios en cada tarea
- Asignación a responsable

### 6.6 Alertas de Fuga
- Lead sin contacto inicial (configurable, default: 2h)
- Lead sin seguimiento (configurable, default: 48h)
- Prospecto estancado en etapa (configurable, default: 5 días)
- Tarea vencida sin completar
- Prospecto en riesgo de abandono
- Concentración excesiva de leads en un vendedor
- Caída de conversión vs periodo anterior

### 6.7 Reportes
- Leads por fuente/canal
- Leads por etapa del pipeline
- Tasa de conversión por etapa
- Tasa de conversión global
- Tiempo promedio de primera respuesta
- Tiempo promedio por etapa
- Cierres por vendedor
- Cierres por canal
- Leads perdidos con motivo
- Productividad comercial (acciones por vendedor)
- Exportación a CSV

### 6.8 Usuarios y Permisos
- Gestión de usuarios por organización
- Roles: Dueño, Admin, Gerente, Supervisor, Vendedor
- Invitación por email
- Activar/desactivar usuarios

### 6.9 Configuración
- Etapas del pipeline
- Fuentes/canales
- Etiquetas
- Campos personalizados (Fase 2)
- Reglas de asignación
- SLAs y tiempos de alerta
- Motivos de pérdida
- Datos de la empresa

### 6.10 Integraciones
- WhatsApp Business API
- Webhook de entrada (formularios)
- Meta Lead Ads
- Google Sheets (exportación)
- Correo electrónico (Fase 2)
- Calendario Google (Fase 2)
- Zapier / Make (Fase 3)

### 6.11 Bitácora / Historial
- Cambios de etapa (quién, cuándo, de/a)
- Cambios de responsable
- Tareas creadas, completadas, vencidas
- Notas agregadas
- Actividades registradas
- Login/logout de usuarios
- Fecha y hora de cada evento
- Filtrable por lead, usuario, tipo de evento

---

## 7. Pantallas del Sistema

### Pantallas principales (MVP)

| # | Pantalla | Descripción | Prioridad |
|---|----------|-------------|-----------|
| 1 | Login | Acceso con email/password | MVP |
| 2 | Registro de empresa | Onboarding inicial | MVP |
| 3 | Dashboard | Resumen ejecutivo del día | MVP |
| 4 | Lista de leads | Tabla filtrable con búsqueda | MVP |
| 5 | Pipeline Kanban | Vista de embudo drag-and-drop | MVP |
| 6 | Detalle del prospecto | Ficha completa con historial | MVP |
| 7 | Mis tareas / Mi día | Lista priorizada de acciones | MVP |
| 8 | Nuevo lead (modal) | Formulario rápido de alta | MVP |
| 9 | Importar leads | Upload CSV con mapeo | MVP |
| 10 | Alertas | Lista de focos rojos | MVP |
| 11 | Reportes | Métricas y gráficas | MVP |
| 12 | Usuarios | Gestión del equipo | MVP |
| 13 | Configuración | Ajustes de pipeline y sistema | MVP |

### Pantallas secundarias (Post-MVP)

| # | Pantalla | Descripción | Fase |
|---|----------|-------------|------|
| 14 | Integraciones | Conexión con servicios externos | F2 |
| 15 | Bitácora global | Auditoría de eventos | F2 |
| 16 | Perfil de usuario | Datos personales y preferencias | F2 |
| 17 | Reporte por vendedor | Detalle individual de rendimiento | F2 |
| 18 | Secuencias | Flujos de seguimiento automático | F3 |

---

## 8. Flujo de Usuario Principal

```
                    ┌─────────────────┐
                    │   Lead entra    │
                    │ (WhatsApp, form,│
                    │  campaña, CSV,  │
                    │  alta manual)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Sistema registra│
                    │ con canal y     │
                    │ datos básicos   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Se asigna      │
                    │  responsable    │
                    │ (auto o manual) │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Lead entra al   │
                    │ pipeline como   │
                    │ "Nuevo"         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Vendedor ve     │
                    │ prioridad del   │
                    │ día en "Mi día" │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Contacta al     │
                    │ prospecto y     │
                    │ registra acción │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Agenda próxima  │
                    │ acción/tarea    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───────┐      │     ┌────────▼────────┐
     │ Lead avanza    │      │     │ Lead se enfría  │
     │ en pipeline    │      │     │ → Alerta activa │
     └────────┬───────┘      │     └────────┬────────┘
              │              │              │
              │    ┌─────────▼──────────┐   │
              │    │ Se repite ciclo    │   │
              │    │ de seguimiento     │   │
              │    └────────────────────┘   │
              │                             │
     ┌────────▼───────┐           ┌─────────▼───────┐
     │ CERRADO GANADO │           │ CERRADO PERDIDO │
     │ (con motivo de │           │ (con motivo de  │
     │  cierre)       │           │  pérdida)       │
     └────────────────┘           └─────────────────┘
              │                             │
              └──────────┬──────────────────┘
                         │
                ┌────────▼────────┐
                │ Dashboard y     │
                │ reportes se     │
                │ actualizan      │
                └─────────────────┘
```

---

## 9. Roles y Permisos

### Matriz de permisos

| Permiso | Dueño | Admin | Gerente | Supervisor | Vendedor |
|---------|-------|-------|---------|------------|----------|
| Ver dashboard global | ✅ | ✅ | ✅ | ✅ | ❌ |
| Ver dashboard propio | ✅ | ✅ | ✅ | ✅ | ✅ |
| Crear leads | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver todos los leads | ✅ | ✅ | ✅ | ✅ | ❌ |
| Ver leads asignados | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editar leads | ✅ | ✅ | ✅ | ✅ | Solo propios |
| Eliminar leads | ✅ | ✅ | ❌ | ❌ | ❌ |
| Importar CSV | ✅ | ✅ | ✅ | ❌ | ❌ |
| Mover leads en pipeline | ✅ | ✅ | ✅ | ✅ | Solo propios |
| Asignar/reasignar leads | ✅ | ✅ | ✅ | ❌ | ❌ |
| Crear tareas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver tareas de otros | ✅ | ✅ | ✅ | ✅ | ❌ |
| Ver reportes globales | ✅ | ✅ | ✅ | ✅ | ❌ |
| Ver reportes propios | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gestionar usuarios | ✅ | ✅ | ❌ | ❌ | ❌ |
| Configurar pipeline | ✅ | ✅ | ❌ | ❌ | ❌ |
| Configurar integraciones | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ver bitácora completa | ✅ | ✅ | ✅ | ✅ | ❌ |
| Gestionar facturación | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar empresa | ✅ | ❌ | ❌ | ❌ | ❌ |

### Implementación técnica

```typescript
enum Role {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SUPERVISOR = 'supervisor',
  SELLER = 'seller'
}

// Permisos se validan en middleware con enfoque RBAC
// Cada endpoint/server action verifica: role + ownership del recurso
```

---

## 10. Modelo de Datos Propuesto

### Diagrama entidad-relación principal

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Organization │────<│    User      │     │ Subscription │
│              │     │              │     │              │
│ id           │     │ id           │     │ id           │
│ name         │     │ name         │     │ org_id       │
│ slug         │     │ email        │     │ plan         │
│ plan         │     │ role         │     │ status       │
│ created_at   │     │ org_id (FK)  │     │ period_end   │
└──────┬───────┘     └──────┬───────┘     └──────────────┘
       │                    │
       │     ┌──────────────┤
       │     │              │
┌──────▼─────▼──┐   ┌──────▼───────┐     ┌──────────────┐
│    Lead       │──<│  Activity    │     │   Task       │
│               │   │              │     │              │
│ id            │   │ id           │     │ id           │
│ org_id (FK)   │   │ lead_id (FK) │     │ lead_id (FK) │
│ name          │   │ user_id (FK) │     │ user_id (FK) │
│ phone         │   │ type         │     │ org_id (FK)  │
│ email         │   │ description  │     │ title        │
│ company       │   │ created_at   │     │ type         │
│ source        │   └──────────────┘     │ due_date     │
│ stage_id (FK) │                        │ status       │
│ assigned_to   │   ┌──────────────┐     │ priority     │
│ priority      │   │  Note        │     └──────────────┘
│ status        │   │              │
│ tags          │   │ id           │     ┌──────────────┐
│ interest      │   │ lead_id (FK) │     │ AuditLog     │
│ lost_reason   │   │ user_id (FK) │     │              │
│ closed_at     │   │ content      │     │ id           │
│ first_contact │   │ created_at   │     │ org_id (FK)  │
│ last_contact  │   └──────────────┘     │ user_id (FK) │
│ next_action   │                        │ entity_type  │
│ created_at    │   ┌──────────────┐     │ entity_id    │
└──────┬────────┘   │PipelineStage │     │ action       │
       │            │              │     │ changes      │
       │            │ id           │     │ created_at   │
       └───────────>│ org_id (FK)  │     └──────────────┘
                    │ name         │
                    │ position     │     ┌──────────────┐
                    │ color        │     │    Tag       │
                    │ sla_hours    │     │              │
                    └──────────────┘     │ id           │
                                        │ org_id (FK)  │
                    ┌──────────────┐     │ name         │
                    │    Alert     │     │ color        │
                    │              │     └──────────────┘
                    │ id           │
                    │ org_id (FK)  │     ┌──────────────┐
                    │ lead_id (FK) │     │   LeadTag    │
                    │ type         │     │              │
                    │ message      │     │ lead_id (FK) │
                    │ is_read      │     │ tag_id (FK)  │
                    │ created_at   │     └──────────────┘
                    └──────────────┘
```

### Modelo Prisma detallado

```prisma
// Organización (tenant)
model Organization {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  phone       String?
  email       String?
  logo        String?
  timezone    String   @default("America/Mexico_City")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users          User[]
  leads          Lead[]
  pipelineStages PipelineStage[]
  tags           Tag[]
  alerts         Alert[]
  auditLogs      AuditLog[]
  tasks          Task[]
  subscription   Subscription?
  lostReasons    LostReason[]
  leadSources    LeadSource[]
}

// Usuario
model User {
  id             String   @id @default(cuid())
  email          String   @unique
  name           String
  passwordHash   String
  role           Role     @default(SELLER)
  phone          String?
  avatar         String?
  isActive       Boolean  @default(true)
  lastLoginAt    DateTime?
  orgId          String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization   Organization @relation(fields: [orgId], references: [id])
  assignedLeads  Lead[]       @relation("AssignedTo")
  createdLeads   Lead[]       @relation("CreatedBy")
  activities     Activity[]
  notes          Note[]
  tasks          Task[]       @relation("TaskAssignee")
  createdTasks   Task[]       @relation("TaskCreator")
  auditLogs      AuditLog[]

  @@index([orgId])
  @@index([email])
}

enum Role {
  OWNER
  ADMIN
  MANAGER
  SUPERVISOR
  SELLER
}

// Lead / Prospecto
model Lead {
  id             String    @id @default(cuid())
  orgId          String
  name           String
  phone          String?
  email          String?
  company        String?
  source         String?
  interest       String?
  priority       Priority  @default(MEDIUM)
  status         LeadStatus @default(NEW)
  stageId        String
  assignedToId   String?
  createdById    String?
  lostReasonId   String?
  closedAt       DateTime?
  firstContactAt DateTime?
  lastContactAt  DateTime?
  nextActionAt   DateTime?
  nextActionNote String?
  customFields   Json?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  organization   Organization  @relation(fields: [orgId], references: [id])
  stage          PipelineStage @relation(fields: [stageId], references: [id])
  assignedTo     User?         @relation("AssignedTo", fields: [assignedToId], references: [id])
  createdBy      User?         @relation("CreatedBy", fields: [createdById], references: [id])
  lostReason     LostReason?   @relation(fields: [lostReasonId], references: [id])
  activities     Activity[]
  notes          Note[]
  tasks          Task[]
  alerts         Alert[]
  tags           LeadTag[]

  @@index([orgId])
  @@index([orgId, status])
  @@index([orgId, stageId])
  @@index([assignedToId])
  @@index([orgId, assignedToId])
  @@index([orgId, createdAt])
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  WON
  LOST
}

// Etapas del Pipeline
model PipelineStage {
  id        String @id @default(cuid())
  orgId     String
  name      String
  position  Int
  color     String @default("#6B7280")
  slaHours  Int?
  isDefault Boolean @default(false)
  isClosedWon  Boolean @default(false)
  isClosedLost Boolean @default(false)
  createdAt DateTime @default(now())

  organization Organization @relation(fields: [orgId], references: [id])
  leads        Lead[]

  @@index([orgId])
  @@unique([orgId, position])
}

// Actividad / Registro de interacción
model Activity {
  id          String       @id @default(cuid())
  leadId      String
  userId      String
  type        ActivityType
  description String?
  metadata    Json?
  createdAt   DateTime     @default(now())

  lead Lead @relation(fields: [leadId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id])

  @@index([leadId])
  @@index([userId])
  @@index([leadId, createdAt])
}

enum ActivityType {
  CALL
  WHATSAPP
  EMAIL
  MEETING
  VISIT
  NOTE
  STAGE_CHANGE
  ASSIGNMENT
  DOCUMENT
  OTHER
}

// Notas
model Note {
  id        String   @id @default(cuid())
  leadId    String
  userId    String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  lead Lead @relation(fields: [leadId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id])

  @@index([leadId])
}

// Tareas
model Task {
  id          String     @id @default(cuid())
  orgId       String
  leadId      String?
  assigneeId  String
  creatorId   String
  title       String
  description String?
  type        TaskType
  priority    Priority   @default(MEDIUM)
  status      TaskStatus @default(PENDING)
  dueDate     DateTime
  completedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  organization Organization @relation(fields: [orgId], references: [id])
  lead         Lead?        @relation(fields: [leadId], references: [id])
  assignee     User         @relation("TaskAssignee", fields: [assigneeId], references: [id])
  creator      User         @relation("TaskCreator", fields: [creatorId], references: [id])

  @@index([orgId])
  @@index([assigneeId])
  @@index([assigneeId, status])
  @@index([assigneeId, dueDate])
  @@index([leadId])
}

enum TaskType {
  CALL
  WHATSAPP
  EMAIL
  MEETING
  VISIT
  DOCUMENT
  FOLLOW_UP
  OTHER
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

// Alertas
model Alert {
  id        String    @id @default(cuid())
  orgId     String
  leadId    String?
  userId    String?
  type      AlertType
  message   String
  isRead    Boolean   @default(false)
  readAt    DateTime?
  createdAt DateTime  @default(now())

  organization Organization @relation(fields: [orgId], references: [id])
  lead         Lead?        @relation(fields: [leadId], references: [id])

  @@index([orgId])
  @@index([orgId, isRead])
  @@index([userId, isRead])
}

enum AlertType {
  LEAD_UNATTENDED
  LEAD_NO_FOLLOWUP
  LEAD_STAGNANT
  TASK_OVERDUE
  LEAD_AT_RISK
  LEAD_OVERLOAD
  CONVERSION_DROP
}

// Etiquetas
model Tag {
  id    String @id @default(cuid())
  orgId String
  name  String
  color String @default("#3B82F6")

  organization Organization @relation(fields: [orgId], references: [id])
  leads        LeadTag[]

  @@unique([orgId, name])
}

model LeadTag {
  leadId String
  tagId  String

  lead Lead @relation(fields: [leadId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([leadId, tagId])
}

// Bitácora de auditoría
model AuditLog {
  id         String   @id @default(cuid())
  orgId      String
  userId     String?
  entityType String
  entityId   String
  action     String
  changes    Json?
  ipAddress  String?
  createdAt  DateTime @default(now())

  organization Organization @relation(fields: [orgId], references: [id])
  user         User?        @relation(fields: [userId], references: [id])

  @@index([orgId])
  @@index([orgId, entityType, entityId])
  @@index([orgId, createdAt])
}

// Motivos de pérdida
model LostReason {
  id    String @id @default(cuid())
  orgId String
  name  String

  organization Organization @relation(fields: [orgId], references: [id])
  leads        Lead[]

  @@unique([orgId, name])
}

// Fuentes de leads
model LeadSource {
  id    String @id @default(cuid())
  orgId String
  name  String
  type  String

  organization Organization @relation(fields: [orgId], references: [id])

  @@unique([orgId, name])
}

// Suscripción
model Subscription {
  id            String   @id @default(cuid())
  orgId         String   @unique
  plan          Plan     @default(STARTER)
  status        SubStatus @default(ACTIVE)
  maxUsers      Int      @default(3)
  periodStart   DateTime
  periodEnd     DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  organization Organization @relation(fields: [orgId], references: [id])
}

enum Plan {
  STARTER
  GROWTH
  PRO
}

enum SubStatus {
  ACTIVE
  PAST_DUE
  CANCELLED
  TRIAL
}
```

---

## 11. Integraciones Sugeridas

### Fase 1 — MVP

| Integración | Uso | Implementación |
|-------------|-----|----------------|
| **Webhook de entrada** | Recibir leads de formularios externos | Endpoint POST con API key |
| **CSV/Excel import** | Carga masiva de leads existentes | Parser con xlsx + mapeo de columnas |
| **Email transaccional** | Notificaciones, invitaciones, alertas | Resend o SendGrid |

### Fase 2

| Integración | Uso | Implementación |
|-------------|-----|----------------|
| **WhatsApp Business API** | Recibir/enviar mensajes, captar leads | Meta Cloud API via 360dialog o Twilio |
| **Meta Lead Ads** | Captura automática de leads de campañas | Facebook Marketing API + webhooks |
| **Google Sheets** | Exportación de datos para análisis externo | Google Sheets API v4 |
| **Calendario Google** | Sincronizar citas y reuniones | Google Calendar API |

### Fase 3

| Integración | Uso | Implementación |
|-------------|-----|----------------|
| **Zapier / Make** | Conectar con +5000 apps sin código | Webhook triggers + Zapier app |
| **Correo (IMAP/SMTP)** | Sincronizar conversaciones por email | Nylas API o IMAP directo |
| **Telefonía VoIP** | Click-to-call, grabación de llamadas | Twilio Voice |
| **Stripe / Conekta** | Pagos y facturación de suscripciones | Stripe API + webhooks |

### API pública de Vantor

```
POST   /api/v1/leads              → Crear lead
GET    /api/v1/leads              → Listar leads
GET    /api/v1/leads/:id          → Obtener lead
PATCH  /api/v1/leads/:id          → Actualizar lead
DELETE /api/v1/leads/:id          → Eliminar lead

POST   /api/v1/leads/:id/activities  → Registrar actividad
GET    /api/v1/leads/:id/activities  → Historial de actividades

POST   /api/v1/leads/:id/tasks      → Crear tarea
GET    /api/v1/tasks                 → Listar tareas del usuario
PATCH  /api/v1/tasks/:id            → Actualizar tarea

GET    /api/v1/pipeline/stages       → Obtener etapas
PATCH  /api/v1/leads/:id/stage       → Mover lead de etapa

GET    /api/v1/reports/conversion    → Reporte de conversión
GET    /api/v1/reports/performance   → Reporte de productividad
GET    /api/v1/reports/funnel        → Reporte de embudo

POST   /api/v1/webhooks/incoming     → Webhook de entrada (leads externos)

GET    /api/v1/alerts                → Alertas activas
PATCH  /api/v1/alerts/:id/read       → Marcar alerta como leída
```

Autenticación: Bearer token (JWT) por usuario. API keys para integraciones webhook.

---

## 12. Stack Tecnológico Recomendado

### Frontend

| Tecnología | Justificación |
|------------|---------------|
| **Next.js 15 (App Router)** | Framework full-stack, SSR, Server Components, Server Actions |
| **TypeScript** | Seguridad de tipos, mejor DX, menos bugs |
| **Tailwind CSS** | Utility-first, rápido de iterar, consistente |
| **shadcn/ui** | Componentes accesibles, personalizables, no-lock-in |
| **@hello-pangea/dnd** | Drag-and-drop para Kanban (fork mantenido de react-beautiful-dnd) |
| **Recharts** | Gráficas simples para dashboard y reportes |
| **React Hook Form + Zod** | Formularios performantes con validación de esquemas |
| **nuqs** | State management para query params (filtros URL) |

### Backend

| Tecnología | Justificación |
|------------|---------------|
| **Next.js API Routes + Server Actions** | Colocación frontend/backend, tipado end-to-end |
| **Prisma ORM** | Type-safe queries, migraciones, buena DX |
| **Zod** | Validación de inputs en server y client |

### Base de datos

| Tecnología | Justificación |
|------------|---------------|
| **PostgreSQL** | Relacional, maduro, escalable, JSON support |
| **Neon** (managed) | Serverless Postgres, branching, generous free tier |

### Cache y colas

| Tecnología | Justificación |
|------------|---------------|
| **Redis (Upstash)** | Cache, rate limiting, sesiones |
| **BullMQ** | Colas para jobs: alertas, importaciones, reportes |
| **Inngest** (alternativa) | Event-driven jobs serverless, más simple que BullMQ |

### Autenticación

| Tecnología | Justificación |
|------------|---------------|
| **NextAuth.js v5 (Auth.js)** | Auth integrado con Next.js, múltiples providers |
| **bcrypt** | Hashing de contraseñas |
| **JWT** | Tokens para API externa |

### Almacenamiento de archivos

| Tecnología | Justificación |
|------------|---------------|
| **Cloudflare R2** o **AWS S3** | Archivos adjuntos, logos, documentos |
| **UploadThing** (alternativa) | Upload simplificado para Next.js |

### Infraestructura y deploy

| Tecnología | Justificación |
|------------|---------------|
| **Vercel** | Deploy del frontend + API, edge functions, previews |
| **Railway** o **Fly.io** | Workers de background (BullMQ) si se necesitan |
| **GitHub Actions** | CI/CD, tests, linting |

### Monitoreo y observabilidad

| Tecnología | Justificación |
|------------|---------------|
| **Sentry** | Error tracking en frontend y backend |
| **Vercel Analytics** | Web vitals, performance |
| **Axiom** o **Better Stack** | Logging estructurado |

### Email

| Tecnología | Justificación |
|------------|---------------|
| **Resend** | Email transaccional, buena DX, React Email templates |

---

## 13. Arquitectura Técnica

### Diagrama de arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENTES                                  │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │  Navegador  │  │   Móvil     │  │  API Client │                │
│  │  (Web App)  │  │   (PWA)     │  │  (Webhooks) │                │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                │
│         │                │                │                        │
└─────────┼────────────────┼────────────────┼────────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Vercel    │
                    │   Edge      │
                    │  Network    │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────▼──────┐  ┌─────▼──────┐  ┌──────▼──────┐
   │   Next.js   │  │  Server    │  │  API Routes │
   │    SSR      │  │  Actions   │  │  /api/v1/*  │
   │  (React     │  │  (Mutate)  │  │  (External) │
   │   Server    │  │            │  │             │
   │  Components)│  │            │  │             │
   └──────┬──────┘  └─────┬──────┘  └──────┬──────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Prisma    │
                    │   ORM       │
                    │  (Data      │
                    │   Layer)    │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────▼──────┐  ┌─────▼──────┐  ┌──────▼──────┐
   │ PostgreSQL  │  │   Redis    │  │ Cloudflare  │
   │   (Neon)    │  │ (Upstash)  │  │   R2 / S3   │
   │             │  │            │  │             │
   │  - Datos    │  │ - Cache    │  │ - Archivos  │
   │  - Tenants  │  │ - Sessions │  │ - Logos     │
   │  - Audit    │  │ - Queues   │  │ - Docs      │
   └─────────────┘  └────────────┘  └─────────────┘
                           │
                    ┌──────▼──────┐
                    │  Background │
                    │   Jobs      │
                    │             │
                    │ - Alertas   │
                    │ - Import    │
                    │ - Reportes  │
                    │ - Cleanup   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────▼──────┐  ┌─────▼──────┐  ┌──────▼──────┐
   │   Resend    │  │  WhatsApp  │  │   Meta      │
   │  (Email)    │  │  Business  │  │  Lead Ads   │
   │             │  │   API      │  │   API       │
   └─────────────┘  └────────────┘  └─────────────┘
```

### Estructura multitenant

**Enfoque: Shared database con tenant_id (orgId)**

```
Razón:
- Simple de implementar y mantener
- Suficiente para el volumen esperado (< 10,000 empresas)
- Un solo deploy, una sola base de datos
- Row Level Security (RLS) en PostgreSQL como capa extra
- Prisma middleware para inyectar orgId automáticamente
```

```typescript
// Middleware de Prisma para multitenant
prisma.$use(async (params, next) => {
  const orgId = getCurrentOrgId(); // Desde sesión

  // Inyectar orgId en queries automáticamente
  if (params.action === 'findMany' || params.action === 'findFirst') {
    params.args.where = { ...params.args.where, orgId };
  }
  if (params.action === 'create') {
    params.args.data = { ...params.args.data, orgId };
  }

  return next(params);
});
```

### Seguridad

| Aspecto | Implementación |
|---------|----------------|
| Autenticación | NextAuth.js con email/password, CSRF protection |
| Autorización | RBAC middleware, verificación de ownership |
| Datos | Tenant isolation via orgId en todas las queries |
| Contraseñas | bcrypt con salt rounds = 12 |
| API externa | API keys hasheadas, rate limiting con Upstash |
| XSS | React escaping por defecto, CSP headers |
| CSRF | NextAuth CSRF tokens |
| SQL Injection | Prisma parameterized queries |
| Headers | Helmet-style security headers en next.config |
| HTTPS | Forzado en Vercel |
| Auditoría | AuditLog en cada mutación relevante |

---

## 14. MVP de 30 Días

### Semana 1: Fundación

| Día | Tarea |
|-----|-------|
| 1-2 | Setup proyecto: Next.js + Prisma + Tailwind + shadcn/ui + Auth |
| 3 | Modelo de datos: migraciones, seed con datos de prueba |
| 4 | Auth: registro de empresa, login, logout, protección de rutas |
| 5 | Layout principal: sidebar, header, navegación, responsive |

### Semana 2: Core funcional

| Día | Tarea |
|-----|-------|
| 6-7 | Módulo Leads: CRUD, tabla filtrable, alta rápida (modal) |
| 8-9 | Pipeline Kanban: vista por etapas, drag-and-drop, semáforo |
| 10 | Detalle del prospecto: ficha completa, historial, notas |

### Semana 3: Seguimiento y alertas

| Día | Tarea |
|-----|-------|
| 11-12 | Tareas: CRUD, vista "Mi día", filtros, tipos de acción |
| 13 | Actividades: registro de interacciones, timeline en lead |
| 14 | Alertas de fuga: motor básico (lead sin atender, tarea vencida) |
| 15 | Importación CSV: upload, mapeo de columnas, preview, ejecución |

### Semana 4: Visibilidad y pulido

| Día | Tarea |
|-----|-------|
| 16-17 | Dashboard: widgets, métricas clave, gráfica de embudo |
| 18-19 | Reportes: leads por fuente, conversión por etapa, cierre por vendedor |
| 20 | Usuarios: invitación, roles, activar/desactivar |
| 21-22 | Responsive mobile, QA, bug fixes, performance |

### Qué SÍ incluye el MVP
- Login y registro
- Multi-empresa (tenant)
- Leads con CRUD completo
- Pipeline Kanban funcional
- Detalle del prospecto
- Tareas y seguimientos
- Alertas básicas (sin atender, tarea vencida)
- Dashboard con métricas clave
- Reportes básicos
- Importación CSV
- Usuarios y roles
- Diseño responsivo

### Qué NO incluye el MVP
- IA / scoring inteligente
- WhatsApp Business API
- Meta Lead Ads
- Automatizaciones complejas
- Secuencias de seguimiento
- Campos personalizados
- Zapier / Make
- Telefonía
- Facturación / pagos
- App nativa móvil

---

## 15. Roadmap de 90 Días

### Fase 1 (Días 1-30): MVP Funcional

**Objetivo:** Sistema operativo para primeros pilotos.

- Setup técnico completo
- Auth + multitenancy
- Leads, Pipeline, Detalle, Tareas
- Alertas básicas
- Dashboard y Reportes básicos
- Import CSV
- Usuarios y permisos
- Responsive mobile
- Deploy a producción

**Resultado:** 3-5 empresas piloto usando el sistema.

### Fase 2 (Días 31-60): Integraciones y Refinamiento

**Objetivo:** Incorporar feedback real, agregar integraciones clave.

- Webhook de entrada para formularios externos
- WhatsApp Business API (lectura de mensajes, envío básico)
- Meta Lead Ads (captura automática)
- Mejores alertas (estancamiento, riesgo, sobrecarga)
- Asignación automática (round-robin)
- Mejores reportes (tiempo de respuesta, productividad)
- Exportación a CSV / Google Sheets
- Notificaciones por email (alertas críticas)
- Campos personalizados básicos
- Mejoras de UX basadas en feedback
- Bitácora de auditoría completa

**Resultado:** Producto validado con feedback real, integraciones clave funcionando.

### Fase 3 (Días 61-90): Escalamiento y Diferenciación

**Objetivo:** Producto listo para comercialización activa.

- Scoring de prioridad (reglas configurables)
- Secuencias de seguimiento (workflows básicos)
- Calendario Google integrado
- Dashboard ejecutivo mejorado (comparativas, tendencias)
- Verticalización: templates por industria (inmobiliaria, financiera, etc.)
- Permisos granulares refinados
- Onboarding guiado (wizard + tooltips)
- Landing page y sitio de producto
- Sistema de facturación (Stripe/Conekta)
- Documentación y base de conocimiento
- Programa de early adopters

**Resultado:** Producto comercialmente viable, listo para crecimiento.

---

## 16. Riesgos Técnicos y de Producto

### Riesgos técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| WhatsApp API tiene restricciones de aprobación | Alta | Alto | Empezar sin WhatsApp nativo, usar webhook genérico. Aplicar a Business API en paralelo |
| Performance del Kanban con muchos leads | Media | Medio | Virtualización de lista, paginación, filtros obligatorios |
| Complejidad del multitenancy | Media | Alto | Usar Prisma middleware desde día 1, tests de aislamiento |
| Escalabilidad de alertas en tiempo real | Baja | Medio | Cron jobs cada 5 min inicialmente, migrar a eventos después |
| Migración de datos de clientes (Excel caótico) | Alta | Medio | Template estándar de importación, validación robusta, preview |

### Riesgos de producto

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Baja adopción por vendedores (rechazo al cambio) | Alta | Crítico | UX extremadamente simple, valor visible día 1, "Mi día" como hook |
| Competencia con CRMs establecidos (HubSpot, Pipedrive) | Alta | Alto | Enfoque en ejecución (no administración), pricing LATAM, WhatsApp-first |
| Feature creep (querer agregar todo) | Alta | Alto | Disciplina de MVP, validar con usuarios antes de construir |
| Churn por falta de valor percibido | Media | Crítico | Onboarding guiado, métricas de antes/después, quick wins |
| Dependencia de Meta APIs (cambios, deprecaciones) | Media | Medio | Abstraer integraciones, capa de adaptadores |

---

## 17. Recomendaciones de UX/UI

### Principios de diseño

1. **Cero fricción:** Registrar un seguimiento debe tomar < 10 segundos
2. **Claridad inmediata:** Dashboard entendible en < 10 segundos
3. **Acción visible:** Las acciones importantes siempre visibles, nunca escondidas en menús
4. **Mobile-ready:** Todo funcional desde el celular del vendedor
5. **Foco en "hoy":** La vista por defecto siempre muestra qué hacer hoy

### Recomendaciones específicas

| Área | Recomendación |
|------|---------------|
| **Dashboard** | Cards grandes con números, semáforos, lista de urgentes arriba |
| **Pipeline** | Kanban con cards compactas: nombre, teléfono, días en etapa, semáforo |
| **"Mi día"** | Vista tipo checklist: tareas ordenadas por prioridad, un tap para completar |
| **Detalle lead** | Layout en 2 columnas: datos a la izquierda, timeline a la derecha |
| **Alta de lead** | Modal rápido: solo nombre y teléfono obligatorios, lo demás opcional |
| **Filtros** | Siempre visibles en barra superior, presets guardables |
| **Notificaciones** | Badge en sidebar + dropdown, nunca popups intrusivos |
| **Mobile** | Bottom navigation, swipe en cards, formularios adaptativos |

### Paleta de colores sugerida

```
Primario:       #1E3A5F (azul marino profundo - confianza, profesionalismo)
Secundario:     #3B82F6 (azul claro - acción, interactividad)
Acento:         #10B981 (verde - éxito, cierres, positivo)
Alerta:         #F59E0B (amarillo - precaución, seguimiento pendiente)
Peligro:        #EF4444 (rojo - urgente, vencido, fuga)
Fondo:          #F8FAFC (gris muy claro)
Superficie:     #FFFFFF (blanco)
Texto:          #1E293B (gris oscuro)
Texto secundario: #64748B (gris medio)
```

### Tipografía

```
Fuente principal: Inter (Google Fonts)
Títulos: 600 (semi-bold)
Cuerpo: 400 (regular)
Números/métricas: 700 (bold), tamaño mayor
```

---

## 18. Métricas Clave del Sistema

### Métricas de producto (para el equipo Vantor)

| Métrica | Objetivo | Cómo medir |
|---------|----------|------------|
| DAU/MAU | > 40% | Usuarios activos diarios / mensuales |
| Tiempo a primer valor | < 10 min | Desde registro hasta primer lead creado |
| Retención D7 | > 60% | Usuarios que regresan a los 7 días |
| Retención D30 | > 40% | Usuarios que regresan a los 30 días |
| NPS | > 50 | Encuesta in-app trimestral |
| Churn mensual | < 5% | Empresas que cancelan / total activas |
| Leads procesados/empresa | > 50/mes | Promedio de leads por tenant activo |
| Acciones/vendedor/día | > 10 | Actividades registradas por vendedor |

### Métricas de negocio (que Vantor muestra al cliente)

| Métrica | Descripción |
|---------|-------------|
| Leads por fuente | Cuántos leads entran por cada canal |
| Tasa de conversión por etapa | % de leads que avanzan de una etapa a otra |
| Tasa de conversión global | % de leads que llegan a cierre ganado |
| Tiempo promedio de primera respuesta | Minutos/horas desde que entra el lead hasta primer contacto |
| Tiempo promedio por etapa | Cuánto tarda un lead en cada etapa |
| Cierres por vendedor | Número de deals cerrados por persona |
| Cierres por canal | Qué canales generan más cierres |
| Leads perdidos y motivo | Por qué se pierden los deals |
| Productividad comercial | Acciones realizadas por vendedor por día |
| Leads en riesgo | Cuántos leads están estancados o sin atender |
| Valor del pipeline | Suma estimada de oportunidades activas (Fase 2) |

---

## 19. Estructura SaaS Multitenant

### Enfoque elegido: Shared Database + Row-Level Isolation

```
┌─────────────────────────────────────────┐
│            Aplicación Next.js           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      Auth Middleware            │    │
│  │  (Valida sesión + org_id)       │    │
│  └──────────────┬──────────────────┘    │
│                 │                       │
│  ┌──────────────▼──────────────────┐    │
│  │      Prisma Middleware          │    │
│  │  (Inyecta org_id en queries)    │    │
│  └──────────────┬──────────────────┘    │
│                 │                       │
│  ┌──────────────▼──────────────────┐    │
│  │      PostgreSQL                 │    │
│  │                                 │    │
│  │  ┌─────┐ ┌─────┐ ┌─────┐      │    │
│  │  │Org A│ │Org B│ │Org C│      │    │
│  │  │data │ │data │ │data │      │    │
│  │  └─────┘ └─────┘ └─────┘      │    │
│  │                                 │    │
│  │  Todas las tablas tienen        │    │
│  │  org_id como columna            │    │
│  │  + índices compuestos           │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### Reglas de aislamiento

1. **Toda tabla** (excepto User y Subscription) tiene `orgId` como columna obligatoria
2. **Todo query** pasa por middleware que inyecta `orgId` del usuario autenticado
3. **Índices compuestos** en todas las tablas: `(orgId, ...)` para performance
4. **Tests automatizados** que verifican que no hay data leak entre tenants
5. **API keys** son por organización, hasheadas en la base de datos

### Límites por plan

| Recurso | Starter | Growth | Pro |
|---------|---------|--------|-----|
| Usuarios | 3 | 10 | 25 |
| Leads activos | 500 | 2,000 | 10,000 |
| Almacenamiento | 1 GB | 5 GB | 20 GB |
| Importaciones/mes | 5 | 20 | Ilimitadas |
| Reportes | Básicos | Completos | Completos + exportación |
| Integraciones | Webhook | + WhatsApp, Meta | + Todo |
| Soporte | Email | Email + Chat | Prioritario |

### Facturación

- **Fase MVP:** Manual (transferencia, domiciliación)
- **Fase 2:** Stripe para cobro automático con tarjeta
- **Fase 3:** Conekta para métodos de pago México (OXXO, SPEI, tarjeta)

---

## 20. Recomendación Final de Implementación

### Prioridad absoluta: Velocidad a valor

El éxito de Vantor no depende de tener muchas funciones. Depende de que un vendedor abra la app y en 10 segundos sepa qué hacer hoy. Eso es lo que hay que lograr primero.

### Orden de ejecución recomendado

```
SEMANA 1-2:  Fundación técnica + Auth + Layout
SEMANA 3-4:  Leads + Pipeline + Detalle del prospecto
SEMANA 5-6:  Tareas + Alertas + Dashboard
SEMANA 7-8:  Reportes + Import CSV + Usuarios
SEMANA 9-10: Webhook entrada + WhatsApp básico
SEMANA 11-12: Pulido UX + Mobile + QA + Pilotos
```

### Equipo mínimo recomendado

| Rol | Cantidad | Perfil |
|-----|----------|--------|
| Full-stack developer | 1-2 | Next.js, TypeScript, Prisma, Tailwind |
| Product/UX | 1 | Diseño de flujos, wireframes, testing con usuarios |
| Founder/PM | 1 | Priorización, feedback de clientes, go-to-market |

### Costos estimados de infraestructura (mensual MVP)

| Servicio | Costo estimado |
|----------|---------------|
| Vercel Pro | $20 USD |
| Neon (Postgres) | $0-19 USD |
| Upstash (Redis) | $0-10 USD |
| Resend (email) | $0-20 USD |
| Cloudflare R2 | $0-5 USD |
| Sentry | $0 (free tier) |
| Dominio + DNS | $15 USD/año |
| **Total MVP** | **~$50-75 USD/mes** |

### Principios técnicos no negociables

1. **TypeScript estricto** en todo el codebase
2. **Validación con Zod** en toda entrada de datos
3. **Prisma migrations** para todo cambio de esquema
4. **orgId en todo query** — nunca confiar en el frontend
5. **Tests de aislamiento** entre tenants
6. **Audit log** en toda mutación de negocio
7. **Mobile-first** en CSS
8. **Server Components** por defecto, Client Components solo cuando hay interactividad
9. **Conventional commits** + PR reviews
10. **Feature flags** solo cuando hay riesgo de deploy, no por default

### Decisión de arquitectura más importante

**No separar frontend y backend.** Usar Next.js full-stack con Server Actions y API Routes. Esto reduce complejidad operacional, elimina problemas de CORS, permite tipado end-to-end, y un solo deploy. Si en el futuro se necesita una API independiente (para mobile nativo o terceros), se extrae de los Server Actions existentes sin reescribir lógica.

### Mensaje final

Vantor tiene una oportunidad clara en el mercado LATAM porque ataca un dolor real y diario. La clave no es construir el CRM más completo, sino el sistema de ejecución más adoptable. Cada decisión técnica y de producto debe pasar por este filtro:

> **¿Esto ayuda al vendedor a cerrar más ventas hoy?**

Si la respuesta es no, no va en el MVP.

---

*Documento generado como base arquitectónica para el desarrollo de Vantor v1.0*
*Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + Tailwind + shadcn/ui*
*Modelo: SaaS B2B Multitenant*
*Mercado: México y LATAM*
