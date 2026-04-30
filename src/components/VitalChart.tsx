import { VitalSigns } from '../types';

interface VitalChartProps {
  vitals: VitalSigns[];
  metric: keyof Omit<VitalSigns, 'consciousness' | 'timestamp'>;
  label: string;
  unit: string;
  color: string;
  min?: number;
  max?: number;
}

export default function VitalChart({ vitals, metric, label, unit, color, min, max }: VitalChartProps) {
  const values = vitals.map((v) => v[metric] as number);
  const dataMin = min ?? Math.min(...values) * 0.95;
  const dataMax = max ?? Math.max(...values) * 1.05;
  const range = dataMax - dataMin || 1;

  const width = 280;
  const height = 70;
  const pad = { left: 4, right: 4, top: 6, bottom: 6 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const points = values.map((v, i) => {
    const x = pad.left + (i / Math.max(values.length - 1, 1)) * chartW;
    const y = pad.top + chartH - ((v - dataMin) / range) * chartH;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');
  const fillPath = `M${pad.left},${pad.top + chartH} L${points.join(' L')} L${pad.left + chartW},${pad.top + chartH} Z`;

  const latest = values[values.length - 1];

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <span className={`text-base font-bold ${color}`}>
          {typeof latest === 'number' ? (Number.isInteger(latest) ? latest : latest.toFixed(1)) : latest}
          <span className="text-xs font-normal text-slate-500 ml-1">{unit}</span>
        </span>
      </div>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" className={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" className={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill={`url(#grad-${metric})`} opacity="0.4" />
        <polyline
          points={polyline}
          fill="none"
          stroke="currentColor"
          className={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {values.length > 0 && (() => {
          const last = points[points.length - 1].split(',');
          return <circle cx={last[0]} cy={last[1]} r="2.5" fill="currentColor" className={color} />;
        })()}
      </svg>
      <div className="flex justify-between text-xs text-slate-600 mt-1">
        <span>-{Math.round((values.length - 1) * 5)}m</span>
        <span>maintenant</span>
      </div>
    </div>
  );
}
