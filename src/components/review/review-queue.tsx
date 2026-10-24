'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/stores/app-store';
import {
  CLASSIFICATION_COLUMNS,
  CLASSIFICATION_LABELS,
  OUTCOME_LABELS,
  SEVERE_EVENT_LABELS,
} from '@/lib/schemas/incident';
import type { Classification, Incident } from '@/lib/schemas/incident';
import { OUTCOME_STYLES } from '@/lib/osha';

export function ReviewQueue() {
  const { incidents } = useAppStore();
  const pending = incidents.filter((i) => i.review.status === 'pending');

  if (pending.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="w-14 h-14 rounded-full bg-[var(--engine-subtle)] flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
        >
          <svg className="w-7 h-7 text-[var(--engine)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </motion.div>
        <h3 className="text-lg font-semibold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          All Clear
        </h3>
        <p className="text-sm text-[var(--ink-muted)]">Every case has been signed off.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <motion.p className="text-sm text-[var(--ink-muted)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Foreman classified {pending.length} case{pending.length !== 1 ? 's' : ''}. Check each call and sign off. Nothing goes on the 300 log until you do.
      </motion.p>
      <AnimatePresence>
        {pending.map((incident, i) => (
          <ReviewCard key={incident.id} incident={incident} index={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ReviewCard({ incident, index }: { incident: Incident; index: number }) {
  const { acceptDetermination, overrideDetermination, answerQuestions } = useAppStore();
  const d = incident.determination;
  const style = OUTCOME_STYLES[d.outcome];
  const [showOverride, setShowOverride] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [overrideOutcome, setOverrideOutcome] = useState<'recordable' | 'not-recordable'>(
    d.outcome === 'recordable' ? 'not-recordable' : 'recordable'
  );
  const [overrideClass, setOverrideClass] = useState<Classification>('other-recordable');
  const [reason, setReason] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>(incident.review.answers ?? {});

  const answered = !!incident.review.answers;
  const allAnswered = d.openQuestions.every((_, qi) => answers[qi]?.trim());

  return (
    <motion.div
      className="rounded-[var(--radius-lg)] border bg-[var(--card)] overflow-hidden"
      style={{ borderColor: 'var(--border)', borderLeft: `3px solid ${style.text}` }}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="text-sm font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                {incident.employeeName}
              </h4>
              <span className="text-[11px] text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>
                {incident.id}
              </span>
            </div>
            <p className="text-xs text-[var(--ink-muted)]">
              {[incident.jobTitle, incident.location, incident.date].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {d.classification && (
              <span className="text-[11px] text-[var(--ink-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
                Col {CLASSIFICATION_COLUMNS[d.classification]}: {CLASSIFICATION_LABELS[d.classification]}
              </span>
            )}
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: style.text, backgroundColor: style.bg }}>
              {OUTCOME_LABELS[d.outcome]}
            </span>
          </div>
        </div>

        {incident.severeAlert && !incident.severeAlert.reportedAt && (
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--alert)' }}>
            Severe injury ({SEVERE_EVENT_LABELS[incident.severeAlert.event]}): report to OSHA separately. See the dashboard alert.
          </p>
        )}

        <p className="text-sm text-[var(--ink)] leading-relaxed">{d.reason}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {d.citations.map((c) => (
            <span
              key={c}
              className="text-[11px] px-2 py-0.5 rounded-[var(--radius-sm,4px)] border border-[var(--border)] text-[var(--ink-muted)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              29 CFR {c}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {incident.facts.map((f) => (
            <div key={f.key} className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink-faint)]">{f.label}</span>
                {f.confidence === 'low' && (
                  <span className="text-[10px] font-medium px-1.5 rounded-full" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)' }}>
                    Check this
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--ink)]">{f.value ?? <span className="text-[var(--ink-faint)]">Not mentioned</span>}</p>
              {f.source && <p className="text-[11px] text-[var(--ink-faint)] italic truncate">&ldquo;{f.source}&rdquo;</p>}
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowNote(!showNote)}
          className="mt-4 text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)]"
        >
          {showNote ? 'Hide' : 'Show'} original note from {incident.submittedBy}
        </button>
        <AnimatePresence>
          {showNote && (
            <motion.p
              className="mt-2 text-sm text-[var(--ink-muted)] p-3 rounded-[var(--radius-md)] bg-[var(--card-hover)] leading-relaxed"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {incident.rawText}
            </motion.p>
          )}
        </AnimatePresence>

        {d.outcome === 'needs-info' && (
          <div className="mt-5 p-4 rounded-[var(--radius-md)]" style={{ backgroundColor: 'var(--accent-subtle)' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--accent)' }}>
              The engine needs these answers before it can decide
            </p>
            <div className="space-y-3">
              {d.openQuestions.map((q, qi) => (
                <div key={qi}>
                  <label htmlFor={`q-${incident.id}-${qi}`} className="block text-xs text-[var(--ink)] mb-1">{q}</label>
                  <input
                    id={`q-${incident.id}-${qi}`}
                    className="input-field"
                    value={answers[qi] ?? ''}
                    disabled={answered}
                    onChange={(e) => setAnswers({ ...answers, [qi]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            {answered ? (
              <p className="text-xs text-[var(--ink-muted)] mt-3">
                Answers saved. The rules engine re-runs on them once the backend is connected. You can still override below.
              </p>
            ) : (
              <button
                disabled={!allAnswered}
                onClick={() => answerQuestions(incident.id, answers)}
                className="mt-3 px-3 py-1.5 text-xs font-medium text-[var(--on-accent)] rounded-[var(--radius-md)] disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Send answers to engine
              </button>
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--card-hover)]">
        <AnimatePresence mode="wait">
          {!showOverride ? (
            <motion.div key="actions" className="flex flex-wrap items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {d.outcome !== 'needs-info' && (
                <motion.button
                  onClick={() => acceptDetermination(incident.id)}
                  className="px-4 py-2 text-xs font-medium text-[var(--on-engine)] rounded-[var(--radius-md)]"
                  style={{ backgroundColor: 'var(--engine)' }}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Accept: {OUTCOME_LABELS[d.outcome]}
                </motion.button>
              )}
              <motion.button
                onClick={() => setShowOverride(true)}
                className="px-4 py-2 text-xs font-medium text-[var(--ink-muted)] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)]"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
              >
                Override
              </motion.button>
              <span className="text-[11px] text-[var(--ink-faint)] ml-auto" style={{ fontFamily: 'var(--font-mono)' }}>
                engine {d.engineVersion}
              </span>
            </motion.div>
          ) : (
            <motion.div key="override" className="space-y-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex flex-wrap gap-2">
                {(['recordable', 'not-recordable'] as const).map((o) => (
                  <button
                    key={o}
                    onClick={() => setOverrideOutcome(o)}
                    className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] border"
                    style={{
                      borderColor: overrideOutcome === o ? OUTCOME_STYLES[o].text : 'var(--border)',
                      color: overrideOutcome === o ? OUTCOME_STYLES[o].text : 'var(--ink-muted)',
                      backgroundColor: overrideOutcome === o ? OUTCOME_STYLES[o].bg : 'var(--card)',
                    }}
                  >
                    {OUTCOME_LABELS[o]}
                  </button>
                ))}
                {overrideOutcome === 'recordable' && (
                  <select
                    aria-label="OSHA 300 column"
                    className="input-field !w-auto"
                    value={overrideClass}
                    onChange={(e) => setOverrideClass(e.target.value as Classification)}
                  >
                    {(Object.keys(CLASSIFICATION_LABELS) as Classification[]).map((c) => (
                      <option key={c} value={c}>
                        Col {CLASSIFICATION_COLUMNS[c]}: {CLASSIFICATION_LABELS[c]}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <textarea
                aria-label="Reason for override"
                className="input-field"
                rows={2}
                placeholder="Reason for override (required, saved to the audit trail)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  disabled={!reason.trim()}
                  onClick={() => overrideDetermination(incident.id, overrideOutcome, overrideOutcome === 'recordable' ? overrideClass : null, reason)}
                  className="px-4 py-2 text-xs font-medium text-[var(--on-accent)] rounded-[var(--radius-md)] disabled:opacity-40"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  Confirm override
                </button>
                <button onClick={() => setShowOverride(false)} className="px-4 py-2 text-xs font-medium text-[var(--ink-muted)]">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
