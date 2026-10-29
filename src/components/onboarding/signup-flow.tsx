'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useMemo } from 'react';
import { CALL_HREF, CornerMarks, Dash, Dimension, EASE, Glyph, LogoMark, Pill } from '@/components/landing/parts';

type Industry =
  | 'warehouse'
  | 'manufacturing'
  | 'food'
  | 'construction'
  | 'electrical'
  | 'trucking'
  | 'roofing'
  | 'other';

interface IndustryOption {
  id: Industry;
  label: string;
  tag: string;
  desc: string;
}

const INDUSTRIES: IndustryOption[] = [
  { id: 'warehouse', tag: 'WH', label: 'Warehouse / Logistics', desc: 'Distribution, fulfillment, 3PL' },
  { id: 'manufacturing', tag: 'MF', label: 'Manufacturing', desc: 'Fabrication, assembly, production' },
  { id: 'food', tag: 'FP', label: 'Food Processing', desc: 'Meat, dairy, bakery, beverage' },
  { id: 'construction', tag: 'GC', label: 'Construction', desc: 'General, commercial, residential' },
  { id: 'electrical', tag: 'EL', label: 'Electrical / HVAC', desc: 'Electricians, HVAC, plumbing' },
  { id: 'trucking', tag: 'TK', label: 'Trucking / Fleet', desc: 'Freight, delivery, fleet ops' },
  { id: 'roofing', tag: 'RF', label: 'Roofing', desc: 'Commercial, residential roofing' },
  { id: 'other', tag: 'OT', label: 'Other Industry', desc: 'Tell us about your operation' },
];

interface TechQuestion {
  id: string;
  question: string;
  options: string[];
  industries: Industry[];
}

const TECH_QUESTIONS: TechQuestion[] = [
  {
    id: 'cameras_full',
    question: 'Do your facilities have security or safety cameras?',
    options: ['Yes, full coverage', 'Partial coverage', 'No cameras'],
    industries: ['warehouse', 'manufacturing', 'food', 'trucking'],
  },
  {
    id: 'cameras_yard',
    question: 'Do you have cameras on your yards or job sites?',
    options: ['Yes, yard/site cameras', 'Some areas only', 'No cameras'],
    industries: ['construction', 'roofing', 'electrical', 'other'],
  },
  {
    id: 'devices_floor',
    question: 'Do workers use company-issued scanners or tablets on the floor?',
    options: ['Yes, scanners/tablets', 'Some areas', 'No floor devices'],
    industries: ['warehouse', 'manufacturing', 'food'],
  },
  {
    id: 'devices_field',
    question: 'Do field technicians carry company phones?',
    options: ['Company phones', 'BYOD (personal phones)', 'No phones issued'],
    industries: ['electrical', 'trucking'],
  },
  {
    id: 'devices_general',
    question: 'What devices do your crews use in the field?',
    options: ['Company phones', 'BYOD / personal phones', 'Radios only', 'None'],
    industries: ['construction', 'roofing', 'other'],
  },
  {
    id: 'radios',
    question: 'Do your teams use two-way radios?',
    options: ['Yes, primary comms', 'Some crews', 'No'],
    industries: ['manufacturing', 'food', 'construction'],
  },
  {
    id: 'fleet_gps',
    question: 'Do your vehicles have GPS tracking or ELD?',
    options: ['Yes, GPS + ELD', 'GPS only', 'No fleet tracking'],
    industries: ['trucking', 'electrical', 'construction', 'roofing'],
  },
  {
    id: 'wearables',
    question: 'Do workers use safety wearables (gas monitors, fall detection, smart hard hats)?',
    options: ['Yes', 'Some crews', 'No'],
    industries: ['manufacturing', 'construction', 'roofing'],
  },
];

interface FixedQuestion {
  id: string;
  question: string;
  options: string[];
  subtitle: string;
}

