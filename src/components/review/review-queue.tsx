'use client';

import { useState, useEffect } from 'react';
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

  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (pending.length > 0) {
      setShowBanner(true);
      const t = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(t);
    }
  }, [pending.length]);

  return (
    <div className="space-y-5 max-w-4xl">
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--accent)]/30"
            style={{ backgroundColor: 'var(--accent-subtle)' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0, padding: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4M10 13h.01" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-[var(--ink)] m-0" style={{ fontFamily: 'var(--font-display)' }}>
                {pending.length} case{pending.length !== 1 ? 's' : ''} waiting for your review
              </p>
              <p className="text-xs text-[var(--ink-muted)] m-0 mt-1">
                Foreman classified these cases. Check each determination and sign off. Nothing goes on the 300 Log until you do.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      style={{ borderColor: 'var(--border)', borderLeft: `4px solid ${style.text}` }}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      {/* Card header */}
      <div className="px-6 pt-5 pb-4 border-b border-[var(--border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold" style={{ backgroundColor: style.bg, color: style.text }}>
              {incident.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h4 className="text-base font-bold text-[var(--ink)] m-0" style={{ fontFamily: 'var(--font-display)' }}>
                {incident.employeeName}
              </h4>
              <p className="text-xs text-[var(--ink-muted)] m-0 mt-0.5">
                {incident.jobTitle} &middot; {incident.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>
              {incident.caseNumber ?? incident.id}
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ color: style.text, backgroundColor: style.bg }}>
              {OUTCOME_LABELS[d.outcome]}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Severe injury alert */}
        {incident.severeAlert && !incident.severeAlert.reportedAt && (
          <div className="flex items-start gap-2 p-3 rounded-[var(--radius-md)] mb-4" style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
            <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--alert)' }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 1.5L1 14h14L8 1.5zM8 6v4M8 12h.01" />
            </svg>
            <p className="text-sm font-medium m-0" style={{ color: 'var(--alert)' }}>
              Severe injury ({SEVERE_EVENT_LABELS[incident.severeAlert.event]}): report to OSHA within 24 hours.
            </p>
          </div>
        )}

        {/* Engine reasoning */}
        <div className="p-4 rounded-[var(--radius-md)] mb-5" style={{ backgroundColor: 'var(--card-hover)' }}>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-[var(--ink-muted)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="6.5" />
              <path d="M8 5v3l2 1" />
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">Engine Analysis</span>
            {d.classification && (
              <span className="text-[11px] text-[var(--ink-faint)] ml-auto" style={{ fontFamily: 'var(--font-mono)' }}>
                Col {CLASSIFICATION_COLUMNS[d.classification]}: {CLASSIFICATION_LABELS[d.classification]}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--ink)] leading-relaxed m-0">{d.reason}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {d.citations.map((c) => (
              <span
                key={c}
                className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--ink-muted)]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                29 CFR {c}
              </span>
            ))}
          </div>
        </div>

        {/* Key facts grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
          {incident.facts.map((f) => (
            <div key={f.key} className="min-w-0 p-3 rounded-[var(--radius-md)] border border-[var(--border)]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)]">{f.label}</span>
                {f.confidence === 'low' && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)' }}>
                    Verify
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-[var(--ink)] m-0">{f.value ?? <span className="text-[var(--ink-faint)] font-normal italic">Not mentioned</span>}</p>
              {f.source && <p className="text-[11px] text-[var(--ink-faint)] italic truncate m-0 mt-1">&ldquo;{f.source}&rdquo;</p>}
            </div>
          ))}
        </div>

        {/* Original note toggle */}
        <button
          onClick={() => setShowNote(!showNote)}
          className="flex items-center gap-2 text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 4h12M2 8h8M2 12h10" />
          </svg>
          {showNote ? 'Hide' : 'View'} original report from {incident.submittedBy}
        </button>
        <AnimatePresence>
          {showNote && (
            <motion.div
              className="mt-3 p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card-hover)]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-faint)] mb-2 m-0">Original Report</p>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed m-0">{incident.rawText}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Needs-info questions */}
        {d.outcome === 'needs-info' && (
          <div className="mt-5 p-4 rounded-[var(--radius-md)] border" style={{ backgroundColor: 'var(--accent-subtle)', borderColor: 'var(--accent)' }}>
            <p className="text-xs font-bold mb-3 m-0" style={{ color: 'var(--accent)' }}>
              Additional information needed before the engine can classify this case
            </p>
            <div className="space-y-3">
              {d.openQuestions.map((q, qi) => (
                <div key={qi}>
                  <label htmlFor={`q-${incident.id}-${qi}`} className="block text-xs font-medium text-[var(--ink)] mb-1">{q}</label>
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
              <p className="text-xs text-[var(--ink-muted)] mt-3 m-0">
                Answers saved. The engine will re-classify once connected. You can still override below.
              </p>
            ) : (
              <button
                disabled={!allAnswered}
                onClick={() => answerQuestions(incident.id, answers)}
                className="mt-3 px-4 py-2 text-xs font-bold text-[var(--on-accent)] rounded-[var(--radius-md)] disabled:opacity-40 border-none cursor-pointer"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Submit answers
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--card-hover)]">
        <AnimatePresence mode="wait">
          {!showOverride ? (
            <motion.div key="actions" className="flex flex-wrap items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {d.outcome !== 'needs-info' && (
                <motion.button
                  onClick={() => acceptDetermination(incident.id)}
                  className="px-5 py-2.5 text-sm font-bold text-[var(--on-engine)] rounded-[var(--radius-md)] border-none cursor-pointer"
                  style={{ backgroundColor: 'var(--engine)' }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Accept: {OUTCOME_LABELS[d.outcome]}
                </motion.button>
              )}
              <motion.button
                onClick={() => setShowOverride(true)}
                className="px-5 py-2.5 text-sm font-medium text-[var(--ink-muted)] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] cursor-pointer"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
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
                    className="px-4 py-2 text-xs font-bold rounded-[var(--radius-md)] border cursor-pointer"
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
                  className="px-5 py-2.5 text-sm font-bold text-[var(--on-accent)] rounded-[var(--radius-md)] disabled:opacity-40 border-none cursor-pointer"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  Confirm override
                </button>
                <button onClick={() => setShowOverride(false)} className="px-4 py-2 text-sm font-medium text-[var(--ink-muted)] bg-transparent border-none cursor-pointer">
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
