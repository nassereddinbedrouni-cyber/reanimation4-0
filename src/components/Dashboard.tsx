import { Patient } from '../types';
import PatientCard from './PatientCard';
import { Activity, AlertTriangle, Users, TrendingUp } from 'lucide-react';

interface DashboardProps {
  patients: Patient[];
  onSelectPatient: (id: string) => void;
}

export default function Dashboard({ patients, onSelectPatient }: DashboardProps) {
  const critical = patients.filter((p) => p.newsScore.risk === 'critical' || p.newsScore.risk === 'high');
  const moderate = patients.filter((p) => p.newsScore.risk === 'medium');
  const stable = patients.filter((p) => p.newsScore.risk === 'low');
  const totalAlerts = patients.reduce((acc, p) => acc + p.aiInsights.filter((i) => i.type === 'critical').length, 0);

  const stats = [
    { label: 'Patients en surveillance', value: patients.length, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { label: 'État critique / élevé', value: critical.length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { label: 'Alertes IA actives', value: totalAlerts, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'Patients stables', value: stable.length, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Tableau de bord – Vue d'ensemble</h2>
        <p className="text-slate-400 text-sm mt-1">Surveillance en temps réel · {new Date().toLocaleString('fr-FR')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${s.bg} border ${s.border} mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {critical.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Patients critiques / risque élevé ({critical.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {critical.map((p) => (
              <PatientCard key={p.id} patient={p} onClick={() => onSelectPatient(p.id)} />
            ))}
          </div>
        </div>
      )}

      {moderate.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Risque modéré ({moderate.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {moderate.map((p) => (
              <PatientCard key={p.id} patient={p} onClick={() => onSelectPatient(p.id)} />
            ))}
          </div>
        </div>
      )}

      {stable.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Stables ({stable.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {stable.map((p) => (
              <PatientCard key={p.id} patient={p} onClick={() => onSelectPatient(p.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
