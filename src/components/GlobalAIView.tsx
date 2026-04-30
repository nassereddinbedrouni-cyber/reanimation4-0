import { Patient } from '../types';
import { Brain, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

interface GlobalAIViewProps {
  patients: Patient[];
  onSelectPatient: (id: string) => void;
}

const riskConfig = {
  low: { label: 'Faible', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500' },
  medium: { label: 'Modéré', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-500' },
  high: { label: 'Élevé', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: 'bg-orange-500' },
  critical: { label: 'Critique', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', bar: 'bg-red-500' },
};

export default function GlobalAIView({ patients, onSelectPatient }: GlobalAIViewProps) {
  const allInsights = patients.flatMap((p) =>
    p.aiInsights.map((insight) => ({ ...insight, patientName: p.name, patientId: p.id }))
  );
  const criticalInsights = allInsights.filter((i) => i.type === 'critical');
  const warningInsights = allInsights.filter((i) => i.type === 'warning');

  const avgNEWS = (patients.reduce((a, p) => a + p.newsScore.total, 0) / patients.length).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          Vue IA globale
        </h2>
        <p className="text-slate-400 text-sm mt-1">Analyse intelligente de l'ensemble des patients</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="text-2xl font-bold text-red-400">{criticalInsights.length}</div>
          <div className="text-xs text-slate-400 mt-1">Alertes IA critiques</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="text-2xl font-bold text-amber-400">{warningInsights.length}</div>
          <div className="text-xs text-slate-400 mt-1">Avertissements IA</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
          <div className="text-2xl font-bold text-cyan-400">{avgNEWS}</div>
          <div className="text-xs text-slate-400 mt-1">Score NEWS moyen</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{patients.length}</div>
          <div className="text-xs text-slate-400 mt-1">Patients analysés</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Scores NEWS par patient</span>
          </div>
          <div className="p-4 space-y-3">
            {[...patients].sort((a, b) => b.newsScore.total - a.newsScore.total).map((p) => {
              const c = riskConfig[p.newsScore.risk];
              const pct = Math.min(100, (p.newsScore.total / 20) * 100);
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPatient(p.id)}
                  className="w-full text-left hover:bg-slate-800/50 rounded-lg p-2 -m-2 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${c.color}`}>{c.label}</span>
                      <span className={`text-sm font-bold ${c.color}`}>{p.newsScore.total}</span>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${c.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{p.bed} · {p.diagnosis}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {criticalInsights.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold text-white">Alertes critiques IA</span>
              </div>
              <div className="p-4 space-y-3">
                {criticalInsights.map((insight, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectPatient(insight.patientId)}
                    className="w-full text-left bg-red-500/10 border border-red-500/20 rounded-lg p-3 hover:bg-red-500/15 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-red-400">{insight.patientName}</span>
                      <span className="text-xs text-slate-500">{insight.confidence}% confiance</span>
                    </div>
                    <p className="text-xs font-medium text-white">{insight.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{insight.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-xl">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Recommandations système</span>
            </div>
            <div className="p-4 space-y-2">
              {patients.filter((p) => p.newsScore.risk === 'critical').map((p) => (
                <div key={p.id} className="text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <span className="text-red-400 font-semibold">{p.name}</span>
                  <span className="text-slate-300 ml-1">→ Intervention immédiate requise (NEWS {p.newsScore.total})</span>
                </div>
              ))}
              {patients.filter((p) => p.newsScore.risk === 'high').map((p) => (
                <div key={p.id} className="text-xs bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <span className="text-amber-400 font-semibold">{p.name}</span>
                  <span className="text-slate-300 ml-1">→ Évaluation clinique urgente (NEWS {p.newsScore.total})</span>
                </div>
              ))}
              {patients.filter((p) => p.newsScore.risk === 'medium').map((p) => (
                <div key={p.id} className="text-xs bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <span className="text-slate-300 font-semibold">{p.name}</span>
                  <span className="text-slate-400 ml-1">→ Renforcer la surveillance (NEWS {p.newsScore.total})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
