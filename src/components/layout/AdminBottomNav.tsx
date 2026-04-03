"use client";
import React from 'react';
import Link from 'next/link';

export function AdminBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 h-24 bg-white dark:bg-slate-900 shadow-[0_-12px_40px_rgba(0,0,0,0.06)] rounded-t-[32px]">
      <Link href="/admin" className="flex flex-col items-center justify-center text-[#1A237E] dark:text-indigo-300 font-extrabold transition-opacity">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
        <span className="font-lexend font-medium text-[12px] md:text-[14px]">Home</span>
      </Link>
      <Link href="/history" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:opacity-80 transition-opacity">
        <span className="material-symbols-outlined">history</span>
        <span className="font-lexend font-medium text-[12px] md:text-[14px]">History</span>
      </Link>
      
      {/* Voice Center Action */}
      <div className="flex flex-col items-center justify-center -mt-12 bg-primary w-16 h-16 rounded-full text-white shadow-xl active:scale-90 duration-150 cursor-pointer">
        <span className="material-symbols-outlined text-3xl">mic</span>
      </div>

      <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:opacity-80 transition-opacity cursor-pointer">
        <span className="material-symbols-outlined">menu_book</span>
        <span className="font-lexend font-medium text-[12px] md:text-[14px]">Rules</span>
      </div>
      <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:opacity-80 transition-opacity cursor-pointer">
        <span className="material-symbols-outlined">person</span>
        <span className="font-lexend font-medium text-[12px] md:text-[14px]">Profile</span>
      </div>
    </nav>
  );
}
