'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/stores/app-store';
import { SEVERE_EVENT_LABELS } from '@/lib/schemas/incident';

function timeLeft(deadline: string, now: number) {
  const ms = new Date(deadline).getTime() - now;
  if (ms <= 0) return 'Deadline passed';
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m left`;
}

export function SevereAlerts() {
  const { incidents, markSevereReported } = useAppStore();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const t = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, []);

  const open = incidents.filter((i) => i.severeAlert && !i.severeAlert.reportedAt);

  return (
    <AnimatePresence>
      {open.map((i) => {
        const a = i.severeAlert!;
        const hours = a.event === 'fatality' ? 8 : 24;
        return (
          <motion.div
            key={i.id}
            className="rounded-[var(--radius-lg)] border p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ borderColor: 'var(--alert)', backgroundColor: 'var(--alert-subtle)' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--alert)', fontFamily: 'var(--font-display)' }}>
                Report to OSHA within {hours} hours: {SEVERE_EVENT_LABELS[a.event]}
              </p>
              <p className="text-xs text-[var(--ink-muted)] mt-1">
                {i.employeeName}, {i.location}. Call 1-800-321-6742 or file at osha.gov/report. This is separate from the 300 log (1904.39).
              </p>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full tabular-nums" style={{ color: 'var(--alert)', fontFamily: 'var(--font-mono)' }}>
              {now === null ? '' : timeLeft(a.deadlineAt, now)}
            </span>
            <motion.button
              onClick={() => markSevereReported(i.id)}
              className="px-3 py-1.5 text-xs font-medium text-[var(--on-alert)] rounded-[var(--radius-md)] shrink-0"
              style={{ backgroundColor: 'var(--alert)' }}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              Mark as reported
            </motion.button>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
