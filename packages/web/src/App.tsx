import { useMemo } from 'react';
import { useStats } from './api/useStats';
import { LayoutShell } from './components/layout/LayoutShell';
import { Nav } from './components/layout/Nav';
import { TopCommandsBarChart } from './components/charts/TopCommandsBarChart';
import { HourlyPatternBarChart } from './components/charts/HourlyPatternBarChart';
import { CategoryBarChart } from './components/charts/CategoryBarChart';
import { SecretsSection } from './components/summary/SecretsSection';

const NAV_ITEMS = [
  { id: 'hero', label: 'Overview' },
  { id: 'command', label: 'Commands' },
  { id: 'persona', label: 'Persona' },
  { id: 'activity', label: 'Rhythm' },
  { id: 'categories', label: 'Stack' },
  { id: 'secrets', label: 'Exposure' },
];

function derivePeriodLabel(dateRange: { start?: string; end?: string }): string {
  if (!dateRange.start || !dateRange.end) return 'this session';
  const start = new Date(dateRange.start);
  const end = new Date(dateRange.end);
  const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days <= 6) return 'this week';
  if (days <= 30) return 'this month';
  if (days >= 330) return 'this year';
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const s = fmt(start);
  const e = fmt(end);
  return s === e ? s : `${s} to ${e}`;
}

const AI_TOOLS = ['claude', 'codex', 'copilot', 'aider', 'gpt', 'chatgpt', 'ollama', 'cursor'];

