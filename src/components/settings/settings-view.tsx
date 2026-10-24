'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/stores/app-store';
import type { Establishment } from '@/lib/schemas/incident';

type Theme = 'system' | 'light' | 'dark';

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: 'system',
    label: 'System',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="4" width="14" height="10" rx="1.5" />
        <path d="M7 17h6M10 14v3" />
      </svg>
    ),
  },
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="10" cy="10" r="3.5" />
        <path d="M10 3v1.5M10 15.5V17M17 10h-1.5M4.5 10H3M14.95 5.05l-1.06 1.06M6.11 13.89l-1.06 1.06M14.95 14.95l-1.06-1.06M6.11 6.11L5.05 5.05" />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M17 12.5A7.5 7.5 0 117.5 3a5.5 5.5 0 009.5 9.5z" />
      </svg>
    ),
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

const ESTABLISHMENT_FIELDS: { key: keyof Establishment; label: string; numeric?: boolean; hint?: string }[] = [
  { key: 'companyName', label: 'Company Name' },
  { key: 'establishmentName', label: 'Establishment / Site Name', hint: 'OSHA logs are kept per establishment' },
  { key: 'ein', label: 'EIN' },
  { key: 'naicsCode', label: 'NAICS Code' },
  { key: 'streetAddress', label: 'Street Address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'zip', label: 'ZIP' },
  { key: 'annualAverageEmployees', label: 'Annual Average Employees', numeric: true },
  { key: 'totalHoursWorked', label: 'Total Hours Worked (this year)', numeric: true, hint: 'Used to calculate your injury rates' },
  { key: 'injuryRateTarget', label: 'Injury Rate Target', numeric: true, hint: 'Ring turns red at or above this' },
  { key: 'missedWorkRateTarget', label: 'Missed Work Rate Target', numeric: true, hint: 'Many big clients cap suppliers around 2.5' },
];

export function SettingsView() {
  const { establishment, updateEstablishment } = useAppStore();
  // Settings only renders client-side after navigation, so reading storage on first render is safe
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('foreman-theme') as Theme | null) ?? 'system';
    } catch {
      return 'system';
    }
  });

  function applyTheme(t: Theme) {
    setTheme(t);
    try { localStorage.setItem('foreman-theme', t); } catch {}
    const root = document.documentElement;
    if (t === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', t);
    }
  }

  return (
    <motion.div className="max-w-2xl space-y-8" {...fadeUp}>
      <div>
        <h2 className="text-xl font-bold text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Settings
        </h2>
        <p className="text-sm text-[var(--ink-muted)]">Manage your workspace preferences</p>
      </div>

      <motion.div
        className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <h3 className="text-sm font-semibold text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Appearance
        </h3>
        <p className="text-xs text-[var(--ink-muted)] mb-5">Choose how Foreman looks for you</p>

        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value}
              onClick={() => applyTheme(opt.value)}
              className="relative flex flex-col items-center gap-2 p-4 rounded-[var(--radius-md)] border text-sm transition-colors"
              style={{
                borderColor: theme === opt.value ? 'var(--accent)' : 'var(--border)',
                backgroundColor: theme === opt.value ? 'var(--accent-subtle)' : 'var(--card)',
                color: theme === opt.value ? 'var(--accent)' : 'var(--ink-muted)',
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {theme === opt.value && (
                <motion.div
                  layoutId="theme-active"
                  className="absolute inset-0 rounded-[var(--radius-md)] border-2 border-[var(--accent)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{opt.icon}</span>
              <span className="relative z-10 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                {opt.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <h3 className="text-sm font-semibold text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Establishment Info
        </h3>
        <p className="text-xs text-[var(--ink-muted)] mb-5">Required for OSHA Form 300A annual summary</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ESTABLISHMENT_FIELDS.map((f) => (
            <div key={f.key}>
              <label htmlFor={`est-${f.key}`} className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5">{f.label}</label>
              <input
                id={`est-${f.key}`}
                aria-describedby={f.hint ? `est-${f.key}-hint` : undefined}
                type={f.numeric ? 'number' : 'text'}
                min={f.numeric ? 0 : undefined}
                step={f.numeric ? 'any' : undefined}
                value={establishment[f.key]}
                onChange={(e) =>
                  updateEstablishment({ [f.key]: f.numeric ? Math.max(0, Number(e.target.value)) : e.target.value })
                }
                className="input-field"
              />
              {f.hint && <p id={`est-${f.key}-hint`} className="text-[11px] text-[var(--ink-faint)] mt-1">{f.hint}</p>}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
