"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Film,
  Target,
  CreditCard,
  Users,
  Settings,
  BookOpen,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
  { label: "Gestion du Contenu", href: "/admin/contenu", icon: Film },
  { label: "Projets", href: "/admin/projets", icon: Target },
  { label: "Finance & Dons", href: "/admin/finance", icon: CreditCard },
  { label: "Personnel (RH)", href: "/admin/personnel", icon: Users },
  { label: "Pub & Ouvrage", href: "/admin/pubs-ouvrages", icon: BookOpen },
  { label: "Paramètres", href: "/admin/settings", icon: Settings },
];

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrateur",
  manager: "Manager",
  accountant: "Comptable",
  observer: "Observateur",
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col justify-between border-r border-slate-700 bg-slate-900 text-white shrink-0">
      <div className="flex flex-col gap-2 p-4">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">JT</span>
          </div>
          <span className="text-xl font-bold">JeTémoigne TV</span>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 space-y-3 border-t border-slate-700">
        {user && (
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {ROLE_LABELS[user.role] ?? user.role}
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
