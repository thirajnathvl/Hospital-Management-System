-- =======================================================
-- MedCore Database Schema & Seed Data for Supabase
-- =======================================================

-- 1. CLEANUP EXISTING TABLES (IF ANY)
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS records CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;

-- 2. CREATE DOCTORS TABLE
CREATE TABLE doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  experience TEXT NOT NULL,
  availability TEXT NOT NULL DEFAULT 'Available',
  room TEXT NOT NULL,
  avatar TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE APPOINTMENTS TABLE
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  doctor_id TEXT REFERENCES doctors(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE PRESCRIPTIONS TABLE
CREATE TABLE prescriptions (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  drug_name TEXT NOT NULL,
  dose TEXT NOT NULL,
  duration TEXT NOT NULL,
  refills INTEGER NOT NULL DEFAULT 0,
  doctor TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Filled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE RECORDS TABLE
CREATE TABLE records (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  doctor TEXT NOT NULL,
  bp TEXT NOT NULL,
  pulse INTEGER NOT NULL,
  temp NUMERIC(4,1) NOT NULL,
  diagnosis TEXT NOT NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CREATE INVOICES TABLE
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  "desc" TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  insurance NUMERIC(10,2) NOT NULL,
  copay NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables public CRUD access for easy setup of demo clients.
-- =======================================================

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON doctors FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON doctors FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON doctors FOR UPDATE USING (true);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON appointments FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON appointments FOR UPDATE USING (true);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON prescriptions FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON prescriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON prescriptions FOR UPDATE USING (true);

ALTER TABLE records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON records FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON records FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON records FOR UPDATE USING (true);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON invoices FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON invoices FOR UPDATE USING (true);

-- =======================================================
-- SEED DATA
-- =======================================================

-- Seed Doctors
INSERT INTO doctors (id, name, specialty, rating, experience, availability, room, avatar, phone) VALUES
('doc-connor', 'Dr. Sarah Connor', 'Cardiology', 4.9, '14 years', 'Available', 'Room 302, Floor 3', 'SC', '+1 555-0102'),
('doc-house', 'Dr. Gregory House', 'Neurology', 4.8, '22 years', 'On Break', 'Room 305, Floor 3', 'GH', '+1 555-0105'),
('doc-watson', 'Dr. John Watson', 'General Medicine', 4.7, '10 years', 'Offline', 'Room 102, Floor 1', 'JW', '+1 555-0108'),
('doc-grey', 'Dr. Meredith Grey', 'Pediatrics', 4.9, '12 years', 'Available', 'Room 310, Floor 3', 'MG', '+1 555-0111'),
('doc-strange', 'Dr. Stephen Strange', 'Orthopedics', 5.0, '18 years', 'Available', 'Room 201, Floor 2', 'SS', '+1 555-0120'),
('doc-foster', 'Dr. Jane Foster', 'Dermatology', 4.6, '8 years', 'Available', 'Room 312, Floor 3', 'JF', '+1 555-0133');

-- Seed Appointments
INSERT INTO appointments (id, patient_name, patient_id, doctor_name, doctor_id, date, time, reason, status) VALUES
('apt-101', 'John Doe', 'PT-980042', 'Dr. Sarah Connor', 'doc-connor', '2026-07-03', '10:00 AM', 'Annual cardiovascular checkup & ECG review.', 'Confirmed'),
('apt-102', 'John Doe', 'PT-980042', 'Dr. Stephen Strange', 'doc-strange', '2026-07-15', '02:00 PM', 'Post-fracture orthopedics follow-up.', 'Confirmed'),
('apt-103', 'Mary Smith', 'PT-980056', 'Dr. Sarah Connor', 'doc-connor', '2026-07-02', '09:00 AM', 'Hypertension monitoring.', 'Completed'),
('apt-104', 'Robert Johnson', 'PT-980091', 'Dr. Sarah Connor', 'doc-connor', '2026-07-02', '11:30 AM', 'Arrhythmia check.', 'Confirmed');

-- Seed Prescriptions
INSERT INTO prescriptions (id, patient_name, drug_name, dose, duration, refills, doctor, date, status) VALUES
('rx-201', 'John Doe', 'Lisinopril 10mg', '1 tablet daily', '30 days', 2, 'Dr. Sarah Connor', '2026-06-15', 'Filled'),
('rx-202', 'John Doe', 'Atorvastatin 20mg', '1 tablet at bedtime', '90 days', 1, 'Dr. Sarah Connor', '2026-06-15', 'Filled'),
('rx-203', 'John Doe', 'Amoxicillin 500mg', '1 capsule three times daily', '7 days', 0, 'Dr. John Watson', '2026-05-10', 'Expired');

-- Seed Records
INSERT INTO records (id, patient_name, date, type, doctor, bp, pulse, temp, diagnosis, notes) VALUES
('rec-301', 'John Doe', '2026-06-15', 'Cardiology Checkup', 'Dr. Sarah Connor', '120/80', 72, 98.6, 'Normal sinus rhythm, bp controlled under lisinopril.', 'Patient reports feeling well with active daily exercise. Rest blood pressure at 120/80. Confirmed continuation of Lisinopril 10mg. Next checkup scheduled in 3 months.'),
('rec-302', 'John Doe', '2026-05-10', 'General Consultation', 'Dr. John Watson', '118/76', 68, 101.2, 'Acute Pharyngitis (Throat Infection)', 'Presented with sore throat, fever (101.2F) and swallowing difficulty for 2 days. Red swollen tonsils noted. Prescribed 7-day course of Amoxicillin 500mg. Recommended throat lozenges and hydration.'),
('rec-303', 'John Doe', '2026-03-01', 'Orthopedic Diagnostics', 'Dr. Stephen Strange', '122/82', 75, 98.4, 'Fracture of Distal Radius (Left Wrist)', 'Wrist trauma following fall from bicycle. X-ray confirms hairline fracture of left distal radius. Immobilized wrist in synthetic fiberglass cast for 6 weeks. Encouraged finger movements.');

-- Seed Invoices
INSERT INTO invoices (id, date, "desc", total, insurance, copay, status) VALUES
('inv-401', '2026-07-02', 'Cardiology Consultation (O.P.D)', 150.00, 120.00, 30.00, 'Pending'),
('inv-402', '2026-06-15', 'Electrocardiogram (ECG) & Blood Lipid Panel Labs', 320.00, 256.00, 64.00, 'Paid'),
('inv-403', '2026-05-10', 'General OPD Tariff + Streptococcal Throat Test', 95.00, 76.00, 19.00, 'Paid'),
('inv-404', '2026-03-01', 'Orthopedics Cast Application & Radiograph (Wrist)', 600.00, 480.00, 120.00, 'Paid');
