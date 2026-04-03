"use client";

import { useAuth } from "@/context/AuthContext";
import { VoiceTicketForm } from "@/components/tickets/VoiceTicketForm";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, profileName, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="w-full mb-12 text-center md:text-left mt-4">
        <h2 className="text-on-surface font-headline font-extrabold text-[2.75rem] leading-tight md:text-[3.5rem] tracking-tight">
          Hello, {profileName?.split(" ")[0] || "Resident"}
        </h2>
        <p className="text-on-surface-variant text-xl md:text-2xl mt-2 font-medium">
          How can the Panchayat help you today?
        </p>
      </div>

      {/* Voice Hero Section */}
      <VoiceTicketForm user={user} />

      {/* Quick Action Tiles (Bento Style) */}
      <div className="w-full mt-16">
        <div className="flex items-center justify-between mb-8">
          <h4 className="font-headline font-bold text-2xl">Quick Actions</h4>
          <button onClick={() => alert("All actions coming soon")} className="text-primary font-bold text-lg hover:underline transition-all">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tile 1: Water */}
          <div onClick={() => alert("Water supply details page coming soon!")} className="bg-surface-container-lowest rounded-[2rem] p-8 transition-all hover:bg-surface-container-low group cursor-pointer border border-transparent hover:border-outline-variant/20 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-blue-700 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
            </div>
            <h5 className="text-2xl font-bold text-on-surface mb-2">Check Water Supply</h5>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
              <span className="text-secondary font-bold">Flowing Normal</span>
            </div>
          </div>

          {/* Tile 2: Lift */}
          <div onClick={() => alert("Lift status details page coming soon!")} className="bg-surface-container-lowest rounded-[2rem] p-8 transition-all hover:bg-surface-container-low group cursor-pointer border border-transparent hover:border-outline-variant/20 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-amber-700 text-4xl">elevator</span>
            </div>
            <h5 className="text-2xl font-bold text-on-surface mb-2">Lift Status</h5>
            <div className="flex items-center gap-2 text-on-surface-variant font-medium">
              <span>Lift A &amp; B Working</span>
            </div>
          </div>

          {/* Tile 3: Pay Maintenance */}
          <div onClick={() => alert("Opening payments portal...")} className="bg-surface-container-lowest rounded-[2rem] p-8 transition-all hover:bg-surface-container-low group cursor-pointer border border-transparent hover:border-outline-variant/20 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-green-700 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
            <h5 className="text-2xl font-bold text-on-surface mb-2">Pay Maintenance</h5>
            <div className="flex items-center gap-2">
              <span className="text-error font-bold">Due in 3 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Notification (Asymmetric Alert) */}
      <div className="w-full mt-12 bg-tertiary-fixed text-on-tertiary-fixed p-8 rounded-[2.5rem] flex items-center gap-6 shadow-md border border-tertiary-fixed-dim/20">
        <div className="p-4 bg-on-tertiary-fixed/10 rounded-2xl shrink-0">
          <span className="material-symbols-outlined text-4xl text-on-tertiary-fixed-variant">warning</span>
        </div>
        <div>
          <p className="text-xl font-bold mb-1">Scheduled Power Outage</p>
          <p className="opacity-80 text-lg">Tomorrow, 10:00 AM to 12:00 PM for transformer servicing.</p>
        </div>
      </div>
    </div>
  );
}
