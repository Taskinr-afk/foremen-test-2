'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/stores/app-store';
import { CASE_TYPE_LABELS } from '@/lib/schemas/incident';
import type { Incident } from '@/lib/schemas/incident';
import { capDays, finalClassification, isLogged } from '@/lib/osha';

const CSV_HEADERS = [
  'Case No.',
  'Employee Name',
  'Job Title',
  'Date of Injury',
  'Where Event Occurred',
  'Description',
  'Death',
  'Days Away',
  'Job Transfer or Restriction',
  'Other Recordable',
  'Days Away from Work',
  'Days of Job Transfer or Restriction',
  'Injury or Illness Type',
];

function csvRow(i: Incident) {
  const c = finalClassification(i);
  return [
    i.caseNumber ?? '',
    i.privacyCase ? 'Privacy Case' : i.employeeName,
    i.jobTitle,
    i.date,
    i.location,
    i.description,
    c === 'death' ? 'X' : '',
    c === 'days-away' ? 'X' : '',
    c === 'restricted' ? 'X' : '',
    c === 'other-recordable' ? 'X' : '',
    String(capDays(i.daysAway)),
    String(capDays(i.daysRestricted)),
    CASE_TYPE_LABELS[i.caseType],
  ];
}

function csvCell(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function CheckMark() {
  return (
    <svg className="w-4 h-4 mx-auto" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--engine)' }}>
      <path d="M3 8l4 4 6-6" />
    </svg>
  );
}

