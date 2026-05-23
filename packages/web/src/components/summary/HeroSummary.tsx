/**
 * Hero section with main summary stats
 */

import { motion } from 'motion/react';
import type { StatsMeta, TopCommand } from '../../api/types';
import { MetricCard } from '../cards/MetricCard';
import { ConfettiBurst } from '../motion/ConfettiBurst';

export interface HeroSummaryProps {
  meta: StatsMeta;
  topCommand: TopCommand | null;
}

export function HeroSummary({ meta, topCommand }: HeroSummaryProps) {
  const dateRangeText = formatDateRange(meta.dateRange.start, meta.dateRange.end);

  return (
    <section id="hero" className="relative min-h-[72vh] py-10 md:py-14">
      <ConfettiBurst count={36} />

      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-emerald-100/15 bg-[#0d1f15] p-7 shadow-glow md:p-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-64 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 max-w-4xl">
          <p className="mb-5 text-[10px] uppercase tracking-[0.32em] text-primary/85">Spotify-like terminal narrative</p>
          <h1 className="text-4xl font-extrabold leading-[0.95] text-white sm:text-6xl md:text-7xl">
            Your Terminal
            <span className="block text-primary">
              Designer Wrapped
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">
            A cinematic view of your command-line behavior, crafted for designers who code.
          </p>
          {dateRangeText && (
            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-slate-300/90">{dateRangeText}</p>
          )}
        </div>

        <motion.div
          className="relative z-10 mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <MetricCard
            label="Total Commands"
            value={meta.totalCommands}
            subtitle="commands executed"
            accentColor="primary"
          />

          <MetricCard
            label="Unique Commands"
            value={meta.distinctCommands}
            subtitle="different commands"
            accentColor="secondary"
          />

          {topCommand && (
            <MetricCard
              label="#1 Command"
              value={topCommand.name}
              subtitle={`used ${topCommand.count.toLocaleString()} times`}
              accentColor="accent"
            />
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

function formatDateRange(start?: string, end?: string): string {
  if (!start && !end) return '';

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate.getFullYear() === endDate.getFullYear()) {
      return startDate.getFullYear().toString();
    }

    return `${formatShortDate(start)} to ${formatShortDate(end)}`;
  }

  if (start) return `Since ${formatShortDate(start)}`;
  if (end) return `Until ${formatShortDate(end)}`;

  return '';
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}
