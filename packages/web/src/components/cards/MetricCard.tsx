/**
 * Single metric display card with elevated visual treatment
 */

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accentColor?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

const accentClasses = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  accent: 'bg-accent text-black',
};

export function MetricCard({
  label,
  value,
  subtitle,
  icon,
  accentColor = 'primary',
  className = '',
}: MetricCardProps) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <motion.div
      className={[
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl',
        className,
      ].join(' ')}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${accentClasses[accentColor]}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl">{formattedValue}</p>
          {subtitle && <p className="mt-2 text-sm text-slate-300">{subtitle}</p>}
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
    </motion.div>
  );
}
