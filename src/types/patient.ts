export type ServiceType = 'reanimation' | 'soins-intensifs' | 'dechocage' | 'neonatologie';

export type PatientStatus = 'critique' | 'grave' | 'stable' | 'surveillance';

export interface VitalSigns {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  glycemia: number; // in g/L
}

export interface Medication {
  name: string;
  dose: string;
  frequency: string;
  route: string;
}

export interface LabResult {
  name: string;
  value: string;
  unit: string;
  isAbnormal: boolean;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number; // in years for adults, in days for neonatology
  gender: 'M' | 'F';
  service: ServiceType;
  bedNumber: string;
  admissionDate: string;
  diagnosis: string;
  status: PatientStatus;
  vitalSigns: VitalSigns;
  medications: Medication[];
  labResults: LabResult[];
  doctor: string;
  notes: string;
  isNeonatal?: boolean; // true = age is in days
  isPremature?: boolean;
  motherName?: string;
  gestationalAge?: number; // weeks for premature
}
