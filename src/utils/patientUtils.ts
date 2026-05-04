import { Patient, ServiceType, VitalSigns } from '../types/patient';

export function formatAge(patient: Patient): string {
  if (patient.isNeonatal) {
    if (patient.age === 1) return '1 jour';
    return `${patient.age} jours`;
  }
  return `${patient.age} ans`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'critique': return 'text-red-600 bg-red-50 border-red-200';
    case 'grave': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'stable': return 'text-green-600 bg-green-50 border-green-200';
    case 'surveillance': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'critique': return 'Critique';
    case 'grave': return 'Grave';
    case 'stable': return 'Stable';
    case 'surveillance': return 'Surveillance';
    default: return status;
  }
}

export function getServiceLabel(service: ServiceType): string {
  switch (service) {
    case 'reanimation': return 'Réanimation';
    case 'soins-intensifs': return 'Soins Intensifs';
    case 'dechocage': return 'Déchocage';
    case 'neonatologie': return 'Néonatologie';
  }
}

// Glycemia normal ranges based on patient type
// Nouveau-né à terme: ≥ 0.45 g/L
// Prématuré: > 0.40–0.45 g/L
// Adult/Elderly: 0.70–1.10 g/L
export function isGlycemiaAbnormal(patient: Patient): boolean {
  const g = patient.vitalSigns.glycemia;
  if (patient.isNeonatal) {
    if (patient.isPremature) {
      return g <= 0.40 || g > 1.80;
    }
    return g < 0.45 || g > 1.80;
  }
  return g < 0.70 || g > 1.10;
}

export function getGlycemiaRange(patient: Patient): string {
  if (patient.isNeonatal) {
    if (patient.isPremature) return '0.40–0.45 g/L (prématuré)';
    return '≥ 0.45 g/L (nouveau-né)';
  }
  return '0.70–1.10 g/L';
}

export function isVitalAbnormal(key: keyof VitalSigns, value: number | { systolic: number; diastolic: number }, patient: Patient): boolean {
  const isNeo = patient.isNeonatal ?? false;

  if (key === 'heartRate') {
    const v = value as number;
    return isNeo ? (v < 100 || v > 180) : (v < 50 || v > 120);
  }
  if (key === 'bloodPressure') {
    const bp = value as { systolic: number; diastolic: number };
    return isNeo
      ? (bp.systolic < 45 || bp.systolic > 90)
      : (bp.systolic < 90 || bp.systolic > 160);
  }
  if (key === 'temperature') {
    const v = value as number;
    return v < 36.0 || v > 38.5;
  }
  if (key === 'oxygenSaturation') {
    const v = value as number;
    return isNeo ? v < 90 : v < 94;
  }
  if (key === 'respiratoryRate') {
    const v = value as number;
    return isNeo ? (v < 30 || v > 80) : (v < 12 || v > 25);
  }
  if (key === 'glycemia') {
    return isGlycemiaAbnormal(patient);
  }
  return false;
}

export function getServiceBgColor(service: ServiceType): string {
  switch (service) {
    case 'reanimation': return 'from-red-500 to-red-600';
    case 'soins-intensifs': return 'from-blue-500 to-blue-600';
    case 'dechocage': return 'from-amber-500 to-amber-600';
    case 'neonatologie': return 'from-teal-500 to-teal-600';
  }
}

export function getServiceAccentColor(service: ServiceType): string {
  switch (service) {
    case 'reanimation': return 'red';
    case 'soins-intensifs': return 'blue';
    case 'dechocage': return 'amber';
    case 'neonatologie': return 'teal';
  }
}
