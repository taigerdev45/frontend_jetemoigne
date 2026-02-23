"use client";

import { useAuth } from "@/hooks/useAuth";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useAuth();

  // La page de login a son propre layout, on la laisse passer directement
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Vérification côté client en cours (le middleware a déjà bloqué les non-authentifiés,
  // ce spinner couvre le court instant avant que useAuth confirme l'état)
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">JT</span>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Vérification de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans antialiased">
      {/* Sidebar — masquée sur mobile */}
      <aside className="hidden md:flex w-64 flex-col shrink-0">
        <AdminSidebar />
      </aside>

      {/* Zone principale */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
