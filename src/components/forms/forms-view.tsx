'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/stores/app-store';
import { isLogged } from '@/lib/osha';

const FORMS = [
  {
    id: '300',
    title: 'OSHA Form 300',
    subtitle: 'Log of Work-Related Injuries and Illnesses',
    desc: 'The running log maintained throughout the year. Each recordable case gets one row. Already live in the OSHA 300 Log tab.',
    status: 'active' as const,
    icon: 'M3 3h14v14H3zM3 7h14M7 3v14',
  },
  {
    id: '300a',
    title: 'OSHA Form 300A',
    subtitle: 'Summary of Work-Related Injuries and Illnesses',
    desc: 'Annual summary calculated from the 300 Log. Must be posted at your establishment from February 1 through April 30 and certified by a company executive.',
    status: 'ready' as const,
    icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h0a2 2 0 002-2M9 5a2 2 0 012-2h0a2 2 0 012 2',
  },
  {
    id: '301',
    title: 'OSHA Form 301',
    subtitle: 'Injury and Illness Incident Report',
    desc: 'One form per recordable case with full details: employee info, physician, hospital, how the injury occurred, and what the employee was doing. Required within 7 calendar days of learning about a case.',
    status: 'ready' as const,
    icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
  {
    id: 'ita',
    title: 'ITA Submission',
    subtitle: 'Injury Tracking Application Export',
    desc: 'Electronic submission to OSHA required by March 2 each year. Establishments with 250+ employees submit full case-level data. Sites with 20-249 in high-hazard industries submit the 300A summary.',
    status: 'ready' as const,
    icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
  },
];

const STATUS_LABELS = {
  active: { label: 'Live', bg: 'var(--engine-subtle)', text: 'var(--engine)' },
  ready: { label: 'Generate', bg: 'var(--accent-subtle)', text: 'var(--accent)' },
};

export function FormsView() {
  const { incidents, establishment, setActiveView } = useAppStore();
  const logged = incidents.filter(isLogged);
  const year = new Date().getFullYear();
  const totalCases = logged.length;

  return (
    <motion.div className="space-y-5 max-w-4xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[var(--ink)] m-0" style={{ fontFamily: 'var(--font-display)' }}>
          OSHA Forms
        </h2>
        <p className="text-sm text-[var(--ink-muted)] m-0 mt-1">
          Generate, review, and export all required OSHA recordkeeping forms.
        </p>
        <p className="text-xs text-[var(--ink-faint)] mt-1 m-0" style={{ fontFamily: 'var(--font-mono)' }}>
          {establishment.establishmentName} | {totalCases} recordable case{totalCases !== 1 ? 's' : ''} in {year}
        </p>
      </div>

      {/* Form Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FORMS.map((form, i) => {
          const st = STATUS_LABELS[form.status];
          return (
            <motion.div
              key={form.id}
              className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5 flex flex-col gap-3 hover:border-[var(--border-strong)] transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
              onClick={() => {
                if (form.id === '300') setActiveView('log');
              }}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center" style={{ backgroundColor: st.bg }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: st.text }}>
                    <path d={form.icon} />
                  </svg>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                  style={{ backgroundColor: st.bg, color: st.text }}
                >
                  {st.label}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[var(--ink)] m-0" style={{ fontFamily: 'var(--font-display)' }}>
                  {form.title}
                </h3>
                <p className="text-xs font-medium text-[var(--ink-muted)] m-0 mt-0.5">{form.subtitle}</p>
              </div>

              <p className="text-xs text-[var(--ink-muted)] m-0 leading-relaxed flex-1">{form.desc}</p>

              {form.id !== '300' && (
                <motion.button
                  className="w-full mt-1 px-4 py-2 text-xs font-bold rounded-[var(--radius-md)] border border-[var(--accent)] text-[var(--accent)] bg-transparent cursor-pointer"
                  whileHover={{ scale: 1.02, backgroundColor: 'var(--accent-subtle)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {form.id === 'ita' ? 'Generate CSV' : 'Generate PDF'}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Deadlines */}
      <motion.div
        className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <h3 className="text-sm font-bold text-[var(--ink)] m-0 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Key Deadlines
        </h3>
        <div className="space-y-2.5">
          {[
            { date: 'Feb 1', label: 'Post 300A summary at establishment', note: '29 CFR 1904.32(b)(5)' },
            { date: 'Mar 2', label: 'ITA electronic submission deadline', note: '29 CFR 1904.41' },
            { date: 'Apr 30', label: 'Last day to display 300A', note: '29 CFR 1904.32(b)(6)' },
            { date: 'Within 7 days', label: 'Complete Form 301 for each new recordable case', note: '29 CFR 1904.29(b)(3)' },
            { date: 'Within 24 hrs', label: 'Report severe injuries (amputation, loss of eye, inpatient hospitalization)', note: '29 CFR 1904.39(a)(2)' },
            { date: 'Within 8 hrs', label: 'Report work-related fatalities', note: '29 CFR 1904.39(a)(1)' },
          ].map((d, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="text-[10px] font-bold text-[var(--accent)] whitespace-nowrap mt-0.5 w-24 shrink-0"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {d.date}
              </span>
              <div className="flex-1">
                <p className="text-xs text-[var(--ink)] m-0">{d.label}</p>
                <p className="text-[10px] text-[var(--ink-faint)] m-0 mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>{d.note}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="flex items-start gap-2 text-[11px] text-[var(--ink-faint)]">
        <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="6.5" />
          <path d="M8 5v3M8 10h.01" />
        </svg>
        <p className="m-0">
          PDF generation and ITA CSV export connect to your signed-off cases. Forms auto-populate from incident data you have already reviewed.
        </p>
      </div>
    </motion.div>
  );
}
