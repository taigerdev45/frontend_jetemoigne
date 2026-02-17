import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans antialiased">
      <aside className="hidden w-64 flex-col md:flex">
        <AdminSidebar />
      </aside>
      
      <main className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
