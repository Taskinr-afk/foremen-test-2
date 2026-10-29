'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/stores/app-store';
import type { AuditEntry } from '@/lib/schemas/incident';

const ACTION_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  Submitted: { bg: 'var(--blue-subtle, #dbeafe)', text: 'var(--blue, #2563eb)', icon: 'M12 4v16m8-8H4' },
  Determined: { bg: 'var(--accent-subtle)', text: 'var(--accent)', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0' },
  Accepted: { bg: 'var(--engine-subtle)', text: 'var(--engine)', icon: 'M5 13l4 4L19 7' },
  Overridden: { bg: 'var(--alert-subtle, #fef2f2)', text: 'var(--alert, #dc2626)', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
  'Reported to OSHA': { bg: 'var(--alert-subtle, #fef2f2)', text: 'var(--alert, #dc2626)', icon: 'M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.75-2.75L13.75 4a2 2 0 00-3.5 0L3.32 16.25A2 2 0 005.07 19z' },
  'Answered questions': { bg: 'var(--blue-subtle, #dbeafe)', text: 'var(--blue, #2563eb)', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01' },
};

const DEFAULT_STYLE = { bg: 'var(--border)', text: 'var(--ink-muted)', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };

function getStyle(action: string) {
  return ACTION_STYLES[action] || DEFAULT_STYLE;
}

function ActionIcon({ action, className }: { action: string; className?: string }) {
  const s = getStyle(action);
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: s.text }}>
      <path d={s.icon} />
    </svg>
  );
}

function formatRelative(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type FilterType = 'all' | 'decisions' | 'submissions' | 'overrides';

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All Activity' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'submissions', label: 'Submissions' },
  { id: 'overrides', label: 'Overrides' },
];

function matchesFilter(entry: AuditEntry, filter: FilterType) {
  if (filter === 'all') return true;
  if (filter === 'decisions') return entry.action === 'Determined' || entry.action === 'Accepted';
  if (filter === 'submissions') return entry.action === 'Submitted' || entry.action === 'Reported to OSHA';
  if (filter === 'overrides') return entry.action === 'Overridden';
  return true;
}

export function AuditTrail() {
  const { auditLog } = useAppStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const filtered = auditLog.filter((e) => matchesFilter(e, filter));

  function exportLog() {
    const header = 'Timestamp,Action,Incident ID,Actor,Detail';
    const rows = auditLog.map((e) => {
      const cells = [e.at, e.action, e.incidentId, e.actor, e.detail];
      return cells.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',');
    });
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.div className="space-y-5 max-w-4xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--ink)] m-0" style={{ fontFamily: 'var(--font-display)' }}>
            Audit Trail
          </h2>
          <p className="text-sm text-[var(--ink-muted)] m-0 mt-1">
            Every action is timestamped and attributed. Entries are never edited or deleted.
          </p>
        </div>
        <motion.button
          onClick={exportLog}
          disabled={auditLog.length === 0}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--accent)] rounded-[var(--radius-md)] border border-[var(--accent)] disabled:opacity-40 self-start bg-transparent cursor-pointer"
          whileHover={{ scale: 1.03, y: -1, backgroundColor: 'var(--accent-subtle)' }}
          whileTap={{ scale: 0.96 }}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2M8 2v8M5 7l3 3 3-3" />
          </svg>
          Export Log
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          const count = f.id === 'all' ? auditLog.length : auditLog.filter((e) => matchesFilter(e, f.id)).length;
          return (
            <motion.button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="relative px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer"
              style={{
                borderColor: active ? 'var(--accent)' : 'var(--border)',
                backgroundColor: active ? 'var(--accent-subtle)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--ink-muted)',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {f.label}
              <span className="ml-1.5 text-[10px] opacity-70">{count}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              className="px-5 py-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-[var(--ink-faint)]">No entries match this filter.</p>
            </motion.div>
          ) : (
            filtered.map((e, i) => {
              const s = getStyle(e.action);
              return (
                <motion.div
                  key={e.id}
                  layout
                  className="flex items-start gap-4 px-5 py-4 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--card-hover)] transition-colors"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, height: 0, padding: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Icon */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: s.bg }}
                  >
                    <ActionIcon action={e.action} className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: s.bg, color: s.text }}
                      >
                        {e.action}
                      </span>
                      <span className="text-[11px] text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>
                        {e.incidentId}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--ink)] mt-1 m-0 break-words">{e.detail}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px] text-[var(--ink-muted)]">{e.actor}</span>
                      <span className="text-[11px] text-[var(--ink-faint)]">
                        {formatRelative(e.at)}
                      </span>
                      <span className="text-[10px] text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }} title={e.at}>
                        {new Date(e.at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-start gap-2 text-[11px] text-[var(--ink-faint)]">
        <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="6.5" />
          <path d="M8 5v3M8 10h.01" />
        </svg>
        <p className="m-0">
          This log is immutable. OSHA inspectors may request this during an audit to verify recordability decisions and sign-off timestamps. Export it before an inspection for a ready-to-go documentation package.
        </p>
      </div>
    </motion.div>
  );
}
