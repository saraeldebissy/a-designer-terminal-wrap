/**
 * Horizontal bar chart for command categories — ranked list matching TopCommandsBarChart visual language
 */

import { motion } from 'motion/react';
import type { Category } from '../../api/types';

export interface CategoryBarChartProps {
  categories: Category[];
  maxItems?: number;
}

const categoryColors: Record<string, string> = {
  vcs: 'bg-[#1ed760]',
  pkg: 'bg-[#38bdf8]',
  runtime: 'bg-[#a3e635]',
  devops: 'bg-[#f59e0b]',
  remote: 'bg-[#22d3ee]',
  editor: 'bg-[#fb7185]',
  files: 'bg-[#fb923c]',
  shell: 'bg-[#94a3b8]',
};

export function CategoryBarChart({ categories, maxItems = 8 }: CategoryBarChartProps) {
  const displayCategories = categories.slice(0, maxItems);
  const maxCount = Math.max(...displayCategories.map((c) => c.count), 1);

  return (
    <div className="space-y-3">
      {displayCategories.map((category, index) => {
        const widthPercent = (category.count / maxCount) * 100;
        const colorClass = categoryColors[category.slug] || 'bg-[#64748b]';

        return (
          <motion.div
            key={category.slug}
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <div className="relative h-11 overflow-hidden rounded-xl border border-white/10 bg-black/25">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-xl ${colorClass}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${widthPercent}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.2, duration: 0.8, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <span className="z-10 text-sm font-semibold text-white">{category.name}</span>
                <span className="z-10 font-mono text-sm text-slate-300">{category.count.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
