/*
  # Create patients and vitals tables

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `patient_number` (integer, unique) - Numéro du patient
      - `name` (text) - Nom du patient
      - `service` (text) - Service (reanimation, soinsIntensifs, dechocage, neonatologie)
      - `box_number` (integer, nullable) - Numéro de box (pour néonatologie)
      - `maternal_name` (text, nullable) - Nom de la mère
      - `maternal_first_name` (text, nullable) - Prénom de la mère
      - `gender` (text) - Genre (M/F)
      - `date_of_birth` (timestamptz) - Date de naissance
      - `apgar_score` (integer, nullable) - Score d'Apgar (néonatologie)
      - `status` (text) - État (admitted, discharged)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `vitals`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `temperature` (numeric) - °C
      - `heart_rate` (integer) - bpm
      - `blood_pressure_systolic` (integer) - mmHg
      - `blood_pressure_diastolic` (integer) - mmHg
      - `respiratory_rate` (integer) - breaths/min
      - `oxygen_saturation` (numeric) - %
      - `glycemia` (numeric) - g/l
      - `recorded_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage patient data
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_number integer UNIQUE NOT NULL,
  name text NOT NULL,
  service text NOT NULL CHECK (service IN ('reanimation', 'soinsIntensifs', 'dechocage', 'neonatologie')),
  box_number integer,
  maternal_name text,
  maternal_first_name text,
  gender text CHECK (gender IN ('M', 'F')),
  date_of_birth timestamptz NOT NULL,
  apgar_score integer CHECK (apgar_score IS NULL OR (apgar_score >= 0 AND apgar_score <= 10)),
  status text DEFAULT 'admitted' CHECK (status IN ('admitted', 'discharged')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  temperature numeric,
  heart_rate integer,
  blood_pressure_systolic integer,
  blood_pressure_diastolic integer,
  respiratory_rate integer,
  oxygen_saturation numeric,
  glycemia numeric,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all patients"
  ON patients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update patients"
  ON patients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete patients"
  ON patients FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view vitals"
  ON vitals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert vitals"
  ON vitals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX idx_patients_service ON patients(service);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_patient_number ON patients(patient_number);
CREATE INDEX idx_vitals_patient_id ON vitals(patient_id);
CREATE INDEX idx_vitals_recorded_at ON vitals(recorded_at);