function App() {
  const { stats, loading, error } = useStats();

  const personality = useMemo(() => {
    if (!stats) return null;
    const total = stats.meta.totalCommands || 1;

    const aiCount = stats.topCommands
      .filter((c) => AI_TOOLS.some((t) => c.name.toLowerCase().includes(t)))
      .reduce((sum, c) => sum + c.count, 0);
    if (aiCount / total > 0.2) {
      return {
        name: 'The AI Native',
        code: 'AINV',
        line: 'Your terminal is a conversation. AI is your first tool, not your last resort.',
      };
    }

    const nightCommands = stats.activityByHour
      .filter((h) => h.hour >= 22 || h.hour <= 4)
      .reduce((acc, h) => acc + h.count, 0);
    if (nightCommands / total > 0.35) {
      return {
        name: 'The Night Crafter',
        code: 'NCTL',
        line: 'You do your best work while the rest of the internet sleeps.',
      };
    }

    if (stats.parameters.topFlags.length > 35) {
      return {
        name: 'The Precision Tuner',
        code: 'PRTN',
        line: 'You shape every command with intentional flags and control.',
      };
    }

    return {
      name: 'The Flow Architect',
      code: 'FLAR',
      line: 'You build momentum fast and keep your terminal in constant motion.',
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <p className="animate-pulse font-mono text-sm uppercase tracking-[0.3em] text-white/40">
          parsing history...
        </p>
      </div>
    );
  }

  if (error || !stats || !personality) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4">
        <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-8 text-center">
          <h1 className="text-3xl font-bold lg:text-5xl">Couldn't load stats</h1>
          <p className="mt-3 text-white/60">{error || 'Run the CLI first to generate stats.'}</p>
        </div>
      </div>
    );
  }

  const top = stats.topCommands[0];
  const period = derivePeriodLabel(stats.meta.dateRange);

  return (
    <>
      <Nav items={NAV_ITEMS} />
      <LayoutShell>

        {/* Hero */}
        <section id="hero" className="story-card border border-black/35 bg-[#d8ef3f] p-6 text-black lg:p-10">
          <div className="story-noise absolute inset-0" />
          <div className="relative z-10 flex flex-col text-center">
            <p className="text-xs uppercase tracking-[0.2em]">Terminal Wrapped</p>
            <h1 className="mt-4 font-extrabold leading-[0.88] tracking-[-0.02em] text-[clamp(2.6rem,8.2vw,7.2rem)]">
              <span className="block">Command</span>
              <span className="block">Canvas</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-xl font-semibold lg:text-3xl">
              {stats.meta.totalCommands.toLocaleString()} commands, {period}. These are the patterns.
            </p>
            <div className="mt-8 inline-flex items-center justify-center">
              <span className="rounded-full border border-black/40 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em]">
                Designer Edition
              </span>
            </div>
          </div>
        </section>

        {/* Signature Command */}
        {top && (
          <section id="command" className="story-card border border-black/35 bg-[#f172cd] p-6 text-black lg:p-10">
            <div className="relative z-10 flex flex-col">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em]">Signature Command</p>
                  <h2 className="mt-2 break-words text-4xl font-extrabold leading-[0.94] sm:text-5xl lg:text-6xl">
                    {top.name}
                  </h2>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-4xl font-extrabold lg:text-5xl">{top.count.toLocaleString()}</p>
                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-black/60">runs</p>
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-lg font-medium text-black/75 lg:text-xl">
                Your most-used command, {period}.
              </p>
              <div className="mt-8 rounded-2xl bg-[#050505] p-4 lg:p-6">
                <TopCommandsBarChart commands={stats.topCommands} maxItems={6} />
              </div>
            </div>
          </section>
        )}

        {/* Persona */}
        <section id="persona" className="story-card border border-black/35 bg-[#1ed760] p-6 text-black lg:p-10">
          <div className="relative z-10 flex items-end justify-between gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.2em]">Your Terminal Archetype</p>
              <h2 className="mt-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl">{personality.name}</h2>
              <p className="mt-4 max-w-2xl text-xl font-semibold lg:text-2xl">{personality.line}</p>
            </div>
            <div className="shrink-0">
              <span className="block rounded-2xl border-2 border-black/20 bg-[#d8ef3f] px-5 py-3 text-2xl font-black tracking-[0.2em] lg:text-3xl">
                {personality.code}
              </span>
            </div>
          </div>
        </section>

        {/* Daily Rhythm */}
        <section id="activity" className="story-card border border-black/35 bg-[#38bdf8] p-6 text-black lg:p-10">
          <div className="relative z-10 flex flex-col">
            <p className="text-xs uppercase tracking-[0.2em] text-black/75">When you work</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-[0.94] sm:text-5xl lg:text-6xl">Daily Rhythm</h2>
            <p className="mt-3 max-w-3xl text-lg text-black/75 lg:text-xl">
              The hours where momentum peaks.
            </p>
            <div className="mt-8 rounded-2xl bg-[#050505] p-4 text-white lg:p-6">
              <HourlyPatternBarChart data={stats.activityByHour} />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="story-card border border-black/35 bg-[#d8ef3f] p-6 text-black lg:p-10">
          <div className="relative z-10 flex flex-col">
            <p className="text-xs uppercase tracking-[0.2em] text-black/75">Command Composition</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-[0.94] sm:text-5xl lg:text-6xl">
              What your terminal is made of
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-black/75 lg:text-xl">
              How your work breaks down by discipline.
            </p>
            <div className="mt-8 rounded-2xl bg-[#050505] p-4 text-white lg:p-6">
              <CategoryBarChart categories={stats.categories} maxItems={8} />
            </div>
          </div>
        </section>

        {/* Exposure */}
        <section id="secrets" className="story-card border border-black/35 bg-[#111111] p-6 text-white lg:p-10">
          <div className="relative z-10 flex flex-col">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Security</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-[0.94] sm:text-5xl lg:text-6xl">Exposure Report</h2>
            <p className="mt-3 max-w-3xl text-lg text-white/60 lg:text-xl">
              Things that should never have been typed in plain text.
            </p>
            <div className="mt-8 flex-1">
              <SecretsSection secrets={stats.secrets} />
            </div>
          </div>
        </section>

      </LayoutShell>
    </>
  );
}

export default App;
