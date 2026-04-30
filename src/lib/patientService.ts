import { supabase } from './supabase';
import { Patient, ServiceType } from '../types';

export async function getPatientsByService(service: ServiceType): Promise<Patient[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('service', service)
    .eq('status', 'admitted')
    .order('patient_number');

  if (error) {
    console.error('Error fetching patients:', error);
    return [];
  }

  return (data || []).map(mapSupabaseToPatient);
}

export async function addPatient(
  patientNumber: number,
  name: string,
  service: ServiceType,
  gender: 'M' | 'F',
  dateOfBirth: string,
  boxNumber?: number,
  maternalName?: string,
  maternalFirstName?: string,
  apgarScore?: number
): Promise<Patient | null> {
  const { data, error } = await supabase
    .from('patients')
    .insert([
      {
        patient_number: patientNumber,
        name,
        service,
        gender,
        date_of_birth: new Date(dateOfBirth).toISOString(),
        box_number: boxNumber,
        maternal_name: maternalName,
        maternal_first_name: maternalFirstName,
        apgar_score: apgarScore,
        status: 'admitted',
      },
    ])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error adding patient:', error);
    return null;
  }

  return data ? mapSupabaseToPatient(data) : null;
}

export async function removePatient(patientId: string): Promise<boolean> {
  const { error } = await supabase
    .from('patients')
    .update({ status: 'discharged' })
    .eq('id', patientId);

  if (error) {
    console.error('Error removing patient:', error);
    return false;
  }

  return true;
}

export async function getPatientByNumber(patientNumber: number): Promise<Patient | null> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('patient_number', patientNumber)
    .maybeSingle();

  if (error) {
    console.error('Error fetching patient:', error);
    return null;
  }

  return data ? mapSupabaseToPatient(data) : null;
}

function mapSupabaseToPatient(data: any): Patient {
  const dateOfBirth = new Date(data.date_of_birth);
  const now = new Date();
  const ageInDays = Math.floor((now.getTime() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24));
  const ageInYears = Math.floor(ageInDays / 365);

  return {
    id: data.id,
    patientNumber: data.patient_number,
    name: data.name,
    age: ageInYears,
    ageInDays,
    gender: data.gender,
    bed: `Box ${data.box_number || 'N/A'}`,
    diagnosis: 'Monitoring',
    comorbidities: [],
    admissionDate: new Date(data.created_at).toLocaleDateString(),
    physician: 'Dr.',
    treatments: [],
    allergies: [],
    vitals: [],
    devices: [],
    biologicalResults: [],
    aiInsights: [],
    newsScore: { total: 0, respiratoryRate: 0, spo2: 0, temperature: 0, systolicBP: 0, heartRate: 0, consciousness: 0, risk: 'low', interpretation: '' },
    service: data.service,
    isNeonatal: data.service === 'neonatologie',
    boxNumber: data.box_number,
    maternalName: data.maternal_name,
    maternalFirstName: data.maternal_first_name,
    apgarScore: data.apgar_score,
    status: data.status,
  };
}
