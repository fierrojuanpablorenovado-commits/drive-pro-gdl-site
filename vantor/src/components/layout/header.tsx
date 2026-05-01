"use client";

import { Bell, Menu, Search } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  userName?: string;
  orgName?: string;
  alertCount?: number;
  onMenuToggle?: () => void;
}

export function Header({
  userName = "Usuario",
  orgName = "Empresa",
  alertCount = 0,
  onMenuToggle,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-64">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar leads, tareas..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-5 w-5 rounded-full bg-danger-500 text-white text-[10px] font-bold">
                {alertCount > 99 ? "99+" : alertCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{orgName}</p>
            </div>
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-brand-800 text-white text-sm font-semibold">
              {getInitials(userName)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
