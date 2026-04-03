import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminBottomNav } from "@/components/layout/AdminBottomNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen text-on-surface bg-background pb-32">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 lg:ml-80 p-6 md:p-10 mb-24 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
      <AdminBottomNav />
    </div>
  );
}
