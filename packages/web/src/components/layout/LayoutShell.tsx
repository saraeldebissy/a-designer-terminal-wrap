import type { ReactNode } from 'react';

export interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-50">
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-5 pt-20 sm:px-8 lg:px-14">
        <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/70 sm:text-xs">
          <span>Command Canvas</span>
          <span className="rounded-full border border-white/35 px-3 py-1.5 text-[10px] tracking-[0.16em]">Designer Edition</span>
        </div>
        <div className="space-y-5">{children}</div>
      </main>
    </div>
  );
}
