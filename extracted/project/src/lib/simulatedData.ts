import { Patient, VitalSigns, ConsciousnessLevel, MedicalDevice, BiologicalResult } from '../types';
import { calculateNEWS } from './newsScore';
import { generateAIInsights } from './aiAnalysis';

function rand(min: number, max: number, decimals = 0): number {
  const v = Math.random() * (max - min) + min;
  return decimals > 0 ? parseFloat(v.toFixed(decimals)) : Math.round(v);
}

function generateVitalHistory(
  baseHR: number,
  baseSBP: number,
  baseSpo2: number,
  baseRR: number,
  baseTemp: number,
  baseGlycemia: number,
  consciousness: ConsciousnessLevel,
  count = 20
): VitalSigns[] {
  const vitals: VitalSigns[] = [];
  const now = Date.now();
  for (let i = count - 1; i >= 0; i--) {
    vitals.push({
      heartRate: Math.max(30, Math.min(200, baseHR + rand(-8, 8))),
      systolicBP: Math.max(60, Math.min(240, baseSBP + rand(-10, 10))),
      diastolicBP: Math.max(40, Math.min(130, Math.round(baseSBP * 0.65) + rand(-5, 5))),
      spo2: Math.max(70, Math.min(100, baseSpo2 + rand(-2, 2))),
      respiratoryRate: Math.max(4, Math.min(40, baseRR + rand(-3, 3))),
      temperature: Math.max(34, Math.min(42, baseTemp + rand(-3, 3, 1))),
      glycemia: Math.max(2.0, Math.min(30.0, parseFloat((baseGlycemia + rand(-10, 10, 1) / 10).toFixed(1)))),
      consciousness,
      timestamp: now - i * 5 * 60 * 1000,
    });
  }
  return vitals;
}

function makeDevices(types: Array<{ type: MedicalDevice['type']; name: string; days: number; status: MedicalDevice['status'] }>): MedicalDevice[] {
  return types.map((d, i) => ({
    id: `dev-${i}`,
    name: d.name,
    type: d.type,
    status: d.status,
    detail: d.status === 'warning' ? 'Vérification requise' : d.status === 'error' ? 'Intervention nécessaire' : 'Fonctionnement normal',
    insertedDays: d.days,
    riskLevel: d.days > 5 ? 'high' : d.days > 3 ? 'medium' : 'low',
  }));
}

function makeBio(results: Array<{ name: string; value: string; unit: string; status: BiologicalResult['status'] }>): BiologicalResult[] {
  const today = new Date().toLocaleDateString('fr-FR');
  return results.map((r) => ({ ...r, date: today }));
}

const emptyNews = { total: 0, respiratoryRate: 0, spo2: 0, temperature: 0, systolicBP: 0, heartRate: 0, consciousness: 0, risk: 'low' as const, interpretation: '' };

