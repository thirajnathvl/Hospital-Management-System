/* ==========================================
   MedCore Hospital Management JavaScript Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Safety fallback for Lucide icons library to prevent CDN failure crashes
  const lucide = window.lucide || { createIcons: () => console.warn("Lucide SDK not loaded.") };
  
  // ==========================================
  // 1. Initial State & Comprehensive Mock Data
  // ==========================================
  const State = {
    currentRole: 'patient', // 'patient' | 'doctor' | 'admin'
    currentView: 'patient-dashboard',
    theme: localStorage.getItem('medcore-theme') || 'light',
    emergencyState: false,
    notifications: [
      { id: 1, title: 'Appointment Confirmed', desc: 'Your meeting with Dr. Connor is scheduled for tomorrow.', time: '10 mins ago', read: false },
      { id: 2, title: 'Prescription Refill', desc: 'Lisinopril 10mg has been dispatched to Outpatient Pharmacy.', time: '2 hours ago', read: false },
      { id: 3, title: 'Diagnostic Report Ready', desc: 'Blood Lipid Panel report uploaded by Lab Department.', time: '1 day ago', read: true }
    ],
    doctors: [
      { id: 'doc-connor', name: 'Dr. Sarah Connor', specialty: 'Cardiology', rating: 4.9, experience: '14 years', availability: 'Available', room: 'Room 302, Floor 3', avatar: 'SC', phone: '+1 555-0102' },
      { id: 'doc-house', name: 'Dr. Gregory House', specialty: 'Neurology', rating: 4.8, experience: '22 years', availability: 'On Break', room: 'Room 305, Floor 3', avatar: 'GH', phone: '+1 555-0105' },
      { id: 'doc-watson', name: 'Dr. John Watson', specialty: 'General Medicine', rating: 4.7, experience: '10 years', availability: 'Offline', room: 'Room 102, Floor 1', avatar: 'JW', phone: '+1 555-0108' },
      { id: 'doc-grey', name: 'Dr. Meredith Grey', specialty: 'Pediatrics', rating: 4.9, experience: '12 years', availability: 'Available', room: 'Room 310, Floor 3', avatar: 'MG', phone: '+1 555-0111' },
      { id: 'doc-strange', name: 'Dr. Stephen Strange', specialty: 'Orthopedics', rating: 5.0, experience: '18 years', availability: 'Available', room: 'Room 201, Floor 2', avatar: 'SS', phone: '+1 555-0120' },
      { id: 'doc-foster', name: 'Dr. Jane Foster', specialty: 'Dermatology', rating: 4.6, experience: '8 years', availability: 'Available', room: 'Room 312, Floor 3', avatar: 'JF', phone: '+1 555-0133' }
    ],
    appointments: [
      { id: 'apt-101', patientName: 'John Doe', patientId: 'PT-980042', doctorName: 'Dr. Sarah Connor', doctorId: 'doc-connor', date: '2026-07-03', time: '10:00 AM', reason: 'Annual cardiovascular checkup & ECG review.', status: 'Confirmed' },
      { id: 'apt-102', patientName: 'John Doe', patientId: 'PT-980042', doctorName: 'Dr. Stephen Strange', doctorId: 'doc-strange', date: '2026-07-15', time: '02:00 PM', reason: 'Post-fracture orthopedics follow-up.', status: 'Confirmed' },
      { id: 'apt-103', patientName: 'Mary Smith', patientId: 'PT-980056', doctorName: 'Dr. Sarah Connor', doctorId: 'doc-connor', date: '2026-07-02', time: '09:00 AM', reason: 'Hypertension monitoring.', status: 'Completed' },
      { id: 'apt-104', patientName: 'Robert Johnson', patientId: 'PT-980091', doctorName: 'Dr. Sarah Connor', doctorId: 'doc-connor', date: '2026-07-02', time: '11:30 AM', reason: 'Arrhythmia check.', status: 'Confirmed' }
    ],
    prescriptions: [
      { id: 'rx-201', patientName: 'John Doe', drugName: 'Lisinopril 10mg', dose: '1 tablet daily', duration: '30 days', refills: 2, doctor: 'Dr. Sarah Connor', date: '2026-06-15', status: 'Filled' },
      { id: 'rx-202', patientName: 'John Doe', drugName: 'Atorvastatin 20mg', dose: '1 tablet at bedtime', duration: '90 days', refills: 1, doctor: 'Dr. Sarah Connor', date: '2026-06-15', status: 'Filled' },
      { id: 'rx-203', patientName: 'John Doe', drugName: 'Amoxicillin 500mg', dose: '1 capsule three times daily', duration: '7 days', refills: 0, doctor: 'Dr. John Watson', date: '2026-05-10', status: 'Expired' }
    ],
    records: [
      { id: 'rec-301', patientName: 'John Doe', date: '2026-06-15', type: 'Cardiology Checkup', doctor: 'Dr. Sarah Connor', bp: '120/80', pulse: 72, temp: 98.6, diagnosis: 'Normal sinus rhythm, bp controlled under lisinopril.', notes: 'Patient reports feeling well with active daily exercise. Rest blood pressure at 120/80. Confirmed continuation of Lisinopril 10mg. Next checkup scheduled in 3 months.' },
      { id: 'rec-302', patientName: 'John Doe', date: '2026-05-10', type: 'General Consultation', doctor: 'Dr. John Watson', bp: '118/76', pulse: 68, temp: 101.2, diagnosis: 'Acute Pharyngitis (Throat Infection)', notes: 'Presented with sore throat, fever (101.2F) and swallowing difficulty for 2 days. Red swollen tonsils noted. Prescribed 7-day course of Amoxicillin 500mg. Recommended throat lozenges and hydration.' },
      { id: 'rec-303', patientName: 'John Doe', date: '2026-03-01', type: 'Orthopedic Diagnostics', doctor: 'Dr. Stephen Strange', bp: '122/82', pulse: 75, temp: 98.4, diagnosis: 'Fracture of Distal Radius (Left Wrist)', notes: 'Wrist trauma following fall from bicycle. X-ray confirms hairline fracture of left distal radius. Immobilized wrist in synthetic fiberglass cast for 6 weeks. Encouraged finger movements.' }
    ],
    invoices: [
      { id: 'inv-401', date: '2026-07-02', desc: 'Cardiology Consultation (O.P.D)', total: 150.00, insurance: 120.00, copay: 30.00, status: 'Pending' },
      { id: 'inv-402', date: '2026-06-15', desc: 'Electrocardiogram (ECG) & Blood Lipid Panel Labs', total: 320.00, insurance: 256.00, copay: 64.00, status: 'Paid' },
      { id: 'inv-403', date: '2026-05-10', desc: 'General OPD Tariff + Streptococcal Throat Test', total: 95.00, insurance: 76.00, copay: 19.00, status: 'Paid' },
      { id: 'inv-404', date: '2026-03-01', desc: 'Orthopedics Cast Application & Radiograph (Wrist)', total: 600.00, insurance: 480.00, copay: 120.00, status: 'Paid' }
    ],
    wards: [
      { name: 'Intensive Care Unit (ICU)', totalBeds: 20, occupiedBeds: 18, criticalLevel: 'danger' },
      { name: 'Cardiovascular Care Unit (CCU)', totalBeds: 15, occupiedBeds: 11, criticalLevel: 'warning' },
      { name: 'General Medicine Ward (Ward A)', totalBeds: 50, occupiedBeds: 32, criticalLevel: 'normal' },
      { name: 'Pediatric Care Ward (Ward B)', totalBeds: 25, occupiedBeds: 12, criticalLevel: 'normal' },
      { name: 'Surgical Wards & Recovery Rooms', totalBeds: 30, occupiedBeds: 15, criticalLevel: 'normal' }
    ],
    admissionLogs: [
      { id: 'log-1', time: '10:48 AM', patient: 'Emma Watson', action: 'Admitted to ER - Severe Asthma Flareup', type: 'rose' },
      { id: 'log-2', time: '10:15 AM', patient: 'Dave Miller', action: 'Discharged from Ward A - Wrist cast removed', type: 'green' },
      { id: 'log-3', time: '09:30 AM', patient: 'Arthur Pendragon', action: 'Scheduled for Coronary Bypass surgery', type: 'orange' },
      { id: 'log-4', time: '08:45 AM', patient: 'Clara Oswald', action: 'Admitted to CCU - Heart palpitation evaluation', type: 'rose' }
    ],
    services: {
      consultations: [
        { name: 'General Outpatient OPD Consultation', cost: '$50.00', copay: '$10.00', time: 'Immediate checkup / 20 mins' },
        { name: 'Specialist Cardiology / Neurology Consult', cost: '$150.00', copay: '$30.00', time: 'Scheduled slots / 30 mins' },
        { name: 'Emergency Room Intake & Triage Care', cost: '$250.00', copay: '$50.00', time: 'Instant priority triage' },
        { name: 'ICU Critical Care Day Tariff', cost: '$1,500.00', copay: '$300.00', time: 'Per day billing rate' },
        { name: 'General Ward Shared Bed Tariff', cost: '$200.00', copay: '$40.00', time: 'Per day billing rate' }
      ],
      diagnostics: [
        { name: 'Complete Blood Count (CBC) Panel', cost: '$45.00', copay: '$9.00', time: 'Results in 4 hours' },
        { name: 'Blood Lipid / Cholesterol Panel', cost: '$60.00', copay: '$12.00', time: 'Results in 6 hours' },
        { name: 'Unalysis & Renal Metabolic Labs', cost: '$55.00', copay: '$11.00', time: 'Results in 3 hours' },
        { name: 'Thyroid Stimulating Hormone (TSH) Test', cost: '$80.00', copay: '$16.00', time: 'Results in 12 hours' }
      ],
      imaging: [
        { name: 'Digital Chest X-Ray (A.P / Lateral Views)', cost: '$120.00', copay: '$24.00', time: 'Ready in 30 minutes' },
        { name: 'High-Res Cranial CT Scan (Head)', cost: '$450.00', copay: '$90.00', time: 'Scan: 15m / Report: 2h' },
        { name: 'Magnetic Resonance Imaging (MRI) scan', cost: '$850.00', copay: '$170.00', time: 'Scan: 45m / Report: 4h' },
        { name: 'Cardiac Stress Test & Echocardiogram', cost: '$380.00', copay: '$76.00', time: 'Session time: 1 hour' }
      ],
      surgeries: [
        { name: 'Laparoscopic Appendectomy (Appendix Removal)', cost: '$4,200.00', copay: '$840.00', time: 'Procedure: 1.5 hours' },
        { name: 'Coronary Angioplasty & Stent Placement', cost: '$8,500.00', copay: '$1,700.00', time: 'Procedure: 2 hours' },
        { name: 'Total Knee / Joint Replacement', cost: '$11,000.00', copay: '$2,200.00', time: 'Procedure: 3 hours' }
      ]
    },
    mapLevels: {
      "3": {
        title: "Level 3 - Specialty Clinics & Private Wards",
        rooms: [
          { id: "room-301", name: "Cardiology Clinic", x: 50, y: 50, w: 180, h: 100, color: "#eff6ff", stroke: "#2563eb", desc: "Dr. Sarah Connor's Clinic Office" },
          { id: "room-302", name: "Neurology Clinic", x: 260, y: 50, w: 180, h: 100, color: "#f5f3ff", stroke: "#8b5cf6", desc: "Dr. Gregory House's Clinic Office" },
          { id: "room-303", name: "Pediatrics Clinic", x: 470, y: 50, w: 180, h: 100, color: "#fdf2f8", stroke: "#ec4899", desc: "Dr. Meredith Grey's Clinic Office" },
          { id: "room-304", name: "Specialty Ward B", x: 50, y: 190, w: 280, h: 110, color: "#f0fdfa", stroke: "#14b8a6", desc: "Semi-private medical recovery beds" },
          { id: "room-305", name: "Nurse Station 3", x: 360, y: 190, w: 90, h: 110, color: "#ecfdf5", stroke: "#10b981", desc: "Duty nurses desk level 3" },
          { id: "room-306", name: "Dermatology Clinic", x: 470, y: 190, w: 180, h: 110, color: "#fffbeb", stroke: "#f59e0b", desc: "Dr. Jane Foster's Dermatology consult" }
        ]
      },
      "2": {
        title: "Level 2 - Operation Theatres & ICU Wing",
        rooms: [
          { id: "room-201", name: "Operation Theatre 1", x: 50, y: 50, w: 180, h: 110, color: "#fff1f2", stroke: "#f43f5e", desc: "Main Cardiac Surgery OR" },
          { id: "room-202", name: "Operation Theatre 2", x: 250, y: 50, w: 180, h: 110, color: "#fff1f2", stroke: "#f43f5e", desc: "General & Laparoscopy OR" },
          { id: "room-203", name: "Orthopedics Unit", x: 450, y: 50, w: 200, h: 110, color: "#eff6ff", stroke: "#2563eb", desc: "Dr. Stephen Strange's Unit" },
          { id: "room-204", name: "Intensive Care Unit (ICU)", x: 50, y: 190, w: 320, h: 110, color: "#fff5f5", stroke: "#ef4444", desc: "Critical Level ICU Ward - 20 Bed Capacity" },
          { id: "room-205", name: "ICU Lounge", x: 390, y: 190, w: 100, h: 110, color: "#f8fafc", stroke: "#64748b", desc: "ICU Patient family waiting area" },
          { id: "room-206", name: "Anesthesiology Lab", x: 510, y: 190, w: 140, h: 110, color: "#f5f3ff", stroke: "#8b5cf6", desc: "Anesthetic prep & drug logs room" }
        ]
      },
      "1": {
        title: "Level 1 - Emergency Trauma & Labs",
        rooms: [
          { id: "room-101", name: "Emergency Department (ER)", x: 50, y: 50, w: 320, h: 110, color: "#fff1f2", stroke: "#f43f5e", desc: "Level 1 Trauma Triage Unit" },
          { id: "room-102", name: "Radiology (X-Ray / MRI)", x: 390, y: 50, w: 260, h: 110, color: "#eff6ff", stroke: "#2563eb", desc: "Diagnostic scans & imaging center" },
          { id: "room-103", name: "Pathology Labs", x: 50, y: 190, w: 200, h: 110, color: "#f0fdfa", stroke: "#14b8a6", desc: "Clinical pathology, blood labs & toxicology" },
          { id: "room-104", name: "General Medicine Consult", x: 270, y: 190, w: 200, h: 110, color: "#fdf4ff", stroke: "#d946ef", desc: "Dr. John Watson's General Consult Office" },
          { id: "room-105", name: "Blood Bank Store", x: 490, y: 190, w: 160, h: 110, color: "#fff5f5", stroke: "#ef4444", desc: "Blood donation & refrigeration stores" }
        ]
      },
      "0": {
        title: "Ground Floor - Lobby, Registrations & Pharmacy",
        rooms: [
          { id: "room-001", name: "Main Reception Desk", x: 50, y: 50, w: 250, h: 110, color: "#f0fdf4", stroke: "#16a34a", desc: "Patient registration & inquiry counter" },
          { id: "room-002", name: "Outpatient Pharmacy", x: 320, y: 50, w: 330, h: 110, color: "#eff6ff", stroke: "#2563eb", desc: "Prescription collection & health stores" },
          { id: "room-003", name: "Billing & Cashier", x: 50, y: 190, w: 200, h: 110, color: "#fffbeb", stroke: "#f59e0b", desc: "Inpatient/Outpatient accounts & insurance claims" },
          { id: "room-004", name: "Hospital Cafeteria", x: 270, y: 190, w: 200, h: 110, color: "#fafaf9", stroke: "#78716c", desc: "MedCafé - Food & refreshments dining room" },
          { id: "room-005", name: "Emergency Ambulance Bay", x: 490, y: 190, w: 160, h: 110, color: "#fff1f2", stroke: "#f43f5e", desc: "Direct ambulance ER intake area" }
        ]
      }
    },
    ambulances: [
      { id: "amb-1", code: "MED-01", status: "On Call", location: "Cardiology Emergency", eta: "4 mins" },
      { id: "amb-2", code: "MED-05", status: "Responding", location: "Downtown Highway A", eta: "8 mins" },
      { id: "amb-3", code: "MED-09", status: "Stationed", location: "Ambulance Bay Room 1", eta: "Ready" }
    ]
  };

  // ==========================================
  // 2. DOM Elements Selection & Cache
  // ==========================================
  const DOM = {
    // Layout
    themeToggleBtn: document.getElementById('sidebar-theme-toggle'),
    themeIconDark: document.querySelector('.theme-icon-dark'),
    themeIconLight: document.querySelector('.theme-icon-light'),
    roleSelect: document.getElementById('role-select'),
    headerHomeBtn: document.getElementById('header-home-btn'),
    sidebarLinksContainer: document.getElementById('portal-links'),
    contentArea: document.getElementById('content-area'),
    sidebar: document.getElementById('app-sidebar'),
    menuToggleBtn: document.getElementById('menu-toggle-btn'),
    closeSidebarBtn: document.getElementById('close-sidebar-btn'),
    sidebarUserName: document.getElementById('sidebar-user-name'),
    sidebarUserRole: document.getElementById('sidebar-user-role'),
    sidebarAvatar: document.getElementById('sidebar-avatar'),
    headerAvatar: document.getElementById('header-avatar'),
    
    // Notifications
    notiToggleBtn: document.getElementById('noti-toggle-btn'),
    notiBadge: document.getElementById('noti-badge'),
    notiDropdown: document.getElementById('noti-dropdown'),
    clearNotiBtn: document.getElementById('clear-noti-btn'),
    notiList: document.getElementById('noti-list'),
    
    // Global Search
    globalSearch: document.getElementById('global-search'),
    searchDropdown: document.getElementById('search-dropdown'),
    
    // SOS Overlay elements
    sosTrigger: document.getElementById('sidebar-sos-trigger'),
    sosOverlay: document.getElementById('sos-overlay'),
    cancelSosBtn: document.getElementById('cancel-sos-btn'),
    
    // Modals
    bookingModal: document.getElementById('booking-modal'),
    bookingModalBody: document.getElementById('booking-modal-body'),
    closeBookingModal: document.getElementById('close-booking-modal'),
    confirmBookingModalOk: document.getElementById('confirm-booking-modal-ok'),
    
    // Supabase Integration UI
    supabaseStatusBadge: document.getElementById('supabase-status-badge'),
    supabaseConfigBtn: document.getElementById('supabase-config-btn'),
    supabaseModal: document.getElementById('supabase-modal'),
    closeSupabaseModal: document.getElementById('close-supabase-modal'),
    supabaseConfigForm: document.getElementById('supabase-config-form'),
    supabaseUrlInput: document.getElementById('supabase-url'),
    supabaseKeyInput: document.getElementById('supabase-anon-key'),
    btnTestSupabase: document.getElementById('btn-test-supabase'),
    supabaseFeedback: document.getElementById('supabase-test-feedback'),
    supabaseDisconnectBlock: document.getElementById('supabase-disconnect-block'),
    btnDisconnectSupabase: document.getElementById('btn-disconnect-supabase'),
    
    // Patient Portal View nodes
    patDashboardApts: document.getElementById('patient-dashboard-appointments'),
    patDashboardMeds: document.getElementById('patient-dashboard-meds'),
    bookingSpecialty: document.getElementById('booking-specialty'),
    bookingDoctor: document.getElementById('booking-doctor'),
    bookingDate: document.getElementById('booking-date'),
    bookingTime: document.getElementById('booking-time'),
    bookingReason: document.getElementById('booking-reason'),
    bookingForm: document.getElementById('appointment-booking-form'),
    doctorBookingPreview: document.getElementById('doctor-booking-preview'),
    doctorBookingPreviewCard: document.getElementById('doctor-booking-preview-card'),
    patHistoryTimeline: document.getElementById('patient-history-timeline'),
    recordDetailsPanel: document.getElementById('record-details-panel'),
    prescriptionsGrid: document.getElementById('prescriptions-grid-container'),
    billingOutstanding: document.getElementById('billing-outstanding'),
    billingTableBody: document.getElementById('billing-table-body'),

    // User Profile UI nodes
    profileMenuBtn: document.getElementById('profile-menu-btn'),
    sidebarUserCard: document.querySelector('.sidebar-user-card'),
    profileModal: document.getElementById('profile-modal'),
    closeProfileModal: document.getElementById('close-profile-modal'),
    profileForm: document.getElementById('profile-edit-form'),
    profileInputName: document.getElementById('profile-input-name'),
    profileInputBlood: document.getElementById('profile-input-blood'),
    profileInputPhone: document.getElementById('profile-input-phone'),
    profileInputAllergies: document.getElementById('profile-input-allergies'),
    profileDisplayName: document.getElementById('profile-display-name'),
    profileAvatarChar: document.getElementById('profile-avatar-char'),
    
    // Doctor Portal View nodes
    docScheduleList: document.getElementById('doctor-schedule-list'),
    docEhrForm: document.getElementById('doctor-ehr-form'),
    docEhrPatientSelect: document.getElementById('ehr-patient'),
    doctorPatientPreview: document.getElementById('doctor-patient-preview'),
    doctorPatientPreviewCard: document.getElementById('doctor-patient-preview-card'),
    btnStatusActive: document.getElementById('btn-status-active'),
    btnStatusBreak: document.getElementById('btn-status-break'),
    btnStatusOut: document.getElementById('btn-status-out'),
    
    // Admin Portal View nodes
    adminEmergencyToggle: document.getElementById('admin-emergency-toggle'),
    adminWardList: document.getElementById('admin-ward-list'),
    adminActivityLogs: document.getElementById('admin-activity-logs'),
    
    // Information Hub View nodes
    docDirSearch: document.getElementById('doctor-dir-search'),
    docDirDept: document.getElementById('doctor-dir-dept'),
    docDirStatus: document.getElementById('doctor-dir-status'),
    docDirContainer: document.getElementById('doctor-dir-container'),
    servicesTabsContainer: document.getElementById('services-tabs-container'),
    servicesTableBody: document.getElementById('services-table-body'),
    mapLevelSelector: document.getElementById('map-level-selector'),
    mapRoomList: document.getElementById('map-room-list'),
    mapVisualContainer: document.getElementById('map-visual-container'),
    mapCurrentTitle: document.getElementById('map-current-title'),
    ambulanceStatusContainer: document.getElementById('ambulance-status-container')
  };

  // Set minimum date picker to today
  if (DOM.bookingDate) {
    const today = new Date().toISOString().split('T')[0];
    DOM.bookingDate.setAttribute('min', today);
  }

  // ==========================================
  // Supabase Database Manager
  // ==========================================
  let supabaseClient = null;

  const DBManager = {
    isConnected: false,

    async init() {
      const url = localStorage.getItem('medcore-supabase-url') || 'https://jbcqhqipugurmcuwiukm.supabase.co';
      const key = localStorage.getItem('medcore-supabase-key') || 'sb_publishable_4cdIgcyhcnb3GBdcbDk5kg_L8dGXYvB';
      if (url && key) {
        try {
          if (typeof supabase !== 'undefined') {
            supabaseClient = supabase.createClient(url, key);
            // Verify connection
            const { data, error } = await supabaseClient.from('doctors').select('id').limit(1);
            if (error) throw error;
            this.isConnected = true;
            this.updateStatusUI(true);
            console.log("Supabase initialized successfully.");
          } else {
            this.isConnected = false;
            this.updateStatusUI(false, "SDK missing");
          }
        } catch (e) {
          console.error("Supabase failed connection:", e);
          this.isConnected = false;
          this.updateStatusUI(false, "Connection error");
        }
      } else {
        this.isConnected = false;
        this.updateStatusUI(false);
      }
    },

    updateStatusUI(connected, errorMsg = '') {
      if (!DOM.supabaseStatusBadge) return;
      if (connected) {
        DOM.supabaseStatusBadge.className = "supabase-status-badge state-connected";
        DOM.supabaseStatusBadge.querySelector('span').innerText = "Cloud Sync";
        DOM.supabaseStatusBadge.querySelector('i').setAttribute('data-lucide', 'cloud-lightning');
        DOM.supabaseDisconnectBlock.classList.remove('hidden');
      } else {
        DOM.supabaseStatusBadge.className = "supabase-status-badge state-offline";
        DOM.supabaseStatusBadge.querySelector('span').innerText = errorMsg ? `Offline (${errorMsg})` : "Local Sync";
        DOM.supabaseStatusBadge.querySelector('i').setAttribute('data-lucide', 'cloud-off');
        DOM.supabaseDisconnectBlock.classList.add('hidden');
      }
      lucide.createIcons();
    },

    async testConnection(url, key) {
      try {
        if (typeof supabase === 'undefined') {
          return { success: false, message: 'Supabase SDK is not loaded' };
        }
        const tempClient = supabase.createClient(url, key);
        const { error } = await tempClient.from('doctors').select('id').limit(1);
        if (error) {
          return { success: false, message: error.message };
        }
        return { success: true };
      } catch (e) {
        return { success: false, message: e.message || 'Unknown network error' };
      }
    },

    async syncState() {
      if (!this.isConnected || !supabaseClient) {
        // Fall back: load from localStorage if there's any updates, or leave default mock
        const localApts = localStorage.getItem('medcore-local-appointments');
        if (localApts) State.appointments = JSON.parse(localApts);
        
        const localPrescr = localStorage.getItem('medcore-local-prescriptions');
        if (localPrescr) State.prescriptions = JSON.parse(localPrescr);

        const localRecs = localStorage.getItem('medcore-local-records');
        if (localRecs) State.records = JSON.parse(localRecs);

        const localInvoices = localStorage.getItem('medcore-local-invoices');
        if (localInvoices) State.invoices = JSON.parse(localInvoices);

        const localDocs = localStorage.getItem('medcore-local-doctors');
        if (localDocs) State.doctors = JSON.parse(localDocs);
        return;
      }

      try {
        // Load Doctors
        const { data: docs, error: errDocs } = await supabaseClient.from('doctors').select('*');
        if (errDocs) throw errDocs;
        if (docs && docs.length > 0) {
          State.doctors = docs.map(d => ({
            id: d.id,
            name: d.name,
            specialty: d.specialty,
            rating: parseFloat(d.rating),
            experience: d.experience,
            availability: d.availability,
            room: d.room,
            avatar: d.avatar,
            phone: d.phone
          }));
        }

        // Load Appointments
        const { data: apts, error: errApt } = await supabaseClient.from('appointments').select('*');
        if (errApt) throw errApt;
        if (apts) {
          State.appointments = apts.map(a => ({
            id: a.id,
            patientName: a.patient_name,
            patientId: a.patient_id,
            doctorName: a.doctor_name,
            doctorId: a.doctor_id,
            date: a.date,
            time: a.time,
            reason: a.reason,
            status: a.status
          }));
        }

        // Load Prescriptions
        const { data: rxs, error: errRx } = await supabaseClient.from('prescriptions').select('*');
        if (errRx) throw errRx;
        if (rxs) {
          State.prescriptions = rxs.map(r => ({
            id: r.id,
            patientName: r.patient_name,
            drugName: r.drug_name,
            dose: r.dose,
            duration: r.duration,
            refills: parseInt(r.refills),
            doctor: r.doctor,
            date: r.date,
            status: r.status
          }));
        }

        // Load Records
        const { data: recs, error: errRec } = await supabaseClient.from('records').select('*').order('date', { ascending: false });
        if (errRec) throw errRec;
        if (recs) {
          State.records = recs.map(r => ({
            id: r.id,
            patientName: r.patient_name,
            date: r.date,
            type: r.type,
            doctor: r.doctor,
            bp: r.bp,
            pulse: parseInt(r.pulse),
            temp: parseFloat(r.temp),
            diagnosis: r.diagnosis,
            notes: r.notes
          }));
        }

        // Load Invoices
        const { data: invs, error: errInv } = await supabaseClient.from('invoices').select('*').order('date', { ascending: false });
        if (errInv) throw errInv;
        if (invs) {
          State.invoices = invs.map(i => ({
            id: i.id,
            date: i.date,
            desc: i.desc,
            total: parseFloat(i.total),
            insurance: parseFloat(i.insurance),
            copay: parseFloat(i.copay),
            status: i.status
          }));
        }
      } catch (err) {
        console.error("Failed to sync records with Supabase:", err);
      }
    },

    async insertAppointment(apt) {
      if (this.isConnected && supabaseClient) {
        const { error } = await supabaseClient.from('appointments').insert({
          id: apt.id,
          patient_name: apt.patientName,
          patient_id: apt.patientId,
          doctor_name: apt.doctorName,
          doctor_id: apt.doctorId,
          date: apt.date,
          time: apt.time,
          reason: apt.reason,
          status: apt.status
        });
        if (error) console.error("Error inserting appointment:", error);
      } else {
        State.appointments.push(apt);
        localStorage.setItem('medcore-local-appointments', JSON.stringify(State.appointments));
      }
    },

    async insertInvoice(inv) {
      if (this.isConnected && supabaseClient) {
        const { error } = await supabaseClient.from('invoices').insert({
          id: inv.id,
          date: inv.date,
          desc: inv.desc,
          total: inv.total,
          insurance: inv.insurance,
          copay: inv.copay,
          status: inv.status
        });
        if (error) console.error("Error inserting invoice:", error);
      } else {
        State.invoices.unshift(inv);
        localStorage.setItem('medcore-local-invoices', JSON.stringify(State.invoices));
      }
    },

    async insertRecord(rec) {
      if (this.isConnected && supabaseClient) {
        const { error } = await supabaseClient.from('records').insert({
          id: rec.id,
          patient_name: rec.patientName,
          date: rec.date,
          type: rec.type,
          doctor: rec.doctor,
          bp: rec.bp,
          pulse: rec.pulse,
          temp: rec.temp,
          diagnosis: rec.diagnosis,
          notes: rec.notes
        });
        if (error) console.error("Error inserting record:", error);
      } else {
        State.records.unshift(rec);
        localStorage.setItem('medcore-local-records', JSON.stringify(State.records));
      }
    },

    async insertPrescription(rx) {
      if (this.isConnected && supabaseClient) {
        const { error } = await supabaseClient.from('prescriptions').insert({
          id: rx.id,
          patient_name: rx.patientName,
          drug_name: rx.drugName,
          dose: rx.dose,
          duration: rx.duration,
          refills: rx.refills,
          doctor: rx.doctor,
          date: rx.date,
          status: rx.status
        });
        if (error) console.error("Error inserting prescription:", error);
      } else {
        State.prescriptions.unshift(rx);
        localStorage.setItem('medcore-local-prescriptions', JSON.stringify(State.prescriptions));
      }
    },

    async updateInvoiceStatus(invId, status) {
      if (this.isConnected && supabaseClient) {
        const { error } = await supabaseClient.from('invoices').update({ status }).eq('id', invId);
        if (error) console.error("Error updating invoice status:", error);
      } else {
        const invoice = State.invoices.find(i => i.id === invId);
        if (invoice) {
          invoice.status = status;
          localStorage.setItem('medcore-local-invoices', JSON.stringify(State.invoices));
        }
      }
    },

    async updateAppointmentStatus(aptId, status) {
      if (this.isConnected && supabaseClient) {
        const { error } = await supabaseClient.from('appointments').update({ status }).eq('id', aptId);
        if (error) console.error("Error updating appointment status:", error);
      } else {
        const apt = State.appointments.find(a => a.id === aptId);
        if (apt) {
          apt.status = status;
          localStorage.setItem('medcore-local-appointments', JSON.stringify(State.appointments));
        }
      }
    },

    async updateDoctorAvailability(docId, availability) {
      if (this.isConnected && supabaseClient) {
        const { error } = await supabaseClient.from('doctors').update({ availability }).eq('id', docId);
        if (error) console.error("Error updating doctor availability:", error);
      } else {
        const doc = State.doctors.find(d => d.id === docId);
        if (doc) {
          doc.availability = availability;
          localStorage.setItem('medcore-local-doctors', JSON.stringify(State.doctors));
        }
      }
    },

    async updatePrescriptionRefills(rxId, refills) {
      if (this.isConnected && supabaseClient) {
        const { error } = await supabaseClient.from('prescriptions').update({ refills }).eq('id', rxId);
        if (error) console.error("Error updating prescription refills:", error);
      } else {
        const rx = State.prescriptions.find(r => r.id === rxId);
        if (rx) {
          rx.refills = refills;
          localStorage.setItem('medcore-local-prescriptions', JSON.stringify(State.prescriptions));
        }
      }
    }
  };

  // ==========================================
  // 3. Navigation Engine (Client-Side Router)
  // ==========================================
  const Navigation = {
    // Views list maps Role to Sidebar menu links
    roleMenuLinks: {
      patient: [
        { view: 'patient-dashboard', label: 'My Dashboard', icon: 'layout-dashboard' },
        { view: 'patient-booking', label: 'Book Appointment', icon: 'calendar-plus' },
        { view: 'patient-records', label: 'My Medical Records', icon: 'folder-heart' },
        { view: 'patient-prescriptions', label: 'Prescriptions', icon: 'pill' },
        { view: 'patient-billing', label: 'Invoices & Billing', icon: 'credit-card' }
      ],
      doctor: [
        { view: 'doctor-dashboard', label: 'Doctor Dashboard', icon: 'layout-dashboard' },
        { view: 'doctor-ehr', label: 'EHR Prescription Writer', icon: 'file-signature' }
      ],
      admin: [
        { view: 'admin-dashboard', label: 'Control Center', icon: 'shield-alert' }
      ]
    },

    async init() {
      await DBManager.init();
      this.renderSidebarLinks();
      await this.switchView(State.currentRole + '-dashboard');
      
      // Bind click events to navigation links
      document.addEventListener('click', async (e) => {
        const link = e.target.closest('[data-view]');
        if (link) {
          e.preventDefault();
          const targetView = link.getAttribute('data-view');
          await this.switchView(targetView);
          
          // Auto close sidebar on mobile
          if (window.innerWidth <= 768) {
            DOM.sidebar.classList.remove('sidebar-open');
          }
        }
        
        // Quick Action page buttons (e.g. data-go-view="patient-booking")
        const goBtn = e.target.closest('[data-go-view]');
        if (goBtn) {
          e.preventDefault();
          const targetView = goBtn.getAttribute('data-go-view');
          await this.switchView(targetView);
        }
      });
    },

    renderSidebarLinks() {
      const links = this.roleMenuLinks[State.currentRole];
      let html = '';
      links.forEach(item => {
        html += `
          <li>
            <a href="#" class="nav-link" data-view="${item.view}">
              <i data-lucide="${item.icon}"></i> <span>${item.label}</span>
            </a>
          </li>
        `;
      });
      DOM.sidebarLinksContainer.innerHTML = html;
      lucide.createIcons();
    },

    async switchView(viewId) {
      // Deactivate all sections
      const sections = document.querySelectorAll('.view-section');
      sections.forEach(sec => sec.classList.remove('active'));

      // Activate selected section
      const activeSection = document.getElementById(viewId);
      if (activeSection) {
        activeSection.classList.add('active');
        State.currentView = viewId;
        
        // Render view specific details
        await this.onViewLoaded(viewId);
      }

      // Update active links state in Sidebar
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        if (link.getAttribute('data-view') === viewId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    },

    async onViewLoaded(viewId) {
      // Sync State with DB (local or Supabase) before rendering
      await DBManager.syncState();

      // Triggers specific render updates upon loading a section
      switch (viewId) {
        case 'patient-dashboard':
          RenderEngine.patientDashboard();
          break;
        case 'patient-booking':
          RenderEngine.bookingOptions();
          break;
        case 'patient-records':
          RenderEngine.recordsTimeline();
          break;
        case 'patient-prescriptions':
          RenderEngine.prescriptionsList();
          break;
        case 'patient-billing':
          RenderEngine.billingInvoices();
          break;
        case 'doctor-dashboard':
          RenderEngine.doctorDashboard();
          break;
        case 'doctor-ehr':
          RenderEngine.doctorEhrForm();
          break;
        case 'admin-dashboard':
          RenderEngine.adminDashboard();
          break;
        case 'info-doctors':
          RenderEngine.doctorDirectory();
          break;
        case 'info-services':
          RenderEngine.servicesPricing('consultations');
          break;
        case 'info-map':
          RenderEngine.hospitalMap("3");
          break;
        case 'info-emergency':
          RenderEngine.emergencyCenter();
          break;
      }
    }
  };

  // ==========================================
  // 4. Render Engine (Visual Builders)
  // ==========================================
  const RenderEngine = {
    
    patientDashboard() {
      // Render Appointments on Patient Dashboard
      const personalApts = State.appointments.filter(a => a.patientName === 'John Doe' && a.status !== 'Completed');
      let aptHtml = '';
      
      if (personalApts.length === 0) {
        aptHtml = `<div class="text-muted text-center padding-24">No upcoming consultations scheduled.</div>`;
      } else {
        personalApts.forEach(apt => {
          const doc = State.doctors.find(d => d.name === apt.doctorName) || { room: 'OPD Level 1' };
          aptHtml += `
            <div class="appt-card">
              <div class="appt-info">
                <div class="appt-icon"><i data-lucide="video"></i></div>
                <div class="appt-details">
                  <h4>${apt.doctorName}</h4>
                  <p>${doc.specialty} &bull; ${doc.room}</p>
                </div>
              </div>
              <div class="appt-time">
                <div class="time">${apt.time}</div>
                <div class="date">${apt.date}</div>
              </div>
            </div>
          `;
        });
      }
      DOM.patDashboardApts.innerHTML = aptHtml;
      
      // Render Active Meds
      const activeMeds = State.prescriptions.filter(p => p.patientName === 'John Doe' && p.status === 'Filled');
      let medHtml = '';
      
      if (activeMeds.length === 0) {
        medHtml = `<div class="text-muted text-center padding-24">No active prescriptions found.</div>`;
      } else {
        activeMeds.forEach(med => {
          medHtml += `
            <div class="med-card">
              <div class="med-meta">
                <h4>${med.drugName}</h4>
                <p>${med.dose} &bull; ${med.duration}</p>
              </div>
              <span class="med-timing">Daily Intake</span>
            </div>
          `;
        });
      }
      DOM.patDashboardMeds.innerHTML = medHtml;
      lucide.createIcons();
    },

    bookingOptions() {
      // Reset specialty select & trigger dependencies
      DOM.bookingSpecialty.value = "";
      DOM.bookingDoctor.innerHTML = `<option value="" disabled selected>Select department first...</option>`;
      DOM.bookingDoctor.disabled = true;
      
      DOM.doctorBookingPreview.innerHTML = `
        <div class="preview-empty-state">
          <i data-lucide="user-round-cog" class="large-icon text-muted"></i>
          <h3>Practitioner Profile</h3>
          <p>Select a department and doctor to view their schedule, experience, ratings, and ward location.</p>
        </div>
      `;
      lucide.createIcons();
    },

    recordsTimeline() {
      let timelineHtml = '';
      const personalRecs = State.records.filter(r => r.patientName === 'John Doe');
      
      if (personalRecs.length === 0) {
        timelineHtml = '<p class="text-muted">No diagnostic history logged.</p>';
      } else {
        personalRecs.forEach((rec, idx) => {
          timelineHtml += `
            <div class="timeline-item" data-rec-id="${rec.id}">
              <div class="timeline-item-meta">
                <span class="date">${rec.date}</span>
                <span class="badge-role badge-patient">EHR</span>
              </div>
              <h4>${rec.type}</h4>
              <p class="timeline-item-doc">${rec.doctor}</p>
            </div>
          `;
        });
      }
      DOM.patHistoryTimeline.innerHTML = timelineHtml;

      // Reset Details Panel
      DOM.recordDetailsPanel.innerHTML = `
        <div class="preview-empty-state">
          <i data-lucide="file-text" class="large-icon text-muted"></i>
          <h3>Select a Record</h3>
          <p>Click on any entry in your timeline to view detailed descriptions, lab measurements, and clinical opinions.</p>
        </div>
      `;
      lucide.createIcons();

      // Timeline Item Clicks
      const timelineItems = DOM.patHistoryTimeline.querySelectorAll('.timeline-item');
      timelineItems.forEach(item => {
        item.addEventListener('click', () => {
          timelineItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          const recId = item.getAttribute('data-rec-id');
          this.recordDetails(recId);
        });
      });
    },

    recordDetails(recId) {
      const rec = State.records.find(r => r.id === recId);
      if (!rec) return;

      DOM.recordDetailsPanel.innerHTML = `
        <div class="record-header-detail">
          <div>
            <h2>${rec.type}</h2>
            <p class="text-muted">Logged on ${rec.date}</p>
          </div>
          <span class="card-badge status-normal">Official Diagnostics</span>
        </div>
        <div class="record-doc-badge margin-top-16">
          <div class="avatar-small">${rec.doctor.split(' ').pop().substring(0,2).toUpperCase()}</div>
          <div>
            <h4 class="font-weight-600">${rec.doctor}</h4>
            <p class="text-muted" style="font-size: 11px;">Consulting Practitioner</p>
          </div>
        </div>
        
        <div class="divider-x"></div>
        
        <h4 class="margin-top-16 font-weight-600">Recorded Vitals</h4>
        <div class="vitals-grid margin-top-8">
          <div class="vital-item" style="padding: 10px;">
            <span class="text-muted" style="font-size: 11px;">Blood Pressure</span>
            <strong style="font-size: 16px;">${rec.bp} mmHg</strong>
          </div>
          <div class="vital-item" style="padding: 10px;">
            <span class="text-muted" style="font-size: 11px;">Pulse Rate</span>
            <strong style="font-size: 16px;">${rec.pulse} bpm</strong>
          </div>
          <div class="vital-item" style="padding: 10px;">
            <span class="text-muted" style="font-size: 11px;">Temperature</span>
            <strong style="font-size: 16px;">${rec.temp} °F</strong>
          </div>
        </div>

        <div class="divider-x"></div>

        <h4 class="font-weight-600">Primary Diagnosis</h4>
        <p class="font-weight-600 text-blue margin-top-8" style="font-size: 15px;">${rec.diagnosis}</p>

        <h4 class="margin-top-16 font-weight-600">Clinical Assessment Notes</h4>
        <div class="notes-block margin-top-8">
          ${rec.notes}
        </div>
      `;
      lucide.createIcons();
    },

    prescriptionsList() {
      const personalMeds = State.prescriptions.filter(p => p.patientName === 'John Doe');
      let html = '';

      if (personalMeds.length === 0) {
        html = `<div class="grid-card col-span-2 text-center text-muted">No prescriptions recorded.</div>`;
      } else {
        personalMeds.forEach(med => {
          const filledClass = med.status === 'Filled' ? 'filled' : '';
          const statusBadge = med.status === 'Filled' ? 'status-normal' : 'status-danger';
          
          html += `
            <div class="prescr-card ${filledClass}">
              <div class="prescr-header">
                <div>
                  <h3>${med.drugName}</h3>
                  <span class="text-muted" style="font-size: 11px;">Rx Ref: ${med.id}</span>
                </div>
                <span class="card-badge ${statusBadge}">${med.status}</span>
              </div>
              <div class="prescr-body">
                <div class="prescr-row">
                  <span>Instructions:</span>
                  <span>${med.dose}</span>
                </div>
                <div class="prescr-row">
                  <span>Duration:</span>
                  <span>${med.duration}</span>
                </div>
                <div class="prescr-row">
                  <span>Refills:</span>
                  <span>${med.refills} Remaining</span>
                </div>
                <div class="prescr-row">
                  <span>Prescribed By:</span>
                  <span>${med.doctor}</span>
                </div>
                <div class="prescr-row">
                  <span>Date Issued:</span>
                  <span>${med.date}</span>
                </div>
              </div>
              ${med.refills > 0 && med.status === 'Filled' ? `
                <button class="btn btn-secondary-light btn-sm btn-block margin-top-16 ref-btn" data-med-id="${med.id}">
                  <i data-lucide="refresh-cw"></i> Refill Order
                </button>
              ` : ''}
            </div>
          `;
        });
      }
      DOM.prescriptionsGrid.innerHTML = html;
      lucide.createIcons();

      // Refill event binder
      document.querySelectorAll('.ref-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const medId = btn.getAttribute('data-med-id');
          const med = State.prescriptions.find(p => p.id === medId);
          if (med && med.refills > 0) {
            med.refills--;
            await DBManager.updatePrescriptionRefills(medId, med.refills);
            alert(`Refill request for ${med.drugName} sent to pharmacy successfully. Remaining refills: ${med.refills}`);
            this.prescriptionsList();
          }
        });
      });
    },

    billingInvoices() {
      // Count pending outstanding
      const outstandingVal = State.invoices
        .filter(i => i.status === 'Pending')
        .reduce((acc, curr) => acc + curr.copay, 0);
      DOM.billingOutstanding.innerText = `$${outstandingVal.toFixed(2)}`;
      if (outstandingVal > 0) {
        DOM.billingOutstanding.className = "value-large text-rose animate-pulse-slow";
      } else {
        DOM.billingOutstanding.className = "value-large text-green";
      }

      // Render table
      let tableHtml = '';
      State.invoices.forEach(inv => {
        const isPending = inv.status === 'Pending';
        const badge = isPending ? 'status-pending' : 'status-normal';
        
        tableHtml += `
          <tr>
            <td class="font-weight-600 text-blue">${inv.id}</td>
            <td>${inv.date}</td>
            <td>${inv.desc}</td>
            <td>$${inv.total.toFixed(2)}</td>
            <td>$${inv.insurance.toFixed(2)}</td>
            <td class="font-weight-600">$${inv.copay.toFixed(2)}</td>
            <td><span class="card-badge ${badge}">${inv.status}</span></td>
            <td>
              ${isPending ? `
                <button class="btn btn-primary btn-sm pay-btn" data-inv-id="${inv.id}">Pay Copay</button>
              ` : `
                <span class="text-muted"><i data-lucide="check" class="text-green"></i> Cleared</span>
              `}
            </td>
          </tr>
        `;
      });
      DOM.billingTableBody.innerHTML = tableHtml;
      lucide.createIcons();

      // Add payment action clicks
      document.querySelectorAll('.pay-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const invId = btn.getAttribute('data-inv-id');
          const invoice = State.invoices.find(i => i.id === invId);
          if (invoice) {
            // Pay invoice simulated process
            invoice.status = 'Paid';
            await DBManager.updateInvoiceStatus(invId, 'Paid');
            State.notifications.unshift({
              id: Date.now(),
              title: 'Invoice Paid',
              desc: `Payment of $${invoice.copay.toFixed(2)} for ${invoice.id} confirmed.`,
              time: 'Just now',
              read: false
            });
            UpdateNotificationsUI();
            alert(`Payment of $${invoice.copay.toFixed(2)} was successfully processed! Thank you.`);
            this.billingInvoices();
          }
        });
      });
    },

    doctorDashboard() {
      // Today's Date display
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      DOM.docScheduleList.innerHTML = '';
      
      // Filter cardiology appointments as Dr. Connor's
      const doctorApts = State.appointments.filter(a => a.doctorId === 'doc-connor');
      
      // Update statistics
      document.getElementById('doc-stat-consultations').innerText = `${doctorApts.length} Patients`;
      const completed = doctorApts.filter(a => a.status === 'Completed').length;
      document.getElementById('doc-stat-completed').innerText = `${completed} Patients`;

      let scheduleHtml = '';
      if (doctorApts.length === 0) {
        scheduleHtml = `<div class="text-muted text-center padding-24">No appointments listed for today.</div>`;
      } else {
        doctorApts.forEach(apt => {
          const isCompleted = apt.status === 'Completed';
          const indicator = isCompleted ? 'green' : 'orange';
          const cardText = isCompleted ? 'line-through' : '';
          
          scheduleHtml += `
            <div class="appt-card" style="margin-bottom: 8px;">
              <div class="appt-info">
                <div class="activity-dot ${indicator}"></div>
                <div class="appt-details">
                  <h4 style="text-decoration: ${cardText}">${apt.patientName} (ID: ${apt.patientId})</h4>
                  <p>Reason: ${apt.reason}</p>
                </div>
              </div>
              <div class="appt-time" style="display:flex; flex-direction:column; align-items:flex-end;">
                <div class="time">${apt.time}</div>
                ${!isCompleted ? `
                  <button class="btn btn-secondary-light btn-sm start-consult-btn margin-top-8" data-patient="${apt.patientName}" data-apt-id="${apt.id}">
                    Start Clinic Consult
                  </button>
                ` : '<span class="text-green font-weight-600 margin-top-8" style="font-size:12px;"><i data-lucide="check"></i> Completed</span>'}
              </div>
            </div>
          `;
        });
      }
      DOM.docScheduleList.innerHTML = scheduleHtml;
      lucide.createIcons();

      // Start Consult button bindings
      document.querySelectorAll('.start-consult-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const patientName = btn.getAttribute('data-patient');
          const aptId = btn.getAttribute('data-apt-id');
          // Navigate to EHR form and select patient
          Navigation.switchView('doctor-ehr');
          DOM.docEhrPatientSelect.value = patientName;
          DOM.docEhrPatientSelect.dispatchEvent(new Event('change'));
          // Set attribute in form for completing appointment
          DOM.docEhrForm.setAttribute('data-complete-apt-id', aptId);
        });
      });
    },

    doctorEhrForm() {
      // Reset select
      DOM.docEhrPatientSelect.value = "";
      DOM.doctorPatientPreview.innerHTML = `
        <div class="preview-empty-state">
          <i data-lucide="user" class="large-icon text-muted"></i>
          <h3>Patient Vitals & File</h3>
          <p>Select a patient in the dropdown list to load their existing health cards, drug allergies, and clinic history.</p>
        </div>
      `;
      lucide.createIcons();
    },

    adminDashboard() {
      // Stat 1: Total active admissions count
      document.getElementById('admin-stat-admissions').innerText = State.records.length + 139; // simulated database size + records length

      // Render Wards status progress bars
      let wardHtml = '';
      State.wards.forEach(ward => {
        const perc = Math.round((ward.occupiedBeds / ward.totalBeds) * 100);
        let colorClass = '';
        if (perc >= 90) colorClass = 'danger';
        else if (perc >= 75) colorClass = 'warning';

        wardHtml += `
          <div class="occupancy-item">
            <div class="occupancy-meta">
              <span>${ward.name}</span>
              <span class="text-secondary">${ward.occupiedBeds} / ${ward.totalBeds} Beds (${perc}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${colorClass}" style="width: ${perc}%"></div>
            </div>
          </div>
        `;
      });
      DOM.adminWardList.innerHTML = wardHtml;

      // Render Live Logs
      let logsHtml = '';
      State.admissionLogs.forEach(log => {
        logsHtml += `
          <li class="activity-item">
            <div class="activity-dot ${log.type}"></div>
            <div class="activity-details">
              <p>${log.action}</p>
              <span>Patient: ${log.patient} &bull; Received ${log.time}</span>
            </div>
          </li>
        `;
      });
      DOM.adminActivityLogs.innerHTML = logsHtml;
    },

    doctorDirectory() {
      const searchVal = DOM.docDirSearch.value.toLowerCase();
      const deptVal = DOM.docDirDept.value;
      const statusVal = DOM.docDirStatus.value;

      let html = '';
      const filtered = State.doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchVal) || doc.specialty.toLowerCase().includes(searchVal);
        const matchesDept = deptVal === 'ALL' || doc.specialty === deptVal;
        const matchesStatus = statusVal === 'ALL' || doc.availability === statusVal;
        return matchesSearch && matchesDept && matchesStatus;
      });

      if (filtered.length === 0) {
        html = `<div class="grid-card col-span-2 text-center text-muted">No practitioners matched your search criteria.</div>`;
      } else {
        filtered.forEach(doc => {
          let dotColor = 'offline';
          if (doc.availability === 'Available') dotColor = 'available';
          else if (doc.availability === 'On Break') dotColor = 'break';
          
          html += `
            <div class="doctor-card">
              <div class="doctor-card-avatar">
                ${doc.avatar}
                <div class="status-dot ${dotColor}"></div>
              </div>
              <h4>${doc.name}</h4>
              <p class="dept">${doc.specialty}</p>
              
              <div class="doctor-card-details">
                <div class="row">
                  <label>Experience:</label>
                  <span>${doc.experience}</span>
                </div>
                <div class="row">
                  <label>Consult Office:</label>
                  <span>${doc.room}</span>
                </div>
                <div class="row">
                  <label>Contact Phone:</label>
                  <span>${doc.phone}</span>
                </div>
                <div class="row">
                  <label>Rating Index:</label>
                  <span class="preview-rating">${doc.rating} <i data-lucide="star"></i></span>
                </div>
              </div>
              
              <div class="doctor-card-actions">
                ${State.currentRole === 'patient' && doc.availability === 'Available' ? `
                  <button class="btn btn-primary btn-sm btn-block book-doc-shortcut" data-dept="${doc.specialty}" data-doc-id="${doc.id}">
                    Book Consultation
                  </button>
                ` : `
                  <button class="btn btn-secondary-light btn-sm btn-block" disabled>Unavailable for Direct Booking</button>
                `}
              </div>
            </div>
          `;
        });
      }
      DOM.docDirContainer.innerHTML = html;
      lucide.createIcons();

      // Quick Booking shortcuts
      document.querySelectorAll('.book-doc-shortcut').forEach(btn => {
        btn.addEventListener('click', () => {
          const dept = btn.getAttribute('data-dept');
          const docId = btn.getAttribute('data-doc-id');
          Navigation.switchView('patient-booking');
          DOM.bookingSpecialty.value = dept;
          DOM.bookingSpecialty.dispatchEvent(new Event('change'));
          DOM.bookingDoctor.value = docId;
        });
      });
    },

    servicesPricing(category) {
      const items = State.services[category];
      let html = '';
      
      items.forEach(srv => {
        html += `
          <tr>
            <td class="font-weight-600">${srv.name}</td>
            <td>${srv.cost}</td>
            <td class="text-green font-weight-500">${srv.copay} (80% Covered)</td>
            <td class="font-weight-600">$${(parseFloat(srv.cost.replace('$','').replace(',','')) * 0.20).toFixed(2)}</td>
            <td>${srv.time}</td>
          </tr>
        `;
      });
      DOM.servicesTableBody.innerHTML = html;
    },

    hospitalMap(level) {
      const mapData = State.mapLevels[level];
      DOM.mapCurrentTitle.innerText = mapData.title;

      // Populating room listing
      let listHtml = '';
      mapData.rooms.forEach(room => {
        listHtml += `
          <li class="room-indicator-item" data-room-id="${room.id}" style="cursor:pointer;">
            <div class="room-color-block" style="background-color: ${room.stroke}"></div>
            <div>
              <span class="font-weight-600">${room.name}</span>
              <p class="text-muted" style="font-size:10px; margin-top:2px;">${room.desc}</p>
            </div>
          </li>
        `;
      });
      DOM.mapRoomList.innerHTML = listHtml;

      // Generate SVG Layout
      let svgHtml = `
        <svg class="map-floor-svg" viewBox="0 0 700 350" width="100%" height="100%">
          <rect x="10" y="10" width="680" height="330" fill="none" stroke="var(--border-color)" stroke-width="4" stroke-dasharray="6,6" />
          <path d="M 350,10 L 350,340" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4,4" />
      `;

      mapData.rooms.forEach(room => {
        svgHtml += `
          <g class="map-svg-group" data-room-id="${room.id}">
            <rect id="rect-${room.id}" x="${room.x}" y="${room.y}" width="${room.w}" height="${room.h}" rx="6"
                  class="map-room-rect" style="fill: ${room.color}; stroke: ${room.stroke};" />
            <text x="${room.x + room.w/2}" y="${room.y + room.h/2 + 4}" class="map-room-text" style="fill: var(--text-primary);">${room.name}</text>
          </g>
        `;
      });

      svgHtml += `</svg>`;
      DOM.mapVisualContainer.innerHTML = svgHtml;
      
      // Bind hover/click interactivities for SVG rooms and List items
      const mapGroups = DOM.mapVisualContainer.querySelectorAll('g');
      const listItems = DOM.mapRoomList.querySelectorAll('li');

      const highlightRoom = (roomId, activate) => {
        const rect = document.getElementById(`rect-${roomId}`);
        const listItem = DOM.mapRoomList.querySelector(`[data-room-id="${roomId}"]`);
        
        if (rect) {
          if (activate) {
            rect.style.fill = 'var(--color-primary-light)';
            rect.style.strokeWidth = '3px';
            if (listItem) listItem.style.backgroundColor = 'var(--color-primary-light)';
          } else {
            const roomObj = mapData.rooms.find(r => r.id === roomId);
            rect.style.fill = roomObj.color;
            rect.style.strokeWidth = '2';
            if (listItem) listItem.style.backgroundColor = 'var(--bg-primary)';
          }
        }
      };

      mapGroups.forEach(grp => {
        const roomId = grp.getAttribute('data-room-id');
        grp.addEventListener('mouseenter', () => highlightRoom(roomId, true));
        grp.addEventListener('mouseleave', () => highlightRoom(roomId, false));
        grp.addEventListener('click', () => {
          const roomObj = mapData.rooms.find(r => r.id === roomId);
          alert(`Selected Room Info:\n${roomObj.name}\nDetail: ${roomObj.desc}`);
        });
      });

      listItems.forEach(item => {
        const roomId = item.getAttribute('data-room-id');
        item.addEventListener('mouseenter', () => highlightRoom(roomId, true));
        item.addEventListener('mouseleave', () => highlightRoom(roomId, false));
        item.addEventListener('click', () => {
          const roomObj = mapData.rooms.find(r => r.id === roomId);
          alert(`Selected Room Info:\n${roomObj.name}\nDetail: ${roomObj.desc}`);
        });
      });
    },

    emergencyCenter() {
      // Ambulances status
      let html = '';
      State.ambulances.forEach(amb => {
        let badgeColor = 'status-normal';
        if (amb.status === 'On Call') badgeColor = 'status-pending';
        else if (amb.status === 'Responding') badgeColor = 'status-danger';

        html += `
          <div class="ambulance-item">
            <div class="ambulance-meta">
              <h4>Ambulance Fleet Code: ${amb.code}</h4>
              <p>Current Sector: ${amb.location}</p>
            </div>
            <div style="text-align: right;">
              <span class="card-badge ${badgeColor}">${amb.status}</span>
              <p class="text-blue font-weight-600 margin-top-8" style="font-size: 11px;">ETA: ${amb.eta}</p>
            </div>
          </div>
        `;
      });
      DOM.ambulanceStatusContainer.innerHTML = html;
      lucide.createIcons();
    }

  };

  // ==========================================
  // 5. Shared UI Interactions & State Events
  // ==========================================

  // Switch Theme (Light/Dark) Logic
  DOM.themeToggleBtn.addEventListener('click', () => {
    if (State.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark');
      State.theme = 'dark';
      DOM.themeIconDark.classList.add('hidden');
      DOM.themeIconLight.classList.remove('hidden');
      DOM.themeToggleBtn.querySelector('span').innerText = "Light Mode";
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      State.theme = 'light';
      DOM.themeIconDark.classList.remove('hidden');
      DOM.themeIconLight.classList.add('hidden');
      DOM.themeToggleBtn.querySelector('span').innerText = "Dark Mode";
    }
    localStorage.setItem('medcore-theme', State.theme);
  });

  // Apply saved theme state on load
  if (State.theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    DOM.themeIconDark.classList.add('hidden');
    DOM.themeIconLight.classList.remove('hidden');
    DOM.themeToggleBtn.querySelector('span').innerText = "Light Mode";
  }

  // Switch User Roles simulator
  DOM.roleSelect.addEventListener('change', (e) => {
    const role = e.target.value;
    State.currentRole = role;
    
    // Update User Info elements in sidebar
    if (role === 'patient') {
      DOM.sidebarUserName.innerText = "John Doe";
      DOM.sidebarUserRole.className = "badge-role badge-patient";
      DOM.sidebarUserRole.innerText = "Patient Portal";
      DOM.sidebarAvatar.innerText = "P";
      DOM.headerAvatar.innerText = "P";
    } else if (role === 'doctor') {
      DOM.sidebarUserName.innerText = "Dr. Sarah Connor";
      DOM.sidebarUserRole.className = "badge-role badge-doctor";
      DOM.sidebarUserRole.innerText = "Doctor Portal";
      DOM.sidebarAvatar.innerText = "SC";
      DOM.headerAvatar.innerText = "SC";
    } else if (role === 'admin') {
      DOM.sidebarUserName.innerText = "Super Admin";
      DOM.sidebarUserRole.className = "badge-role badge-admin";
      DOM.sidebarUserRole.innerText = "Hospital Admin";
      DOM.sidebarAvatar.innerText = "AD";
      DOM.headerAvatar.innerText = "AD";
    }

    // Refresh Navigation options & change view
    Navigation.renderSidebarLinks();
    Navigation.switchView(role + '-dashboard');
  });

  // Sidebar controls on mobile viewports
  DOM.menuToggleBtn.addEventListener('click', () => {
    DOM.sidebar.classList.add('sidebar-open');
  });
  DOM.closeSidebarBtn.addEventListener('click', () => {
    DOM.sidebar.classList.remove('sidebar-open');
  });

  // Notifications Toggle
  DOM.notiToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    DOM.notiDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#noti-dropdown') && !e.target.closest('#noti-toggle-btn')) {
      DOM.notiDropdown.classList.add('hidden');
    }
    if (!e.target.closest('#search-dropdown') && !e.target.closest('#global-search')) {
      DOM.searchDropdown.classList.add('hidden');
    }
  });

  // Mark notifications read
  const UpdateNotificationsUI = () => {
    const unread = State.notifications.filter(n => !n.read).length;
    if (unread > 0) {
      DOM.notiBadge.innerText = unread;
      DOM.notiBadge.classList.remove('hidden');
    } else {
      DOM.notiBadge.classList.add('hidden');
    }

    let notiHtml = '';
    if (State.notifications.length === 0) {
      notiHtml = `<li class="padding-16 text-center text-muted">No notifications.</li>`;
    } else {
      State.notifications.forEach(noti => {
        const readClass = noti.read ? '' : 'style="background-color: var(--color-primary-light);"';
        notiHtml += `
          <li class="noti-item" data-noti-id="${noti.id}" ${readClass}>
            <div class="noti-title">${noti.title}</div>
            <div class="noti-desc">${noti.desc}</div>
            <span class="noti-time">${noti.time}</span>
          </li>
        `;
      });
    }
    DOM.notiList.innerHTML = notiHtml;
  };

  DOM.clearNotiBtn.addEventListener('click', () => {
    State.notifications.forEach(n => n.read = true);
    UpdateNotificationsUI();
  });

  // Notification item clicks to read
  DOM.notiList.addEventListener('click', (e) => {
    const item = e.target.closest('.noti-item');
    if (item) {
      const id = parseInt(item.getAttribute('data-noti-id'));
      const notiObj = State.notifications.find(n => n.id === id);
      if (notiObj) {
        notiObj.read = true;
        UpdateNotificationsUI();
      }
    }
  });

  UpdateNotificationsUI();

  // Global Search Box Search-Anywhere Engine
  DOM.globalSearch.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    if (val === '') {
      DOM.searchDropdown.classList.add('hidden');
      return;
    }

    const matches = [];

    // Search Doctors
    State.doctors.forEach(d => {
      if (d.name.toLowerCase().includes(val) || d.specialty.toLowerCase().includes(val)) {
        matches.push({ title: d.name, desc: `Specialty: ${d.specialty} &bull; Room: ${d.room}`, view: 'info-doctors' });
      }
    });

    // Search Services
    Object.keys(State.services).forEach(cat => {
      State.services[cat].forEach(srv => {
        if (srv.name.toLowerCase().includes(val)) {
          matches.push({ title: srv.name, desc: `Price: ${srv.cost} &bull; Class: ${cat}`, view: 'info-services' });
        }
      });
    });

    // Search floor coordinates
    Object.keys(State.mapLevels).forEach(lvl => {
      State.mapLevels[lvl].rooms.forEach(rm => {
        if (rm.name.toLowerCase().includes(val) || rm.desc.toLowerCase().includes(val)) {
          matches.push({ title: rm.name, desc: `${rm.desc} &bull; Located Level ${lvl}`, view: 'info-map' });
        }
      });
    });

    // Populate search options UI
    if (matches.length === 0) {
      DOM.searchDropdown.innerHTML = `<div class="padding-16 text-muted text-center">No search results found.</div>`;
    } else {
      let searchHtml = '';
      matches.slice(0, 5).forEach(m => {
        searchHtml += `
          <div class="search-item" data-goto="${m.view}">
            <div class="search-item-title">${m.title}</div>
            <div class="search-item-desc">${m.desc}</div>
          </div>
        `;
      });
      DOM.searchDropdown.innerHTML = searchHtml;

      // Add click navigations to search items
      DOM.searchDropdown.querySelectorAll('.search-item').forEach(item => {
        item.addEventListener('click', () => {
          const view = item.getAttribute('data-goto');
          DOM.globalSearch.value = '';
          DOM.searchDropdown.classList.add('hidden');
          Navigation.switchView(view);
        });
      });
    }

    DOM.searchDropdown.classList.remove('hidden');
  });

  // ==========================================
  // 6. Interactive Functional Workflows
  // ==========================================

  // A. Appointment Booking workflow
  DOM.bookingSpecialty.addEventListener('change', (e) => {
    const dept = e.target.value;
    const deptDocs = State.doctors.filter(d => d.specialty === dept);
    
    let docSelectHtml = `<option value="" disabled selected>Select Doctor...</option>`;
    deptDocs.forEach(d => {
      const isOff = d.availability === 'Offline' ? ' (Offline)' : '';
      docSelectHtml += `<option value="${d.id}">${d.name}${isOff}</option>`;
    });
    DOM.bookingDoctor.innerHTML = docSelectHtml;
    DOM.bookingDoctor.disabled = false;
  });

  DOM.bookingDoctor.addEventListener('change', (e) => {
    const docId = e.target.value;
    const doc = State.doctors.find(d => d.id === docId);
    if (!doc) return;

    // Show booking profile panel details
    DOM.doctorBookingPreviewCard.innerHTML = `
      <div class="preview-doctor-header">
        <div class="avatar">${doc.avatar}</div>
        <div class="preview-doctor-info">
          <h4>${doc.name}</h4>
          <p>${doc.specialty}</p>
          <div class="preview-rating">${doc.rating} <i data-lucide="star"></i></div>
        </div>
      </div>
      <div class="preview-detail-box">
        <label>Clinic Location</label>
        <p>${doc.room}</p>
      </div>
      <div class="preview-detail-box">
        <label>Experience Index</label>
        <p>${doc.experience} practicing</p>
      </div>
      <div class="preview-detail-box">
        <label>Consult Fee</label>
        <p>$150.00 standard OPD tariff</p>
      </div>
    `;
    DOM.doctorBookingPreviewCard.classList.remove('hidden');
    DOM.doctorBookingPreview.querySelector('.preview-empty-state').classList.add('hidden');
    lucide.createIcons();
  });

  DOM.bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const docId = DOM.bookingDoctor.value;
    const doc = State.doctors.find(d => d.id === docId);
    const dateVal = document.getElementById('booking-date').value;
    const timeVal = DOM.bookingTime.value;
    const reasonVal = DOM.bookingReason.value;

    const aptId = `apt-${Date.now().toString().slice(-3)}`;
    
    // Add to state
    const newApt = {
      id: aptId,
      patientName: 'John Doe',
      patientId: 'PT-980042',
      doctorName: doc.name,
      doctorId: doc.id,
      date: dateVal,
      time: timeVal,
      reason: reasonVal,
      status: 'Confirmed'
    };
    await DBManager.insertAppointment(newApt);

    // Create Invoice for booking
    const newInvoice = {
      id: `inv-${Date.now().toString().slice(-3)}`,
      date: dateVal,
      desc: `Outpatient Consultation - ${doc.name} (${doc.specialty})`,
      total: 150.00,
      insurance: 120.00,
      copay: 30.00,
      status: 'Pending'
    };
    await DBManager.insertInvoice(newInvoice);

    // Add notification
    State.notifications.unshift({
      id: Date.now(),
      title: 'Appointment Booked',
      desc: `Successfully booked appointment with ${doc.name} for ${dateVal} at ${timeVal}.`,
      time: 'Just now',
      read: false
    });
    UpdateNotificationsUI();

    // Show success modal
    DOM.bookingModalBody.innerHTML = `
      <p><strong>Practitioner:</strong> ${doc.name} (${doc.specialty})</p>
      <p><strong>Appointment Time:</strong> ${timeVal} on ${dateVal}</p>
      <p><strong>Room Clinic:</strong> ${doc.room}</p>
      <div class="divider-x"></div>
      <p class="text-rose font-weight-600">Please Note:</p>
      <p style="font-size:12px;" class="text-secondary">
        A copay invoice of <strong>$30.00</strong> has been issued to your billing ledger. You can clear this under your invoices portal prior to checking in.
      </p>
    `;
    DOM.bookingModal.classList.remove('hidden');
    
    // Reset booking forms
    DOM.bookingForm.reset();
    RenderEngine.bookingOptions();
  });

  // Modal Closures
  DOM.closeBookingModal.addEventListener('click', () => DOM.bookingModal.classList.add('hidden'));
  DOM.confirmBookingModalOk.addEventListener('click', () => {
    DOM.bookingModal.classList.add('hidden');
    Navigation.switchView('patient-dashboard');
  });

  // B. EHR Prescription Writing (Doctor Mode)
  DOM.docEhrPatientSelect.addEventListener('change', (e) => {
    const patName = e.target.value;
    
    if (patName === 'John Doe') {
      DOM.doctorPatientPreviewCard.innerHTML = `
        <div class="digital-health-card" style="padding:16px; border-radius:var(--radius-sm); margin-bottom:14px; box-shadow:none;">
          <h4 style="color:white; margin-bottom:10px;">PT-980042</h4>
          <span style="font-size:14px; font-weight:700; color:white; display:block;">JOHNATHAN DOE</span>
          <span style="font-size:11px; color:rgba(255,255,255,0.7); display:block; margin-top:2px;">Blood: O+ &bull; Allergies: Penicillin, Peanuts</span>
        </div>
        <div class="preview-detail-box">
          <label>Medical Diagnoses Ledger</label>
          <p style="font-size:12px; margin-top:4px;">1. Hairline Wrist Fracture (Level 2cast)</p>
          <p style="font-size:12px; margin-top:2px;">2. Chronic Heart Hypertension</p>
        </div>
        <div class="preview-detail-box">
          <label>Active Medications</label>
          <p style="font-size:12px; margin-top:4px;">- Lisinopril 10mg (once daily)</p>
          <p style="font-size:12px; margin-top:2px;">- Atorvastatin 20mg (nightly dose)</p>
        </div>
      `;
      DOM.doctorPatientPreviewCard.classList.remove('hidden');
      DOM.doctorPatientPreview.querySelector('.preview-empty-state').classList.add('hidden');
    } else {
      // General dynamic template for other options
      DOM.doctorPatientPreviewCard.innerHTML = `
        <div class="digital-health-card" style="padding:16px; border-radius:var(--radius-sm); margin-bottom:14px; box-shadow:none; background: linear-gradient(135deg, #16a34a, #10b981);">
          <h4 style="color:white; margin-bottom:10px;">PT-980056</h4>
          <span style="font-size:14px; font-weight:700; color:white; display:block;">${patName}</span>
          <span style="font-size:11px; color:rgba(255,255,255,0.7); display:block; margin-top:2px;">Blood: A Positive &bull; Allergies: None Reported</span>
        </div>
        <div class="preview-detail-box">
          <label>Medical History</label>
          <p style="font-size:12px; margin-top:4px;">No diagnostic anomalies logged on this account.</p>
        </div>
      `;
      DOM.doctorPatientPreviewCard.classList.remove('hidden');
      DOM.doctorPatientPreview.querySelector('.preview-empty-state').classList.add('hidden');
    }
  });

  DOM.docEhrForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const patName = DOM.docEhrPatientSelect.value;
    const bp = document.getElementById('ehr-bp').value;
    const pulse = parseInt(document.getElementById('ehr-pulse').value);
    const temp = parseFloat(document.getElementById('ehr-temp').value);
    const diagnosis = document.getElementById('ehr-diagnosis').value;
    const notes = document.getElementById('ehr-notes').value;
    
    const medName = document.getElementById('ehr-medication').value;
    const doseVal = document.getElementById('ehr-dosage').value;
    const durationVal = document.getElementById('ehr-duration').value;
    const refillsVal = parseInt(document.getElementById('ehr-refills').value) || 0;

    const dateStr = new Date().toISOString().split('T')[0];

    // Log Record to EHR
    const newRecId = `rec-${Date.now().toString().slice(-3)}`;
    const newRecord = {
      id: newRecId,
      patientName: patName,
      date: dateStr,
      type: 'Specialist Consultation Log',
      doctor: 'Dr. Sarah Connor',
      bp: bp,
      pulse: pulse,
      temp: temp,
      diagnosis: diagnosis,
      notes: notes
    };
    await DBManager.insertRecord(newRecord);

    // If prescription details are filled out
    if (medName !== '') {
      const rxId = `rx-${Date.now().toString().slice(-3)}`;
      const newRx = {
        id: rxId,
        patientName: patName,
        drugName: medName,
        dose: doseVal,
        duration: durationVal,
        refills: refillsVal,
        doctor: 'Dr. Sarah Connor',
        date: dateStr,
        status: 'Filled'
      };
      await DBManager.insertPrescription(newRx);
    }

    // Complete appointment if coming from dashboard shortcut
    const activeAptId = DOM.docEhrForm.getAttribute('data-complete-apt-id');
    if (activeAptId) {
      await DBManager.updateAppointmentStatus(activeAptId, 'Completed');
      DOM.docEhrForm.removeAttribute('data-complete-apt-id');
    }

    // Log admin logs action
    State.admissionLogs.unshift({
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      patient: patName,
      action: `EHR updated - Diagnosed: ${diagnosis}`,
      type: 'green'
    });

    // Add alert notification for Patient
    State.notifications.unshift({
      id: Date.now(),
      title: 'Health Record Updated',
      desc: `New diagnosis and clinical consultation report uploaded by Dr. Sarah Connor.`,
      time: 'Just now',
      read: false
    });
    UpdateNotificationsUI();

    alert(`Electronic Health Record successfully written and saved to database.`);
    DOM.docEhrForm.reset();
    Navigation.switchView('doctor-dashboard');
  });

  // Doctor status toggle buttons
  const docStatusBtns = [DOM.btnStatusActive, DOM.btnStatusBreak, DOM.btnStatusOut];
  docStatusBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        docStatusBtns.forEach(b => {
          b.className = "btn btn-sm btn-secondary-light";
        });
        
        let newStatus = 'Offline';
        if (btn === DOM.btnStatusActive) {
          btn.className = "btn btn-sm btn-green";
          newStatus = 'Available';
        } else if (btn === DOM.btnStatusBreak) {
          btn.className = "btn btn-sm btn-green";
          newStatus = 'On Break';
        } else {
          btn.className = "btn btn-sm btn-danger";
        }

        // Update Dr Connor in state
        const connor = State.doctors.find(d => d.id === 'doc-connor');
        if (connor) {
          connor.availability = newStatus;
          DBManager.updateDoctorAvailability('doc-connor', newStatus);
        }
      });
    }
  });

  // C. Administrator SOS / Emergency Level Control
  DOM.adminEmergencyToggle.addEventListener('click', () => {
    State.emergencyState = !State.emergencyState;
    if (State.emergencyState) {
      DOM.adminEmergencyToggle.className = "btn btn-sm btn-danger border-radius-sm margin-top-8 pulse-icon";
      DOM.adminEmergencyToggle.innerHTML = `<i data-lucide="bell-ring"></i> Level 3 ACTIVE`;
      alert("HOSPITAL-WIDE HIGH EMERGENCY STATE LEVEL 3 REGISTERED.");
      
      State.admissionLogs.unshift({
        id: Date.now().toString(),
        time: 'Now',
        patient: 'SYSTEM',
        action: 'EMERGENCY STATE ACTIVATED - Level 3 Alert Response initiated',
        type: 'rose'
      });
    } else {
      DOM.adminEmergencyToggle.className = "btn btn-sm btn-secondary-light border-radius-sm margin-top-8";
      DOM.adminEmergencyToggle.innerHTML = `<i data-lucide="bell-off"></i> Emergency Cleared`;
      
      State.admissionLogs.unshift({
        id: Date.now().toString(),
        time: 'Now',
        patient: 'SYSTEM',
        action: 'Emergency cleared. Wards returned to general operating logs.',
        type: 'green'
      });
    }
    DOM.adminEmergencyToggle.querySelector('i');
    lucide.createIcons();
    RenderEngine.adminDashboard();
  });

  // D. Shared view: Doctor directory searches
  DOM.docDirSearch.addEventListener('input', () => RenderEngine.doctorDirectory());
  DOM.docDirDept.addEventListener('change', () => RenderEngine.doctorDirectory());
  DOM.docDirStatus.addEventListener('change', () => RenderEngine.doctorDirectory());

  // E. Shared view: Services pricing category switcher
  DOM.servicesTabsContainer.querySelectorAll('.services-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.servicesTabsContainer.querySelectorAll('.services-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      RenderEngine.servicesPricing(cat);
    });
  });

  // F. Shared view: Floor Maps levels
  DOM.mapLevelSelector.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.mapLevelSelector.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lvl = btn.getAttribute('data-level');
      RenderEngine.hospitalMap(lvl);
    });
  });

  // G. Global SOS overlay triggers
  DOM.sosTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    DOM.sosOverlay.classList.remove('hidden');
    
    // Add Log to system
    State.admissionLogs.unshift({
      id: Date.now().toString(),
      time: 'Now',
      patient: 'John Doe',
      action: 'PATIENT PORTAL SOS PANIC TRIGGERED',
      type: 'rose'
    });
    
    State.notifications.unshift({
      id: Date.now(),
      title: 'SOS Dispatched',
      desc: 'GPS position logged. Emergency responders are moving to your location.',
      time: 'Just now',
      read: false
    });
    UpdateNotificationsUI();
  });

  DOM.cancelSosBtn.addEventListener('click', () => {
    DOM.sosOverlay.classList.add('hidden');
    alert("Emergency SOS signal cancelled. Alert status set back to normal.");
    
    State.admissionLogs.unshift({
      id: Date.now().toString(),
      time: 'Now',
      patient: 'John Doe',
      action: 'Patient SOS Alarm cancelled (False Alarm logged)',
      type: 'green'
    });
  });

  // ==========================================
  // Supabase Settings Modal Controls
  // ==========================================
  if (DOM.supabaseConfigBtn) {
    DOM.supabaseConfigBtn.addEventListener('click', () => {
      DOM.supabaseUrlInput.value = localStorage.getItem('medcore-supabase-url') || 'https://jbcqhqipugurmcuwiukm.supabase.co';
      DOM.supabaseKeyInput.value = localStorage.getItem('medcore-supabase-key') || 'sb_publishable_4cdIgcyhcnb3GBdcbDk5kg_L8dGXYvB';
      DOM.supabaseFeedback.innerHTML = '';
      DOM.supabaseModal.classList.remove('hidden');
    });
  }

  if (DOM.closeSupabaseModal) {
    DOM.closeSupabaseModal.addEventListener('click', () => {
      DOM.supabaseModal.classList.add('hidden');
    });
  }

  if (DOM.btnTestSupabase) {
    DOM.btnTestSupabase.addEventListener('click', async () => {
      const url = DOM.supabaseUrlInput.value.trim();
      const key = DOM.supabaseKeyInput.value.trim();
      
      if (!url || !key) {
        DOM.supabaseFeedback.innerHTML = `<span style="color: var(--color-rose);">Please fill in both fields first.</span>`;
        return;
      }

      DOM.supabaseFeedback.innerHTML = `<span style="color: var(--color-primary);">Testing connection...</span>`;
      
      const test = await DBManager.testConnection(url, key);
      if (test.success) {
        DOM.supabaseFeedback.innerHTML = `<span style="color: var(--color-green);"><i data-lucide="check-circle" style="width:14px; height:14px; display:inline-block; vertical-align:middle;"></i> Connection validated successfully!</span>`;
      } else {
        DOM.supabaseFeedback.innerHTML = `<span style="color: var(--color-rose); word-break: break-all;">Connection Failed: ${test.message}</span>`;
      }
      lucide.createIcons();
    });
  }

  if (DOM.supabaseConfigForm) {
    DOM.supabaseConfigForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = DOM.supabaseUrlInput.value.trim();
      const key = DOM.supabaseKeyInput.value.trim();

      DOM.supabaseFeedback.innerHTML = `<span style="color: var(--color-primary);">Validating and saving...</span>`;

      const test = await DBManager.testConnection(url, key);
      if (test.success) {
        localStorage.setItem('medcore-supabase-url', url);
        localStorage.setItem('medcore-supabase-key', key);
        DOM.supabaseModal.classList.add('hidden');
        alert("Supabase integration credentials saved. Reloading data...");
        
        // Re-initialize client & reload
        await DBManager.init();
        await Navigation.switchView(State.currentRole + '-dashboard');
      } else {
        DOM.supabaseFeedback.innerHTML = `<span style="color: var(--color-rose);">Failed to save: validation check failed.</span>`;
      }
    });
  }

  if (DOM.btnDisconnectSupabase) {
    DOM.btnDisconnectSupabase.addEventListener('click', async () => {
      localStorage.removeItem('medcore-supabase-url');
      localStorage.removeItem('medcore-supabase-key');
      supabaseClient = null;
      DBManager.isConnected = false;
      DBManager.updateStatusUI(false);
      DOM.supabaseModal.classList.add('hidden');
      alert("Disconnected from Supabase database. Reverting to local storage data...");
      await Navigation.switchView(State.currentRole + '-dashboard');
    });
  }

  // ==========================================
  // User Profile Modal Controls & Dynamic Binding
  // ==========================================
  const loadUserProfile = () => {
    const profile = localStorage.getItem('medcore-user-profile');
    if (profile) {
      const data = JSON.parse(profile);
      if (DOM.sidebarUserName && State.currentRole === 'patient') DOM.sidebarUserName.innerText = data.name;
      const initials = data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      if (DOM.sidebarAvatar && State.currentRole === 'patient') DOM.sidebarAvatar.innerText = initials;
      if (DOM.headerAvatar && State.currentRole === 'patient') DOM.headerAvatar.innerText = initials;
      if (DOM.profileDisplayName) DOM.profileDisplayName.innerText = data.name;
      if (DOM.profileAvatarChar) DOM.profileAvatarChar.innerText = initials;

      // Update Digital Health Card if rendered on screen
      const healthCardName = document.querySelector('.card-patient-name');
      if (healthCardName) healthCardName.innerText = data.name.toUpperCase();
      
      const details = document.querySelectorAll('.card-details-grid p');
      if (details.length >= 4) {
        details[1].innerText = data.blood; // Blood Group
        details[2].innerText = data.allergies; // Allergies
        details[3].innerText = data.phone; // Emergency Contact
      }
    }
  };

  const openProfileModal = () => {
    // Populate form with current values
    const profile = localStorage.getItem('medcore-user-profile');
    if (profile) {
      const data = JSON.parse(profile);
      DOM.profileInputName.value = data.name;
      DOM.profileInputBlood.value = data.blood;
      DOM.profileInputPhone.value = data.phone;
      DOM.profileInputAllergies.value = data.allergies;
    } else {
      DOM.profileInputName.value = "John Doe";
      DOM.profileInputBlood.value = "O+";
      DOM.profileInputPhone.value = "+1 555-0199";
      DOM.profileInputAllergies.value = "Penicillin, Peanuts";
    }
    DOM.profileModal.classList.remove('hidden');
  };

  if (DOM.profileMenuBtn) {
    DOM.profileMenuBtn.addEventListener('click', openProfileModal);
  }

  if (DOM.sidebarUserCard) {
    DOM.sidebarUserCard.style.cursor = 'pointer';
    DOM.sidebarUserCard.addEventListener('click', () => {
      if (State.currentRole === 'patient') {
        openProfileModal();
      } else {
        alert(`Profile manager is only active for Patients in this demo simulator.`);
      }
    });
  }

  if (DOM.closeProfileModal) {
    DOM.closeProfileModal.addEventListener('click', () => {
      DOM.profileModal.classList.add('hidden');
    });
  }

  if (DOM.profileForm) {
    DOM.profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedProfile = {
        name: DOM.profileInputName.value.trim(),
        blood: DOM.profileInputBlood.value.trim(),
        phone: DOM.profileInputPhone.value.trim(),
        allergies: DOM.profileInputAllergies.value.trim()
      };
      localStorage.setItem('medcore-user-profile', JSON.stringify(updatedProfile));
      loadUserProfile();
      DOM.profileModal.classList.add('hidden');
      alert("Patient profile information updated successfully!");
    });
  }

  // Load user profile on page start
  loadUserProfile();

  // Home navigation button click logic
  if (DOM.headerHomeBtn) {
    DOM.headerHomeBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await Navigation.switchView(State.currentRole + '-dashboard');
    });
  }

  // Initialize navigation and default views
  Navigation.init();
  lucide.createIcons();
});
