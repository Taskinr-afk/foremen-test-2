'use client';

import { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { useAppStore } from '@/lib/stores/app-store';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeIncident, SAMPLE_VOICE_NOTE } from '@/lib/api/mock';
import type { AnalysisResult } from '@/lib/api/mock';
import { OUTCOME_LABELS } from '@/lib/schemas/incident';
import { OUTCOME_STYLES } from '@/lib/osha';

type Step = 'describe' | 'extracting' | 'review' | 'submitted';

export function ReportForm() {
  const { addIncident, incidents } = useAppStore();
  const [step, setStep] = useState<Step>('describe');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmitDescription() {
    if (!inputText.trim()) return;
    setStep('extracting');
    setResult(await analyzeIncident(inputText));
    setStep('review');
  }

  function handleAcceptAndSubmit() {
    if (!result) return;
    const maxId = incidents.reduce((m, i) => Math.max(m, Number(i.id.replace('INC-', '')) || 0), 1000);
    addIncident({
      id: `INC-${maxId + 1}`,
      caseNumber: null,
      employeeName: result.employeeName,
      jobTitle: result.jobTitle,
      date: result.date,
      location: result.location,
      description: result.description,
      bodyPart: result.bodyPart,
      caseType: 'injury',
      daysAway: 0,
      daysRestricted: result.daysRestricted,
      privacyCase: false,
      rawText: inputText,
      facts: result.facts,
      determination: result.determination,
      review: { status: 'pending' },
      severeAlert: result.severeAlert,
      submittedBy: 'Test Manager',
      createdAt: new Date().toISOString(),
    });
    setStep('submitted');
  }

  function handleReset() {
    setStep('describe');
    setInputText('');
    setResult(null);
    setIsRecording(false);
  }

  function toggleRecording() {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputText(SAMPLE_VOICE_NOTE);
      }, 3000);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'describe' && (
          <motion.div
            key="describe"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center mx-auto mb-4">
                <MicIcon className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3
                className="text-lg font-semibold text-[var(--ink)] mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Describe what happened
              </h3>
              <p className="text-sm text-[var(--ink-muted)] max-w-md mx-auto">
                Use your own words. Talk or type like you&apos;re telling a coworker. Foreman pulls out the facts, checks them against OSHA&apos;s rules, and builds the case file.
              </p>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                  placeholder='Example: "Mike slipped on the wet scaffold plank on level 3 and twisted his ankle. Clinic gave him a rigid splint and said no climbing for a week..."'
                  className="w-full p-5 pb-16 text-sm text-[var(--ink)] bg-transparent border-none outline-none resize-none placeholder:text-[var(--ink-faint)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--card)]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleRecording}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-all',
                        isRecording
                          ? 'bg-[var(--alert)] text-[var(--on-alert)]'
                          : 'bg-[var(--accent-subtle)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)]'
                      )}
                      style={{ transitionDuration: 'var(--duration-fast)' }}
                    >
                      {isRecording ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          Recording...
                        </>
                      ) : (
                        <>
                          <MicIcon className="w-3.5 h-3.5" />
                          Voice
                        </>
                      )}
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium bg-[var(--blue-subtle)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-[var(--on-blue)] transition-all"
                      style={{ transitionDuration: 'var(--duration-fast)' }}
                    >
                      <CameraIcon className="w-3.5 h-3.5" />
                      Photos
                    </button>
                  </div>
                  <button
                    onClick={handleSubmitDescription}
                    disabled={!inputText.trim()}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-all',
                      inputText.trim()
                        ? 'bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-hover)]'
                        : 'bg-[var(--border)] text-[var(--ink-faint)] cursor-not-allowed'
                    )}
                    style={{ transitionDuration: 'var(--duration-fast)' }}
                  >
                    <SparklesIcon className="w-3.5 h-3.5" />
                    Extract with AI
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: '1', text: 'You describe it in plain language' },
                { icon: '2', text: 'AI pulls out the facts, with the words each came from' },
                { icon: '3', text: 'OSHA rules decide; the safety manager signs off' },
              ].map((s) => (
                <div key={s.icon} className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--card)] border border-[var(--border)]">
                  <span
                    className="w-5 h-5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    {s.icon}
                  </span>
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'extracting' && (
          <motion.div
            key="extracting"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-center py-20"
          >
            <div className="w-14 h-14 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center mx-auto mb-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <SparklesIcon className="w-6 h-6 text-[var(--accent)]" />
              </motion.div>
            </div>
            <h3 className="text-lg font-semibold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Extracting incident details...
            </h3>
            <p className="text-sm text-[var(--ink-muted)]">
              Reading your description and identifying employee, injuries, treatments, and location
            </p>
            <div className="mt-8 max-w-sm mx-auto space-y-3">
              {['Employee and location', 'Body part and injury', 'Treatment and medication doses', 'Restrictions and days away'].map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4, duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.4 + 0.2, type: 'spring', damping: 12 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-[var(--engine)] flex items-center justify-center">
                      <svg className="w-3 h-3 text-[var(--on-engine)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8l3.5 3.5L13 5" />
                      </svg>
                    </div>
                  </motion.div>
                  <span className="text-sm text-[var(--ink-muted)]">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'review' && result && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                  Review Extracted Details
                </h3>
                <p className="text-sm text-[var(--ink-muted)] mt-1">
                  AI only pulls out facts. It does not decide anything. Fields marked &ldquo;Check this&rdquo; were unclear in your note.
                </p>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--blue-subtle)] text-[var(--blue)] shrink-0">
                Demo mode
              </span>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {result.facts.map((f) => (
                  <FactField key={f.key} label={f.label} value={f.value} source={f.source} lowConfidence={f.confidence === 'low'} />
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--accent-subtle)] p-4">
              <div className="flex items-start gap-3">
                <SparklesIcon className="w-4 h-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[var(--accent)]">What happens next</p>
                  <p className="text-xs text-[var(--ink-muted)] mt-1">
                    The rules engine checks these facts against OSHA 1904.5 through 1904.11. Missing facts become questions, never a &ldquo;not recordable.&rdquo; The safety manager signs off before anything reaches the 300 log.
                  </p>
                  <p className="text-[11px] text-[var(--ink-faint)] mt-2">
                    Demo mode shows a sample result until the backend is connected.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-[var(--ink-muted)] rounded-[var(--radius-md)] border border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors"
                style={{ transitionDuration: 'var(--duration-fast)' }}
              >
                Start Over
              </button>
              <button
                onClick={handleAcceptAndSubmit}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[var(--on-accent)] rounded-[var(--radius-md)] hover:opacity-90 transition-colors"
                style={{ backgroundColor: 'var(--accent)', transitionDuration: 'var(--duration-fast)' }}
              >
                Facts look right, submit
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'submitted' && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.1 }}
              className="w-14 h-14 rounded-full bg-[var(--engine-subtle)] flex items-center justify-center mx-auto mb-4"
            >
              <svg className="w-7 h-7 text-[var(--engine)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </motion.div>
            <h3 className="text-lg font-semibold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Incident Submitted
            </h3>
            {result && (
              <p className="text-sm text-[var(--ink-muted)] mb-2">
                Rules engine result:{' '}
                <span className="font-semibold" style={{ color: OUTCOME_STYLES[result.determination.outcome].text }}>
                  {OUTCOME_LABELS[result.determination.outcome]}
                </span>
              </p>
            )}
            <p className="text-xs text-[var(--ink-faint)] mb-6">
              It is waiting in the Review Queue for the safety manager to sign off.
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-[var(--on-accent)] rounded-[var(--radius-md)] transition-colors"
              style={{ backgroundColor: 'var(--accent)', transitionDuration: 'var(--duration-fast)' }}
            >
              Report Another Incident
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FactField({ label, value, source, lowConfidence }: { label: string; value: string | null; source: string | null; lowConfidence: boolean }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink-faint)]">{label}</span>
        {lowConfidence && (
          <span className="text-[10px] font-medium px-1.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">Check this</span>
        )}
      </div>
      <p className="text-sm font-medium text-[var(--ink)]">{value ?? <span className="text-[var(--ink-faint)] font-normal">Not mentioned</span>}</p>
      {source && <p className="text-[11px] text-[var(--ink-faint)] mt-0.5 italic">&ldquo;{source}&rdquo;</p>}
    </div>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5.5" y="1.5" width="5" height="9" rx="2.5" />
      <path d="M3 7.5a5 5 0 0010 0M8 12.5v2M6 14.5h4" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5.5a1 1 0 011-1h2l1-1.5h4l1 1.5h2a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1v-7z" />
      <circle cx="8" cy="8.5" r="2.5" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0l1.5 4.5L14 6l-4.5 1.5L8 12l-1.5-4.5L2 6l4.5-1.5L8 0z" />
      <path d="M12 8l.75 2.25L15 11l-2.25.75L12 14l-.75-2.25L9 11l2.25-.75L12 8z" opacity="0.6" />
    </svg>
  );
}
