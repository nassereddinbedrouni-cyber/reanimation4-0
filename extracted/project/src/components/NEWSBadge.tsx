import { NEWSScore } from '../types';

interface NEWSBadgeProps {
  score: NEWSScore;
  compact?: boolean;
}

const riskConfig = {
  low: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Faible' },
  medium: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Modéré' },
  high: { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-400', label: 'Élevé' },
  critical: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-500 animate-pulse', label: 'Critique' },
};

export default function NEWSBadge({ score, compact = false }: NEWSBadgeProps) {
  const c = riskConfig[score.risk];

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${c.bg} ${c.border} ${c.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        NEWS {score.total}
      </span>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-300">Score NEWS</span>
        <span className={`text-2xl font-bold ${c.text}`}>{score.total}</span>
      </div>
      <div className={`text-xs font-semibold ${c.text} mb-2 flex items-center gap-1.5`}>
        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
        Risque {c.label}
      </div>
      <p className="text-xs text-slate-400">{score.interpretation}</p>

      <div className="mt-3 pt-3 border-t border-slate-700/50 grid grid-cols-3 gap-2">
        {[
          { label: 'FR', value: score.respiratoryRate },
          { label: 'SpO2', value: score.spo2 },
          { label: 'Temp', value: score.temperature },
          { label: 'PAS', value: score.systolicBP },
          { label: 'FC', value: score.heartRate },
          { label: 'Conscience', value: score.consciousness },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className={`text-sm font-bold ${item.value > 0 ? c.text : 'text-slate-300'}`}>{item.value}</div>
            <div className="text-xs text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
