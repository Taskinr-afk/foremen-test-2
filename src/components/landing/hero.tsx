'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, type KeyboardEvent } from 'react';
import { CALL_HREF, Chip, Contours, Dimension, EASE, Glyph, Pill } from './parts';

const BOOT = ['facility_04 connected', 'part_1904 rules loaded', 'awaiting incident report'];

function BootLines() {
  return (
    <div className="lp-mono text-xs sm:text-sm text-[var(--lp-ink-3)] mb-8 space-y-1" aria-hidden="true">
      {BOOT.map((line, i) => (
        <motion.p
          key={line}
          className={`m-0 ${i === BOOT.length - 1 ? 'lp-cursor text-[var(--lp-ink-2)]' : ''}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.35, duration: 0.3 }}
        >
          &gt; {line}
        </motion.p>
      ))}
    </div>
  );
}

// Sample cases across industries. Each call and citation follows 29 CFR 1904.
const CASES = [
  {
    tab: 'Plant',
    no: '#0147',
    title: 'Laceration, left hand',
    meta: 'Facility 04 · Assembly line · Reported Oct 14',
    facts: [['Treatment', '3 sutures at an urgent-care clinic'], ['Days away', '0'], ['Restriction', 'None']],
    recordable: true,
    reason: 'Sutures are medical treatment beyond first aid.',
    cite: '29 CFR 1904.7(b)(5)',
  },
  {
    tab: 'Hospital',
    no: '#0152',
    title: 'Needlestick, right thumb',
    meta: 'Med-surg unit · Night shift · Reported Oct 14',
    facts: [['Source', 'Used needle, patient blood'], ['Days away', '0'], ['Log entry', 'Privacy case: name withheld']],
    recordable: true,
    reason: 'A needlestick contaminated with another person’s blood is recordable, and it’s a privacy case.',
    cite: '29 CFR 1904.8(a), 1904.29(b)(7)',
  },
  {
    tab: 'Utility',
    no: '#0158',
    title: 'Minor burn, left forearm',
    meta: 'Substation 12 · Line crew · Reported Oct 14',
    facts: [['Treatment', 'Cooled, OTC burn cream, bandage'], ['Days away', '0'], ['Restriction', 'None']],
    recordable: false,
    reason: 'Non-prescription cream and a bandage are first aid only. Keep the incident report.',
    cite: '29 CFR 1904.7(b)(5)(ii)',
  },
  {
    tab: 'Warehouse',
    no: '#0161',
    title: 'Lower-back strain',
    meta: 'Distribution center · Receiving · Reported Oct 14',
    facts: [['Treatment', 'Physician exam'], ['Days away', '0'], ['Restriction', 'No lifting over 20 lb, 3 days']],
    recordable: true,
    reason: 'A physician-ordered work restriction makes the case recordable.',
    cite: '29 CFR 1904.7(b)(4)',
  },
] as const;

/** Sample case files with one tab per industry. Illustrative only. */
function CaseFile() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const c = CASES[active];
  const days = 7;
  const used = 2;

  // Arrow keys move between tabs, per the WAI-ARIA tabs pattern
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    const next = (active + step + CASES.length) % CASES.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <motion.figure
      aria-label="Sample case files by industry"
      className="relative m-0 bg-[var(--lp-panel)]/95 border border-[var(--lp-line)] shadow-[0_24px_60px_-30px_rgb(0_0_0/0.35)]"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
    >
      <div role="tablist" aria-label="Industry" onKeyDown={onKeyDown} className="grid grid-cols-4 border-b border-[var(--lp-line)]">
        {CASES.map((k, i) => (
          <button
            key={k.tab}
            ref={(el) => { tabs.current[i] = el; }}
            id={`case-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="case-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`lp-mono text-[10px] sm:text-[11px] tracking-normal sm:tracking-[0.12em] uppercase py-3 border-none cursor-pointer transition-colors ${i === active ? 'bg-[var(--lp-dark)] text-white' : 'bg-transparent text-[var(--lp-ink-2)] hover:bg-[var(--lp-panel-2)]'}`}
          >
            {k.tab}
          </button>
        ))}
      </div>

      <motion.div
        key={c.no}
        id="case-panel"
        role="tabpanel"
        aria-labelledby={`case-tab-${active}`}
        className="lp-blueprint p-6 sm:p-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="lp-mono flex items-center justify-between text-[11px] tracking-[0.2em] text-[var(--lp-ink-3)] mb-5">
          <span>[ CASE FILE ]</span>
          <span>SAMPLE · {c.no}</span>
        </div>

        <p className="lp-display text-2xl font-bold tracking-tight m-0">{c.title}</p>
        <p className="text-sm text-[var(--lp-ink-3)] mt-1 mb-5">{c.meta}</p>

        <div className="space-y-1.5 mb-5">
          {c.facts.map(([label, value]) => <Chip key={label} label={label}>{value}</Chip>)}
        </div>

        <div className="bg-[var(--lp-dark)] text-white p-4 mb-5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="lp-mono text-[10px] tracking-[0.2em] text-white/65">ENGINE RECOMMENDATION</span>
            <span
              className="lp-display text-xs font-bold tracking-wider px-2 py-1"
              style={c.recordable ? { background: 'var(--lp-yellow)', color: 'var(--lp-ink)' } : { background: 'transparent', color: '#fff', boxShadow: 'inset 0 0 0 1px rgb(255 255 255 / 0.6)' }}
            >
              {c.recordable ? 'RECORDABLE' : 'NOT RECORDABLE'}
            </span>
          </div>
          <p className="text-sm text-white/85 m-0 leading-snug">{c.reason}</p>
          <p className="lp-mono text-[11px] text-white/60 m-0 mt-1">{c.cite}</p>
        </div>

        {c.recordable ? (
          <>
            <div className="flex items-end justify-between mb-2">
              <span className="lp-mono text-[10px] tracking-[0.2em] text-[var(--lp-ink-3)]">RECORD BY OCT 21</span>
              <span className="lp-display font-bold">
                <span className="text-3xl">{String(days - used).padStart(2, '0')}</span>
                <span className="text-sm text-[var(--lp-ink-3)]">/{days} DAYS LEFT</span>
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-3" aria-hidden="true">
              {Array.from({ length: days }).map((_, i) => (
                <span key={i} className="h-2" style={{ background: i < used ? 'var(--lp-ink)' : 'var(--lp-panel-2)' }} />
              ))}
            </div>
            <Dimension className="mb-6">Oct 14 → Oct 21 · 7 calendar days</Dimension>
          </>
        ) : (
          <div className="mb-6 border border-dashed border-[var(--lp-ink-3)] px-4 py-3 lp-mono text-[11px] tracking-[0.15em] text-[var(--lp-ink-2)]">
            NO 300 LOG ENTRY · CLOSE AFTER SIGN-OFF
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[var(--lp-line)] pt-4">
          <span className="lp-mono text-[11px] tracking-[0.15em] text-[var(--lp-ink-2)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--lp-orange)]" aria-hidden="true" />
            AWAITING SIGN-OFF
          </span>
          <span className="lp-mono text-[11px] text-[var(--lp-ink-3)]">SAFETY MGR</span>
        </div>
      </motion.div>
    </motion.figure>
  );
}

export function Hero({ onDemo }: { onDemo: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bandX = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-12%']);

  return (
    <section id="top" ref={ref} className="lp-grid relative pt-16 overflow-hidden">
      <Contours className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 lg:px-10 pt-14 lg:pt-20 pb-16 lg:pb-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-start">
        <div>
          <p className="lp-mono flex items-center gap-2 text-[11px] tracking-[0.25em] text-[var(--lp-ink-2)] mb-6">
            <Glyph />
            {'// FOREMAN: AI SAFETY RECORDKEEPING'}
          </p>
          <BootLines />

          <motion.h1
            className="lp-display text-5xl sm:text-7xl xl:text-[88px] font-bold leading-[0.95] tracking-tighter m-0 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Your OSHA
            <br />
            <span className="inline-block bg-[var(--lp-yellow)] px-3 -mx-1 my-1">compliance</span>
            <br />
            engine.
          </motion.h1>

          <p className="text-lg text-[var(--lp-ink-2)] max-w-xl leading-relaxed mb-10">
            AI reads every incident report and recommends whether it&apos;s recordable, with the
            regulation it relied on. Your safety manager makes the call. The 300 Log fills itself.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Pill href={CALL_HREF}>Book a 15-min Call</Pill>
            <Pill variant="dark" onClick={onDemo}>Try the Demo</Pill>
          </div>
          <p className="text-sm text-[var(--lp-ink-3)] mt-6">
            Early access. We&apos;re talking with safety managers now, and we&apos;re not selling anything yet.
          </p>
        </div>

        <CaseFile />
      </div>

      {/* Yellow band with the hatched wordmark, in flow so it never covers the content */}
      <div className="relative h-[clamp(120px,16vw,240px)] mt-4" aria-hidden="true">
        <div className="absolute inset-x-0 top-[22%] bottom-0 bg-[var(--lp-yellow)] -skew-y-2 origin-left">
          <div className="absolute inset-0 lp-diag opacity-60" />
        </div>
        <motion.div className="absolute inset-x-0 bottom-[-0.14em] whitespace-nowrap select-none pl-4 lg:pl-10" style={{ x: bandX }}>
          <span className="lp-display lp-hatch font-bold leading-none tracking-tighter text-[clamp(110px,19vw,300px)]">FOREMAN</span>
        </motion.div>
      </div>
    </section>
  );
}
