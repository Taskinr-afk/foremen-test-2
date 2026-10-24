'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/stores/app-store';
import { CASE_TYPE_LABELS, CLASSIFICATION_COLUMNS, CLASSIFICATION_LABELS } from '@/lib/schemas/incident';
import type { Incident } from '@/lib/schemas/incident';
import { capDays, finalClassification, isLogged } from '@/lib/osha';

const COLUMNS = [
  'A Case No.',
  'B Employee',
  'C Job Title',
  'D Date',
  'E Where',
  'F Description',
  'G-J Classification',
  'K Days Away',
  'L Restricted',
  'M Type',
];

function row(i: Incident) {
  const c = finalClassification(i);
  return [
    i.caseNumber ?? '',
    i.privacyCase ? 'Privacy Case' : i.employeeName,
    i.jobTitle,
    i.date,
    i.location,
    i.description,
    c ? `${CLASSIFICATION_COLUMNS[c]} - ${CLASSIFICATION_LABELS[c]}` : '',
    String(capDays(i.daysAway)),
    String(capDays(i.daysRestricted)),
    CASE_TYPE_LABELS[i.caseType],
  ];
}

function csvCell(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function OshaLog() {
  const { incidents, establishment } = useAppStore();
  const logged = incidents.filter(isLogged).sort((a, b) => (a.caseNumber ?? '').localeCompare(b.caseNumber ?? ''));
  const year = new Date().getFullYear();

  function exportCsv() {
    const lines = [COLUMNS, ...logged.map(row)].map((r) => r.map(csvCell).join(','));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osha-300-log-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--ink-muted)]">OSHA Form 300 - Log of Work-Related Injuries and Illnesses</p>
          <p className="text-xs text-[var(--ink-faint)] mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
            {establishment.establishmentName} | {establishment.city}, {establishment.state} | Year: {year}
          </p>
        </div>
        <motion.button
          onClick={exportCsv}
          disabled={logged.length === 0}
          className="px-3 py-1.5 text-xs font-medium text-[var(--accent)] rounded-[var(--radius-md)] border border-[var(--accent)] disabled:opacity-40 self-start"
          whileHover={{ scale: 1.04, y: -1, backgroundColor: 'var(--accent-subtle)' }}
          whileTap={{ scale: 0.96 }}
        >
          Export CSV
        </motion.button>
      </div>

      <motion.div
        role="region"
        aria-label="OSHA 300 Log table"
        tabIndex={0}
        className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-x-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <table className="w-full text-sm min-w-[960px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              {COLUMNS.map((c) => (
                <th key={c} className="px-4 py-3 text-[11px] font-semibold text-[var(--ink-faint)] uppercase tracking-wider whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {logged.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-sm text-[var(--ink-faint)]">
                  No cases signed off as recordable yet.
                </td>
              </tr>
            ) : (
              logged.map((inc, i) => {
                const cells = row(inc);
                return (
                  <motion.tr
                    key={inc.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ backgroundColor: 'var(--card-hover)' }}
                  >
                    {cells.map((v, ci) => (
                      <td
                        key={ci}
                        className={
                          ci === 0
                            ? 'px-4 py-3 text-xs text-[var(--ink-muted)] whitespace-nowrap'
                            : ci === 1
                            ? 'px-4 py-3 font-medium text-[var(--ink)] whitespace-nowrap'
                            : ci === 5
                            ? 'px-4 py-3 text-xs text-[var(--ink-muted)] max-w-[280px]'
                            : ci === 6
                            ? 'px-4 py-3 text-xs font-medium text-[var(--alert)] whitespace-nowrap'
                            : 'px-4 py-3 text-[var(--ink-muted)] whitespace-nowrap'
                        }
                        style={ci === 0 || ci === 7 || ci === 8 ? { fontFamily: 'var(--font-mono)' } : undefined}
                      >
                        {v}
                      </td>
                    ))}
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </motion.div>
      <p className="text-[11px] text-[var(--ink-faint)]">
        Only cases you signed off as recordable appear here. Day counts are calendar days, capped at 180 (1904.7(b)(3)). Keep this log for 5 years (1904.33).
      </p>
    </motion.div>
  );
}
