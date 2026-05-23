/**
 * Horizontal bar chart for top commands
 */

import { motion } from 'motion/react';
import type { TopCommand } from '../../api/types';

export interface TopCommandsBarChartProps {
  commands: TopCommand[];
  maxItems?: number;
}

export function TopCommandsBarChart({
  commands,
  maxItems = 10,
}: TopCommandsBarChartProps) {
  const displayCommands = commands.slice(0, maxItems);

  return (
    <div className="space-y-3">
      {displayCommands.map((cmd, index) => (
        <motion.div
          key={cmd.name}
          className="relative"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
        >
          <div className="relative h-12 overflow-hidden rounded-xl border border-white/10 bg-black/25">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-xl bg-[#1ed760]"
              initial={{ width: 0 }}
              whileInView={{ width: `${cmd.percentile * 100}%` }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 + 0.2, duration: 0.8, ease: 'easeOut' }}
            />

            <div className="absolute inset-0 flex items-center justify-between px-4">
              <span className="z-10 truncate pr-2 font-mono text-base font-semibold text-white">
                {cmd.name}
              </span>
              <span className="z-10 text-base text-slate-100">
                {cmd.count.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
