"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Ticket as TicketIcon } from "lucide-react";
import { format } from "date-fns";

type Ticket = {
  id: string;
  category: string;
  issue: string;
  priority: string;
  status: string;
  createdAt: any;
};

export default function TicketsPage() {
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, "complaints"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
      setTickets(docs);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (authLoading || loading) {
    return <div className="flex justify-center h-full pt-20"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="pt-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Your Tickets</h1>
        <TicketIcon className="w-8 h-8 text-blue-500 opacity-50" />
      </header>

      {tickets.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
           <p>No complaints yet.</p>
           <p className="text-sm mt-2">Go Home to record one if needed.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-blue-400">{ticket.category}</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  ticket.status === 'Done' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  ticket.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-white text-lg font-medium leading-snug mb-4">{ticket.issue}</p>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className={`px-2 py-0.5 rounded ${
                  ticket.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-slate-800'
                }`}>{ticket.priority} Priority</span>
                <span>{ticket.createdAt ? format(ticket.createdAt.toDate(), "dd MMM, hh:mm a") : "Just now"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
