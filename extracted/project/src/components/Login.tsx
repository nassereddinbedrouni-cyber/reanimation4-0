import { useState } from 'react';
import { Activity, Shield, AlertTriangle, Heart, AlertCircle, Baby } from 'lucide-react';
import { ServiceType } from '../types';

interface LoginProps {
  onLogin: (service: ServiceType) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [service, setService] = useState<ServiceType>('reanimation');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const DEMO_USERS = [
    { user: 'infirmier1', pass: 'demo123', role: 'Infirmier(e)' },
    { user: 'medecin1', pass: 'demo123', role: 'Médecin' },
    { user: 'admin', pass: 'admin123', role: 'Administrateur' },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const found = DEMO_USERS.find((u) => u.user === username && u.pass === password);
      if (found) {
        onLogin(service);
      } else {
        setError('Identifiants incorrects. Utilisez les comptes de démonstration.');
      }
      setLoading(false);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Activity className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Réanimation 4.0</h1>
          <p className="text-slate-400 mt-2 text-sm">Système intelligent de surveillance en soins critiques</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Service</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'reanimation', label: 'Réanimation', icon: Heart, color: 'text-red-400' },
                  { id: 'soinsIntensifs', label: 'Soins Intensifs', icon: AlertCircle, color: 'text-orange-400' },
                  { id: 'dechocage', label: 'Déchocage', icon: AlertTriangle, color: 'text-amber-400' },
                  { id: 'neonatologie', label: 'Néonatologie', icon: Baby, color: 'text-cyan-400' },
                ].map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setService(id as ServiceType)}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                      service === id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="text-xs font-medium text-white text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Identifiant</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="infirmier1 / medecin1"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo123"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-semibold rounded-lg px-4 py-3 transition-colors"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Comptes de démonstration
            </p>
            <div className="space-y-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.user}
                  onClick={() => { setUsername(u.user); setPassword(u.pass); }}
                  className="w-full text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg px-3 py-2 transition-colors"
                >
                  <span className="text-xs text-cyan-400 font-mono">{u.user}</span>
                  <span className="text-xs text-slate-500 ml-2">/ demo123 – {u.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Prototype de démonstration – Aucune donnée réelle
        </p>
      </div>
    </div>
  );
}
