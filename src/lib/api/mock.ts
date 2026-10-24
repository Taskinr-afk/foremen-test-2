import type { Determination, Establishment, Fact, Incident, SevereAlert } from '../schemas/incident';

// Stand-in for the backend (Claude extraction + Part 1904 rules engine). Swap analyzeIncident for the real API call.

export const ENGINE = 'mock-0.1';
export const HOUR = 3_600_000;

export function fact(key: string, label: string, value: string | null, source: string | null, confidence: Fact['confidence'] = 'high'): Fact {
  return { key, label, value, source, confidence };
}

export const MOCK_ESTABLISHMENT: Establishment = {
  companyName: 'Demo Construction Co.',
  establishmentName: 'West 33rd St Tower Site',
  ein: '12-3456789',
  naicsCode: '236220',
  streetAddress: '450 W 33rd St',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  annualAverageEmployees: 120,
  totalHoursWorked: 240000,
  injuryRateTarget: 3,
  missedWorkRateTarget: 2.5,
};

export function buildMockIncidents(now = Date.now()): Incident[] {
  const iso = (msAgo: number) => new Date(now - msAgo).toISOString();
  return [
    {
      id: 'INC-1007',
      caseNumber: null,
      employeeName: 'Ray Dominguez',
      jobTitle: 'Laborer',
      date: '2026-10-16',
      location: 'Excavation, north foundation trench',
      description: 'Trench wall partially collapsed; worker pinned at the legs. Admitted to hospital overnight with a crushed right leg.',
      bodyPart: 'Right leg',
      caseType: 'injury',
      daysAway: 0,
      daysRestricted: 0,
      privacyCase: false,
      rawText: 'Ray got caught when the north trench wall gave way around 7:40. FDNY pulled him out, he was admitted to Bellevue overnight, crushed right leg.',
      facts: [
        fact('employee', 'Employee', 'Ray Dominguez', 'Ray'),
        fact('event', 'What happened', 'Trench wall collapse, pinned at legs', 'the north trench wall gave way'),
        fact('bodyPart', 'Body part', 'Right leg', 'crushed right leg'),
        fact('hospitalized', 'Hospitalized overnight', 'Yes', 'admitted to Bellevue overnight'),
        fact('daysAway', 'Days away', null, null, 'low'),
      ],
      determination: {
        outcome: 'recordable',
        classification: 'days-away',
        reason: 'In-patient hospitalization means treatment well beyond first aid. This is also a severe injury that must be reported to OSHA within 24 hours.',
        citations: ['1904.5(a)', '1904.7(b)(5)', '1904.39(a)(2)'],
        openQuestions: [],
        engineVersion: ENGINE,
      },
      review: { status: 'pending' },
      severeAlert: { event: 'hospitalization', deadlineAt: iso(-21 * HOUR), reportedAt: null },
      submittedBy: 'Site Super - M. Reyes',
      createdAt: iso(3 * HOUR),
    },
    {
      id: 'INC-1006',
      caseNumber: null,
      employeeName: 'Luis Ortega',
      jobTitle: 'Carpenter',
      date: '2026-10-15',
      location: 'Level 4 deck, east framing',
      description: 'Nail gun double-fired; nail entered left palm. Clinic removed nail, closed with 3 sutures, prescribed 800mg ibuprofen.',
      bodyPart: 'Left hand',
      caseType: 'injury',
      daysAway: 0,
      daysRestricted: 0,
      privacyCase: false,
      rawText: 'Luis was framing on 4 and the nail gun double fired, nail went into his left palm. Clinic pulled it, 3 stitches, gave him a script for 800mg ibuprofen. Back tomorrow full duty.',
      facts: [
        fact('employee', 'Employee', 'Luis Ortega', 'Luis'),
        fact('bodyPart', 'Body part', 'Left hand (palm)', 'left palm'),
        fact('treatment', 'Treatment', 'Nail removed, 3 sutures', 'Clinic pulled it, 3 stitches'),
        fact('medication', 'Medication', 'Ibuprofen 800mg, prescribed', 'a script for 800mg ibuprofen'),
        fact('restrictions', 'Work restrictions', 'None, full duty', 'Back tomorrow full duty'),
      ],
      determination: {
        outcome: 'recordable',
        classification: 'other-recordable',
        reason: 'Sutures are medical treatment, not first aid. The 800mg ibuprofen is also prescription strength (over 467mg per dose). No days away or restrictions, so it goes in column J.',
        citations: ['1904.5(a)', '1904.7(b)(5)(i)', '1904.7(b)(5)(ii)(A)'],
        openQuestions: [],
        engineVersion: ENGINE,
      },
      review: { status: 'pending' },
      severeAlert: null,
      submittedBy: 'Foreman - D. Kim',
      createdAt: iso(26 * HOUR),
    },
    {
      id: 'INC-1005',
      caseNumber: null,
      employeeName: 'Devon Price',
      jobTitle: 'Laborer',
      date: '2026-10-14',
      location: 'Laydown yard, rebar staging',
      description: 'Strained lower back lifting a rebar bundle. Clinic gave an ice pack and "something for the pain." Told to avoid heavy lifting.',
      bodyPart: 'Lower back',
      caseType: 'injury',
      daysAway: 0,
      daysRestricted: 0,
      privacyCase: false,
      rawText: 'Devon tweaked his lower back lifting a rebar bundle in the yard. Clinic gave him an ice pack and something for the pain, said take it easy on heavy lifting.',
      facts: [
        fact('employee', 'Employee', 'Devon Price', 'Devon'),
        fact('bodyPart', 'Body part', 'Lower back', 'his lower back'),
        fact('treatment', 'Treatment', 'Ice pack', 'an ice pack'),
        fact('medication', 'Medication', 'Unknown', 'something for the pain', 'low'),
        fact('restrictions', 'Work restrictions', 'Avoid heavy lifting', 'take it easy on heavy lifting', 'low'),
      ],
      determination: {
        outcome: 'needs-info',
        classification: null,
        reason: 'The ice pack is first aid. The rest of the case depends on two facts the note does not settle, so the engine will not guess.',
        citations: ['1904.7(b)(5)(ii)(E)', '1904.7(b)(5)(ii)(A)', '1904.7(b)(4)'],
        openQuestions: [
          'What medication was given or recommended, and at what dose per pill?',
          'Did a physician or licensed provider recommend that Devon not do heavy lifting, and is heavy lifting something he normally does at least once a week?',
        ],
        engineVersion: ENGINE,
      },
      review: { status: 'pending' },
      severeAlert: null,
      submittedBy: 'Foreman - D. Kim',
      createdAt: iso(50 * HOUR),
    },
    {
      id: 'INC-1004',
      caseNumber: null,
      employeeName: 'Kevin Walsh',
      jobTitle: 'Electrician',
      date: '2026-10-13',
      location: 'Level 2, electrical room',
      description: 'Metal shaving in right eye while drilling conduit. Flushed at the on-site eyewash station; returned to work.',
      bodyPart: 'Right eye',
      caseType: 'injury',
      daysAway: 0,
      daysRestricted: 0,
      privacyCase: false,
      rawText: 'Kevin got a metal shaving in his right eye drilling conduit in the 2nd floor elec room. Flushed it at the eyewash, felt fine, went back to work.',
      facts: [
        fact('employee', 'Employee', 'Kevin Walsh', 'Kevin'),
        fact('bodyPart', 'Body part', 'Right eye', 'his right eye'),
        fact('treatment', 'Treatment', 'Eye flushed with eyewash', 'Flushed it at the eyewash'),
        fact('restrictions', 'Work restrictions', 'None', 'went back to work'),
      ],
      determination: {
        outcome: 'not-recordable',
        classification: null,
        reason: 'Removing a foreign body from the eye using only irrigation is on OSHA\'s first aid list. No other treatment, restriction or lost time.',
        citations: ['1904.7(b)(5)(ii)(J)'],
        openQuestions: [],
        engineVersion: ENGINE,
      },
      review: { status: 'pending' },
      severeAlert: null,
      submittedBy: 'Foreman - A. Novak',
      createdAt: iso(74 * HOUR),
    },
    {
      id: 'INC-1008',
      caseNumber: '2026-003',
      employeeName: 'Sam Reed',
      jobTitle: 'Plumber',
      date: '2026-10-09',
      location: 'Level 2, mechanical room',
      description: 'Pipe threader slipped and cut right index finger. Clinic closed it with 2 sutures; returned to full duty the same day.',
      bodyPart: 'Right index finger',
      caseType: 'injury',
      daysAway: 0,
      daysRestricted: 0,
      privacyCase: false,
      rawText: 'Sam caught his right index finger in the pipe threader on 2. Clinic put in 2 stitches, he came back and finished the shift.',
      facts: [
        fact('employee', 'Employee', 'Sam Reed', 'Sam'),
        fact('treatment', 'Treatment', '2 sutures', 'Clinic put in 2 stitches'),
        fact('restrictions', 'Work restrictions', 'None, full duty', 'came back and finished the shift'),
      ],
      determination: {
        outcome: 'recordable',
        classification: 'other-recordable',
        reason: 'Sutures are medical treatment, not first aid. No days away or restrictions, so it goes in column J.',
        citations: ['1904.7(b)(5)(i)'],
        openQuestions: [],
        engineVersion: ENGINE,
      },
      review: { status: 'accepted', reviewer: 'Test Manager', at: iso(160 * HOUR), outcome: 'recordable', classification: 'other-recordable' },
      severeAlert: null,
      submittedBy: 'Foreman - A. Novak',
      createdAt: iso(170 * HOUR),
    },
    {
      id: 'INC-1003',
      caseNumber: '2026-002',
      employeeName: 'Tyrone Banks',
      jobTitle: 'Roofer',
      date: '2026-10-06',
      location: 'Roof, south parapet',
      description: 'Pallet of shingles shifted on the hoist landing and struck left foot. Fractured metatarsal; physician ordered no work for 14 days.',
      bodyPart: 'Left foot',
      caseType: 'injury',
      daysAway: 14,
      daysRestricted: 0,
      privacyCase: false,
      rawText: 'Shingle pallet shifted on the hoist landing and came down on Tyrone\'s left foot. X-ray showed a broken metatarsal, doctor said no work for 2 weeks.',
      facts: [
        fact('employee', 'Employee', 'Tyrone Banks', 'Tyrone'),
        fact('diagnosis', 'Diagnosis', 'Fractured metatarsal', 'broken metatarsal'),
        fact('daysAway', 'Days away', '14', 'no work for 2 weeks'),
      ],
      determination: {
        outcome: 'recordable',
        classification: 'days-away',
        reason: 'A physician-diagnosed fracture is recordable on its own, and the 14 days away put it in column H.',
        citations: ['1904.7(b)(3)', '1904.7(b)(7)'],
        openQuestions: [],
        engineVersion: ENGINE,
      },
      review: { status: 'accepted', reviewer: 'Test Manager', at: iso(230 * HOUR), outcome: 'recordable', classification: 'days-away' },
      severeAlert: null,
      submittedBy: 'Foreman - A. Novak',
      createdAt: iso(240 * HOUR),
    },
    {
      id: 'INC-1002',
      caseNumber: '2026-001',
      employeeName: 'Maria Santos',
      jobTitle: 'Ironworker',
      date: '2026-09-29',
      location: 'Level 3, steel erection',
      description: 'Fell from a 6 ft ladder and sprained right wrist. Physician restricted use of right hand for 10 days; reassigned to flagging.',
      bodyPart: 'Right wrist',
      caseType: 'injury',
      daysAway: 0,
      daysRestricted: 10,
      privacyCase: false,
      rawText: 'Maria came off a 6 foot ladder on 3 and sprained her right wrist. Doc says no right hand for 10 days, we moved her to flagging.',
      facts: [
        fact('employee', 'Employee', 'Maria Santos', 'Maria'),
        fact('bodyPart', 'Body part', 'Right wrist', 'her right wrist'),
        fact('restrictions', 'Work restrictions', 'No use of right hand, 10 days', 'no right hand for 10 days'),
      ],
      determination: {
        outcome: 'recordable',
        classification: 'restricted',
        reason: 'A physician restricted her from routine job functions and she was moved to another job, so this is a restricted / transfer case.',
        citations: ['1904.7(b)(4)'],
        openQuestions: [],
        engineVersion: ENGINE,
      },
      review: { status: 'accepted', reviewer: 'Test Manager', at: iso(400 * HOUR), outcome: 'recordable', classification: 'restricted' },
      severeAlert: null,
      submittedBy: 'Site Super - M. Reyes',
      createdAt: iso(410 * HOUR),
    },
    {
      id: 'INC-1001',
      caseNumber: null,
      employeeName: 'Amy Cho',
      jobTitle: 'Laborer',
      date: '2026-09-22',
      location: 'Level 1, HVAC rough-in',
      description: 'Cut on forearm from a sheet metal edge. Cleaned and closed with butterfly bandages on site.',
      bodyPart: 'Left forearm',
      caseType: 'injury',
      daysAway: 0,
      daysRestricted: 0,
      privacyCase: false,
      rawText: 'Amy caught her forearm on a sheet metal edge, medic cleaned it and put butterfly strips on it.',
      facts: [
        fact('employee', 'Employee', 'Amy Cho', 'Amy'),
        fact('treatment', 'Treatment', 'Wound cleaned, butterfly bandages', 'cleaned it and put butterfly strips on it'),
      ],
      determination: {
        outcome: 'not-recordable',
        classification: null,
        reason: 'Cleaning a surface wound and butterfly bandages are both on OSHA\'s first aid list.',
        citations: ['1904.7(b)(5)(ii)(C)', '1904.7(b)(5)(ii)(D)'],
        openQuestions: [],
        engineVersion: ENGINE,
      },
      review: { status: 'accepted', reviewer: 'Test Manager', at: iso(560 * HOUR), outcome: 'not-recordable', classification: null },
      severeAlert: null,
      submittedBy: 'Foreman - D. Kim',
      createdAt: iso(570 * HOUR),
    },
  ];
}

