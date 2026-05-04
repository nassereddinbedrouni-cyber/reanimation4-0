import { Patient } from '../types';
import NEWSBadge from './NEWSBadge';
import { Heart, Wind, Thermometer, Activity, Eye, Droplets } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

const consciousnessColor: Record<string, string> = {
  Alert: 'text-emerald-400',
  Voice: 'text-amber-400',
  Pain: 'text-orange-400',
  Unresponsive: 'text-red-400',
};

export default function PatientCard({ patient, onClick }: PatientCardProps) {
  const vitals = patient.vitals[patient.vitals.length - 1];
  const riskBorder = {
    low: 'border-l-emerald-500',
    medium: 'border-l-amber-500',
    high: 'border-l-orange-500',
    critical: 'border-l-red-500',
  }[patient.newsScore.risk];

  const hasCriticalAlert = patient.aiInsights.some((i) => i.type === 'critical');

  return (
    <div
      onClick={onClick}
      className={`bg-slate-900 border border-slate-800 border-l-4 ${riskBorder} rounded-xl p-4 cursor-pointer hover:bg-slate-800/80 transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 group`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">{patient.bed}</span>
            {hasCriticalAlert && (
              <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded px-1.5 py-0.5 animate-pulse">
                ALERTE
              </span>
            )}
          </div>
          <h3 className="text-white font-semibold mt-0.5 group-hover:text-cyan-300 transition-colors">{patient.name}</h3>
          <p className="text-xs text-slate-500">{patient.isNeonatal && patient.ageInDays ? `${patient.ageInDays} j` : `${patient.age} ans`} · {patient.gender === 'M' ? 'Homme' : 'Femme'}</p>
        </div>
        <NEWSBadge score={patient.newsScore} compact />
      </div>

      <p className="text-xs text-slate-400 mb-3 truncate">{patient.diagnosis}</p>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-white">{vitals.heartRate}</div>
            <div className="text-xs text-slate-500">bpm</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-white">{vitals.systolicBP}/{vitals.diastolicBP}</div>
            <div className="text-xs text-slate-500">mmHg</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-white">{vitals.spo2}%</div>
            <div className="text-xs text-slate-500">SpO2</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-white">{vitals.temperature}°</div>
            <div className="text-xs text-slate-500">°C</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-white">{vitals.respiratoryRate}</div>
            <div className="text-xs text-slate-500">/min</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div>
            <div className={`text-xs font-semibold ${consciousnessColor[vitals.consciousness]}`}>{vitals.consciousness}</div>
            <div className="text-xs text-slate-500">AVPU</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className={`w-3.5 h-3.5 shrink-0 ${vitals.glycemia < 0.6 || vitals.glycemia > 3.6 ? 'text-red-400' : vitals.glycemia < 0.7 || vitals.glycemia > 1.8 ? 'text-amber-400' : 'text-violet-400'}`} />
          <div>
            <div className={`text-xs font-semibold ${vitals.glycemia < 0.6 || vitals.glycemia > 3.6 ? 'text-red-400' : vitals.glycemia < 0.7 || vitals.glycemia > 1.8 ? 'text-amber-400' : 'text-white'}`}>{vitals.glycemia}</div>
            <div className="text-xs text-slate-500">g/l</div>
          </div>
        </div>
      </div>
    </div>
  );
}