export function OshaLog() {
  const { incidents, establishment } = useAppStore();
  const logged = incidents.filter(isLogged).sort((a, b) => (a.caseNumber ?? '').localeCompare(b.caseNumber ?? ''));
  const year = new Date().getFullYear();

  function exportCsv() {
    const lines = [CSV_HEADERS, ...logged.map(csvRow)].map((r) => r.map(csvCell).join(','));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osha-300-log-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--ink)] m-0" style={{ fontFamily: 'var(--font-display)' }}>
            OSHA Form 300
          </h2>
          <p className="text-sm text-[var(--ink-muted)] m-0 mt-1">Log of Work-Related Injuries and Illnesses</p>
          <p className="text-xs text-[var(--ink-faint)] mt-1 m-0" style={{ fontFamily: 'var(--font-mono)' }}>
            {establishment.establishmentName} | {establishment.city}, {establishment.state} | Year: {year}
          </p>
        </div>
        <motion.button
          onClick={exportCsv}
          disabled={logged.length === 0}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--accent)] rounded-[var(--radius-md)] border border-[var(--accent)] disabled:opacity-40 self-start bg-transparent cursor-pointer"
          whileHover={{ scale: 1.03, y: -1, backgroundColor: 'var(--accent-subtle)' }}
          whileTap={{ scale: 0.96 }}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2M8 2v8M5 7l3 3 3-3" />
          </svg>
          Export CSV
        </motion.button>
      </div>

      {/* Table */}
      <motion.div
        role="region"
        aria-label="OSHA 300 Log table"
        tabIndex={0}
        className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-x-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <table className="w-full text-sm min-w-[1100px]">
          <thead>
            {/* Group headers matching real OSHA 300 form */}
            <tr className="border-b border-[var(--border)]">
              <th colSpan={6} className="px-4 py-2 text-[10px] font-bold text-[var(--ink-faint)] uppercase tracking-widest text-left border-r border-[var(--border)]">
                Identify the Case
              </th>
              <th colSpan={4} className="px-4 py-2 text-[10px] font-bold text-[var(--ink-faint)] uppercase tracking-widest text-center border-r border-[var(--border)]">
                Classify the Case
              </th>
              <th colSpan={2} className="px-4 py-2 text-[10px] font-bold text-[var(--ink-faint)] uppercase tracking-widest text-center border-r border-[var(--border)]">
                Days Count
              </th>
              <th className="px-4 py-2 text-[10px] font-bold text-[var(--ink-faint)] uppercase tracking-widest text-center">
                Type
              </th>
            </tr>
            <tr className="border-b border-[var(--border)] bg-[var(--card-hover)]">
              <th className="px-3 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-left whitespace-nowrap w-[70px]">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col A</span>
                Case No.
              </th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-left whitespace-nowrap">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col B</span>
                Employee
              </th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-left whitespace-nowrap">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col C</span>
                Job Title
              </th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-left whitespace-nowrap w-[100px]">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col D</span>
                Date
              </th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-left whitespace-nowrap">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col E</span>
                Where
              </th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-left border-r border-[var(--border)] max-w-[220px]">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col F</span>
                Description
              </th>
              <th className="px-2 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-center whitespace-nowrap w-[60px]">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col G</span>
                Death
              </th>
              <th className="px-2 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-center whitespace-nowrap w-[70px]">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col H</span>
                Days Away
              </th>
              <th className="px-2 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-center whitespace-nowrap w-[80px]">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col I</span>
                Transfer / Restrict
              </th>
              <th className="px-2 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-center border-r border-[var(--border)] whitespace-nowrap w-[70px]">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col J</span>
                Other
              </th>
              <th className="px-2 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-center whitespace-nowrap w-[70px]">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col K</span>
                Days Away
              </th>
              <th className="px-2 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-center border-r border-[var(--border)] whitespace-nowrap w-[80px]">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col L</span>
                Days Restrict
              </th>
              <th className="px-3 py-2.5 text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider text-center whitespace-nowrap w-[80px]">
                <span className="block text-[9px] text-[var(--ink-faint)]">Col M</span>
                Type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {logged.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-4 py-12 text-center">
                  <p className="text-sm text-[var(--ink-faint)] m-0">No cases signed off as recordable yet.</p>
                  <p className="text-xs text-[var(--ink-faint)] m-0 mt-1">Cases appear here after you accept or override them in Review.</p>
                </td>
              </tr>
            ) : (
              logged.map((inc, i) => {
                const cls = finalClassification(inc);
                return (
                  <motion.tr
                    key={inc.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="hover:bg-[var(--card-hover)] transition-colors"
                  >
                    <td className="px-3 py-3 text-xs text-[var(--ink-muted)] whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)' }}>
                      {inc.caseNumber ?? ''}
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-[var(--ink)] whitespace-nowrap">
                      {inc.privacyCase ? 'Privacy Case' : inc.employeeName}
                    </td>
                    <td className="px-3 py-3 text-xs text-[var(--ink-muted)] whitespace-nowrap">
                      {inc.jobTitle}
                    </td>
                    <td className="px-3 py-3 text-xs text-[var(--ink-muted)] whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)' }}>
                      {inc.date}
                    </td>
                    <td className="px-3 py-3 text-xs text-[var(--ink-muted)] whitespace-nowrap">
                      {inc.location}
                    </td>
                    <td className="px-3 py-3 text-xs text-[var(--ink-muted)] max-w-[220px] border-r border-[var(--border)]">
                      {inc.description}
                    </td>
                    {/* G-J: Classification checkmarks */}
                    <td className="px-2 py-3 text-center">{cls === 'death' && <CheckMark />}</td>
                    <td className="px-2 py-3 text-center">{cls === 'days-away' && <CheckMark />}</td>
                    <td className="px-2 py-3 text-center">{cls === 'restricted' && <CheckMark />}</td>
                    <td className="px-2 py-3 text-center border-r border-[var(--border)]">{cls === 'other-recordable' && <CheckMark />}</td>
                    {/* K-L: Day counts */}
                    <td className="px-2 py-3 text-center text-sm text-[var(--ink)]" style={{ fontFamily: 'var(--font-mono)' }}>
                      {capDays(inc.daysAway)}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-[var(--ink)] border-r border-[var(--border)]" style={{ fontFamily: 'var(--font-mono)' }}>
                      {capDays(inc.daysRestricted)}
                    </td>
                    {/* M: Type */}
                    <td className="px-3 py-3 text-xs text-[var(--ink-muted)] text-center whitespace-nowrap">
                      {CASE_TYPE_LABELS[inc.caseType]}
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Footer note */}
      <div className="flex items-start gap-2 text-[11px] text-[var(--ink-faint)]">
        <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="6.5" />
          <path d="M8 5v3M8 10h.01" />
        </svg>
        <p className="m-0">
          Only cases signed off as recordable appear here. Day counts are calendar days, capped at 180 per 29 CFR 1904.7(b)(3). Maintain this log for 5 years per 29 CFR 1904.33. Columns match OSHA Form 300.
        </p>
      </div>
    </motion.div>
  );
}
