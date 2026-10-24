import { create } from 'zustand';
import type { AuditEntry, Classification, Establishment, Incident } from '../schemas/incident';
import { getFacility, type FacilityId } from '../api/facilities';
import { nextCaseNumber } from '../osha';

const CURRENT_USER = 'Test Manager';

interface AppState {
  facility: FacilityId;
  setFacility: (id: FacilityId) => void;
  incidents: Incident[];
  establishment: Establishment;
  auditLog: AuditEntry[];
  sidebarOpen: boolean;
  activeView: string;
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: string) => void;
  addIncident: (incident: Incident) => void;
  acceptDetermination: (id: string) => void;
  overrideDetermination: (id: string, outcome: 'recordable' | 'not-recordable', classification: Classification | null, reason: string) => void;
  answerQuestions: (id: string, answers: Record<string, string>) => void;
  markSevereReported: (id: string) => void;
  updateEstablishment: (updates: Partial<Establishment>) => void;
}

function audit(incidentId: string, action: string, detail: string, actor = CURRENT_USER, offsetMs = 0): AuditEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date(Date.now() + offsetMs).toISOString(),
    actor,
    incidentId,
    action,
    detail,
  };
}

function seedAudit(incidents: Incident[]): AuditEntry[] {
  return incidents
    .flatMap((i) => {
      const rows: AuditEntry[] = [
        { id: `${i.id}-s`, at: i.createdAt, actor: i.submittedBy, incidentId: i.id, action: 'Submitted', detail: 'Incident reported' },
        { id: `${i.id}-e`, at: new Date(new Date(i.createdAt).getTime() + 1000).toISOString(), actor: `Rules engine ${i.determination.engineVersion}`, incidentId: i.id, action: 'Determined', detail: `${i.determination.outcome} (${i.determination.citations.join(', ')})` },
      ];
      if (i.review.status !== 'pending') {
        rows.push({ id: `${i.id}-r`, at: i.review.at!, actor: i.review.reviewer!, incidentId: i.id, action: 'Accepted', detail: i.caseNumber ? `Logged as case ${i.caseNumber}` : 'Not logged' });
      }
      return rows;
    })
    .sort((a, b) => b.at.localeCompare(a.at));
}

// Everything a sample facility brings: its establishment, incidents and the audit trail they imply
function loadFacility(id: FacilityId) {
  const f = getFacility(id);
  const incidents = f.buildIncidents();
  return { facility: id, establishment: f.establishment, incidents, auditLog: seedAudit(incidents) };
}

export const useAppStore = create<AppState>((set) => ({
  ...loadFacility('construction'),
  setFacility: (id) => set(loadFacility(id)),
  sidebarOpen: true,
  activeView: 'dashboard',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveView: (view) => set({ activeView: view }),

  addIncident: (incident) =>
    set((s) => ({
      incidents: [incident, ...s.incidents],
      auditLog: [
        audit(incident.id, 'Determined', `${incident.determination.outcome} (${incident.determination.citations.join(', ')})`, `Rules engine ${incident.determination.engineVersion}`, 1000),
        audit(incident.id, 'Submitted', 'Incident reported'),
        ...s.auditLog,
      ],
    })),

  acceptDetermination: (id) =>
    set((s) => {
      const inc = s.incidents.find((i) => i.id === id);
      if (!inc || inc.determination.outcome === 'needs-info') return s;
      const recordable = inc.determination.outcome === 'recordable';
      const caseNumber = recordable ? nextCaseNumber(s.incidents, Number(inc.date.slice(0, 4))) : null;
      return {
        incidents: s.incidents.map((i) =>
          i.id === id
            ? {
                ...i,
                caseNumber,
                review: {
                  ...i.review,
                  status: 'accepted',
                  reviewer: CURRENT_USER,
                  at: new Date().toISOString(),
                  outcome: recordable ? 'recordable' : 'not-recordable',
                  classification: i.determination.classification,
                },
              }
            : i
        ),
        auditLog: [audit(id, 'Accepted', caseNumber ? `Logged as case ${caseNumber}` : 'Not logged'), ...s.auditLog],
      };
    }),

  overrideDetermination: (id, outcome, classification, reason) =>
    set((s) => {
      const inc = s.incidents.find((i) => i.id === id);
      if (!inc || !reason.trim()) return s;
      const caseNumber = outcome === 'recordable' ? nextCaseNumber(s.incidents, Number(inc.date.slice(0, 4))) : null;
      return {
        incidents: s.incidents.map((i) =>
          i.id === id
            ? {
                ...i,
                caseNumber,
                review: {
                  ...i.review,
                  status: 'overridden',
                  reviewer: CURRENT_USER,
                  at: new Date().toISOString(),
                  outcome,
                  classification: outcome === 'recordable' ? classification : null,
                  overrideReason: reason.trim(),
                },
              }
            : i
        ),
        auditLog: [
          audit(id, 'Overridden', `Engine said ${inc.determination.outcome}, set to ${outcome}${caseNumber ? ` (case ${caseNumber})` : ''}. Reason: ${reason.trim()}`),
          ...s.auditLog,
        ],
      };
    }),

  answerQuestions: (id, answers) =>
    set((s) => ({
      incidents: s.incidents.map((i) => (i.id === id ? { ...i, review: { ...i.review, answers } } : i)),
      auditLog: [audit(id, 'Answered questions', Object.values(answers).join(' | ')), ...s.auditLog],
    })),

  markSevereReported: (id) =>
    set((s) => ({
      incidents: s.incidents.map((i) =>
        i.id === id && i.severeAlert ? { ...i, severeAlert: { ...i.severeAlert, reportedAt: new Date().toISOString() } } : i
      ),
      auditLog: [audit(id, 'Reported to OSHA', 'Severe injury report marked as filed'), ...s.auditLog],
    })),

  updateEstablishment: (updates) => set((s) => ({ establishment: { ...s.establishment, ...updates } })),
}));
