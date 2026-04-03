"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';

export function ResidentHeader() {
  const { user } = useAuth();
  
  return (
    <header className="w-full top-0 sticky z-40 bg-[#fcf9f8] dark:bg-slate-950 flex items-center justify-between px-6 py-4 max-w-none">
      <div className="flex items-center gap-4">
        <button onClick={() => alert("Sidebar menu coming soon!")} className="p-2 transition-transform scale-95 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
          <span className="material-symbols-outlined text-[#1A237E] dark:text-indigo-400 text-3xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>menu</span>
        </button>
        <h1 className="font-lexend font-bold text-2xl text-[#1A237E] dark:text-indigo-400 tracking-tight">Panchayat</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden md:block font-lexend text-[#1A237E] opacity-70">Tower A - 402</span>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container">
          <img alt="Resident Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcNZRSsi8_fYP3EboC_WwU5XQqQL_gSeYKHdHflQvrxs135COwr8ICOavIBUzOYt4F_uElkHy5p65fXlcP-8xsRmrMj0cW0b5JnrnCT8JYGYc8YhpeuCimCBlPxkap9MwtksPwWR0NG5yWOfI_u2kNtwNeRzyT0-5LbDVkSyTo7Dn2Qs7IFXtV5mUP2zVO8veviwWHZNU6QJxdl-aNNBMBoXMTlmWXfXiCfR6bz9JeMzpinAcJ8ZWIc4kxxkzu4YTSHnGgAIlar6M"/>
        </div>
      </div>
    </header>
  );
}
