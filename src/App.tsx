import { useState, useEffect, useCallback } from 'react';
import { Patient, ViewType, ServiceType } from './types';
import { updatePatientVitals, createPatientsByService } from './lib/simulatedData';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatientProfile from './components/PatientProfile';
import AlertPanel from './components/AlertPanel';
import GlobalAIView from './components/GlobalAIView';
import DevicesView from './components/DevicesView';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [service, setService] = useState<ServiceType>('reanimation');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    if (loggedIn) {
      const newPatients = createPatientsByService(service);
      setPatients(newPatients);
    }
  }, [loggedIn, service]);

  const handlePatientAdded = useCallback(() => {
    const updatedPatients = createPatientsByService(service);
    setPatients(updatedPatients);
  }, [service]);

  useEffect(() => {
    if (!loggedIn || patients.length === 0) return;
    const interval = setInterval(() => {
      setPatients((prev) => prev.map((p) => updatePatientVitals(p)));
    }, 5000);
    return () => clearInterval(interval);
  }, [loggedIn, patients.length]);

  const handleSelectPatient = useCallback((id: string) => {
    setSelectedPatientId(id);
    setView('patient');
  }, []);

  const handleNavigate = useCallback((v: ViewType) => {
    setView(v);
    if (v !== 'patient') setSelectedPatientId(null);
  }, []);

  const selectedPatient = selectedPatientId ? patients.find((p) => p.id === selectedPatientId) ?? null : null;

  if (!loggedIn) {
    return <Login onLogin={(svc) => { setService(svc); setLoggedIn(true); }} />;
  }

  const renderContent = () => {
    if (view === 'patient' && selectedPatient) {
      return (
        <PatientProfile
          patient={selectedPatient}
          onBack={() => { setView('dashboard'); setSelectedPatientId(null); }}
        />
      );
    }
    if (view === 'alerts') return <AlertPanel patients={patients} />;
    if (view === 'ai') return <GlobalAIView patients={patients} onSelectPatient={handleSelectPatient} />;
    if (view === 'devices') return <DevicesView patients={patients} onSelectPatient={handleSelectPatient} />;
    return <Dashboard patients={patients} onSelectPatient={handleSelectPatient} />;
  };

  const serviceNames: Record<ServiceType, string> = {
    reanimation: 'Réanimation',
    soinsIntensifs: 'Soins Intensifs',
    dechocage: 'Déchocage',
    neonatologie: 'Néonatologie',
  };

  return (
    <Layout
      currentView={view}
      onNavigate={handleNavigate}
      onLogout={() => { setLoggedIn(false); setPatients([]); setView('dashboard'); }}
      patients={patients}
      selectedPatient={selectedPatient}
      serviceName={serviceNames[service]}
      service={service}
      onPatientAdded={handlePatientAdded}
    >
      {renderContent()}
    </Layout>
  );
}
