import { Patient } from '../types';
import NEWSBadge from './NEWSBadge';
import VitalChart from './VitalChart';
import AIInsights from './AIInsights';
import DeviceMonitoring from './DeviceMonitoring';
import CameraSimulation from './CameraSimulation';
import {
  ArrowLeft, Heart, Wind, Thermometer, Activity, Eye,
  User, Pill, TestTube, FileText, Droplets
} from 'lucide-react';

interface PatientProfileProps {
  patient: Patient;
  onBack: () => void;
}

const consciousnessColors: Record<string, string> = {
  Alert: 'text-emerald-400',
  Voice: 'text-amber-400',
  Pain: 'text-orange-400',
  Unresponsive: 'text-red-400',
};

const bioStatusColors = {
  normal: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  abnormal: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function PatientProfile({ patient, onBack }: PatientProfileProps) {
  const vitals = patient.vitals[patient.vitals.length - 1];

  const vitalConfigs = [
    { metric: 'heartRate' as const, label: 'Fréquence cardiaque', unit: 'bpm', color: 'text-rose-400', min: 30, max: 200 },
    { metric: 'systolicBP' as const, label: 'Pression systolique', unit: 'mmHg', color: 'text-cyan-400', min: 60, max: 240 },
    { metric: 'spo2' as const, label: 'SpO2', unit: '%', color: 'text-sky-400', min: 70, max: 100 },
    { metric: 'respiratoryRate' as const, label: 'Fréquence respiratoire', unit: '/min', color: 'text-teal-400', min: 4, max: 40 },
    { metric: 'temperature' as const, label: 'Température', unit: '°C', color: 'text-amber-400', min: 34, max: 42 },
    { metric: 'diastolicBP' as const, label: 'Pression diastolique', unit: 'mmHg', color: 'text-slate-300', min: 40, max: 130 },
    { metric: 'glycemia' as const, label: 'Glycémie', unit: 'mmol/L', color: 'text-pink-400', min: 2, max: 30 },
  ];

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au tableau de bord
      </button>

      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{patient.name}</h2>
                <p className="text-slate-400 text-sm">{patient.age} ans · {patient.gender === 'M' ? 'Homme' : 'Femme'} · {patient.bed}</p>
              </div>
            </div>
            <NEWSBadge score={patient.newsScore} compact />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-500 text-xs">Diagnostic</span>
              <p className="text-white font-medium mt-0.5">{patient.diagnosis}</p>
            </div>
            <div>
              <span className="text-slate-500 text-xs">Médecin référent</span>
              <p className="text-white font-medium mt-0.5">{patient.physician}</p>
            </div>
            <div>
              <span className="text-slate-500 text-xs">Admission</span>
              <p className="text-white font-medium mt-0.5">{patient.admissionDate}</p>
            </div>
            <div>
              <span className="text-slate-500 text-xs">Allergies</span>
              <p className="text-white font-medium mt-0.5">{patient.allergies.length > 0 ? patient.allergies.join(', ') : 'Aucune connue'}</p>
            </div>
          </div>
        </div>

        <div className="lg:w-64">
          <NEWSBadge score={patient.newsScore} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { icon: Heart, label: 'FC', value: `${vitals.heartRate}`, unit: 'bpm', color: 'text-rose-400' },
          { icon: Activity, label: 'PA', value: `${vitals.systolicBP}/${vitals.diastolicBP}`, unit: 'mmHg', color: 'text-cyan-400' },
          { icon: Wind, label: 'SpO2', value: `${vitals.spo2}%`, unit: '', color: 'text-sky-400' },
          { icon: Wind, label: 'FR', value: `${vitals.respiratoryRate}`, unit: '/min', color: 'text-teal-400' },
          { icon: Thermometer, label: 'Temp', value: `${vitals.temperature}°C`, unit: '', color: 'text-amber-400' },
          {
            icon: Droplets,
            label: 'Glycémie',
            value: `${vitals.glycemia}`,
            unit: 'mmol/L',
            color: vitals.glycemia < 3.0 || vitals.glycemia > 20 ? 'text-red-400' : vitals.glycemia < 4.0 || vitals.glycemia > 10 ? 'text-amber-400' : 'text-pink-400',
          },
          { icon: Eye, label: 'AVPU', value: vitals.consciousness, unit: '', color: consciousnessColors[vitals.consciousness] },
        ].map((item) => (
          <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.color}`} />
            <div className={`text-base font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-slate-500">{item.label} {item.unit}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Graphiques de tendance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {vitalConfigs.map((vc) => (
            <VitalChart
              key={vc.metric}
              vitals={patient.vitals}
              metric={vc.metric}
              label={vc.label}
              unit={vc.unit}
              color={vc.color}
              min={vc.min}
              max={vc.max}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Traitements</span>
            </div>
            <ul className="space-y-2">
              {patient.treatments.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Comorbidités</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.comorbidities.map((c, i) => (
                <span key={i} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TestTube className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Résultats biologiques</span>
            </div>
            <div className="space-y-2">
              {patient.biologicalResults.map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{r.name}</span>
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${bioStatusColors[r.status]}`}>
                    {r.value} {r.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <AIInsights insights={patient.aiInsights} />
          <DeviceMonitoring devices={patient.devices} />
        </div>

        <div>
          <CameraSimulation />
          <div className="mt-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Aide à la décision clinique
            </h4>
            <div className="space-y-2">
              {patient.aiInsights.filter((i) => i.type === 'critical').map((insight, i) => (
                <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-xs text-red-400 font-semibold">{insight.title}</p>
                  <p className="text-xs text-slate-300 mt-1">→ Alerter immédiatement l'équipe médicale</p>
                </div>
              ))}
              {patient.newsScore.risk === 'critical' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-xs text-red-400 font-semibold">Score NEWS critique ({patient.newsScore.total})</p>
                  <p className="text-xs text-slate-300 mt-1">→ Intervention immédiate requise</p>
                </div>
              )}
              {patient.newsScore.risk === 'high' && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-xs text-amber-400 font-semibold">Risque élevé de détérioration</p>
                  <p className="text-xs text-slate-300 mt-1">→ Réévaluation clinique urgente</p>
                </div>
              )}
              {patient.newsScore.risk === 'medium' && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-xs text-amber-400 font-semibold">Surveillance renforcée</p>
                  <p className="text-xs text-slate-300 mt-1">→ Augmenter la fréquence de surveillance</p>
                </div>
              )}
              {patient.newsScore.risk === 'low' && patient.aiInsights.every((i) => i.type === 'info') && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-xs text-emerald-400 font-semibold">Patient stable</p>
                  <p className="text-xs text-slate-300 mt-1">→ Maintenir la surveillance de routine</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
