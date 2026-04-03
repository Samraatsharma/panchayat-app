"use client";
import React from 'react';

export function AdminHeader() {
  return (
    <header className="bg-[#fcf9f8] dark:bg-slate-950 w-full top-0 sticky z-50">
      <div className="flex items-center justify-between px-6 py-4 w-full max-w-none bg-[#f6f3f2] dark:bg-slate-900 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-transform active:scale-95 lg:hidden">
            <span className="material-symbols-outlined text-[#1A237E] dark:text-indigo-400">menu</span>
          </button>
          <div className="hidden lg:flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container">
             <span className="material-symbols-outlined text-secondary">admin_panel_settings</span>
          </div>
          <h1 className="font-lexend font-bold text-2xl text-[#1A237E] dark:text-indigo-400 tracking-tight">Society Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 mr-8">
            <span className="text-[#000666] font-bold cursor-pointer">Ticket Queue</span>
            <span className="text-[#1A237E] opacity-70 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 rounded px-2 transition-all">Expense Tracker</span>
            <span className="text-[#1A237E] opacity-70 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 rounded px-2 transition-all">Member Directory</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-primary-fixed">
            <img alt="Admin User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp6fGHlvtoJITg_3jlrVNwofkqnTszXQuCeLknvvOsz9cHX2q0aiA1TYhRPlrN7afpmpDD-qqgu1IoCtgu6QR-pog2raVhIiyArLwCyzB7oUWSRY1mHVEpvCNVEZ0L_klUJiwmpEBrrXCmd6KX0H2NbRfxY4KOvqFE0Bzi_dVaT4xvZVYvMRynI9UvIuYip8U9rc4VDB5pJST_DBM87K_Rlg6JumWiG-by_KXtV1Ho4KhbpXQn3AQmJlP0-vWbhMrceVx7_pSGGME"/>
          </div>
        </div>
      </div>
    </header>
  );
}
