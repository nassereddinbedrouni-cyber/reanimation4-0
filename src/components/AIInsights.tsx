import { AIInsight } from '../types';
import { Brain, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

interface AIInsightsProps {
  insights: AIInsight[];
}

const typeConfig = {
  info: { icon: Info, bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', label: 'Information' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', label: 'Avertissement' },
  critical: { icon: ShieldAlert, bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', label: 'Critique' },
};

export default function AIInsights({ insights }: AIInsightsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
        <Brain className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold text-white">Analyse IA</span>
        <span className="ml-auto text-xs text-slate-500">{insights.length} résultat{insights.length > 1 ? 's' : ''}</span>
      </div>
      <div className="p-4 space-y-3">
        {insights.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">Aucune anomalie détectée</p>
        )}
        {insights.map((insight, i) => {
          const c = typeConfig[insight.type];
          return (
            <div key={i} className={`rounded-lg border p-3 ${c.bg} ${c.border}`}>
              <div className="flex items-start gap-2.5">
                <c.icon className={`w-4 h-4 mt-0.5 shrink-0 ${c.text}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`text-xs font-semibold ${c.text}`}>{insight.title}</span>
                    <span className="text-xs text-slate-500">Confiance : {insight.confidence}%</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-800 rounded-full h-1.5">
              <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: '73%' }} />
            </div>
            <span className="text-xs text-slate-500">Modèle IA actif</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
}
