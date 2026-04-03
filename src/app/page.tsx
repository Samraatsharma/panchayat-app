"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect them seamlessly to the dashboard
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) return null; // Prevent flicker while redirecting

  return (
    <div className="flex flex-col gap-12 pt-12 pb-20 px-2 h-full">
      <header className="text-center mt-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 leading-tight mb-4 tracking-tighter shadow-sm">
          Welcome to Panchayat
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed max-w-sm mx-auto">
          The world's simplest, AI-powered society management platform designed for absolutely everyone.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center shrink-0">
            <Mic className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Voice Complaints</h3>
            <p className="text-slate-400 text-sm mt-1">Just hold the mic and speak in any language. Our AI handles the text.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center shrink-0">
            <Sparkles className="text-purple-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Rulebook AI</h3>
            <p className="text-slate-400 text-sm mt-1">Ask questions and instantly get society rules answered perfectly.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-start gap-4">
          <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck className="text-green-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Elder Friendly</h3>
            <p className="text-slate-400 text-sm mt-1">No complicated menus. Big buttons, high contrast, clear navigation.</p>
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center justify-center mb-6">
        <Link href="/login" className="w-full">
          <Button className="w-full py-6 text-xl rounded-2xl flex gap-3 shadow-blue-500/20 shadow-xl">
            Enter Panchayat <ArrowRight className="w-6 h-6" />
          </Button>
        </Link>
        <p className="text-slate-500 text-xs text-center mt-6 uppercase tracking-widest font-bold">100% Free for Residents</p>
      </div>
    </div>
  );
}
