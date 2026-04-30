import { useState } from 'react';
import { Patient, Alert } from '../types';
import { Bell, BellOff, AlertTriangle, Zap, Brain, Activity } from 'lucide-react';

interface AlertPanelProps {
  patients: Patient[];
}

function generateAlerts(patients: Patient[]): Alert[] {
  const alerts: Alert[] = [];
  patients.forEach((p) => {
    const v = p.vitals[p.vitals.length - 1];
    if (p.newsScore.risk === 'critical') {
      alerts.push({
        id: `news-${p.id}`,
        patientId: p.id,
        patientName: p.name,
        severity: 'critical',
        message: `Score NEWS critique (${p.newsScore.total}) – Intervention immédiate requise`,
        type: 'news',
        timestamp: Date.now() - 30000,
        acknowledged: false,
      });
    } else if (p.newsScore.risk === 'high') {
      alerts.push({
        id: `news-h-${p.id}`,
        patientId: p.id,
        patientName: p.name,
        severity: 'moderate',
        message: `Score NEWS élevé (${p.newsScore.total}) – Évaluation urgente`,
        type: 'news',
        timestamp: Date.now() - 120000,
        acknowledged: false,
      });
    }
    if (v.spo2 < 92) {
      alerts.push({
        id: `spo2-${p.id}`,
        patientId: p.id,
        patientName: p.name,
        severity: 'critical',
        message: `SpO2 critique : ${v.spo2}% – Hypoxémie sévère`,
        type: 'vital',
        timestamp: Date.now() - 60000,
        acknowledged: false,
      });
    }
    p.aiInsights.forEach((insight, i) => {
      if (insight.type === 'critical') {
        alerts.push({
          id: `ai-${p.id}-${i}`,
          patientId: p.id,
          patientName: p.name,
          severity: 'critical',
          message: `IA : ${insight.title} – ${insight.description.slice(0, 80)}...`,
          type: 'ai',
          timestamp: insight.timestamp - 15000,
          acknowledged: false,
        });
      }
    });
    p.devices.forEach((d) => {
      if (d.status === 'error') {
        alerts.push({
          id: `dev-${p.id}-${d.id}`,
          patientId: p.id,
          patientName: p.name,
          severity: 'moderate',
          message: `Dispositif : ${d.name} – ${d.detail}`,
          type: 'device',
          timestamp: Date.now() - 600000,
          acknowledged: false,
        });
      }
    });
  });
  return alerts.sort((a, b) => {
    const order = { critical: 0, moderate: 1, low: 2 };
    return order[a.severity] - order[b.severity] || b.timestamp - a.timestamp;
  });
}

const severityConfig = {
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400 border-red-500/30' },
  moderate: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  low: { bg: 'bg-slate-700/30', border: 'border-slate-600/30', text: 'text-slate-400', badge: 'bg-slate-700/50 text-slate-400 border-slate-600/30' },
};

const typeIcon = {
  news: Activity,
  vital: AlertTriangle,
  ai: Brain,
  device: Zap,
};

const typeLabel = {
  news: 'NEWS',
  vital: 'Paramètre vital',
  ai: 'Analyse IA',
  device: 'Dispositif',
};

export default function AlertPanel({ patients }: AlertPanelProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const allAlerts = generateAlerts(patients);
  const visible = allAlerts.filter((a) => !dismissed.has(a.id));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Centre d'alertes
          </h2>
          <p className="text-slate-400 text-sm mt-1">{visible.length} alerte{visible.length > 1 ? 's' : ''} active{visible.length > 1 ? 's' : ''}</p>
        </div>
        {visible.length > 0 && (
          <button
            onClick={() => setDismissed(new Set(allAlerts.map((a) => a.id)))}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            <BellOff className="w-3.5 h-3.5" />
            Tout acquitter
          </button>
        )}
      </div>

      {visible.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aucune alerte active</p>
          <p className="text-sm mt-1">Tous les patients sont surveillés</p>
        </div>
      )}

      <div className="space-y-3">
        {visible.map((alert) => {
          const sc = severityConfig[alert.severity];
          const Icon = typeIcon[alert.type];
          const elapsed = Math.floor((Date.now() - alert.timestamp) / 60000);
          return (
            <div key={alert.id} className={`rounded-xl border p-4 ${sc.bg} ${sc.border}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${sc.bg} border ${sc.border}`}>
                  <Icon className={`w-4 h-4 ${sc.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-white">{alert.patientName}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${sc.badge}`}>
                      {alert.severity === 'critical' ? 'CRITIQUE' : alert.severity === 'moderate' ? 'MODÉRÉ' : 'FAIBLE'}
                    </span>
                    <span className="text-xs text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">{typeLabel[alert.type]}</span>
                  </div>
                  <p className="text-sm text-slate-300">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Il y a {elapsed < 1 ? 'moins d\'une minute' : `${elapsed} minute${elapsed > 1 ? 's' : ''}`}
                  </p>
                </div>
                <button
                  onClick={() => setDismissed((d) => new Set([...d, alert.id]))}
                  className="text-slate-500 hover:text-white transition-colors shrink-0 text-xs"
                >
                  Acquitter
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
