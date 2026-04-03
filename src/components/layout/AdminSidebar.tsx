"use client";
import React from 'react';
import Link from 'next/link';

export function AdminSidebar() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-[72px] h-[calc(100vh-72px)] z-[60] flex-col bg-[#ffffff] dark:bg-slate-900 rounded-r-2xl w-80 shadow-2xl dark:shadow-none transition-all duration-300 py-6">
      <div className="px-6 mb-8 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-secondary">admin_panel_settings</span>
        </div>
        <div>
          <p className="font-lexend text-lg font-bold text-[#1A237E]">Society Manager</p>
          <p className="text-sm text-on-surface-variant">Tower A - Admin</p>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        <Link className="bg-[#1A237E] text-white rounded-xl mx-4 px-4 py-3 font-bold flex items-center gap-4 transition-all" href="/admin">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>confirmation_number</span>
          <span>Ticket Queue</span>
        </Link>
        <Link className="text-slate-700 dark:text-slate-300 mx-4 px-4 py-3 flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all" href="/history">
          <span className="material-symbols-outlined">history</span>
          <span>Complaint History</span>
        </Link>
        <Link className="text-slate-700 dark:text-slate-300 mx-4 px-4 py-3 flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all" href="#">
          <span className="material-symbols-outlined">payments</span>
          <span>Expense Tracker</span>
        </Link>
        <Link className="text-slate-700 dark:text-slate-300 mx-4 px-4 py-3 flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all" href="#">
          <span className="material-symbols-outlined">group</span>
          <span>Member Directory</span>
        </Link>
        <Link className="text-slate-700 dark:text-slate-300 mx-4 px-4 py-3 flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span>Society Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
