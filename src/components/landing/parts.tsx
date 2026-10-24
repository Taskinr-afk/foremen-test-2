import type { CSSProperties, ReactNode } from 'react';

// Where "Book a call" goes. Swap for a team inbox or scheduling link before launch.
export const CONTACT_EMAIL = 'yingyuul05@gmail.com';
export const CALL_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Foreman: 15-minute call')}`;

export const EASE = [0.16, 1, 0.3, 1] as const;

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: 'var(--lp-yellow)' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="var(--lp-ink)">
        <path d="M12 2L2 7v2h20V7L12 2zM4 11v8h3v-8H4zm5 0v8h3v-8H9zm5 0v8h3v-8h-3zm5 0v8h3v-8h-3zM2 21h20v2H2v-2z" />
      </svg>
    </span>
  );
}

/** Small marker taken from the Foreman logo's columns */
export function Glyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" className={`shrink-0 ${className}`} fill="currentColor" aria-hidden="true">
      <path d="M6 0.5L0.5 3.2v1.1h11V3.2zM1.5 5.4v4h1.6v-4zm2.8 0v4h1.6v-4zm2.8 0v4h1.6v-4zm2.8 0v4h1.6v-4zM0.5 10.4h11v1.1h-11z" />
    </svg>
  );
}

/** Architectural dimension line: |/——— LABEL ———/| */
export function Dimension({ children, dark = false, className = '' }: { children: ReactNode; dark?: boolean; className?: string }) {
  const tone = dark ? 'rgb(255 255 255 / 0.6)' : 'var(--lp-ink-3)';
  const tick = (
    <svg viewBox="0 0 12 14" width="12" height="14" className="shrink-0" aria-hidden="true">
      <path d="M6 0v14M2 11l8-8" stroke={tone} strokeWidth="1.3" />
    </svg>
  );
  return (
    <div className={`lp-mono flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase ${className}`} style={{ color: dark ? 'rgb(255 255 255 / 0.7)' : 'var(--lp-ink-2)' }}>
      {tick}
      <span className="h-px flex-1" style={{ background: tone }} aria-hidden="true" />
      <span className="shrink-0">{children}</span>
      <span className="h-px flex-1" style={{ background: tone }} aria-hidden="true" />
      {tick}
    </div>
  );
}

/** `[ SEC.01 // THE PROBLEM ]` */
export function SectionLabel({ index, children, dark = false }: { index: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`lp-mono flex items-center gap-3 text-xs tracking-[0.12em] sm:tracking-[0.2em] uppercase ${dark ? 'text-white/70' : 'text-[var(--lp-ink-2)]'}`}>
      <Dash />
      <span>[ SEC.{index} {'//'} {children} ]</span>
      <span className={`hidden sm:block h-px w-16 shrink-0 ${dark ? 'bg-white/25' : 'bg-[var(--lp-line)]'}`} aria-hidden="true" />
    </div>
  );
}

/** Short orange rule, the accent before section labels */
export function Dash({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block w-3 h-[3px] shrink-0 ${className}`} style={{ background: 'var(--lp-orange)' }} />;
}

/** Orange drafting corner marks (top-left and bottom-right) framing the parent, which must be positioned */
export function CornerMarks() {
  const mark = 'pointer-events-none absolute w-2.5 h-2.5 border-[var(--lp-orange)]';
  return (
    <>
      <span aria-hidden="true" className={`${mark} -top-1 -left-1 border-t-2 border-l-2`} />
      <span aria-hidden="true" className={`${mark} -bottom-1 -right-1 border-b-2 border-r-2`} />
    </>
  );
}

/** Black label chip + value, as in "Faction | Hongshan" on the official site */
export function Chip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-stretch text-sm">
      <span className="lp-mono shrink-0 bg-[var(--lp-ink)] text-white text-[11px] tracking-wider uppercase px-2.5 py-1.5 flex items-center">{label}</span>
      <span className="px-3 py-1.5 text-[var(--lp-ink-2)] border border-l-0 border-[var(--lp-line)] bg-[var(--lp-panel)] flex-1">{children}</span>
    </div>
  );
}

type PillProps = { children: ReactNode; variant?: 'yellow' | 'dark'; href?: string; onClick?: () => void; ringOn?: string };

/** Capsule button with an offset ring and a marker dot */
export function Pill({ children, variant = 'yellow', href, onClick, ringOn = 'var(--lp-bg)' }: PillProps) {
  const yellow = variant === 'yellow';
  const className =
    `lp-display lp-glow ${yellow ? 'lp-glow-orange' : 'lp-glow-blue'} group/pill inline-flex items-center gap-3 rounded-full pl-4 pr-6 py-3 text-sm font-bold tracking-wide no-underline cursor-pointer border-none hover:brightness-95 active:translate-y-px`;
  // The ring goes through --lp-ring so .lp-glow can add the hover glow on top of it
  const style = {
    background: yellow ? 'var(--lp-yellow)' : 'var(--lp-dark)',
    color: yellow ? 'var(--lp-ink)' : '#fff',
    '--lp-ring': `0 0 0 3px ${ringOn}, 0 0 0 4px ${yellow ? 'var(--lp-ink)' : 'var(--lp-ink-3)'}`,
  } as CSSProperties;
  const inner = (
    <>
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full transition-transform group-hover/pill:scale-150" style={{ background: yellow ? 'var(--lp-ink)' : 'var(--lp-yellow)' }} />
      {children}
    </>
  );
  return href ? (
    <a href={href} className={className} style={style}>{inner}</a>
  ) : (
    <button type="button" onClick={onClick} className={className} style={style}>{inner}</button>
  );
}

// Deterministic contour rings so the server and client render the same SVG.
function ring(cx: number, cy: number, r: number, seed: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const t = (i / 64) * Math.PI * 2;
    const k = 1 + 0.11 * Math.sin(3 * t + seed) + 0.06 * Math.sin(5 * t + seed * 1.7) + 0.03 * Math.sin(9 * t + seed * 0.4);
    pts.push(`${(cx + r * k * Math.cos(t)).toFixed(1)},${(cy + r * 0.78 * k * Math.sin(t)).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

const CONTOURS = [
  ...Array.from({ length: 9 }, (_, i) => ring(860, 140, 40 + i * 34, 0.6 + i * 0.13)),
  ...Array.from({ length: 6 }, (_, i) => ring(120, 620, 30 + i * 30, 2.1 + i * 0.21)),
];

/** Topographic contour lines, decorative */
export function Contours({ className = '' }: { className?: string }) {
  return (
    <svg className={`pointer-events-none ${className}`} viewBox="0 0 1000 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="var(--lp-ink)" strokeOpacity="0.09" strokeWidth="1">
        {CONTOURS.map((d, i) => <path key={i} d={d} />)}
      </g>
    </svg>
  );
}
