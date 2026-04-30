import { Patient } from '../types';
import { Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DevicesViewProps {
  patients: Patient[];
  onSelectPatient: (id: string) => void;
}

const typeLabels: Record<string, string> = {
  catheter: 'Cathéter',
  perfusion: 'Perfusion',
  ventilator: 'Ventilateur',
  monitor: 'Moniteur',
  pump: 'Pompe',
};

const statusConfig = {
  normal: { icon: CheckCircle, color: 'text-emerald-400', label: 'Normal' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', label: 'Attention' },
  error: { icon: XCircle, color: 'text-red-400', label: 'Erreur' },
};

export default function DevicesView({ patients, onSelectPatient }: DevicesViewProps) {
  const allDevices = patients.flatMap((p) =>
    p.devices.map((d) => ({ ...d, patientName: p.name, patientId: p.id, bed: p.bed }))
  );
  const errors = allDevices.filter((d) => d.status === 'error');
  const warnings = allDevices.filter((d) => d.status === 'warning');
  const normals = allDevices.filter((d) => d.status === 'normal');

  const Section = ({ title, devices, color }: { title: string; devices: typeof allDevices; color: string }) => {
    if (devices.length === 0) return null;
    return (
      <div>
        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${color}`}>{title} ({devices.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {devices.map((d, i) => {
            const sc = statusConfig[d.status];
            return (
              <button
                key={i}
                onClick={() => onSelectPatient(d.patientId)}
                className="text-left bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs text-slate-500">{typeLabels[d.type] ?? d.type}</span>
                    <p className="text-sm font-semibold text-white mt-0.5">{d.name}</p>
                  </div>
                  <sc.icon className={`w-5 h-5 ${sc.color} shrink-0`} />
                </div>
                <p className={`text-xs ${sc.color} mb-2`}>{d.detail}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{d.patientName}</span>
                  <span>{d.bed}</span>
                </div>
                {d.insertedDays !== undefined && (
                  <div className="mt-2 text-xs text-slate-500">
                    En place depuis <span className={d.insertedDays > 5 ? 'text-orange-400 font-medium' : ''}>{d.insertedDays} jour{d.insertedDays > 1 ? 's' : ''}</span>
                    {d.insertedDays > 5 && <span className="text-orange-400 ml-1">· Risque infectieux</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          Surveillance des dispositifs médicaux
        </h2>
        <p className="text-slate-400 text-sm mt-1">{allDevices.length} dispositif{allDevices.length > 1 ? 's' : ''} en service</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{errors.length}</div>
          <div className="text-xs text-slate-400 mt-1">Erreurs</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{warnings.length}</div>
          <div className="text-xs text-slate-400 mt-1">Avertissements</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{normals.length}</div>
          <div className="text-xs text-slate-400 mt-1">Normaux</div>
        </div>
      </div>

      <Section title="Erreurs" devices={errors} color="text-red-400" />
      <Section title="Avertissements" devices={warnings} color="text-amber-400" />
      <Section title="Fonctionnement normal" devices={normals} color="text-emerald-400" />
    </div>
  );
}
