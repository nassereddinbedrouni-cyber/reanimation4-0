import { VitalSigns, NEWSScore, ConsciousnessLevel } from '../types';

function scoreRespRate(rr: number): number {
  if (rr <= 8) return 3;
  if (rr <= 11) return 1;
  if (rr <= 20) return 0;
  if (rr <= 24) return 2;
  return 3;
}

function scoreSpo2(spo2: number): number {
  if (spo2 <= 91) return 3;
  if (spo2 <= 93) return 2;
  if (spo2 <= 95) return 1;
  return 0;
}

function scoreTemperature(temp: number): number {
  if (temp <= 35.0) return 3;
  if (temp <= 36.0) return 1;
  if (temp <= 38.0) return 0;
  if (temp <= 39.0) return 1;
  return 2;
}

function scoreSystolicBP(sbp: number): number {
  if (sbp <= 90) return 3;
  if (sbp <= 100) return 2;
  if (sbp <= 110) return 1;
  if (sbp <= 219) return 0;
  return 3;
}

function scoreHeartRate(hr: number): number {
  if (hr <= 40) return 3;
  if (hr <= 50) return 1;
  if (hr <= 90) return 0;
  if (hr <= 110) return 1;
  if (hr <= 130) return 2;
  return 3;
}

function scoreConsciousness(level: ConsciousnessLevel): number {
  return level === 'Alert' ? 0 : 3;
}

function getRisk(total: number): NEWSScore['risk'] {
  if (total >= 7) return 'critical';
  if (total >= 5) return 'high';
  if (total >= 1) return 'medium';
  return 'low';
}

function getInterpretation(total: number, risk: NEWSScore['risk']): string {
  if (risk === 'critical') return 'Risque critique – Réponse d\'urgence immédiate requise';
  if (risk === 'high') return 'Risque élevé de détérioration – Évaluation urgente';
  if (total >= 3) return 'Risque modéré – Surveillance renforcée recommandée';
  if (total >= 1) return 'Risque faible – Surveillance standard';
  return 'Patient stable – Surveillance de routine';
}

export function calculateNEWS(vitals: VitalSigns): NEWSScore {
  const rrScore = scoreRespRate(vitals.respiratoryRate);
  const spo2Score = scoreSpo2(vitals.spo2);
  const tempScore = scoreTemperature(vitals.temperature);
  const sbpScore = scoreSystolicBP(vitals.systolicBP);
  const hrScore = scoreHeartRate(vitals.heartRate);
  const consciousnessScore = scoreConsciousness(vitals.consciousness);

  const total = rrScore + spo2Score + tempScore + sbpScore + hrScore + consciousnessScore;
  const risk = getRisk(total);

  return {
    total,
    respiratoryRate: rrScore,
    spo2: spo2Score,
    temperature: tempScore,
    systolicBP: sbpScore,
    heartRate: hrScore,
    consciousness: consciousnessScore,
    risk,
    interpretation: getInterpretation(total, risk),
  };
}
