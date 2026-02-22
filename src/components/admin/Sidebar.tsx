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
  MessageSquare
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
  { label: "Gestion du Contenu", href: "/admin/contenu", icon: Film },
  { label: "Projets", href: "/admin/projets", icon: Target },
  { label: "Finance & Dons", href: "/admin/finance", icon: CreditCard },
  { label: "Personnel (RH)", href: "/admin/personnel", icon: Users },
  { label: "Pub & Ouvrage", href: "/admin/pubs-ouvrages", icon: BookOpen },
  { label: "Paramètres", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col justify-between border-r border-slate-200 bg-slate-900 text-white dark:border-slate-800 shrink-0">
      <div className="flex flex-col gap-2 p-4">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600" />
          <span className="text-xl font-bold">JeTémoigne TV</span>
        </div>
        
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
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
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors">
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
