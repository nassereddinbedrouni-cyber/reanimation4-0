import { useState, useEffect } from 'react';
import { Camera, Eye, AlertCircle } from 'lucide-react';

interface CameraFinding {
  label: string;
  value: string;
  status: 'normal' | 'warning' | 'alert';
}

export default function CameraSimulation() {
  const [frame, setFrame] = useState(0);
  const [findings, setFindings] = useState<CameraFinding[]>([
    { label: 'Respiration visuelle', value: 'Détectée – rythme régulier', status: 'normal' },
    { label: 'Mouvements corporels', value: 'Minimes – patient calme', status: 'normal' },
    { label: 'Expression faciale', value: 'Neutre', status: 'normal' },
    { label: 'Signes de douleur', value: 'Non détectés', status: 'normal' },
    { label: 'Position lit', value: 'Semi-assis 30°', status: 'normal' },
  ]);

  useEffect(() => {
    const anim = setInterval(() => setFrame((f) => (f + 1) % 3), 2000);
    return () => clearInterval(anim);
  }, []);

  useEffect(() => {
    const update = setInterval(() => {
      setFindings([
        { label: 'Respiration visuelle', value: `Détectée – ${Math.floor(12 + Math.random() * 8)}/min`, status: 'normal' },
        { label: 'Mouvements corporels', value: Math.random() > 0.8 ? 'Agitation détectée' : 'Minimes – patient calme', status: Math.random() > 0.8 ? 'warning' : 'normal' },
        { label: 'Expression faciale', value: Math.random() > 0.85 ? 'Grimace possible' : 'Neutre', status: Math.random() > 0.85 ? 'warning' : 'normal' },
        { label: 'Signes de douleur', value: Math.random() > 0.9 ? 'Signal positif détecté' : 'Non détectés', status: Math.random() > 0.9 ? 'alert' : 'normal' },
        { label: 'Position lit', value: 'Semi-assis 30°', status: 'normal' },
      ]);
    }, 5000);
    return () => clearInterval(update);
  }, []);

  const statusConfig = {
    normal: 'text-emerald-400',
    warning: 'text-amber-400',
    alert: 'text-red-400',
  };

  const framePatterns = [
    'M10,35 Q70,20 140,35 Q210,50 280,35',
    'M10,35 Q70,15 140,35 Q210,55 280,35',
    'M10,35 Q70,25 140,35 Q210,45 280,35',
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
        <Camera className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold text-white">Surveillance visuelle IA</span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Simulation active
        </span>
      </div>

      <div className="relative bg-slate-950 h-48 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-10">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-cyan-500/30" />
          ))}
        </div>

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 mx-auto mb-3 flex items-center justify-center">
            <Eye className="w-8 h-8 text-slate-400" />
          </div>
          <svg width="280" height="60" viewBox="0 0 280 60" className="mx-auto">
            <path
              d={framePatterns[frame]}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
            <circle cx="10" cy="35" r="3" fill="#06b6d4" opacity="0.6" />
            <circle cx="280" cy="35" r="3" fill="#06b6d4" opacity="0.6" />
          </svg>
          <p className="text-xs text-slate-500 mt-2">Flux vidéo simulé – Camera IR</p>
        </div>

        <div className="absolute top-2 left-2 bg-red-600/90 text-white text-xs px-1.5 py-0.5 rounded font-mono">
          REC
        </div>
        <div className="absolute top-2 right-2 text-xs text-slate-500 font-mono">
          {new Date().toLocaleTimeString('fr-FR')}
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-slate-500">
          CAM-01 · Box patient
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-1.5 mb-3">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-500">Analyse temps réel par vision artificielle</span>
        </div>
        {findings.map((f) => (
          <div key={f.label} className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{f.label}</span>
            <span className={`text-xs font-medium ${statusConfig[f.status]}`}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