const FIXED_QUESTIONS: FixedQuestion[] = [
  {
    id: 'employees',
    question: 'How many employees at this site?',
    subtitle: 'Determines your OSHA reporting requirements.',
    options: ['1 to 19', '20 to 99', '100 to 249', '250 to 500', 'More than 500'],
  },
  {
    id: 'current_system',
    question: 'How do you track injuries today?',
    subtitle: 'So we can migrate your existing records.',
    options: ['Paper forms and binders', 'Spreadsheets (Excel, Google Sheets)', 'EHS software (VelocityEHS, Cority, etc.)', 'We don\'t really track yet'],
  },
  {
    id: 'pain_point',
    question: 'What\'s your biggest compliance headache?',
    subtitle: 'We prioritize what matters most to you.',
    options: [
      'Deciding if injuries are recordable',
      'Filling out OSHA forms correctly',
      'Hitting the ITA March 2 deadline',
      'Being ready for an OSHA audit',
      'Keeping injury rates (DART/TRIR) low',
    ],
  },
  {
    id: 'sites',
    question: 'How many work sites do you manage?',
    subtitle: 'Helps us set up your log structure.',
    options: ['1 site', '2 to 5 sites', '6 to 10 sites', 'More than 10 sites'],
  },
  {
    id: 'timeline',
    question: 'How soon do you need this running?',
    subtitle: 'We\'ll match your timeline.',
    options: ['Immediately - we have a gap right now', 'Within a month', 'Just exploring options'],
  },
];

interface SolutionItem {
  label: string;
  desc: string;
  detail: string;
}

function getIncidentCapture(answers: Record<string, string>): SolutionItem {
  if (answers.devices_floor === 'Yes, scanners/tablets') {
    return { label: 'Web Kiosk Mode', desc: 'QR codes at work zones, shared tablet entry, works offline', detail: 'Workers scan a QR code at their station and fill out the incident form on a shared tablet. Reports sync automatically when the device reconnects.' };
  }
  if (answers.devices_field === 'Company phones' || answers.devices_general === 'Company phones') {
    return { label: 'Native App', desc: 'Push notifications, offline mode, biometric lock on company devices', detail: 'Your team gets push alerts when an incident needs attention. Reports are filed directly from the field, even without cell service.' };
  }
  if (answers.devices_field === 'BYOD (personal phones)' || answers.devices_general === 'BYOD / personal phones') {
    return { label: 'Progressive Web App', desc: 'No app install needed, QR link to report, works on any phone', detail: 'Workers open a link on their personal phone and file a report in under two minutes. No downloads, no logins, no friction.' };
  }
  if (answers.radios === 'Yes, primary comms' || answers.devices_general === 'Radios only') {
    return { label: 'Voice-First Capture', desc: 'Voice memo over radio, transcribed by AI, pre-filled incident form', detail: 'A worker describes the incident over radio. AI transcribes the report and pre-fills the form so the safety manager only reviews and submits.' };
  }
  return { label: 'Simple Web Form', desc: 'Browser-based reporting from any device with a printed confirmation', detail: 'Open it in any browser, fill out the details, and get a printed confirmation. Simple enough for anyone on your team to use on day one.' };
}

