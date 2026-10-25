'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CALL_HREF, EASE, Glyph, LogoMark, Pill } from './parts';

export const SECTIONS = [
  { id: 'problem', index: '01', label: 'Problem' },
  { id: 'modules', index: '02', label: 'Modules' },
  { id: 'flow', index: '03', label: 'Flow' },
  { id: 'clocks', index: '04', label: 'Clocks' },
  { id: 'field', index: '05', label: 'Sectors' },
];

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

/** Desktop section rail, after the official site's left icon bar */
export function Rail() {
  const active = useActiveSection();
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 w-[72px] flex-col items-center border-r border-[var(--lp-line)] bg-[var(--lp-panel)]">
      <a href="#top" className="mt-4 mb-8 no-underline" aria-label="Foreman, back to top">
        <LogoMark size={36} />
      </a>
      <nav aria-label="Sections" className="flex flex-col w-full">
        {SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={on ? 'true' : undefined}
              className={`relative flex flex-col items-center gap-0.5 py-3 no-underline transition-colors ${on ? 'bg-[var(--lp-panel-2)] text-[var(--lp-ink)]' : 'text-[var(--lp-ink-3)] hover:text-[var(--lp-ink)]'}`}
            >
              {on && <motion.span layoutId="rail-mark" className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--lp-ink)]" transition={{ duration: 0.3, ease: EASE }} />}
              <span className="lp-display text-base font-bold">{s.index}</span>
              <span className="lp-mono text-[9px] tracking-widest uppercase">{s.label}</span>
            </a>
          );
        })}
      </nav>
      <a
        href={CALL_HREF}
        className="lp-on-dark lp-glow lp-glow-orange mt-auto mb-6 flex flex-col items-center gap-3 bg-[var(--lp-dark)] text-white px-2.5 py-4 no-underline hover:bg-black"
      >
        <Glyph className="text-white" />
        <span className="lp-display text-xs font-bold tracking-wider [writing-mode:vertical-rl]">Book a Call</span>
      </a>
    </aside>
  );
}

export function TopBar({ onSignIn, onDemo }: { onSignIn: () => void; onDemo: () => void }) {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[72px] z-30 h-16 flex items-center justify-between px-4 lg:px-10 bg-[var(--lp-bg)]/85 backdrop-blur-md border-b border-[var(--lp-line)]/70">
      <a href="#top" className="flex items-center gap-3 no-underline text-[var(--lp-ink)]" aria-label="Foreman home">
        <span className="lg:hidden"><LogoMark size={30} /></span>
        <span className="lp-display font-bold text-lg tracking-tight">FOREMAN</span>
        <span className="lp-mono hidden sm:inline text-[11px] tracking-widest text-[var(--lp-ink-3)] border-l border-[var(--lp-line)] pl-3">
          OSHA RECORDKEEPING
        </span>
      </a>
      <div className="flex items-center gap-4 sm:gap-6">
        <button type="button" onClick={onDemo} className="lp-display text-sm font-semibold text-[var(--lp-ink-2)] hover:text-[var(--lp-ink)] bg-transparent border-none cursor-pointer py-2">
          Demo
        </button>
        <button type="button" onClick={onSignIn} className="hidden sm:inline lp-display text-sm font-semibold text-[var(--lp-ink-2)] hover:text-[var(--lp-ink)] bg-transparent border-none cursor-pointer py-2">
          Sign In
        </button>
        <span className="lg:hidden">
          <Pill href={CALL_HREF}>Book a Call</Pill>
        </span>
      </div>
    </header>
  );
}

const TITLE_BLOCK = [
  ['Unit', 'Foreman'],
  ['Class', 'Injury recordkeeping'],
  ['Standard', '29 CFR 1904'],
  ['Status', 'Early access'],
  ['Note', 'Not affiliated with OSHA'],
];

