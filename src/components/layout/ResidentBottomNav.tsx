"use client";
import React from 'react';
import Link from 'next/link';

export function ResidentBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 h-24 bg-white dark:bg-slate-900 shadow-[0_-12px_40px_rgba(0,0,0,0.06)] rounded-t-[32px]">
      <Link href="/dashboard" className="flex flex-col items-center justify-center text-[#1A237E] dark:text-indigo-300 font-extrabold hover:opacity-80 transition-opacity">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
        <span className="font-lexend font-medium text-[12px] md:text-[14px]">Home</span>
      </Link>
      <Link href="/history" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:opacity-80 transition-opacity">
        <span className="material-symbols-outlined text-3xl">history</span>
        <span className="font-lexend font-medium text-[12px] md:text-[14px]">History</span>
      </Link>
      
      {/* Voice Orb */}
      <Link href="/dashboard" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:opacity-80 transition-opacity -mt-10 cursor-pointer">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg mb-1 relative before:absolute before:w-full before:h-full before:rounded-full before:bg-primary before:motion-safe:animate-ping before:opacity-20">
          <span className="material-symbols-outlined text-white text-3xl z-10" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
        </div>
        <span className="font-lexend font-medium text-[12px] md:text-[14px]">Voice</span>
      </Link>

      <Link href="/rulebook" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:opacity-80 transition-opacity">
        <span className="material-symbols-outlined text-3xl">menu_book</span>
        <span className="font-lexend font-medium text-[12px] md:text-[14px]">Rules</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:opacity-80 transition-opacity cursor-pointer">
        <span className="material-symbols-outlined text-3xl">person</span>
        <span className="font-lexend font-medium text-[12px] md:text-[14px]">Profile</span>
      </Link>
    </nav>
  );
}