function getConnectedData(answers: Record<string, string>): SolutionItem[] {
  const results: SolutionItem[] = [];
  if (answers.cameras_full === 'Yes, full coverage') {
    results.push({ label: 'Camera Clip (Automatic)', desc: 'Footage is automatically attached to each incident report', detail: 'When an incident is filed, Foremen pulls the matching camera footage by timestamp and location, so your safety manager has video evidence ready without searching.' });
  } else if (answers.cameras_full === 'Partial coverage') {
    results.push({ label: 'Camera Clip (Manual)', desc: 'Timestamped clip request for covered areas', detail: 'Foremen sends a timestamped request to your camera system so your team can pull the right footage without scrubbing through hours of video.' });
  } else if (answers.cameras_yard === 'Yes, yard/site cameras') {
    results.push({ label: 'Camera Reference', desc: 'Yard camera reference note on each incident', detail: 'Each incident report includes the nearest camera ID and timestamp so your team knows exactly where to look for footage.' });
  }
  if (answers.fleet_gps === 'Yes, GPS + ELD') {
    results.push({ label: 'ELD Integration', desc: 'Automatically pulls driver, vehicle, GPS, and hours-of-service data', detail: 'When a driver files a report, Foremen fills in the vehicle, location, and hours-of-service from your ELD system. No manual data entry needed.' });
  } else if (answers.fleet_gps === 'GPS only') {
    results.push({ label: 'GPS and Vehicle ID', desc: 'Location and vehicle data included on each incident', detail: 'Foremen tags every incident with GPS coordinates and the assigned vehicle, giving your team location context without extra steps.' });
  }
  if (answers.wearables === 'Yes') {
    results.push({ label: 'Wearable Auto-Trigger', desc: 'Fall detection or gas exposure opens a pre-filled form', detail: 'When a wearable detects a fall or gas exposure, Foremen automatically opens a pre-filled incident form so the response starts before anyone has to type.' });
  }
  return results;
}

function getMigrationPath(answers: Record<string, string>): SolutionItem {
  const sys = answers.current_system;
  if (sys === 'Paper forms and binders') return { label: 'Paper Digitization', desc: 'Scan or photograph existing binders, and our AI imports every field', detail: 'Take a photo of your paper logs and Foremen reads the handwriting, extracts the data, and builds your digital 300 Log. Years of records migrated in hours, not weeks.' };
  if (sys === 'Spreadsheets (Excel, Google Sheets)') return { label: 'Spreadsheet Import', desc: 'Column mapping wizard that preserves your injury rate history', detail: 'Upload your spreadsheet and Foremen maps each column to the right fields. Your historical injury rates carry over so your trends stay unbroken.' };
  if (sys === 'EHS software (VelocityEHS, Cority, etc.)') return { label: 'EHS Complement Mode', desc: 'Runs alongside your current platform with compatible data exports', detail: 'Foremen works next to your existing EHS software. It handles the recordability decision and OSHA forms while your main platform stays in place.' };
  return { label: 'Zero-to-Compliant Setup', desc: 'Full setup in one guided session with no prior data needed', detail: 'Starting fresh is actually the easiest path. One guided session gets you from zero to a fully compliant recordkeeping system.' };
}

function getFirstPriority(answers: Record<string, string>): SolutionItem {
  const pain = answers.pain_point;
  if (pain === 'Deciding if injuries are recordable') return { label: 'Decision Engine', desc: 'Every regulation encoded into plain-English verdicts with citations', detail: 'Foremen reads the incident details, applies the 29 CFR 1904 rules, and tells your safety manager whether the case is recordable, with the exact regulation it relied on.' };
  if (pain === 'Filling out OSHA forms correctly') return { label: 'Form Automation', desc: 'Forms 300, 301, and 300A generated automatically from signed-off incidents', detail: 'Once your safety manager signs off on a case, Foremen fills the 300 Log entry, the 301 form, and updates the 300A summary. No manual transcription.' };
  if (pain === 'Hitting the ITA March 2 deadline') return { label: 'ITA Sprint', desc: 'Automated file builder with countdown alerts and validation', detail: 'Foremen builds your ITA submission file, sends alerts at 60, 30, and 7 days before the deadline, and validates the file against the ITA portal before you submit.' };
  if (pain === 'Being ready for an OSHA audit') return { label: 'Audit Shield', desc: 'Complete decision log with a ready-to-go documentation package', detail: 'Every recordability decision is logged with the reasoning and regulation. If OSHA shows up, Foremen assembles your full documentation package in under four hours.' };
  return { label: 'Score Protection', desc: 'Injury rate dashboard with first-aid optimization and insurance cost tracking', detail: 'Foremen watches your injury rates in real time, flags cases that might be reclassified, and shows you exactly how each decision affects your insurance costs.' };
}

