"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createTag,
  deleteTag,
  createLeadSource,
  deleteLeadSource,
  createLostReason,
  deleteLostReason,
  updateOrgSettings,
} from "@/server/actions/settings";

export default function SettingsPage() {
  return <SettingsLoader />;
}

function SettingsLoader() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  return <SettingsContent org={data.org} />;
}

function SettingsContent({ org }: { org: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleOrgSubmit(formData: FormData) {
    setSaving(true);
    const result = await updateOrgSettings(formData);
    setSaving(false);
    if (result.error) setMessage(result.error);
    else { setMessage("Guardado"); setTimeout(() => setMessage(""), 2000); }
  }

  async function handleAddTag(formData: FormData) {
    const result = await createTag(formData);
    if (result.error) alert(result.error);
    else router.refresh();
  }

  async function handleDeleteTag(tagId: string) {
    await deleteTag(tagId);
    router.refresh();
  }

  async function handleAddSource(formData: FormData) {
    const result = await createLeadSource(formData);
    if (result.error) alert(result.error);
    else router.refresh();
  }

  async function handleDeleteSource(sourceId: string) {
    await deleteLeadSource(sourceId);
    router.refresh();
  }

  async function handleAddReason(formData: FormData) {
    const result = await createLostReason(formData);
    if (result.error) alert(result.error);
    else router.refresh();
  }

  async function handleDeleteReason(reasonId: string) {
    await deleteLostReason(reasonId);
    router.refresh();
  }

  const planLabels: Record<string, string> = { STARTER: "Starter", GROWTH: "Growth", PRO: "Pro" };
  const statusLabels: Record<string, string> = { ACTIVE: "Activa", PAST_DUE: "Pago pendiente", CANCELLED: "Cancelada", TRIAL: "Prueba" };

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
          <form action={handleOrgSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
                <input name="name" defaultValue={org.name} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input name="email" defaultValue={org.email || ""} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
                <input name="phone" defaultValue={org.phone || ""} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Zona horaria</label>
                <input value={org.timezone} readOnly className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-500" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-800 text-white text-sm font-semibold rounded-lg hover:bg-brand-900 disabled:opacity-50">
                <Save className="h-4 w-4" />
                {saving ? "Guardando..." : "Guardar"}
              </button>
              {message && <span className="text-sm text-success-600">{message}</span>}
            </div>
          </form>
        </div>

        {/* Subscription */}
        {org.subscription && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Suscripción</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400 text-xs">Plan</span>
                <p className="font-semibold text-brand-800">{planLabels[org.subscription.plan] || org.subscription.plan}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Estado</span>
                <p className="font-medium text-gray-700">{statusLabels[org.subscription.status] || org.subscription.status}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Usuarios máx.</span>
                <p className="font-medium text-gray-700">{org.subscription.maxUsers}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pipeline stages */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Etapas del pipeline</h2>
          <div className="space-y-2">
            {org.pipelineStages?.map((stage: any, i: number) => (
              <div key={stage.id} className="flex items-center gap-3 py-2">
                <span className="text-xs text-gray-400 w-6">{i + 1}</span>
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="text-sm text-gray-700 flex-1">{stage.name}</span>
                {stage.isDefault && <span className="text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">Default</span>}
                {stage.isClosedWon && <span className="text-[10px] font-medium text-success-600 bg-success-50 px-1.5 py-0.5 rounded">Ganado</span>}
                {stage.isClosedLost && <span className="text-[10px] font-medium text-danger-600 bg-danger-50 px-1.5 py-0.5 rounded">Perdido</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Etiquetas</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {org.tags?.map((tag: any) => (
              <span key={tag.id} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
                {tag.name}
                <button onClick={() => handleDeleteTag(tag.id)} className="hover:opacity-70"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
          <form action={handleAddTag} className="flex gap-2">
            <input name="name" placeholder="Nueva etiqueta" required className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            <input name="color" type="color" defaultValue="#3B82F6" className="h-9 w-9 rounded-lg border border-gray-300 cursor-pointer" />
            <button type="submit" className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"><Plus className="h-4 w-4" /></button>
          </form>
        </div>

        {/* Sources */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Fuentes de leads</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {org.leadSources?.map((source: any) => (
              <span key={source.id} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                {source.name}
                <button onClick={() => handleDeleteSource(source.id)} className="hover:opacity-70"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
          <form action={handleAddSource} className="flex gap-2">
            <input name="name" placeholder="Nueva fuente" required className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            <input name="type" type="hidden" value="other" />
            <button type="submit" className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"><Plus className="h-4 w-4" /></button>
          </form>
        </div>

        {/* Lost reasons */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Motivos de pérdida</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {org.lostReasons?.map((reason: any) => (
              <span key={reason.id} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-danger-50 text-danger-600">
                {reason.name}
                <button onClick={() => handleDeleteReason(reason.id)} className="hover:opacity-70"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
          <form action={handleAddReason} className="flex gap-2">
            <input name="name" placeholder="Nuevo motivo" required className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            <button type="submit" className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"><Plus className="h-4 w-4" /></button>
          </form>
        </div>

        {/* Webhook info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">API / Webhook</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-400 text-xs">Endpoint</span>
              <p className="font-mono text-xs bg-gray-50 px-3 py-2 rounded-lg mt-1">POST /api/v1/webhooks/incoming</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs">API Key (x-api-key header)</span>
              <p className="font-mono text-xs bg-gray-50 px-3 py-2 rounded-lg mt-1 select-all">{org.slug}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
