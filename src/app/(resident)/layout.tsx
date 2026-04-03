import { ResidentHeader } from "@/components/layout/ResidentHeader";
import { ResidentBottomNav } from "@/components/layout/ResidentBottomNav";

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pb-32 overflow-x-hidden selection:bg-primary-fixed selection:text-on-primary-fixed">
      <ResidentHeader />
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10 flex flex-col items-center">
        {children}
      </main>
      <ResidentBottomNav />
    </div>
  );
}