function getOshaCoverage(answers: Record<string, string>): SolutionItem {
  const emp = answers.employees;
  if (emp === '100 to 249' || emp === '250 to 500' || emp === 'More than 500') {
    return { label: 'Full ITA Reporting', desc: 'Complete 300 Log, 301 forms, 300A summary, and full case-level ITA upload before March 2', detail: 'Your site size requires full case-level electronic reporting. Foremen handles the entire ITA submission, validates every field, and confirms receipt so nothing slips through.' };
  }
  if (emp === '20 to 99') {
    return { label: 'ITA Summary Reporting', desc: 'Complete 300 Log, 301 forms, 300A summary, and ITA 300A upload before March 2', detail: 'Your site needs the 300A summary submission to OSHA each year. Foremen calculates your annual summary, builds the file, and walks you through the upload.' };
  }
  return { label: 'Standard Recordkeeping', desc: 'Complete 300 Log, 301 forms, 300A summary, and immediate severe-injury reporting', detail: 'You maintain logs on-site and report severe injuries within 24 hours. Foremen keeps your logs current and alerts you the moment a case triggers the reporting requirement.' };
}

interface SignupFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

export function SignupFlow({ onComplete, onBack }: SignupFlowProps) {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentTechIdx, setCurrentTechIdx] = useState(0);
  const [currentFixedIdx, setCurrentFixedIdx] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '', message: '' });

  const techQs = useMemo(() => {
    if (!industry) return [];
    return TECH_QUESTIONS.filter((q) => q.industries.includes(industry));
  }, [industry]);

  const totalSteps = useMemo(() => {
    if (!industry) return 6;
    return 1 + TECH_QUESTIONS.filter((q) => q.industries.includes(industry)).length + FIXED_QUESTIONS.length + 3;
  }, [industry]);

  const currentStepNumber = useMemo(() => {
    if (step === 0) return 1;
    if (step === 1) return 2 + currentTechIdx;
    if (step === 2) return 2 + techQs.length + currentFixedIdx;
    if (step === 3) return totalSteps - 2;
    if (step === 4) return totalSteps - 1;
    return totalSteps;
  }, [step, currentTechIdx, currentFixedIdx, techQs.length, totalSteps]);

  const handleIndustrySelect = (id: Industry) => {
    setIndustry(id);
    setCurrentTechIdx(0);
    setStep(1);
  };

  const handleTechAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (currentTechIdx < techQs.length - 1) {
      setCurrentTechIdx((i) => i + 1);
    } else {
      setCurrentFixedIdx(0);
      setStep(2);
    }
  };

  const handleFixedAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (currentFixedIdx < FIXED_QUESTIONS.length - 1) {
      setCurrentFixedIdx((i) => i + 1);
    } else {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      onBack();
    } else if (step === 1) {
      if (currentTechIdx > 0) setCurrentTechIdx((i) => i - 1);
      else { setStep(0); setIndustry(null); }
    } else if (step === 2) {
      if (currentFixedIdx > 0) setCurrentFixedIdx((i) => i - 1);
      else { setCurrentTechIdx(techQs.length - 1); setStep(1); }
    } else if (step === 3) {
      setCurrentFixedIdx(FIXED_QUESTIONS.length - 1);
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    } else {
      setStep(4);
    }
  };

  const solution = useMemo(() => {
    if (step < 3 || !industry) return null;
    return {
      capture: getIncidentCapture(answers),
      data: getConnectedData(answers),
      migration: getMigrationPath(answers),
      priority: getFirstPriority(answers),
      coverage: getOshaCoverage(answers),
    };
  }, [step, industry, answers]);

  const industryLabel = INDUSTRIES.find((i) => i.id === industry)?.label || '';

  return (
    <div className="lp min-h-screen w-full">
      <div className="lp-grid min-h-screen relative">
        {/* progress */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-[var(--lp-panel-2)]">
          <motion.div
            className="h-full"
            style={{ background: 'var(--lp-yellow)' }}
            animate={{ width: `${(currentStepNumber / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* top bar */}
        <header className="fixed top-1.5 left-0 right-0 z-40 h-16 flex items-center justify-between px-4 lg:px-10 bg-[var(--lp-bg)]/85 backdrop-blur-md border-b border-[var(--lp-line)]/70">
          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="flex items-center gap-3 no-underline text-[var(--lp-ink)]">
            <LogoMark size={30} />
            <span className="lp-display font-bold text-lg tracking-tight">FOREMAN</span>
          </a>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="lp-display flex items-center gap-2 text-sm font-semibold text-[var(--lp-ink-2)] hover:text-[var(--lp-ink)] bg-transparent border-none cursor-pointer py-2"
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M15 10H5M9 6l-4 4 4 4" />
              </svg>
              Back
            </button>
            <span className="lp-mono text-[11px] tracking-[0.2em] text-[var(--lp-ink-3)]">
              {String(currentStepNumber).padStart(2, '0')}/{String(totalSteps).padStart(2, '0')}
            </span>
          </div>
        </header>

        {/* content */}
        <div className="max-w-3xl mx-auto px-4 lg:px-10 pt-28 pb-16 w-full">
          <AnimatePresence mode="wait">
            {/* STEP 0: industry */}
            {step === 0 && (
              <motion.div
                key="industry"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <p className="lp-mono flex items-center gap-2 text-[11px] tracking-[0.25em] text-[var(--lp-ink-2)] mb-4">
                  <Glyph />
                  {'// SETUP: SELECT INDUSTRY'}
                </p>
                <Dimension className="mb-8">Step 01 of {String(totalSteps).padStart(2, '0')}</Dimension>

                <h2 className="lp-display text-4xl lg:text-5xl font-bold tracking-tighter mb-3">
                  What industry are you in?
                </h2>
                <p className="text-base text-[var(--lp-ink-2)] mb-10 leading-relaxed">
                  We tailor your setup based on your operation and the tech you already have.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INDUSTRIES.map((ind, i) => (
                    <motion.button
                      key={ind.id}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, ease: EASE }}
                      onClick={() => handleIndustrySelect(ind.id)}
                      className="group relative flex items-center gap-4 p-4 bg-[var(--lp-panel)] border border-[var(--lp-line)] hover:bg-[var(--lp-panel-2)] transition-colors cursor-pointer text-left"
                    >
                      <CornerMarks />
                      <span className="lp-mono text-[11px] tracking-widest text-[var(--lp-ink-3)] bg-[var(--lp-dark)] text-white px-2 py-1 shrink-0">{ind.tag}</span>
                      <div>
                        <span className="lp-display text-sm font-bold text-[var(--lp-ink)] group-hover:text-[var(--lp-ink)] block">{ind.label}</span>
                        <span className="text-xs text-[var(--lp-ink-3)]">{ind.desc}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1: tech questions */}
            {step === 1 && techQs[currentTechIdx] && (
              <motion.div
                key={`tech-${techQs[currentTechIdx].id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <p className="lp-mono flex items-center gap-2 text-[11px] tracking-[0.25em] text-[var(--lp-ink-2)] mb-4">
                  <Glyph />
                  {'// SETUP: YOUR TECH STACK'}
                </p>
                <Dimension className="mb-8">Tech question {currentTechIdx + 1} of {techQs.length}</Dimension>

                <h2 className="lp-display text-3xl lg:text-4xl font-bold tracking-tighter mb-3">
                  {techQs[currentTechIdx].question}
                </h2>
                <p className="text-base text-[var(--lp-ink-2)] mb-10 leading-relaxed">
                  This helps us connect your existing systems to the incident workflow.
                </p>

                <div className="space-y-2">
                  {techQs[currentTechIdx].options.map((opt, i) => (
                    <OptionButton
                      key={opt}
                      label={opt}
                      index={i}
                      selected={answers[techQs[currentTechIdx].id] === opt}
                      onClick={() => handleTechAnswer(techQs[currentTechIdx].id, opt)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: fixed questions */}
            {step === 2 && FIXED_QUESTIONS[currentFixedIdx] && (
              <motion.div
                key={`fixed-${FIXED_QUESTIONS[currentFixedIdx].id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <p className="lp-mono flex items-center gap-2 text-[11px] tracking-[0.25em] text-[var(--lp-ink-2)] mb-4">
                  <Glyph />
                  {'// SETUP: YOUR OPERATION'}
                </p>
                <Dimension className="mb-8">Operation question {currentFixedIdx + 1} of {FIXED_QUESTIONS.length}</Dimension>

                <h2 className="lp-display text-3xl lg:text-4xl font-bold tracking-tighter mb-3">
                  {FIXED_QUESTIONS[currentFixedIdx].question}
                </h2>
                <p className="text-base text-[var(--lp-ink-2)] mb-10 leading-relaxed">
                  {FIXED_QUESTIONS[currentFixedIdx].subtitle}
                </p>

                <div className="space-y-2">
                  {FIXED_QUESTIONS[currentFixedIdx].options.map((opt, i) => (
                    <OptionButton
                      key={opt}
                      label={opt}
                      index={i}
                      selected={answers[FIXED_QUESTIONS[currentFixedIdx].id] === opt}
                      onClick={() => handleFixedAnswer(FIXED_QUESTIONS[currentFixedIdx].id, opt)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: solution summary */}
            {step === 3 && solution && (
              <motion.div
                key="solution"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className="lp-mono flex items-center gap-2 text-[11px] tracking-[0.25em] text-[var(--lp-ink-2)] mb-4">
                  <Glyph />
                  {'// SETUP COMPLETE'}
                </p>
                <Dimension className="mb-8">Your custom configuration</Dimension>

                <h2 className="lp-display text-3xl lg:text-4xl font-bold tracking-tighter mb-2">
                  Built for your {industryLabel.toLowerCase()} operation.
                </h2>
                <p className="text-base text-[var(--lp-ink-2)] mb-10 leading-relaxed">
                  Based on your answers, here is your Foreman configuration.
                </p>

                <div className="space-y-3 mb-10">
                  <SolutionCard tag="01" category="INCIDENT CAPTURE" label={solution.capture.label} desc={solution.capture.desc} detail={solution.capture.detail} delay={0} />

                  {solution.data.map((d, i) => (
                    <SolutionCard
                      key={d.label}
                      tag={String(2 + i).padStart(2, '0')}
                      category={i === 0 ? 'CONNECTED DATA' : ''}
                      label={d.label}
                      desc={d.desc}
                      detail={d.detail}
                      delay={0.08 * (i + 1)}
                    />
                  ))}

                  <SolutionCard
                    tag={String(2 + solution.data.length).padStart(2, '0')}
                    category="MIGRATION PATH"
                    label={solution.migration.label}
                    desc={solution.migration.desc}
                    detail={solution.migration.detail}
                    delay={0.08 * (solution.data.length + 1)}
                  />

                  <SolutionCard
                    tag={String(3 + solution.data.length).padStart(2, '0')}
                    category="FIRST PRIORITY"
                    label={solution.priority.label}
                    desc={solution.priority.desc}
                    detail={solution.priority.detail}
                    delay={0.08 * (solution.data.length + 2)}
                  />

                  <SolutionCard
                    tag={String(4 + solution.data.length).padStart(2, '0')}
                    category="OSHA COVERAGE"
                    label={solution.coverage.label}
                    desc={solution.coverage.desc}
                    detail={solution.coverage.detail}
                    delay={0.08 * (solution.data.length + 3)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <Pill variant="yellow" onClick={() => setStep(4)}>Get a Quote</Pill>
                  <Pill
                    variant="dark"
                    onClick={() => {
                      setStep(0);
                      setIndustry(null);
                      setAnswers({});
                      setCurrentTechIdx(0);
                      setCurrentFixedIdx(0);
                      setContactForm({ name: '', email: '', company: '', message: '' });
                    }}
                  >
                    Start Over
                  </Pill>
                </div>
              </motion.div>
            )}

            {/* STEP 4: contact form */}
            {step === 4 && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <p className="lp-mono flex items-center gap-2 text-[11px] tracking-[0.25em] text-[var(--lp-ink-2)] mb-4">
                  <Glyph />
                  {'// GET A QUOTE'}
                </p>
                <Dimension className="mb-8">Tell us about your company</Dimension>

                <h2 className="lp-display text-3xl lg:text-4xl font-bold tracking-tighter mb-3">
                  How should we reach you?
                </h2>
                <p className="text-base text-[var(--lp-ink-2)] mb-10 leading-relaxed">
                  We will put together a custom quote for your {industryLabel.toLowerCase()} operation and get back to you within 24 hours.
                </p>

                <form
                  onSubmit={(e) => { e.preventDefault(); setStep(5); }}
                  className="space-y-5 max-w-lg"
                >
                  {([
                    { id: 'cf-name', label: 'Name', type: 'text', field: 'name' as const, ph: 'Your full name', required: true },
                    { id: 'cf-email', label: 'Business Email', type: 'email', field: 'email' as const, ph: 'you@company.com', required: true },
                    { id: 'cf-company', label: 'Company', type: 'text', field: 'company' as const, ph: 'Company name', required: true },
                  ] as const).map((f, i) => (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, ease: EASE }}
                      className="flex items-stretch"
                    >
                      <label htmlFor={f.id} className="lp-display w-36 shrink-0 text-xs font-bold tracking-wider uppercase flex items-center border-r-2 border-[var(--lp-ink)] mr-3">
                        {f.label}.
                      </label>
                      <input
                        id={f.id}
                        type={f.type}
                        required={f.required}
                        value={contactForm[f.field]}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, [f.field]: e.target.value }))}
                        placeholder={f.ph}
                        className="flex-1 min-w-0 bg-transparent border-0 border-b-2 border-[var(--lp-ink-3)] px-1 py-2 text-base focus:border-[var(--lp-ink)] placeholder:text-[var(--lp-ink-3)] outline-none"
                      />
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18, ease: EASE }}
                    className="flex items-start"
                  >
                    <label htmlFor="cf-message" className="lp-display w-36 shrink-0 text-xs font-bold tracking-wider uppercase flex items-start pt-2 border-r-2 border-[var(--lp-ink)] mr-3">
                      Message.
                    </label>
                    <textarea
                      id="cf-message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Anything we should know? (optional)"
                      className="flex-1 min-w-0 bg-transparent border-0 border-b-2 border-[var(--lp-ink-3)] px-1 py-2 text-base focus:border-[var(--lp-ink)] placeholder:text-[var(--lp-ink-3)] outline-none resize-none"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, ease: EASE }}
                    className="flex flex-wrap items-center gap-5 pt-4"
                  >
                    <button
                      type="submit"
                      className="lp-display inline-flex items-center gap-3 text-sm font-bold tracking-wider px-8 py-3.5 border-none cursor-pointer bg-[var(--lp-yellow)] text-[var(--lp-ink)] hover:brightness-95"
                    >
                      Send Quote Request
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {/* STEP 5: thank you */}
            {step === 5 && (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="text-center max-w-lg mx-auto"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
                  className="w-20 h-20 mx-auto mb-8 bg-[var(--lp-yellow)] flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--lp-ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </motion.div>

                <p className="lp-mono flex items-center justify-center gap-2 text-[11px] tracking-[0.25em] text-[var(--lp-ink-2)] mb-4">
                  <Glyph />
                  {'// REQUEST RECEIVED'}
                </p>

                <h2 className="lp-display text-3xl lg:text-4xl font-bold tracking-tighter mb-3">
                  We got your request.
                </h2>
                <p className="text-base text-[var(--lp-ink-2)] mb-10 leading-relaxed">
                  Our team will review your {industryLabel.toLowerCase()} configuration and send a custom quote to <strong>{contactForm.email}</strong> within 24 hours.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                  <Pill variant="yellow" href={CALL_HREF}>Book a Call</Pill>
                  <Pill variant="dark" onClick={onBack}>Back to Home</Pill>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function OptionButton({ label, index, selected, onClick }: { label: string; index: number; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, ease: EASE }}
      onClick={onClick}
      className={`group relative w-full flex items-center gap-4 p-4 border transition-colors cursor-pointer text-left ${
        selected
          ? 'border-[var(--lp-ink)] bg-[var(--lp-panel-2)]'
          : 'border-[var(--lp-line)] bg-[var(--lp-panel)] hover:bg-[var(--lp-panel-2)]'
      }`}
    >
      <span
        className="w-5 h-5 border-2 shrink-0 flex items-center justify-center transition-colors"
        style={{
          borderColor: selected ? 'var(--lp-ink)' : 'var(--lp-line)',
          background: selected ? 'var(--lp-ink)' : 'transparent',
        }}
      >
        {selected && (
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M2 6l3 3 5-5" />
          </svg>
        )}
      </span>
      <span className="text-sm text-[var(--lp-ink)] leading-snug">{label}</span>
      {selected && <Dash className="absolute left-0 top-1/2 -translate-y-1/2" />}
    </motion.button>
  );
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'INCIDENT CAPTURE': (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--lp-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  ),
  'CONNECTED DATA': (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--lp-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M7.5 7.5L11 16M16.5 7.5L13 16M8 6h8" />
    </svg>
  ),
  'MIGRATION PATH': (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--lp-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17V7a2 2 0 012-2h8l4 4v8a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
      <path d="M14 5v4h4" />
      <path d="M8 13h8M11 10l-3 3 3 3" />
    </svg>
  ),
  'FIRST PRIORITY': (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--lp-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 7v5c0 5.25 3.4 10.2 8 11 4.6-.8 8-5.75 8-11V7l-8-5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  'OSHA COVERAGE': (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--lp-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 4v16" />
      <path d="M13 14h4M13 17h3" />
    </svg>
  ),
};

function SolutionCardIcon({ category }: { category: string }) {
  const icon = CATEGORY_ICONS[category];
  if (!icon) return null;
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="w-10 h-10 shrink-0 flex items-center justify-center bg-[var(--lp-yellow)]/20 border border-[var(--lp-yellow)]"
    >
      {icon}
    </motion.div>
  );
}

function SolutionCard({ tag, category, label, desc, detail, delay }: { tag: string; category: string; label: string; desc: string; detail: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-start gap-4 p-5 bg-[var(--lp-panel)] border border-[var(--lp-line)] cursor-pointer transition-colors hover:bg-[var(--lp-panel-2)] hover:border-[var(--lp-ink-3)]"
    >
      <CornerMarks />
      <span className="lp-mono text-[11px] tracking-widest text-[var(--lp-ink-3)] shrink-0 pt-0.5">{tag}</span>
      {category && <SolutionCardIcon category={category} />}
      <div className="flex-1 min-w-0">
        {category && (
          <span className="lp-mono text-[10px] tracking-[0.2em] text-[var(--lp-ink-3)] block mb-1">{category}</span>
        )}
        <span className="lp-display text-sm font-bold text-[var(--lp-ink)] block mb-1">{label}</span>
        <span className="text-xs text-[var(--lp-ink-2)] leading-relaxed">{desc}</span>
        <motion.div
          initial={false}
          animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="overflow-hidden"
        >
          <div className="mt-3 pt-3 border-t border-[var(--lp-line)]">
            <p className="text-xs text-[var(--lp-ink-2)] leading-relaxed m-0">{detail}</p>
          </div>
        </motion.div>
      </div>
      <motion.div
        animate={{ y: hovered ? 2 : 0, opacity: hovered ? 1 : 0.3 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="shrink-0 pt-1"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="var(--lp-ink-3)" strokeWidth="1.5" strokeLinecap="round">
          <path d={hovered ? 'M4 6l4 4 4-4' : 'M4 8h8'} />
        </svg>
      </motion.div>
    </motion.div>
  );
}