/** Footer as an equipment nameplate */
export function StatusBar({ onDemo }: { onDemo: () => void }) {
  const link = 'flex items-center gap-2 text-white no-underline bg-transparent border-none cursor-pointer p-0 py-1 text-sm hover:text-[var(--lp-yellow)]';
  const arrow = (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
  return (
    <footer className="lp-on-dark bg-[var(--lp-dark)] text-white lg:pl-[72px]">
      <div className="lp-hazard h-2" aria-hidden="true" />
      <div className="px-4 lg:px-10 py-6 flex flex-col lg:flex-row lg:items-stretch justify-between gap-6">
        <dl className="m-0 grid grid-cols-2 sm:grid-cols-5 border border-white/30 lp-mono text-[11px]">
          {TITLE_BLOCK.map(([k, v]) => (
            <div key={k} className="px-3 py-2 border-white/30 border-b sm:border-b-0 sm:border-r last:border-r-0 odd:border-r sm:odd:border-r">
              <dt className="text-[9px] tracking-[0.2em] uppercase text-white/60">{k}</dt>
              <dd className="m-0 mt-0.5 tracking-wider uppercase text-white/90">{v}</dd>
            </div>
          ))}
        </dl>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href={CALL_HREF} className={link}>{arrow} Book a call</a>
          <button type="button" onClick={onDemo} className={link}>{arrow} Try the demo</button>
          <a href="#top" className={link}>{arrow} Back to top</a>
        </nav>
      </div>
    </footer>
  );
}

export function SignInModal({ open, onClose, onEnterApp }: { open: boolean; onClose: () => void; onEnterApp: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Escape closes, Tab stays inside the dialog, and focus returns to the opener on close.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    formRef.current?.querySelector<HTMLInputElement>('input')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab' || !formRef.current) return;
      const items = formRef.current.querySelectorAll<HTMLElement>('button, input');
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div className="absolute inset-0 bg-[#121212]/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} />
      <motion.form
        ref={formRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-title"
        onSubmit={(e) => { e.preventDefault(); onEnterApp(); }}
        className="relative w-full max-w-md bg-[var(--lp-panel)] border border-[var(--lp-line)] p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <div className="lp-hazard-rule absolute top-0 left-0 right-0" />
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-[var(--lp-ink-3)] hover:text-[var(--lp-ink)] bg-transparent border-none cursor-pointer">
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>

        <p className="lp-mono text-[11px] tracking-[0.2em] text-[var(--lp-ink-3)] mb-2">[ ACCESS ]</p>
        <h2 id="signin-title" className="lp-display text-2xl font-bold tracking-tight mb-6">Sign In</h2>

        <div className="space-y-4 mb-6">
          {([
            { id: 'signin-email', label: 'Username', type: 'email', value: email, set: setEmail, ph: 'you@company.com', ac: 'email' },
            { id: 'signin-password', label: 'Password', type: 'password', value: password, set: setPassword, ph: 'Enter password', ac: 'current-password' },
          ] as const).map((f) => (
            <div key={f.id} className="flex items-stretch">
              <label htmlFor={f.id} className="lp-display w-28 shrink-0 text-xs font-bold tracking-wider uppercase flex items-center border-r-2 border-[var(--lp-ink)] mr-3">
                {f.label}.
              </label>
              <input
                id={f.id}
                autoComplete={f.ac}
                type={f.type}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.ph}
                className="flex-1 min-w-0 bg-transparent border-0 border-b-2 border-[var(--lp-ink-3)] px-1 py-2 text-base focus:border-[var(--lp-ink)] placeholder:text-[var(--lp-ink-3)]"
              />
            </div>
          ))}
        </div>

        <button type="submit" className="lp-display w-full py-3.5 text-sm font-bold tracking-wider bg-[var(--lp-dark)] text-white border-none cursor-pointer hover:bg-black">
          SIGN IN
        </button>
        <p className="text-center text-xs text-[var(--lp-ink-3)] mt-4">
          Demo mode: no real accounts yet. Any email opens the sample dashboard.
        </p>
      </motion.form>
    </div>
  );
}
