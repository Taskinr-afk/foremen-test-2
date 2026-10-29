'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { OUTCOME_LABELS, REVIEW_LABELS } from '@/lib/schemas/incident';
import { finalOutcome, OUTCOME_STYLES } from '@/lib/osha';
import { motion } from 'framer-motion';

const REVIEW_STYLES = {
  pending: { bg: 'var(--accent-subtle)', text: 'var(--accent)' },
  accepted: { bg: 'var(--engine-subtle)', text: 'var(--engine)' },
  overridden: { bg: 'var(--blue-subtle)', text: 'var(--blue)' },
};

export function RecentIncidents() {
  const { incidents, setActiveView } = useAppStore();

  return (
    <motion.div
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
          Recent Incidents
        </h3>
        <motion.button
          onClick={() => setActiveView('review')}
          className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          Go to Review
        </motion.button>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {incidents.slice(0, 5).map((incident, i) => {
          const outcome = finalOutcome(incident);
          const review = REVIEW_STYLES[incident.review.status];
          return (
            <motion.div
              key={incident.id}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-3.5 cursor-pointer"
              onClick={() => setActiveView('review')}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ backgroundColor: 'var(--card-hover)', x: 2 }}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <motion.div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                  style={{ backgroundColor: OUTCOME_STYLES[outcome].text }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 + 0.05 * i }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[var(--ink)]">
                      {incident.privacyCase ? 'Privacy Case' : incident.employeeName}
                    </span>
                    <span className="text-[11px] text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>
                      {incident.caseNumber ?? incident.id}
                    </span>
                    {incident.severeAlert && !incident.severeAlert.reportedAt && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--alert)' }}>
                        Severe
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--ink-muted)] truncate mt-0.5">{incident.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 pl-6 sm:pl-0">
                <span className="text-[11px] font-medium" style={{ color: OUTCOME_STYLES[outcome].text }}>
                  {OUTCOME_LABELS[outcome]}
                </span>
                <span className="text-[11px] text-[var(--ink-faint)]">·</span>
                <span className="text-[11px]" style={{ color: incident.review.status === 'pending' ? review.text : 'var(--ink-faint)' }}>
                  {REVIEW_LABELS[incident.review.status]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
