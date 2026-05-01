"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn, getInitials, formatRelativeTime } from "@/lib/utils";
import { Shield, User, Users, Eye, Crown, Plus, X, Power } from "lucide-react";
import { inviteUser, toggleUserActive } from "@/server/actions/settings";

interface UsersClientProps {
  users: any[];
  currentUserId: string;
  currentRole: string;
  maxUsers: number;
}

const roleConfig: Record<string, { label: string; icon: any; color: string }> = {
  OWNER: { label: "Dueño", icon: Crown, color: "text-brand-800 bg-brand-100" },
  ADMIN: { label: "Admin", icon: Shield, color: "text-purple-700 bg-purple-100" },
  MANAGER: { label: "Gerente", icon: Users, color: "text-blue-700 bg-blue-100" },
  SUPERVISOR: { label: "Supervisor", icon: Eye, color: "text-teal-700 bg-teal-100" },
  SELLER: { label: "Vendedor", icon: User, color: "text-gray-700 bg-gray-100" },
};

export function UsersClient({ users, currentUserId, currentRole, maxUsers }: UsersClientProps) {
  const router = useRouter();
  const canManage = ["OWNER", "ADMIN"].includes(currentRole);
  const [showInvite, setShowInvite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempPass, setTempPass] = useState("");

  const activeCount = users.filter((u) => u.isActive).length;

  async function handleInvite(formData: FormData) {
    setLoading(true);
    setError("");
    setTempPass("");
    const result = await inviteUser(formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.tempPassword) {
      setTempPass(result.tempPassword);
      router.refresh();
    }
  }

  async function handleToggle(userId: string) {
    await toggleUserActive(userId);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeCount} de {maxUsers} usuarios activos
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => { setShowInvite(true); setTempPass(""); setError(""); }}
            className="inline-flex items-center gap-2 bg-brand-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-900"
          >
            <Plus className="h-4 w-4" />
            Invitar usuario
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => {
          const role = roleConfig[u.role] || roleConfig.SELLER;
          const Icon = role.icon;
          const isMe = u.id === currentUserId;

          return (
            <div
              key={u.id}
              className={cn(
                "bg-white rounded-xl border border-gray-200 p-5 transition-all hover:shadow-sm",
                !u.isActive && "opacity-50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-full bg-brand-100 text-brand-800 text-sm font-bold flex items-center justify-center shrink-0">
                  {getInitials(u.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                    {isMe && <span className="text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">Tú</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                {canManage && !isMe && u.role !== "OWNER" && (
                  <button
                    onClick={() => handleToggle(u.id)}
                    className={cn("p-1.5 rounded-lg transition-colors", u.isActive ? "text-gray-400 hover:text-danger-500 hover:bg-danger-50" : "text-gray-400 hover:text-success-500 hover:bg-success-50")}
                    title={u.isActive ? "Desactivar" : "Activar"}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full", role.color)}>
                  <Icon className="h-3 w-3" />
                  {role.label}
                </span>
                {!u.isActive && <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Inactivo</span>}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400">Leads activos</span>
                  <p className="font-semibold text-gray-900">{u._count.assignedLeads}</p>
                </div>
                <div>
                  <span className="text-gray-400">Tareas pend.</span>
                  <p className="font-semibold text-gray-900">{u._count.tasks}</p>
                </div>
              </div>

              {u.lastLoginAt && (
                <p className="text-[10px] text-gray-400 mt-2">
                  Último acceso: {formatRelativeTime(u.lastLoginAt)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Invitar usuario</h2>
              <button onClick={() => setShowInvite(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>

            {error && <div className="mx-6 mt-4 p-3 rounded-lg bg-danger-50 text-danger-600 text-sm">{error}</div>}

            {tempPass ? (
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-success-50 text-success-500 flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Usuario creado</p>
                </div>
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-warning-800 mb-1">Contraseña temporal:</p>
                  <p className="font-mono text-lg font-bold text-warning-900 select-all">{tempPass}</p>
                  <p className="text-xs text-warning-600 mt-2">Comparte esta contraseña con el usuario. Deberá cambiarla al ingresar.</p>
                </div>
                <button onClick={() => setShowInvite(false)} className="w-full py-2.5 bg-brand-800 text-white text-sm font-semibold rounded-lg hover:bg-brand-900">Cerrar</button>
              </div>
            ) : (
              <form action={handleInvite} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input name="name" type="text" required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Nombre completo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="correo@empresa.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select name="role" defaultValue="SELLER" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white">
                    <option value="SELLER">Vendedor</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="MANAGER">Gerente</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowInvite(false)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                  <button type="submit" disabled={loading} className="px-4 py-2.5 text-sm font-semibold text-white bg-brand-800 rounded-lg hover:bg-brand-900 disabled:opacity-50">
                    {loading ? "Creando..." : "Crear usuario"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
