import type { ReactNode } from 'react';

export interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`rounded-[2rem] border border-white/15 bg-black/20 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${className}`}>
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.24em] text-white/70">Your Terminal Wrapped</p>
        <h2 className="mt-2 text-3xl font-extrabold leading-[0.95] text-white">{title}</h2>
        {subtitle && <p className="mt-3 text-sm text-white/85">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
