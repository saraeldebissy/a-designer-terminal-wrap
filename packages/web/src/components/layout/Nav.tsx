/**
 * Sticky navigation with section anchors
 */

import { useState, useEffect } from 'react';

export interface NavItem {
  id: string;
  label: string;
}

export interface NavProps {
  items: NavItem[];
}

export function Nav({ items }: NavProps) {
  const [activeSection, setActiveSection] = useState<string>(items[0]?.id || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '-25% 0px -60% 0px',
        threshold: 0,
      }
    );

    for (const item of items) {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-emerald-100/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Terminal Wrapped</p>
          <p className="text-sm font-semibold text-slate-100">Designer Edition</p>
        </div>

        <div className="scrollbar-none flex max-w-[70%] gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={[
                'rounded-full px-3 py-1.5 text-xs tracking-wide transition-all whitespace-nowrap',
                activeSection === item.id
                  ? 'bg-primary/90 text-black shadow-[0_0_0_1px_rgba(255,255,255,0.18)]'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
