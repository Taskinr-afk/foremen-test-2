import type { Establishment, Incident } from '../schemas/incident';
import { buildMockIncidents, CONSTRUCTION_ANALYSIS, MOCK_ESTABLISHMENT, SAMPLE_VOICE_NOTE, type SampleAnalysis } from './mock';
import {
  buildHospitalIncidents, buildPlantIncidents, buildUtilityIncidents, buildWarehouseIncidents,
  HOSPITAL_ANALYSIS, HOSPITAL_ESTABLISHMENT, HOSPITAL_VOICE_NOTE,
  PLANT_ANALYSIS, PLANT_ESTABLISHMENT, PLANT_VOICE_NOTE,
  UTILITY_ANALYSIS, UTILITY_ESTABLISHMENT, UTILITY_VOICE_NOTE,
  WAREHOUSE_ANALYSIS, WAREHOUSE_ESTABLISHMENT, WAREHOUSE_VOICE_NOTE,
} from './sample-facilities';

// Each sample facility is its own establishment, because OSHA logs are kept per establishment.

export type FacilityId = 'construction' | 'plant' | 'hospital' | 'utility' | 'warehouse';

export interface Facility {
  id: FacilityId;
  label: string;
  establishment: Establishment;
  buildIncidents: (now?: number) => Incident[];
  voiceNote: string;
  analysis: SampleAnalysis;
}

export const FACILITIES: Facility[] = [
  { id: 'construction', label: 'Construction site', establishment: MOCK_ESTABLISHMENT, buildIncidents: buildMockIncidents, voiceNote: SAMPLE_VOICE_NOTE, analysis: CONSTRUCTION_ANALYSIS },
  { id: 'plant', label: 'Manufacturing plant', establishment: PLANT_ESTABLISHMENT, buildIncidents: buildPlantIncidents, voiceNote: PLANT_VOICE_NOTE, analysis: PLANT_ANALYSIS },
  { id: 'hospital', label: 'Hospital', establishment: HOSPITAL_ESTABLISHMENT, buildIncidents: buildHospitalIncidents, voiceNote: HOSPITAL_VOICE_NOTE, analysis: HOSPITAL_ANALYSIS },
  { id: 'utility', label: 'Electric utility', establishment: UTILITY_ESTABLISHMENT, buildIncidents: buildUtilityIncidents, voiceNote: UTILITY_VOICE_NOTE, analysis: UTILITY_ANALYSIS },
  { id: 'warehouse', label: 'Warehouse', establishment: WAREHOUSE_ESTABLISHMENT, buildIncidents: buildWarehouseIncidents, voiceNote: WAREHOUSE_VOICE_NOTE, analysis: WAREHOUSE_ANALYSIS },
];

export function getFacility(id: FacilityId): Facility {
  return FACILITIES.find((f) => f.id === id) ?? FACILITIES[0];
}
