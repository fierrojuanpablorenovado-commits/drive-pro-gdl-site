import { db } from "@/server/db";
import { getSessionUser } from "@/lib/session";

export default async function SettingsPage() {
  const user = await getSessionUser();

  const org = await db.organization.findUnique({
    where: { id: user.orgId },
    include: {
      subscription: true,
      pipelineStages: { orderBy: { position: "asc" } },
      tags: { orderBy: { name: "asc" } },
      leadSources: { orderBy: { name: "asc" } },
      lostReasons: { orderBy: { name: "asc" } },
    },
  });

  const planLabels = { STARTER: "Starter", GROWTH: "Growth", PRO: "Pro" };
  const statusLabels = { ACTIVE: "Activa", PAST_DUE: "Pago pendiente", CANCELLED: "Cancelada", TRIAL: "Prueba" };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">Ajustes de tu empresa y sistema</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Company info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Empresa</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400 text-xs">Nombre</span>
              <p className="font-medium text-gray-900">{org?.name}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Slug</span>
              <p className="font-medium text-gray-700">{org?.slug}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Email</span>
              <p className="font-medium text-gray-700">{org?.email || "—"}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Teléfono</span>
              <p className="font-medium text-gray-700">{org?.phone || "—"}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Zona horaria</span>
              <p className="font-medium text-gray-700">{org?.timezone}</p>
            </div>
          </div>
        </div>

        {/* Subscription */}
        {org?.subscription && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Suscripción</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400 text-xs">Plan</span>
                <p className="font-semibold text-brand-800">
                  {planLabels[org.subscription.plan as keyof typeof planLabels]}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Estado</span>
                <p className="font-medium text-gray-700">
                  {statusLabels[org.subscription.status as keyof typeof statusLabels]}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Usuarios máximos</span>
                <p className="font-medium text-gray-700">{org.subscription.maxUsers}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pipeline stages */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Etapas del pipeline</h2>
          <div className="space-y-2">
            {org?.pipelineStages.map((stage, i) => (
              <div key={stage.id} className="flex items-center gap-3 py-2">
                <span className="text-xs text-gray-400 w-6">{i + 1}</span>
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="text-sm text-gray-700 flex-1">{stage.name}</span>
                {stage.slaHours && (
                  <span className="text-xs text-gray-400">SLA: {stage.slaHours}h</span>
                )}
                {stage.isDefault && (
                  <span className="text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">Default</span>
                )}
                {stage.isClosedWon && (
                  <span className="text-[10px] font-medium text-success-600 bg-success-50 px-1.5 py-0.5 rounded">Ganado</span>
                )}
                {stage.isClosedLost && (
                  <span className="text-[10px] font-medium text-danger-600 bg-danger-50 px-1.5 py-0.5 rounded">Perdido</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Etiquetas</h2>
          <div className="flex flex-wrap gap-2">
            {org?.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
            {org?.tags.length === 0 && (
              <p className="text-sm text-gray-400">Sin etiquetas</p>
            )}
          </div>
        </div>

        {/* Sources */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Fuentes de leads</h2>
          <div className="flex flex-wrap gap-2">
            {org?.leadSources.map((source) => (
              <span
                key={source.id}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700"
              >
                {source.name}
              </span>
            ))}
          </div>
        </div>

        {/* Lost reasons */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Motivos de pérdida</h2>
          <div className="flex flex-wrap gap-2">
            {org?.lostReasons.map((reason) => (
              <span
                key={reason.id}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-danger-50 text-danger-600"
              >
                {reason.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
