import { ReactNode, useState } from 'react';
import { ViewType, Patient, ServiceType } from '../types';
import { Activity, Bell, LayoutDashboard, Users, Cpu, LogOut, Zap } from 'lucide-react';
import PatientManagement from './PatientManagement';

interface LayoutProps {
  children: ReactNode;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
  patients: Patient[];
  selectedPatient: Patient | null;
  serviceName?: string;
  service?: ServiceType;
  onPatientAdded?: () => void;
}

const navItems = [
  { id: 'dashboard' as ViewType, label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'alerts' as ViewType, label: 'Alertes', icon: Bell },
  { id: 'devices' as ViewType, label: 'Dispositifs', icon: Zap },
  { id: 'ai' as ViewType, label: 'Vue IA globale', icon: Cpu },
];

export default function Layout({ children, currentView, onNavigate, onLogout, patients, selectedPatient, serviceName = 'Réanimation 4.0', service = 'reanimation', onPatientAdded }: LayoutProps) {
  const criticalCount = patients.filter((p) => p.newsScore.risk === 'critical').length;
  const alertCount = patients.reduce(
    (acc, p) => acc + (p.newsScore.risk === 'critical' ? 1 : 0) + p.aiInsights.filter((i) => i.type === 'critical').length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="w-16 lg:w-56 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-4 border-b border-slate-800 gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-bold text-white leading-tight">{serviceName}</p>
            <p className="text-xs text-slate-500">Surveillance en temps réel</p>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id && !selectedPatient;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-2 lg:px-3 py-2.5 rounded-lg transition-colors relative ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="hidden lg:block text-sm font-medium">{item.label}</span>
                {item.id === 'alerts' && alertCount > 0 && (
                  <span className="ml-auto hidden lg:flex items-center justify-center bg-red-500 text-white text-xs rounded-full w-5 h-5 font-bold">
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 pb-1">
            <p className="hidden lg:block text-xs text-slate-600 uppercase tracking-wider px-3 mb-2">Patients</p>
          </div>

          {patients.map((p) => {
            const isSelected = selectedPatient?.id === p.id;
            const dotColor = {
              low: 'bg-emerald-400',
              medium: 'bg-amber-400',
              high: 'bg-orange-400',
              critical: 'bg-red-500 animate-pulse',
            }[p.newsScore.risk];
            return (
              <button
                key={p.id}
                onClick={() => onNavigate('patient')}
                className={`w-full flex items-center gap-3 px-2 lg:px-3 py-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="relative shrink-0">
                  <Users className="w-4 h-4" />
                  <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${dotColor}`} />
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <p className="text-xs font-medium truncate">{p.name.split(' ')[0]} {p.name.split(' ')[1]?.[0]}.</p>
                  <p className="text-xs text-slate-500">{p.bed} · NEWS {p.newsScore.total}</p>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-2 border-t border-slate-800">
          {criticalCount > 0 && (
            <div className="hidden lg:flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="text-xs text-red-400">{criticalCount} critique{criticalCount > 1 ? 's' : ''}</span>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-3 py-2.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:block text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-white">
              {selectedPatient ? selectedPatient.name : navItems.find((n) => n.id === currentView)?.label ?? 'Tableau de bord'}
            </p>
            <p className="text-xs text-slate-500">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!selectedPatient && onPatientAdded && (
              <PatientManagement service={service} onPatientAdded={onPatientAdded} />
            )}
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Temps réel
            </div>
            {alertCount > 0 && (
              <button
                onClick={() => onNavigate('alerts')}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                <Bell className="w-4 h-4 text-red-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              </button>
            )}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
