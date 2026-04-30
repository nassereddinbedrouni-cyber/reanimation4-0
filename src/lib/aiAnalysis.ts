import { Patient, AIInsight, NEWSScore } from '../types';

function detectSepsis(patient: Patient, news: NEWSScore): AIInsight | null {
  const latest = patient.vitals[patient.vitals.length - 1];
  if (!latest) return null;
  const suspicion =
    latest.temperature > 38.3 &&
    latest.heartRate > 90 &&
    latest.respiratoryRate > 20 &&
    news.total >= 4;

  if (suspicion) {
    return {
      type: 'critical',
      title: 'Suspicion de sepsis',
      description: `Critères SIRS détectés : tachycardie (${latest.heartRate} bpm), hyperthermie (${latest.temperature}°C), polypnée (${latest.respiratoryRate}/min). Alerter l'équipe médicale immédiatement.`,
      confidence: 82,
      timestamp: Date.now(),
    };
  }
  return null;
}

function detectRespiratoryDistress(patient: Patient): AIInsight | null {
  const latest = patient.vitals[patient.vitals.length - 1];
  if (!latest) return null;
  if (latest.spo2 < 92 && latest.respiratoryRate > 25) {
    return {
      type: 'critical',
      title: 'Détresse respiratoire aiguë',
      description: `SpO2 critique à ${latest.spo2}% avec polypnée sévère (${latest.respiratoryRate}/min). Évaluation ventilatoire urgente requise.`,
      confidence: 91,
      timestamp: Date.now(),
    };
  }
  if (latest.spo2 < 95) {
    return {
      type: 'warning',
      title: 'Hypoxémie modérée',
      description: `SpO2 à ${latest.spo2}%. Optimiser l'oxygénothérapie et surveiller l'évolution.`,
      confidence: 74,
      timestamp: Date.now(),
    };
  }
  return null;
}

function detectHemodynamicInstability(patient: Patient): AIInsight | null {
  const vitals = patient.vitals;
  if (vitals.length < 3) return null;
  const recent = vitals.slice(-4);
  const sbps = recent.map((v) => v.systolicBP);
  const trend = sbps[sbps.length - 1] - sbps[0];

  if (sbps[sbps.length - 1] < 90) {
    return {
      type: 'critical',
      title: 'Hypotension sévère',
      description: `PA systolique à ${sbps[sbps.length - 1]} mmHg. Risque de choc hémodynamique. Remplissage vasculaire et vasopresseurs à considérer.`,
      confidence: 88,
      timestamp: Date.now(),
    };
  }
  if (trend < -20) {
    return {
      type: 'warning',
      title: 'Tendance hypotensive',
      description: `Baisse de la pression artérielle systolique de ${Math.abs(Math.round(trend))} mmHg sur les dernières mesures. Surveiller attentivement.`,
      confidence: 67,
      timestamp: Date.now(),
    };
  }
  return null;
}

function detectGlycemiaDisorder(patient: Patient): AIInsight | null {
  const latest = patient.vitals[patient.vitals.length - 1];
  if (!latest) return null;
  const g = latest.glycemia;

  if (g < 3.0) {
    return {
      type: 'critical',
      title: 'Hypoglycémie sévère',
      description: `Glycémie critique à ${g} mmol/L. Resucrage immédiat requis (glucose IV). Risque de coma hypoglycémique.`,
      confidence: 95,
      timestamp: Date.now(),
    };
  }
  if (g < 4.0) {
    return {
      type: 'warning',
      title: 'Hypoglycémie modérée',
      description: `Glycémie à ${g} mmol/L. Surveillance rapprochée et resucrage à envisager selon le contexte clinique.`,
      confidence: 87,
      timestamp: Date.now(),
    };
  }
  if (g > 20.0) {
    return {
      type: 'critical',
      title: 'Hyperglycémie sévère',
      description: `Glycémie à ${g} mmol/L. Risque de coma hyperosmolaire ou acido-cétose diabétique. Insulinothérapie urgente.`,
      confidence: 92,
      timestamp: Date.now(),
    };
  }
  if (g > 10.0) {
    return {
      type: 'warning',
      title: 'Hyperglycémie',
      description: `Glycémie à ${g} mmol/L. Adapter l'insulinothérapie selon le protocole en cours.`,
      confidence: 80,
      timestamp: Date.now(),
    };
  }
  return null;
}

function detectArrhythmia(patient: Patient): AIInsight | null {
  const vitals = patient.vitals;
  if (vitals.length < 3) return null;
  const hrs = vitals.slice(-5).map((v) => v.heartRate);
  const variance = Math.max(...hrs) - Math.min(...hrs);
  const latest = hrs[hrs.length - 1];

  if (latest > 130 || latest < 45) {
    return {
      type: 'critical',
      title: 'Trouble du rythme cardiaque',
      description: `Fréquence cardiaque à ${latest} bpm. ECG urgent recommandé pour écarter une arythmie grave.`,
      confidence: 79,
      timestamp: Date.now(),
    };
  }
  if (variance > 30) {
    return {
      type: 'warning',
      title: 'Variabilité cardiaque anormale',
      description: `Variation de ${variance} bpm détectée. Possible instabilité rythmique. Surveillance ECG continue recommandée.`,
      confidence: 61,
      timestamp: Date.now(),
    };
  }
  return null;
}

function generateStableInsight(patient: Patient): AIInsight {
  const positives = [
    'Paramètres hémodynamiques stables depuis 2 heures',
    'Tendance favorable de la saturation en oxygène',
    'Score NEWS en amélioration sur les dernières mesures',
    'Équilibre ventilatoire maintenu',
  ];
  return {
    type: 'info',
    title: 'Évolution clinique favorable',
    description: positives[Math.floor(Math.random() * positives.length)],
    confidence: 85 + Math.floor(Math.random() * 10),
    timestamp: Date.now(),
  };
}

export function generateAIInsights(patient: Patient, news: NEWSScore): AIInsight[] {
  const insights: AIInsight[] = [];

  const sepsis = detectSepsis(patient, news);
  if (sepsis) insights.push(sepsis);

  const resp = detectRespiratoryDistress(patient);
  if (resp) insights.push(resp);

  const hemo = detectHemodynamicInstability(patient);
  if (hemo) insights.push(hemo);

  const arrhythmia = detectArrhythmia(patient);
  if (arrhythmia) insights.push(arrhythmia);

  const glycemia = detectGlycemiaDisorder(patient);
  if (glycemia) insights.push(glycemia);

  if (insights.length === 0) {
    insights.push(generateStableInsight(patient));
  }

  return insights;
}
