'use client';

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, type ReactNode } from 'react';
import { CALL_HREF, Chip, Contours, CornerMarks, Dimension, EASE, Glyph, SectionLabel } from './parts';

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: EASE },
};

function Heading({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <h2 className={`lp-display text-4xl lg:text-6xl min-[2400px]:text-7xl font-bold tracking-tighter leading-[0.98] mt-6 mb-0 ${dark ? 'text-white' : ''}`}>
      {children}
    </h2>
  );
}

/* ---------- 01 Problem ---------- */

const problems = [
  { title: 'The judgment call', desc: 'First aid or medical treatment? A prescription-strength dose or a few stitches makes a case recordable. A bandage doesn’t. Every case is a call someone has to defend.' },
  { title: 'The 7-day clock', desc: 'Recordable cases go on the 300 Log within 7 calendar days, often while you’re still waiting on clinic notes.' },
  { title: 'One incident, four systems', desc: 'Incident form, workers’ comp claim, OSHA log, and whatever safety system your company or customers require. The same facts, retyped.' },
  { title: 'The number everyone sees', desc: 'Your injury rate shows up in customer audits, contract bids and insurance renewals. One misclassified case moves it.' },
];

export function Problem() {
  return (
    <section id="problem" className="relative scroll-mt-16 py-24 lg:py-32">
      <div className="max-w-[1240px] min-[1800px]:max-w-[1440px] min-[2400px]:max-w-[1680px] mx-auto px-4 lg:px-10">
        <motion.div {...reveal} className="mb-14">
          <SectionLabel index="01">The Problem</SectionLabel>
          <Heading>
            Recordkeeping runs on
            <br />
            <span className="text-[var(--lp-ink-3)]">judgment and deadlines.</span>
          </Heading>
        </motion.div>

        <ol className="list-none m-0 p-0 grid md:grid-cols-2 border-t border-[var(--lp-ink)]">
          {problems.map((p, i) => (
            <motion.li
              key={p.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
              className="relative flex gap-6 py-8 md:px-6 border-b border-[var(--lp-line)] md:odd:border-r md:odd:pl-0"
            >
              <span className="lp-display lp-outline text-6xl font-bold leading-none text-[var(--lp-ink)] shrink-0 w-16">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="lp-display text-lg font-bold m-0 mb-2">[ {p.title} ]</h3>
                <p className="text-[var(--lp-ink-2)] leading-relaxed m-0">{p.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 02 Modules: file strips that open on hover or focus ---------- */

const ICONS: Record<string, ReactNode> = {
  extract: <><rect x="10" y="8" width="28" height="32" /><path d="M16 16h16M16 22h12M16 28h14" /><path d="M30 34l3 3 6-7" /></>,
  rules: <><path d="M24 6l15 7v9c0 10-6 17-15 20C15 39 9 32 9 22v-9z" /><path d="M17 23l5 5 9-10" /></>,
  queue: <><rect x="8" y="8" width="32" height="32" /><path d="M8 17h32M18 17v23" /><circle cx="33" cy="12.5" r="2" /></>,
  log: <><path d="M10 40V12l7-5h21v33z" /><path d="M17 7v8h-7" /><path d="M17 22h15M17 28h11M17 34h13" /></>,
  rate: <><circle cx="24" cy="24" r="15" /><path d="M24 13v11l8 6" /><path d="M24 6v3M42 24h-3M24 42v-3M6 24h3" /></>,
  audit: <><path d="M14 10h26M14 19h26M14 28h20M14 37h14" /><path d="M7 10h1M7 19h1M7 28h1M7 37h1" strokeWidth="3" /></>,
};

const modules = [
  { key: 'extract', title: 'AI Extraction', desc: 'Drop in a supervisor note. The engine pulls every fact, cites the source text, and flags anything uncertain.' },
  { key: 'rules', title: 'Rules Engine', desc: 'Part 1904 encoded. Recordable, not recordable, or needs more info, with the regulation behind every call.' },
  { key: 'queue', title: 'Sign-off Queue', desc: 'Your safety manager accepts, overrides with a reason, or sends back for detail. Nothing hits the log without approval.' },
  { key: 'log', title: 'Live 300 Log', desc: 'Every signed-off recordable lands on the OSHA 300. CSV export ready. Privacy cases handled.' },
  { key: 'rate', title: 'Rate Tracking', desc: 'Injury rate and missed-work rate calculated live and checked against your targets.' },
  { key: 'audit', title: 'Audit Trail', desc: 'Every action logged, every override recorded with a reason. Five-year retention built in.' },
];

function ModuleIcon({ k, className = '' }: { k: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" aria-hidden="true">
      {ICONS[k]}
    </svg>
  );
}

const PARTICLES = [12, 28, 41, 55, 67, 80, 90];

function ModuleStrip({ m, i }: { m: (typeof modules)[number]; i: number }) {
  const num = String(i + 1).padStart(2, '0');
  return (
    <motion.li
      {...reveal}
      transition={{ ...reveal.transition, delay: i * 0.06 }}
      tabIndex={0}
      aria-label={`${m.title}: ${m.desc}`}
      className="group relative bg-[var(--lp-panel)] border border-[var(--lp-line)] overflow-hidden lg:h-[440px]"
    >
      {/* Resting state */}
      <div className="relative h-full flex flex-col p-6 lg:items-center lg:text-center">
        <span className="lp-mono text-[10px] tracking-[0.2em] text-[var(--lp-ink-3)] lg:self-start">FILE.{num}</span>
        <div className="mt-4 mb-5 lg:my-auto flex flex-col lg:items-center gap-4">
          <span className="lp-display lp-outline text-[72px] font-bold leading-[0.8] text-[var(--lp-ink)] opacity-30 select-none" aria-hidden="true">
            {num}
          </span>
          <span className="relative block w-20 h-20 lp-grid border border-dashed border-[var(--lp-ink-3)]/50 p-3 text-[var(--lp-ink-2)]">
            <CornerMarks />
            <ModuleIcon k={m.key} className="w-full h-full" />
          </span>
        </div>
        <h3 className="lp-display text-base font-bold m-0 lg:mb-2">{m.title}</h3>
        <p className="lg:hidden text-sm text-[var(--lp-ink-2)] leading-relaxed mt-2 mb-0">{m.desc}</p>
      </div>

      {/* Active state: crossfades in on hover or keyboard focus (desktop) */}
      <div className="hidden lg:flex absolute inset-0 flex-col items-center text-center p-6 bg-[var(--lp-dark)] text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
        <div className="lp-halftone absolute inset-0" aria-hidden="true" />
        {PARTICLES.map((left, j) => (
          <span key={left} className="lp-particle" style={{ left: `${left}%`, width: j % 3 ? 3 : 5, height: j % 3 ? 3 : 5, animationDelay: `${j * 0.33}s` }} aria-hidden="true" />
        ))}
        <span className="relative lp-mono text-[10px] tracking-[0.2em] text-white/60 self-start">FILE.{num}</span>
        <span className="relative lp-display lp-outline text-[80px] font-bold leading-none mt-4 [--lp-stroke:rgb(255_255_255/0.55)]" aria-hidden="true">{num}</span>
        <ModuleIcon k={m.key} className="relative w-16 h-16 my-4 text-white" />
        <p className="relative lp-display text-base font-bold m-0 mb-2" aria-hidden="true">{m.title}</p>
        <p className="relative text-sm text-white/80 leading-relaxed m-0">{m.desc}</p>
        <svg className="relative mt-auto" viewBox="0 0 24 30" width="18" height="22" aria-hidden="true">
          <path d="M3 18l9-8 9 8M3 28l9-8 9 8" fill="none" stroke="var(--lp-yellow)" strokeWidth="2.5" />
        </svg>
      </div>
    </motion.li>
  );
}

export function Modules() {
  return (
    <section id="modules" className="relative scroll-mt-16 py-24 lg:py-32 border-t border-[var(--lp-line)] lp-diag">
      <div className="max-w-[1240px] min-[1800px]:max-w-[1440px] min-[2400px]:max-w-[1680px] mx-auto px-4 lg:px-10">
        <motion.div {...reveal} className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <SectionLabel index="02">Modules</SectionLabel>
            <Heading>
              The engine recommends.
              <br />
              <span className="text-[var(--lp-ink-3)]">The manager decides.</span>
            </Heading>
          </div>
          <p className="lp-mono hidden lg:block text-xs tracking-widest text-[var(--lp-ink-3)] m-0">HOVER A FILE TO OPEN IT</p>
        </motion.div>
        <ul className="list-none m-0 p-0 grid sm:grid-cols-2 lg:grid-cols-6 gap-2">
          {modules.map((m, i) => <ModuleStrip key={m.key} m={m} i={i} />)}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 03 Flow: progression track after the skill-tree screen ---------- */

const steps = [
  { who: 'Supervisor', text: 'Reports the incident where it happened' },
  { who: 'AI', text: 'Extracts the facts and cites its sources' },
  { who: 'Engine', text: 'Recommends a call under Part 1904' },
  { who: 'Safety manager', text: 'Reviews and signs off' },
  { who: '300 Log', text: 'The case is recorded' },
];

export function Flow() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.75'] });
  const fill = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);
  const [step, setStep] = useState(reduce ? steps.length : 1);
  useMotionValueEvent(fill, 'change', (v) => {
    if (!reduce) setStep(Math.max(1, Math.min(steps.length, Math.floor(v * (steps.length - 1)) + 1)));
  });
  const lit = reduce ? steps.length : step;

  return (
    <section id="flow" ref={ref} className="relative scroll-mt-16 py-24 lg:py-32 overflow-hidden bg-[var(--lp-panel-2)]">
      <div className="hidden lg:block absolute -left-24 top-0 bottom-0 w-[34%] -skew-x-[14deg] bg-[var(--lp-yellow)]" aria-hidden="true" />
      <div className="relative max-w-[1240px] min-[1800px]:max-w-[1440px] min-[2400px]:max-w-[1680px] mx-auto px-4 lg:px-10 grid lg:grid-cols-[300px_1fr] gap-12 lg:gap-16">
        <motion.div {...reveal}>
          <SectionLabel index="03">Flow</SectionLabel>
          <Heading>From report to log.</Heading>
          <div className="mt-10 flex items-end gap-2" aria-hidden="true">
            <span className="lp-mono text-xs tracking-widest mb-3">STAGE</span>
            <span className="lp-display text-7xl font-bold leading-none tabular-nums">{String(lit).padStart(2, '0')}</span>
            <span className="lp-display text-2xl font-bold text-[var(--lp-ink-2)] mb-1">/{String(steps.length).padStart(2, '0')}</span>
          </div>
          <div className="mt-3 h-2 w-56 bg-[var(--lp-ink)]/15" aria-hidden="true">
            <motion.div className="h-full bg-[var(--lp-ink)] origin-left" style={{ scaleX: reduce ? 1 : fill }} />
          </div>
        </motion.div>

        <div className="self-center">
          <Dimension className="mb-4">Report → Log · {steps.length} stages</Dimension>
          <div className="relative">
            <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-[var(--lp-line)]" aria-hidden="true">
              <motion.div className="w-full h-full bg-[var(--lp-ink)] origin-top" style={{ scaleY: reduce ? 1 : fill }} />
            </div>
            <ol className="list-none m-0 p-0 relative">
              {steps.map((s, i) => {
                const on = i < lit;
                return (
                  <li key={s.who} className="relative flex items-center gap-6 py-4">
                    <span
                      className={`relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center lp-display text-sm font-bold transition-colors duration-300 ${on ? 'bg-[var(--lp-ink)] text-[var(--lp-yellow)]' : 'bg-[var(--lp-panel)] text-[var(--lp-ink-3)] border border-[var(--lp-line)]'}`}
                      style={{ boxShadow: on ? '0 0 0 4px var(--lp-panel-2), 0 0 0 5px var(--lp-ink)' : undefined }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className={`flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 border-b pb-4 transition-colors duration-300 ${on ? 'border-[var(--lp-ink)]/40' : 'border-[var(--lp-line)]'}`}>
                      <span className="lp-mono text-xs tracking-[0.2em] uppercase w-40 shrink-0 text-[var(--lp-ink-2)]">{s.who}</span>
                      <span className={`lp-display text-xl font-bold transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-50'}`}>{s.text}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 04 Clocks ---------- */

const clocks = [
  { value: 7, unit: 'DAYS', label: 'To record a case', cite: '1904.29', segs: 7 },
  { value: 8, unit: 'HRS', label: 'To report a fatality', cite: '1904.39', segs: 8 },
  { value: 24, unit: 'HRS', label: 'Hospitalization, amputation, eye loss', cite: '1904.39', segs: 12 },
  { value: 5, unit: 'YRS', label: 'To keep every record', cite: '1904.33', segs: 5 },
];

export function Clocks() {
  return (
    <section id="clocks" className="lp-on-dark relative scroll-mt-16 py-24 lg:py-28 bg-[var(--lp-dark)] text-white overflow-hidden">
      <div className="lp-halftone absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative max-w-[1240px] min-[1800px]:max-w-[1440px] min-[2400px]:max-w-[1680px] mx-auto px-4 lg:px-10">
        <motion.div {...reveal} className="mb-12">
          <SectionLabel index="04" dark>Clocks</SectionLabel>
          <Heading dark>The deadlines Foreman watches.</Heading>
        </motion.div>
        <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {clocks.map((c, i) => (
            <motion.li key={c.label} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} className="border border-white/20 bg-white/[0.03] p-6">
              <div className="lp-mono text-[10px] tracking-[0.2em] text-white/60 mb-4">CLK.{String(i + 1).padStart(2, '0')}</div>
              <div className="flex items-end gap-2 mb-4">
                <span className="lp-display text-6xl font-bold leading-none tabular-nums">{String(c.value).padStart(2, '0')}</span>
                <span className="lp-display text-lg font-bold text-[var(--lp-yellow)] mb-1">{c.unit}</span>
              </div>
              <div className="flex gap-[3px] mb-5" aria-hidden="true">
                {Array.from({ length: c.segs }).map((_, j) => (
                  <motion.span
                    key={j}
                    className="h-1.5 flex-1 bg-[var(--lp-yellow)] origin-bottom"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + j * 0.04, duration: 0.25 }}
                  />
                ))}
              </div>
              <p className="text-sm text-white/85 m-0 mb-1">{c.label}</p>
              <p className="lp-mono text-[11px] text-white/60 m-0">29 CFR {c.cite}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 05 Field ---------- */

export function Field() {
  return (
    <section id="field" className="relative scroll-mt-16 py-24 lg:py-32 overflow-hidden">
      <Contours className="absolute inset-0 w-full h-full" />
      <div className="relative max-w-[1240px] min-[1800px]:max-w-[1440px] min-[2400px]:max-w-[1680px] mx-auto px-4 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div {...reveal}>
          <SectionLabel index="05">Built for Every Facility</SectionLabel>
          <Heading>
            Your facilities.
            <br />
            Your people.
            <br />
            <span className="text-[var(--lp-ink-3)]">Your compliance.</span>
          </Heading>
          <p className="text-lg text-[var(--lp-ink-2)] leading-relaxed max-w-md mt-8 mb-0">
            Anywhere that keeps an OSHA log. Supervisors, charge nurses and crew leads report from the
            floor, the unit or the field, and your safety manager signs off from anywhere.
          </p>
        </motion.div>
        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.15 }} className="bg-[var(--lp-panel)] border border-[var(--lp-line)]">
          <div className="h-1.5 bg-[var(--lp-ink)]" />
          <div className="lp-blueprint p-6 sm:p-8 space-y-2">
            <p className="lp-mono text-[11px] tracking-[0.2em] text-[var(--lp-ink-3)] m-0 mb-2">[ DEPLOYMENT PROFILE ]</p>
            <Dimension className="mb-4">Sectors · 5 · one standard</Dimension>
            <Chip label="Manufacturing">Plants, food processing, assembly</Chip>
            <Chip label="Healthcare">Hospitals, clinics, long-term care</Chip>
            <Chip label="Utilities">Electric, water, field crews</Chip>
            <Chip label="Logistics">Warehousing and distribution</Chip>
            <Chip label="Construction">General and specialty contractors</Chip>
            <Chip label="Records">OSHA 300, 301 and 300A</Chip>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Closing CTA: facility access badges ---------- */

type BadgeProps = { header: string; title: string; sub: string; no: string; tilt: string; dark?: boolean; href?: string; onClick?: () => void };

function AccessBadge({ header, title, sub, no, tilt, dark = false, href, onClick }: BadgeProps) {
  const body = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl shadow-[0_18px_40px_-20px_rgb(0_0_0/0.45)]"
        style={{ background: dark ? 'var(--lp-dark)' : 'var(--lp-panel)' }}
      />
      {/* Lanyard slot */}
      <span aria-hidden="true" className="relative mx-auto mt-4 block w-14 h-2.5 rounded-full" style={{ background: dark ? 'rgb(255 255 255 / 0.25)' : 'var(--lp-panel-2)', boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.25)' }} />
      <span className="relative flex items-center justify-between mx-5 mt-4" aria-hidden="true">
        <span className="block w-9 h-7 rounded-[4px] bg-[var(--lp-yellow)] [background-image:linear-gradient(to_right,transparent_45%,rgb(0_0_0/0.25)_45%_55%,transparent_55%),linear-gradient(to_bottom,transparent_45%,rgb(0_0_0/0.25)_45%_55%,transparent_55%)]" />
        <Glyph className={dark ? 'text-white/60' : 'text-[var(--lp-ink-3)]'} />
      </span>
      <span className={`relative block mx-5 mt-3 lp-mono text-[11px] tracking-[0.2em] ${dark ? 'text-white/70' : 'text-[var(--lp-ink-2)]'}`}>{header}</span>
      <span className={`relative block mx-5 mt-2 lp-display text-2xl font-bold leading-tight ${dark ? 'text-white' : 'text-[var(--lp-ink)]'}`}>
        {title}
        <svg viewBox="0 0 20 20" width="18" height="18" className="inline-block ml-2 -mt-1 transition-transform group-hover/tag:translate-x-1" aria-hidden="true">
          <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      </span>
      <span className={`relative block mx-5 mt-1 text-sm ${dark ? 'text-white/75' : 'text-[var(--lp-ink-2)]'}`}>{sub}</span>
      {/* Barcode strip */}
      <span
        aria-hidden="true"
        className="relative block mx-5 mt-5 h-6"
        style={{ background: `repeating-linear-gradient(to right, ${dark ? '#fff' : 'var(--lp-ink)'} 0 2px, transparent 2px 4px, ${dark ? '#fff' : 'var(--lp-ink)'} 4px 5px, transparent 5px 8px)`, opacity: 0.7 }}
      />
      <span className={`relative flex justify-between mx-5 mt-2 mb-5 lp-mono text-[10px] tracking-[0.15em] ${dark ? 'text-white/60' : 'text-[var(--lp-ink-3)]'}`}>
        <span>FOREMAN</span>
        <span>{no}</span>
      </span>
    </>
  );
  const cls = `group/tag relative block w-full max-w-[250px] rounded-2xl text-left no-underline bg-transparent border-none p-0 cursor-pointer transition-transform duration-300 hover:rotate-0 hover:-translate-y-1 ${tilt} ${dark ? 'lp-on-dark' : ''}`;
  return href ? <a href={href} className={cls}>{body}</a> : <button type="button" onClick={onClick} className={cls}>{body}</button>;
}

export function Closing({ onDemo }: { onDemo: () => void }) {
  return (
    <section className="relative py-24 lg:py-32 bg-[var(--lp-yellow)] overflow-hidden">
      <div className="lp-grid absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative max-w-[1240px] min-[1800px]:max-w-[1440px] min-[2400px]:max-w-[1680px] mx-auto px-4 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div {...reveal}>
          <p className="lp-mono flex items-center gap-2 text-[11px] tracking-[0.25em] m-0 mb-6"><Glyph />{'// NEXT STEP'}</p>
          <h2 className="lp-display text-5xl lg:text-7xl min-[2400px]:text-8xl font-bold tracking-tighter leading-[0.95] m-0 mb-6">
            Stop guessing.
            <br />
            Start knowing.
          </h2>
          <p className="text-lg max-w-md leading-relaxed m-0">
            Every incident classified. Every decision documented. Every log defensible. Tell us how
            recordkeeping works at your company. It takes 15 minutes.
          </p>
        </motion.div>
        <motion.nav {...reveal} aria-label="Next step" className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-8 sm:gap-6">
          <AccessBadge header="VISITOR · 15 MIN" title="Book a call" sub="Tell us how your team records injuries." no="PASS 001" tilt="-rotate-2" href={CALL_HREF} />
          <AccessBadge header="DEMO ACCESS" title="Try the demo" sub="Walk a case from report to the 300 Log." no="PASS 002" tilt="rotate-2 sm:mt-10" dark onClick={onDemo} />
        </motion.nav>
      </div>
    </section>
  );
}
