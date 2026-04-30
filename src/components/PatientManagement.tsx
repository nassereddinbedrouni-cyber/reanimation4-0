import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { addPatient, removePatient } from '../lib/patientService';
import { ServiceType } from '../types';

interface PatientManagementProps {
  service: ServiceType;
  onPatientAdded: () => void;
}

export default function PatientManagement({ service, onPatientAdded }: PatientManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRemoveForm, setShowRemoveForm] = useState(false);
  const [formData, setFormData] = useState({
    patientNumber: '',
    name: '',
    gender: 'M' as 'M' | 'F',
    dateOfBirth: '',
    boxNumber: '',
    maternalName: '',
    maternalFirstName: '',
    apgarScore: '',
  });
  const [patientIdToRemove, setPatientIdToRemove] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isNeonatal = service === 'neonatologie';

  const handleAddPatient = async () => {
    setLoading(true);
    setError('');

    try {
      const dateOfBirth = new Date(formData.dateOfBirth);
      const now = new Date();
      const ageInDays = Math.floor((now.getTime() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24));

      if (isNeonatal && ageInDays > 28) {
        setError('En néonatologie, l\'âge ne doit pas dépasser 28 jours');
        setLoading(false);
        return;
      }

      const result = await addPatient(
        parseInt(formData.patientNumber),
        formData.name,
        service,
        formData.gender,
        formData.dateOfBirth,
        isNeonatal ? parseInt(formData.boxNumber) : undefined,
        isNeonatal ? formData.maternalName : undefined,
        isNeonatal ? formData.maternalFirstName : undefined,
        isNeonatal ? parseInt(formData.apgarScore) : undefined
      );

      if (result) {
        setShowAddForm(false);
        setFormData({
          patientNumber: '',
          name: '',
          gender: 'M',
          dateOfBirth: '',
          boxNumber: '',
          maternalName: '',
          maternalFirstName: '',
          apgarScore: '',
        });
        onPatientAdded();
      } else {
        setError('Erreur lors de l\'ajout du patient');
      }
    } catch (err) {
      setError('Erreur: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePatient = async (patientId: string) => {
    setLoading(true);
    setError('');

    try {
      const success = await removePatient(patientId);
      if (success) {
        setShowRemoveForm(false);
        setPatientIdToRemove('');
        onPatientAdded();
      } else {
        setError('Erreur lors de la suppression du patient');
      }
    } catch (err) {
      setError('Erreur: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={20} />
        Admission
      </button>

      <button
        onClick={() => setShowRemoveForm(!showRemoveForm)}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <Trash2 size={20} />
        Sortie
      </button>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Admission Patient</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

            <div className="space-y-4">
              <input
                type="number"
                placeholder="Numéro du patient"
                value={formData.patientNumber}
                onChange={(e) => setFormData({ ...formData, patientNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
              </div>

              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {isNeonatal && (
                <>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Numéro de box (1-10)"
                      min="1"
                      max="10"
                      value={formData.boxNumber}
                      onChange={(e) => setFormData({ ...formData, boxNumber: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Nom de la mère"
                    value={formData.maternalName}
                    onChange={(e) => setFormData({ ...formData, maternalName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Prénom de la mère"
                    value={formData.maternalFirstName}
                    onChange={(e) => setFormData({ ...formData, maternalFirstName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="number"
                    placeholder="Score d'Apgar (0-10)"
                    min="0"
                    max="10"
                    value={formData.apgarScore}
                    onChange={(e) => setFormData({ ...formData, apgarScore: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddPatient}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'Traitement...' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRemoveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sortie Patient</h2>
              <button onClick={() => setShowRemoveForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="ID du patient"
                value={patientIdToRemove}
                onChange={(e) => setPatientIdToRemove(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowRemoveForm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleRemovePatient(patientIdToRemove)}
                  disabled={loading || !patientIdToRemove}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                >
                  {loading ? 'Traitement...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
