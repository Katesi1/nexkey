"use client";

import Image from "next/image";

export function FloatingButtons() {
  return (
    <div className="fixed right-4 bottom-20 z-40 flex flex-col items-end gap-3">
      {/* Zalo */}
      <a
        href="https://zalo.me/0917379181"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2"
        aria-label="Chat Zalo"
      >
        <span className="absolute right-14 whitespace-nowrap bg-slate-900 dark:bg-[#0a1428] text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 dark:border-white/10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat Zalo
        </span>
        <div className="w-12 h-12 rounded-full bg-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all flex items-center justify-center overflow-hidden">
          <Image src="/icons/zalo.svg" alt="Zalo" width={42} height={42} />
        </div>
      </a>

      {/* Facebook Messenger */}
      <a
        href="https://www.facebook.com/nguyen.vu.nam.2001"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2"
        aria-label="Facebook Messenger"
      >
        <span className="absolute right-14 whitespace-nowrap bg-slate-900 dark:bg-[#0a1428] text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 dark:border-white/10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Messenger
        </span>
        <div className="w-12 h-12 rounded-full bg-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all flex items-center justify-center overflow-hidden p-2">
          <Image src="/icons/messenger.svg" alt="Messenger" width={32} height={32} />
        </div>
      </a>
    </div>
  );
}
