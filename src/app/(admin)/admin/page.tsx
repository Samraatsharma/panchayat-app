"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { summarizeComplaints } from "@/lib/ai";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboardPage() {
  const { role, loading: authLoading } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [dramaSummary, setDramaSummary] = useState<any>(null);
  const [dramaLoading, setDramaLoading] = useState(false);

  useEffect(() => {
    if (role !== "admin") return;

    const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComplaints(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [role]);

  const runDramaFilter = async () => {
    setDramaLoading(true);
    const texts = complaints.map(c => c.text);
    try {
      const summary = await summarizeComplaints(texts);
      setDramaSummary(summary);
    } catch (e) {
      console.error(e);
    }
    setDramaLoading(false);
  };

  const updateStatus = async (id: string, currentStatus: string) => {
    const statuses = ["Pending", "In Progress", "Done"];
    const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
    await updateDoc(doc(db, "complaints", id), { status: nextStatus });
  };

  if (authLoading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  if (role !== "admin") {
    return <div className="text-center pt-20 text-error font-bold text-2xl">Access Denied. Admins Only.</div>;
  }

  if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  const pendingCount = complaints.filter(c => c.status === "Pending").length;
  const resolvedCount = complaints.filter(c => c.status === "Done").length;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col justify-between min-h-[160px] transition-all hover:bg-surface-container-low border border-outline-variant/10 shadow-sm">
          <span className="text-on-surface-variant font-medium label-lg uppercase tracking-widest text-xs">Total Complaints</span>
          <div className="flex items-end justify-between mt-6">
            <h2 className="text-5xl font-black text-primary">{complaints.length}</h2>
            <span className="material-symbols-outlined text-primary-fixed-variant scale-150">analytics</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col justify-between min-h-[160px] border border-outline-variant/10 shadow-sm">
          <span className="text-tertiary font-medium label-lg uppercase tracking-widest text-xs">Pending</span>
          <div className="flex items-end justify-between mt-6">
            <h2 className="text-5xl font-black text-tertiary">{pendingCount}</h2>
            <span className="material-symbols-outlined text-tertiary-fixed-dim scale-150 relative">
               pending_actions
               {pendingCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-ping"></span>}
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col justify-between min-h-[160px] border border-outline-variant/10 shadow-sm">
          <span className="text-secondary font-medium label-lg uppercase tracking-widest text-xs">Resolved</span>
          <div className="flex items-end justify-between mt-6">
            <h2 className="text-5xl font-black text-secondary">{resolvedCount}</h2>
            <span className="material-symbols-outlined text-secondary-fixed-dim scale-150">check_circle</span>
          </div>
        </div>
      </div>

      {/* AI Action Section */}
      <div className="bg-gradient-to-r from-primary to-primary-container p-8 rounded-[2.5rem] mb-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">Panchayat AI Assistant</h3>
          <p className="text-primary-fixed-dim text-lg opacity-90">There's a lot of chatter in the common areas. Use AI to cut through the noise and get the essence of ongoing issues.</p>
          
          {dramaSummary && (
             <div className="mt-6 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
               <h4 className="font-bold text-tertiary-fixed mb-2 flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">priority_high</span> Key Issues
               </h4>
               <ul className="list-disc pl-5 mb-4 space-y-1">
                 {dramaSummary.topIssues?.map((i: string, idx: number) => <li key={idx} className="text-sm">{i}</li>)}
               </ul>
  
               <h4 className="font-bold text-secondary-container mb-2 flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">lightbulb</span> Suggested Actions
               </h4>
               <ul className="list-disc pl-5 space-y-1">
                  {dramaSummary.suggestedActions?.map((a: string, idx: number) => <li key={idx} className="text-sm">{a}</li>)}
               </ul>
             </div>
          )}
        </div>
        <button 
          onClick={runDramaFilter}
          disabled={dramaLoading || complaints.length === 0}
          className="bg-surface-bright text-primary px-8 h-16 rounded-xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-lg whitespace-nowrap active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {dramaLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>}
          {dramaLoading ? "Analyzing..." : "Summarize Drama"}
        </button>
      </div>

      {/* Complaint Queue */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-3xl font-black text-on-surface">Ticket Queue</h2>
          <div className="flex gap-2">
            <button className="p-4 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {complaints.filter(c => c.status !== "Done").map(c => {
             const timeAgo = c.createdAt ? formatDistanceToNow(c.createdAt.toDate(), { addSuffix: true }) : "just now";
             const isUrgent = c.priority === "High";
             
             let Icon = "build";
             let iconColor = "text-primary";
             let iconBg = "bg-primary-fixed";
             
             if (c.category === "Plumbing") { Icon = "water_drop"; iconColor = "text-tertiary"; iconBg = "bg-tertiary-fixed"; }
             if (c.category === "Electrical") { Icon = "electric_bolt"; iconColor = "text-secondary"; iconBg = "bg-secondary-fixed"; }
             
             return (
              <div key={c.id} className="bg-surface-container-lowest p-6 rounded-[2rem] flex flex-col md:flex-row gap-6 items-start transition-all hover:bg-white hover:shadow-md border border-outline-variant/10">
                <div className={`h-20 w-20 rounded-[1.5rem] ${iconBg} flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined ${iconColor} text-4xl`}>{Icon}</span>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-sm font-bold tracking-tight">#{c.id.substring(0,4).toUpperCase()}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${isUrgent ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                      {c.priority || "Medium"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold border border-outline-variant text-on-surface-variant">
                      {c.status}
                    </span>
                    <span className="text-on-surface-variant text-sm ml-auto mr-2">{timeAgo}</span>
                  </div>
                  <h4 className="text-xl font-bold mb-1">{c.issue}</h4>
                  <p className="text-on-surface-variant mb-6 text-lg">Reported by {c.userName}. <span className="italic">"{c.text}"</span></p>
                  
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-primary text-white h-12 px-6 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                       <span className="material-symbols-outlined text-sm">smart_toy</span>
                       AI Details
                    </button>
                    <button 
                      onClick={() => updateStatus(c.id, c.status)}
                      className="border-2 border-outline-variant h-12 px-6 rounded-xl font-bold text-on-surface hover:bg-surface-container transition-colors active:scale-95"
                    >
                       Mark {c.status === "Pending" ? "In Progress" : "Done"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {complaints.filter(c => c.status !== "Done").length === 0 && (
             <div className="text-center py-10 text-on-surface-variant">
               No active tickets found. Good job!
             </div>
          )}
        </div>
      </div>

      {/* Expense Tracker Overview */}
      <div className="bg-surface-container-low p-8 rounded-[2.5rem]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-on-surface">Expense Tracker</h2>
          <button className="text-primary font-bold flex items-center gap-1 hover:underline">
             View Details <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-center gap-6 shadow-sm border border-outline-variant/10">
            <div className="p-4 bg-primary-fixed rounded-xl text-primary">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">Monthly Collection</p>
              <p className="text-2xl font-black text-on-surface">₹4,25,000</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-center gap-6 shadow-sm border border-outline-variant/10">
            <div className="p-4 bg-tertiary-fixed rounded-xl text-on-tertiary-fixed">
              <span className="material-symbols-outlined text-3xl">shopping_cart</span>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">Active Maintenance</p>
              <p className="text-2xl font-black text-on-surface">₹1,12,450</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