export const SAMPLE_VOICE_NOTE =
  'Jake on the 4th floor deck cut his left forearm on exposed rebar around 10am. Medic cleaned it up and the clinic closed it with 4 stitches, plus a tetanus shot. Doctor put him on light duty, no lifting over 20 pounds for a week.';

export interface AnalysisResult {
  employeeName: string;
  jobTitle: string;
  date: string;
  location: string;
  bodyPart: string;
  description: string;
  facts: Fact[];
  determination: Determination;
  severeAlert: SevereAlert | null;
  daysRestricted: number;
}

// What the mock engine "extracts" from a facility's sample voice note
export type SampleAnalysis = Omit<AnalysisResult, 'date'>;

// The mock ignores the text and returns the facility's canned result.
export async function analyzeIncident(_text: string, sample: SampleAnalysis = CONSTRUCTION_ANALYSIS): Promise<AnalysisResult> {
  await new Promise((r) => setTimeout(r, 2200));
  return { ...sample, date: new Date().toISOString().split('T')[0] };
}

export const CONSTRUCTION_ANALYSIS: SampleAnalysis = {
  employeeName: 'Jake',
  jobTitle: '',
  location: 'Level 4 deck',
  bodyPart: 'Left forearm',
  description: 'Cut left forearm on exposed rebar. Clinic closed it with 4 sutures and gave a tetanus shot. Physician restricted lifting over 20 lbs for one week.',
  facts: [
    fact('employee', 'Employee', 'Jake', 'Jake', 'low'),
    fact('jobTitle', 'Job title', null, null, 'low'),
    fact('location', 'Location', 'Level 4 deck', 'on the 4th floor deck'),
    fact('time', 'Time of event', '10:00 AM', 'around 10am', 'medium'),
    fact('bodyPart', 'Body part', 'Left forearm', 'his left forearm'),
    fact('treatment', 'Treatment', '4 sutures; tetanus shot', 'closed it with 4 stitches, plus a tetanus shot'),
    fact('medication', 'Medication', 'None mentioned', null, 'medium'),
    fact('restrictions', 'Work restrictions', 'No lifting over 20 lbs, 7 days', 'no lifting over 20 pounds for a week'),
    fact('daysAway', 'Days away', '0', 'light duty', 'medium'),
    fact('loc', 'Loss of consciousness', 'No', null, 'medium'),
  ],
  determination: {
    outcome: 'recordable',
    classification: 'restricted',
    reason: 'Sutures are medical treatment, so this is recordable. The tetanus shot alone would be first aid. A physician restricted lifting, which puts it in the restricted / transfer column if lifting over 20 lbs is part of his normal job.',
    citations: ['1904.5(a)', '1904.7(b)(5)(i)', '1904.7(b)(5)(ii)(B)', '1904.7(b)(4)'],
    openQuestions: [],
    engineVersion: ENGINE,
  },
  severeAlert: null,
  daysRestricted: 7,
};
