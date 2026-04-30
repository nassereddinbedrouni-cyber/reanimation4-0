export type ConsciousnessLevel = 'Alert' | 'Voice' | 'Pain' | 'Unresponsive';
export type ServiceType = 'reanimation' | 'soinsIntensifs' | 'dechocage' | 'neonatologie';

export interface VitalSigns {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  spo2: number;
  respiratoryRate: number;
  temperature: number;
  glycemia: number;
  consciousness: ConsciousnessLevel;
  timestamp: number;
}

export interface NeoVitalSigns extends VitalSigns {
  weight: number; // grams
  apgarScore?: number;
  apgarAt1min?: number;
  apgarAt5min?: number;
  gestationalAge?: number; // weeks
  isPreemie: boolean;
}

export interface NEWSScore {
  total: number;
  respiratoryRate: number;
  spo2: number;
  temperature: number;
  systolicBP: number;
  heartRate: number;
  consciousness: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  interpretation: string;
}

export interface AIInsight {
  type: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  confidence: number;
  timestamp: number;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  severity: 'low' | 'moderate' | 'critical';
  message: string;
  type: 'news' | 'vital' | 'ai' | 'device';
  timestamp: number;
  acknowledged: boolean;
}

export interface MedicalDevice {
  id: string;
  name: string;
  type: 'catheter' | 'perfusion' | 'ventilator' | 'monitor' | 'pump';
  status: 'normal' | 'warning' | 'error';
  detail: string;
  insertedDays?: number;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface BiologicalResult {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  bed: string;
  diagnosis: string;
  comorbidities: string[];
  admissionDate: string;
  physician: string;
  treatments: string[];
  allergies: string[];
  vitals: VitalSigns[];
  devices: MedicalDevice[];
  biologicalResults: BiologicalResult[];
  aiInsights: AIInsight[];
  newsScore: NEWSScore;
  service?: ServiceType;
  isNeonatal?: boolean;
}

export type ViewType = 'dashboard' | 'patient' | 'alerts' | 'devices' | 'ai';
