import { MedicalDevice } from '../types';
import { Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DeviceMonitoringProps {
  devices: MedicalDevice[];
}

const typeLabels: Record<MedicalDevice['type'], string> = {
  catheter: 'Cathéter',
  perfusion: 'Perfusion',
  ventilator: 'Ventilateur',
  monitor: 'Moniteur',
  pump: 'Pompe',
};

const typeColors: Record<MedicalDevice['type'], string> = {
  catheter: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  perfusion: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  ventilator: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  monitor: 'text-slate-300 bg-slate-500/10 border-slate-500/20',
  pump: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

const statusConfig = {
  normal: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

export default function DeviceMonitoring({ devices }: DeviceMonitoringProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
        <Zap className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold text-white">Dispositifs médicaux</span>
        <span className="ml-auto text-xs text-slate-500">{devices.length} dispositif{devices.length > 1 ? 's' : ''}</span>
      </div>
      <div className="p-4 space-y-3">
        {devices.map((device) => {
          const sc = statusConfig[device.status];
          const tc = typeColors[device.type];
          return (
            <div key={device.id} className={`rounded-lg border p-3 ${sc.bg} ${sc.border}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${tc}`}>
                      {typeLabels[device.type]}
                    </span>
                    <span className="text-xs font-semibold text-white">{device.name}</span>
                  </div>
                  <p className={`text-xs mt-1 ${sc.color}`}>{device.detail}</p>
                  {device.insertedDays !== undefined && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      En place depuis {device.insertedDays} jour{device.insertedDays > 1 ? 's' : ''}
                      {device.riskLevel === 'high' && <span className="text-orange-400 ml-1">· Risque infectieux</span>}
                      {device.riskLevel === 'medium' && <span className="text-amber-400 ml-1">· Surveillance requise</span>}
                    </p>
                  )}
                </div>
                <sc.icon className={`w-4 h-4 shrink-0 ${sc.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
