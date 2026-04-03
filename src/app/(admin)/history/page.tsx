"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function HistoryPage() {
  const { role, loading: authLoading } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"Active" | "Resolved">("Active");

  useEffect(() => {
    if (role !== "admin") return;

    const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComplaints(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [role]);

  if (authLoading || loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  if (role !== "admin") {
    return <div className="text-center pt-20 text-error font-bold text-2xl">Access Denied. Admins Only.</div>;
  }

  const filteredComplaints = complaints.filter(c => filter === "Active" ? c.status !== "Done" : c.status === "Done");

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section & Filters */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl text-primary font-bold mb-2 tracking-tight">Complaint History</h2>
            <p className="text-on-surface-variant text-lg">Manage and track all community grievances for 'Panchayat'.</p>
          </div>
          <button className="h-16 px-8 flex items-center gap-3 bg-surface-container-highest text-primary rounded-xl font-bold hover:bg-surface-container-high transition-colors active:scale-95">
             <span className="material-symbols-outlined">refresh</span>
             Refresh
          </button>
        </div>

        {/* Segmented Filter */}
        <div className="mt-8 flex p-1.5 bg-surface-container-low rounded-2xl w-fit shadow-inner">
          <button 
            onClick={() => setFilter("Active")}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${filter === "Active" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high"}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter("Resolved")}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${filter === "Resolved" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high"}`}
          >
            Resolved
          </button>
        </div>
      </section>

      {/* Complaint Cards Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredComplaints.map((c, idx) => {
           const timeStr = c.createdAt ? formatDistanceToNow(c.createdAt.toDate(), { addSuffix: true }) : "Unknown time";
           
           let statusColor = "bg-primary-fixed text-on-primary-fixed-variant";
           let secondaryStatusBg = "bg-surface-container-highest text-on-surface-variant";
           if (c.status === "In Progress") {
             statusColor = "bg-tertiary-fixed text-on-tertiary-fixed";
             secondaryStatusBg = "bg-tertiary-fixed-dim text-on-tertiary-fixed-variant";
           } else if (c.status === "Done") {
             statusColor = "bg-secondary-fixed text-on-secondary-fixed";
             secondaryStatusBg = "bg-secondary-container text-on-secondary-container";
           }

           let Icon = "build";
           if (c.category === "Plumbing") Icon = "water_drop";
           if (c.category === "Electrical") Icon = "electric_bolt";
           if (c.category === "Security") Icon = "security";

           return (
            <div key={c.id} className={`bg-surface-container-lowest rounded-[2rem] p-8 flex flex-col justify-between min-h-[16rem] group hover:scale-[1.01] transition-transform border border-outline-variant/10 shadow-sm ${c.status === 'Done' ? 'md:col-span-2 border-secondary/20' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${statusColor}`}>
                  <span className="material-symbols-outlined text-3xl">{Icon}</span>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${secondaryStatusBg}`}>
                   {c.status}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2 line-clamp-1">{c.issue}</h3>
                <p className="text-on-surface-variant text-lg mb-6 line-clamp-2 italic">"{c.text}"</p>
              </div>
              <div className="flex items-center justify-between border-t border-outline-variant/20 pt-6">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span className="text-sm font-medium">{timeStr} by {c.userName || "Resident"}</span>
                </div>
                
                {c.status === 'Done' ? (
                  <div className="flex items-center gap-2 text-secondary font-bold">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Resolved
                  </div>
                ) : (
                  <button className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
                     Details <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredComplaints.length === 0 && (
           <div className="col-span-full text-center py-20 text-on-surface-variant font-medium text-lg border-2 border-dashed border-outline-variant/30 rounded-[2rem]">
             No {filter.toLowerCase()} complaints found.
           </div>
        )}
      </div>
    </div>
  );
}