export function createInitialPatients(): Patient[] {
  const patients: Patient[] = [
    {
      id: 'p1',
      name: 'Mohammed El Fassi',
      age: 68,
      gender: 'M',
      bed: 'Box 1',
      diagnosis: 'Pneumonie sévère – SDRA',
      comorbidities: ['Diabète type 2', 'HTA', 'BPCO'],
      admissionDate: '18/04/2026',
      physician: 'Dr. Samir Lahrech',
      treatments: ['Antibiotiques IV', 'Ventilation non invasive', 'Insulinothérapie'],
      allergies: ['Pénicilline'],
      vitals: generateVitalHistory(110, 88, 89, 28, 38.9, 13.8, 'Alert'),
      devices: makeDevices([
        { type: 'catheter', name: 'Voie veineuse centrale', days: 4, status: 'warning' },
        { type: 'ventilator', name: 'VNI CPAP', days: 2, status: 'normal' },
        { type: 'monitor', name: 'Moniteur multiparamètres', days: 6, status: 'normal' },
      ]),
      biologicalResults: makeBio([
        { name: 'CRP', value: '215', unit: 'mg/L', status: 'critical' },
        { name: 'Procalcitonine', value: '8.4', unit: 'ng/mL', status: 'critical' },
        { name: 'Lactates', value: '3.1', unit: 'mmol/L', status: 'abnormal' },
        { name: 'Créatinine', value: '142', unit: 'µmol/L', status: 'abnormal' },
      ]),
      aiInsights: [],
      newsScore: emptyNews,
    },
    {
      id: 'p2',
      name: 'Fatima Bennani',
      age: 74,
      gender: 'F',
      bed: 'Box 2',
      diagnosis: 'Infarctus du myocarde – Choc cardiogénique',
      comorbidities: ['Coronaropathie', 'Insuffisance cardiaque', 'FA permanente'],
      admissionDate: '19/04/2026',
      physician: 'Dr. Noureddine Zerkani',
      treatments: ['Dobutamine', 'Héparine', 'Aspirine', 'Défibrillateur implantable'],
      allergies: [],
      vitals: generateVitalHistory(52, 82, 94, 22, 37.2, 6.1, 'Alert'),
      devices: makeDevices([
        { type: 'catheter', name: 'Swan-Ganz', days: 1, status: 'normal' },
        { type: 'pump', name: 'Pompe à dobutamine', days: 1, status: 'normal' },
        { type: 'perfusion', name: 'Héparine IV continue', days: 1, status: 'normal' },
        { type: 'monitor', name: 'ECG continu', days: 1, status: 'normal' },
      ]),
      biologicalResults: makeBio([
        { name: 'Troponine I', value: '8500', unit: 'ng/L', status: 'critical' },
        { name: 'BNP', value: '2340', unit: 'pg/mL', status: 'critical' },
        { name: 'Hémoglobine', value: '10.2', unit: 'g/dL', status: 'abnormal' },
        { name: 'Potassium', value: '4.1', unit: 'mmol/L', status: 'normal' },
      ]),
      aiInsights: [],
      newsScore: emptyNews,
    },
    {
      id: 'p3',
      name: 'Ahmed Boukhari',
      age: 45,
      gender: 'M',
      bed: 'Box 3',
      diagnosis: 'Traumatisme crânien grave – Polytraumatisme',
      comorbidities: ['Aucun antécédent notable'],
      admissionDate: '20/04/2026',
      physician: 'Dr. Leila Bennani',
      treatments: ['Sédation-analgésie', 'Ventilation mécanique', 'Osmothérapie'],
      allergies: ['Morphine'],
      vitals: generateVitalHistory(75, 148, 97, 14, 37.0, 7.2, 'Unresponsive'),
      devices: makeDevices([
        { type: 'ventilator', name: 'Ventilation mécanique invasive', days: 0, status: 'normal' },
        { type: 'catheter', name: 'Capteur PIC', days: 0, status: 'normal' },
        { type: 'catheter', name: 'Voie artérielle radiale', days: 0, status: 'normal' },
        { type: 'perfusion', name: 'Propofol IV', days: 0, status: 'normal' },
      ]),
      biologicalResults: makeBio([
        { name: 'Hémoglobine', value: '9.1', unit: 'g/dL', status: 'abnormal' },
        { name: 'INR', value: '1.8', unit: '', status: 'abnormal' },
        { name: 'Natrémie', value: '158', unit: 'mmol/L', status: 'critical' },
        { name: 'Glycémie', value: '7.2', unit: 'mmol/L', status: 'normal' },
      ]),
      aiInsights: [],
      newsScore: emptyNews,
    },
    {
      id: 'p4',
      name: 'Amina Osman',
      age: 58,
      gender: 'F',
      bed: 'Box 4',
      diagnosis: 'Sepsis sévère – Pyélonéphrite compliquée',
      comorbidities: ['Diabète type 1', 'IRC stade 3'],
      admissionDate: '17/04/2026',
      physician: 'Dr. Samir Lahrech',
      treatments: ['Pipéracilline-Tazobactam', 'Remplissage vasculaire', 'Noradrénaline'],
      allergies: ['Fluoroquinolones'],
      vitals: generateVitalHistory(118, 92, 93, 26, 39.4, 11.2, 'Alert'),
      devices: makeDevices([
        { type: 'catheter', name: 'Voie centrale jugulaire', days: 3, status: 'normal' },
        { type: 'pump', name: 'Noradrénaline IV', days: 3, status: 'normal' },
        { type: 'catheter', name: 'Sonde vésicale', days: 7, status: 'error' },
        { type: 'perfusion', name: 'Antibiotiques IV', days: 3, status: 'normal' },
      ]),
      biologicalResults: makeBio([
        { name: 'Lactates', value: '4.2', unit: 'mmol/L', status: 'critical' },
        { name: 'CRP', value: '310', unit: 'mg/L', status: 'critical' },
        { name: 'Créatinine', value: '285', unit: 'µmol/L', status: 'critical' },
        { name: 'Leucocytes', value: '18.5', unit: 'G/L', status: 'critical' },
      ]),
      aiInsights: [],
      newsScore: emptyNews,
    },
    {
      id: 'p5',
      name: 'Karim Tazi',
      age: 62,
      gender: 'M',
      bed: 'Box 5',
      diagnosis: 'Post-op chirurgie cardiaque – PAC x3',
      comorbidities: ['Coronaropathie', 'HTA', 'Dyslipidémie'],
      admissionDate: '20/04/2026',
      physician: 'Dr. Noureddine Zerkani',
      treatments: ['Analgésie IV', 'Bêta-bloquants', 'Héparine bas débit'],
      allergies: [],
      vitals: generateVitalHistory(78, 128, 98, 16, 37.3, 5.8, 'Alert'),
      devices: makeDevices([
        { type: 'catheter', name: 'Drain thoracique', days: 0, status: 'normal' },
        { type: 'monitor', name: 'Moniteur cardiaque', days: 0, status: 'normal' },
        { type: 'perfusion', name: 'Analgésie PCA', days: 0, status: 'normal' },
      ]),
      biologicalResults: makeBio([
        { name: 'Hémoglobine', value: '11.8', unit: 'g/dL', status: 'abnormal' },
        { name: 'CRP', value: '42', unit: 'mg/L', status: 'abnormal' },
        { name: 'Potassium', value: '3.9', unit: 'mmol/L', status: 'normal' },
        { name: 'Créatinine', value: '95', unit: 'µmol/L', status: 'normal' },
      ]),
      aiInsights: [],
      newsScore: emptyNews,
    },
    {
      id: 'p6',
      name: 'Layla Riad',
      age: 33,
      gender: 'F',
      bed: 'Box 6',
      diagnosis: 'Éclampsie sévère – Post-partum',
      comorbidities: ['Pré-éclampsie connue'],
      admissionDate: '19/04/2026',
      physician: 'Dr. Leila Bennani',
      treatments: ['Sulfate de magnésium', 'Antihypertenseurs', 'Corticoïdes'],
      allergies: [],
      vitals: generateVitalHistory(95, 168, 96, 18, 37.8, 8.4, 'Alert'),
      devices: makeDevices([
        { type: 'catheter', name: 'Voie veineuse périphérique', days: 1, status: 'normal' },
        { type: 'monitor', name: 'Monitoring fœtal', days: 1, status: 'normal' },
        { type: 'catheter', name: 'Sonde urinaire', days: 1, status: 'normal' },
      ]),
      biologicalResults: makeBio([
        { name: 'Plaquettes', value: '88', unit: 'G/L', status: 'critical' },
        { name: 'ASAT', value: '245', unit: 'UI/L', status: 'critical' },
        { name: 'Protéinurie', value: '4.2', unit: 'g/24h', status: 'critical' },
        { name: 'LDH', value: '780', unit: 'UI/L', status: 'critical' },
      ]),
      aiInsights: [],
      newsScore: emptyNews,
    },
    {
      id: 'p7',
      name: 'Hassan Khachani',
      age: 71,
      gender: 'M',
      bed: 'Box 7',
      diagnosis: 'Insuffisance respiratoire aiguë – BPCO décompensée',
      comorbidities: ['BPCO stade IV', 'Tabagisme actif', 'Insuffisance cardiaque droite'],
      admissionDate: '19/04/2026',
      physician: 'Dr. Samir Lahrech',
      treatments: ['Bronchodilatateurs nébulisés', 'Corticoïdes IV', 'VNI BiPAP', 'Antibiothérapie'],
      allergies: [],
      vitals: generateVitalHistory(102, 135, 86, 30, 37.6, 6.9, 'Alert'),
      devices: makeDevices([
        { type: 'ventilator', name: 'VNI BiPAP', days: 2, status: 'normal' },
        { type: 'catheter', name: 'Voie veineuse périphérique', days: 2, status: 'normal' },
        { type: 'monitor', name: 'Oxymètre de pouls continu', days: 2, status: 'normal' },
      ]),
      biologicalResults: makeBio([
        { name: 'PaCO2', value: '68', unit: 'mmHg', status: 'critical' },
        { name: 'pH', value: '7.28', unit: '', status: 'critical' },
        { name: 'HCO3-', value: '31', unit: 'mmol/L', status: 'abnormal' },
        { name: 'CRP', value: '88', unit: 'mg/L', status: 'abnormal' },
      ]),
      aiInsights: [],
      newsScore: emptyNews,
    },
    {
      id: 'p8',
      name: 'Noor Alami',
      age: 29,
      gender: 'F',
      bed: 'Box 8',
      diagnosis: 'Acidocétose diabétique sévère',
      comorbidities: ['Diabète type 1 depuis l\'enfance'],
      admissionDate: '20/04/2026',
      physician: 'Dr. Leila Bennani',
      treatments: ['Insuline IV continue', 'Réhydratation IV', 'Supplémentation potassique'],
      allergies: ['Sulfamides'],
      vitals: generateVitalHistory(108, 102, 97, 24, 37.4, 22.5, 'Alert'),
      devices: makeDevices([
        { type: 'catheter', name: 'Voie veineuse centrale', days: 0, status: 'normal' },
        { type: 'pump', name: 'Insuline IV IVSE', days: 0, status: 'normal' },
        { type: 'monitor', name: 'Moniteur glycémique continu', days: 0, status: 'normal' },
        { type: 'catheter', name: 'Sonde urinaire', days: 0, status: 'normal' },
      ]),
      biologicalResults: makeBio([
        { name: 'Glycémie', value: '28.4', unit: 'mmol/L', status: 'critical' },
        { name: 'Corps cétoniques', value: '6.8', unit: 'mmol/L', status: 'critical' },
        { name: 'pH', value: '7.18', unit: '', status: 'critical' },
        { name: 'Potassium', value: '3.2', unit: 'mmol/L', status: 'abnormal' },
      ]),
      aiInsights: [],
      newsScore: emptyNews,
    },
    {
      id: 'p9',
      name: 'Youssef Mansouri',
      age: 55,
      gender: 'M',
      bed: 'Box 9',
      diagnosis: 'Hémorragie digestive haute – Ulcère gastrique perforé',
      comorbidities: ['Éthylisme chronique', 'Cirrhose Child-Pugh B'],
      admissionDate: '18/04/2026',
      physician: 'Dr. Noureddine Zerkani',
      treatments: ['Inhibiteurs pompe à protons IV', 'Somatostatine', 'Transfusion CGR', 'Vitamine K'],
      allergies: [],
      vitals: generateVitalHistory(125, 78, 95, 20, 37.1, 5.2, 'Voice'),
      devices: makeDevices([
        { type: 'catheter', name: 'Voie centrale sous-clavière', days: 2, status: 'normal' },
        { type: 'perfusion', name: 'IPP IV continu', days: 2, status: 'normal' },
        { type: 'catheter', name: 'Sonde nasogastrique', days: 1, status: 'warning' },
        { type: 'monitor', name: 'Moniteur hémodynamique', days: 2, status: 'normal' },
      ]),
      biologicalResults: makeBio([
        { name: 'Hémoglobine', value: '6.8', unit: 'g/dL', status: 'critical' },
        { name: 'INR', value: '2.4', unit: '', status: 'critical' },
        { name: 'Urée', value: '18.2', unit: 'mmol/L', status: 'critical' },
        { name: 'Albumine', value: '24', unit: 'g/L', status: 'abnormal' },
      ]),
      aiInsights: [],
      newsScore: emptyNews,
    },
    {
      id: 'p10',
      name: 'Mariam Qadri',
      age: 48,
      gender: 'F',
      bed: 'Box 10',
      diagnosis: 'Méningite bactérienne – Pneumocoque',
      comorbidities: ['Asplénie post-splénectomie', 'Immunodépression'],
      admissionDate: '20/04/2026',
      physician: 'Dr. Samir Lahrech',
      treatments: ['Ceftriaxone IV', 'Dexaméthasone IV', 'Antiépileptiques', 'Osmotraitement'],
      allergies: ['Amoxicilline'],
      vitals: generateVitalHistory(130, 95, 94, 26, 40.1, 8.8, 'Pain'),
      devices: makeDevices([
        { type: 'catheter', name: 'Voie veineuse centrale', days: 0, status: 'normal' },
        { type: 'perfusion', name: 'Antibiotiques IV', days: 0, status: 'normal' },
        { type: 'monitor', name: 'EEG continu', days: 0, status: 'normal' },
        { type: 'catheter', name: 'Ponction lombaire – drain', days: 0, status: 'warning' },
      ]),
      biologicalResults: makeBio([
        { name: 'LCR leucocytes', value: '>1000', unit: '/mm³', status: 'critical' },
        { name: 'CRP', value: '380', unit: 'mg/L', status: 'critical' },
        { name: 'Procalcitonine', value: '45', unit: 'ng/mL', status: 'critical' },
        { name: 'Natrémie', value: '128', unit: 'mmol/L', status: 'critical' },
      ]),
      aiInsights: [],
      newsScore: emptyNews,
    },
  ];

  return patients.map((p) => {
    const latestVitals = p.vitals[p.vitals.length - 1];
    const newsScore = calculateNEWS(latestVitals);
    const aiInsights = generateAIInsights({ ...p, newsScore }, newsScore);
    return { ...p, newsScore, aiInsights };
  });
}

export function updatePatientVitals(patient: Patient): Patient {
  const last = patient.vitals[patient.vitals.length - 1];
  const drift = (v: number, delta: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v + (Math.random() - 0.5) * delta));

  const newVitals: VitalSigns = {
    heartRate: Math.round(drift(last.heartRate, 6, 30, 200)),
    systolicBP: Math.round(drift(last.systolicBP, 8, 60, 240)),
    diastolicBP: Math.round(drift(last.diastolicBP, 5, 40, 130)),
    spo2: Math.round(drift(last.spo2, 2, 70, 100)),
    respiratoryRate: Math.round(drift(last.respiratoryRate, 3, 4, 40)),
    temperature: parseFloat(drift(last.temperature, 0.2, 34, 42).toFixed(1)),
    glycemia: parseFloat(drift(last.glycemia, 0.6, 2.0, 30.0).toFixed(1)),
    consciousness: last.consciousness,
    timestamp: Date.now(),
  };

  const vitals = [...patient.vitals.slice(-29), newVitals];
  const newsScore = calculateNEWS(newVitals);
  const aiInsights = generateAIInsights({ ...patient, vitals, newsScore }, newsScore);
  return { ...patient, vitals, newsScore, aiInsights };
}
