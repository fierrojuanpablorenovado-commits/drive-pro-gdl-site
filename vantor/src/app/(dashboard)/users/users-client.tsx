"use client";

import { cn, getInitials, formatRelativeTime } from "@/lib/utils";
import { Shield, User, Users, Eye, Crown } from "lucide-react";

interface UsersClientProps {
  users: any[];
  currentUserId: string;
  currentRole: string;
}

const roleConfig: Record<string, { label: string; icon: any; color: string }> = {
  OWNER: { label: "Dueño", icon: Crown, color: "text-brand-800 bg-brand-100" },
  ADMIN: { label: "Admin", icon: Shield, color: "text-purple-700 bg-purple-100" },
  MANAGER: { label: "Gerente", icon: Users, color: "text-blue-700 bg-blue-100" },
  SUPERVISOR: { label: "Supervisor", icon: Eye, color: "text-teal-700 bg-teal-100" },
  SELLER: { label: "Vendedor", icon: User, color: "text-gray-700 bg-gray-100" },
};

export function UsersClient({ users, currentUserId, currentRole }: UsersClientProps) {
  const canManage = ["OWNER", "ADMIN"].includes(currentRole);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} {users.length === 1 ? "usuario" : "usuarios"}
          </p>
        </div>
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
                    {isMe && (
                      <span className="text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                        Tú
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full", role.color)}>
                  <Icon className="h-3 w-3" />
                  {role.label}
                </span>
                {!u.isActive && (
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    Inactivo
                  </span>
                )}
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
    </div>
  );
}
