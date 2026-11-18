export type DfdLevel = 'level0' | 'level1';
export type NodeKind = 'entity' | 'process' | 'datastore';

export interface DfdNodeMeta {
  id: string;
  code: string;
  title: string;
  kind: NodeKind;
  levels: DfdLevel[];
  summary: string;
  responsibilities: string[];
  proposalRef: string;
  mysqlTables?: string[];
  mysqlColumns?: string[];
}

export interface DfdFlowMeta {
  id: string;
  label: string;
  fromId: string;
  toId: string;
  level: DfdLevel;
  description: string;
  payload: string[];
}

export interface BalancingRow {
  entity: string;
  direction: 'Input to System' | 'Output from System';
  level0Flow: string;
  level1Process: string;
  level1Flow: string;
  dataStores: string;
}

export const PROJECT_INFO = {
  title: 'MediSync — Live Chamber Smart Prescription Hub',
  institution: 'Green University of Bangladesh',
  department: 'Department of Computer Science and Engineering (CSE)',
  course: 'Design Project I (CSE-308) · Section 242-D4',
  semester: 'Spring 2026',
  teacher: 'Umme Habiba',
  stack: 'HTML / CSS / JS · PHP (Core / Laravel) · MySQL · Apache Wildcard DNS',
  members: [
    { name: 'Masrur Hossain Seaim', id: '242002123', role: 'Backend (PHP), MySQL Schema & Domain Routing' },
    { name: 'Shahrima Khatun', id: '242002017', role: 'UI/UX Design, Doctor Dashboard & Prescription Template' },
    { name: 'Nafisa Anjum Dina', id: '242002137', role: 'Patient Portal, Appointment Booking & Testing/QA' },
  ],
};

export const DFD_NODES: Record<string, DfdNodeMeta> = {
  E1: {
    id: 'E1',
    code: 'E1',
    title: 'Patient',
    kind: 'entity',
    levels: ['level0', 'level1'],
    summary: 'End-user seeking medical consultation, doctor discovery, appointment booking, and private digital prescription access.',
    responsibilities: [
      'Searches doctors by specialty category and chamber schedule',
      'Books chamber appointments without physical visits',
      'Accesses own digital prescriptions and medical history anytime',
    ],
    proposalRef: 'Section 1.1 Overview & Section 1.4 Objectives 1, 5',
  },
  E2: {
    id: 'E2',
    code: 'E2',
    title: 'Doctor',
    kind: 'entity',
    levels: ['level0', 'level1'],
    summary: 'Registered physician operating a personal sub-domain chamber, managing schedules, assistants, and digital prescriptions.',
    responsibilities: [
      'Manages public profile, chamber timings, and custom sub-domain',
      'Reviews live patient appointment queue and visit history',
      'Creates and prints prescriptions with auto-synced date and time',
      'Delegates limited appointment access to password-protected assistants',
    ],
    proposalRef: 'Section 1.1 Overview & Section 1.4 Objectives 2, 3, 4, 6',
  },
  E3: {
    id: 'E3',
    code: 'E3',
    title: 'Assistant',
    kind: 'entity',
    levels: ['level0', 'level1'],
    summary: 'Chamber staff member granted limited, password-protected credentials strictly for appointment and queue management.',
    responsibilities: [
      'Authenticates via simplified password-protected assistant login',
      'Confirms, updates, and manages daily chamber appointment queues',
      'Restricted from viewing private patient prescription histories',
    ],
    proposalRef: 'Section 1.4 Objective 6 & Section 4.2 Operational Feasibility',
  },
  P0: {
    id: 'P0',
    code: '0',
    title: 'MediSync Live Chamber & Smart Prescription System',
    kind: 'process',
    levels: ['level0'],
    summary: 'Central SaaS healthcare hub unifying category-wise doctor discovery, sub-domain routing, appointment booking, assistant delegation, and private digital prescription generation.',
    responsibilities: [
      'Bridges patients and doctors across a centralized directory and custom sub-domains',
      'Coordinates real-time chamber appointments and assistant queues',
      'Generates printable physical-standard digital prescriptions with strict privacy',
    ],
    proposalRef: 'Section 1.1 Overview & Section 2 Literature Review',
  },
  P1: {
    id: 'P1',
    code: '1.0',
    title: 'Authentication & Role Access Control',
    kind: 'process',
    levels: ['level1'],
    summary: 'Verifies login credentials for Doctors, Patients, and Assistants, enforcing role-based access scopes and strict third-party isolation.',
    responsibilities: [
      'Validates password hashes and issues role-scoped PHP sessions',
      'Applies limited permission scope for Assistant accounts from D5',
      'Blocks unauthorized cross-patient or third-party access attempts',
    ],
    proposalRef: 'Section 1.4 Objectives 5 & 6',
  },
  P2: {
    id: 'P2',
    code: '2.0',
    title: 'Doctor Directory & Sub-domain Routing',
    kind: 'process',
    levels: ['level1'],
    summary: 'Serves category-wise doctor search for patients and resolves wildcard DNS sub-domains (e.g., drname.medisync.com) to individual doctor profiles.',
    responsibilities: [
      'Indexes doctors by specialty category, chamber location, and timings',
      'Resolves Apache wildcard DNS sub-domain slugs to doctor micro-sites',
      'Updates public doctor profile metadata and availability schedules',
    ],
    proposalRef: 'Section 1.4 Objectives 1, 2, 3 & Section 4.1 Technical Feasibility',
  },
  P3: {
    id: 'P3',
    code: '3.0',
    title: 'Appointment & Queue Management',
    kind: 'process',
    levels: ['level1'],
    summary: 'Handles online patient appointment requests, serial allocation, doctor queue visibility, and assistant-operated chamber status updates.',
    responsibilities: [
      'Checks available doctor chamber slots before confirming bookings',
      'Assigns patient serial numbers and appointment confirmations',
      'Allows Doctors and authorized Assistants to update queue statuses',
    ],
    proposalRef: 'Section 1.4 Objectives 2 & 6 · Section 4.4 Patient Portal',
  },
  P4: {
    id: 'P4',
    code: '4.0',
    title: 'Smart Digital Prescription Generator',
    kind: 'process',
    levels: ['level1'],
    summary: 'Enables doctors to compose digital prescriptions with medicines, dosage, and diagnostic tests, auto-syncing date/time and formatting for physical print.',
    responsibilities: [
      'Loads doctor chamber header (D2) and current patient visit info (D3)',
      'Auto-syncs server date and timestamp on every prescription',
      'Saves encrypted prescription records (D4) and outputs print-ready view',
    ],
    proposalRef: 'Section 1.3 Motivation & Section 1.4 Objective 4',
  },
  P5: {
    id: 'P5',
    code: '5.0',
    title: 'Patient History & Privacy Access',
    kind: 'process',
    levels: ['level1'],
    summary: 'Enforces strict data ownership verification so only the authenticated patient (or prescribing doctor) can view saved medical history and prescriptions.',
    responsibilities: [
      'Validates patient ownership token against D1 before querying D4',
      'Prevents assistants or third parties from accessing prescription records',
      'Delivers chronological digital prescription history to the patient portal',
    ],
    proposalRef: 'Section 1.4 Objective 5 & Section 5 Social Impact',
  },
  P6: {
    id: 'P6',
    code: '6.0',
    title: 'Assistant Account & Access Delegation',
    kind: 'process',
    levels: ['level1'],
    summary: 'Allows doctors to create, update, or revoke password-protected assistant accounts strictly scoped to appointment management.',
    responsibilities: [
      'Registers assistant credentials into D1 under the supervising doctor',
      'Stores explicit appointment-only permission flags in D5',
      'Returns assistant account status and active credentials to Doctor',
    ],
    proposalRef: 'Section 1.4 Objective 6 & Section 4.2 Operational Feasibility',
  },
  D1: {
    id: 'D1',
    code: 'D1',
    title: 'Users & Auth Credentials',
    kind: 'datastore',
    levels: ['level1'],
    summary: 'MySQL relational table storing user identities, password hashes, and role assignments (patient, doctor, assistant).',
    responsibilities: [
      'Central identity store for authentication and ownership checks',
    ],
    proposalRef: 'Section 4.1 MySQL Database',
    mysqlTables: ['users'],
    mysqlColumns: ['user_id (PK)', 'full_name', 'email_or_phone', 'password_hash', 'role (doctor|patient|assistant)', 'created_at'],
  },
  D2: {
    id: 'D2',
    code: 'D2',
    title: 'Doctor Profiles & Sub-domains',
    kind: 'datastore',
    levels: ['level1'],
    summary: 'MySQL table holding doctor specialties, degrees, chamber addresses, weekly schedules, and wildcard sub-domain slugs.',
    responsibilities: [
      'Powers category-wise search and custom doctor sub-domain routing',
    ],
    proposalRef: 'Section 1.4 Objectives 1, 2, 3',
    mysqlTables: ['doctors', 'specialties', 'chamber_schedules'],
    mysqlColumns: ['doctor_id (PK)', 'user_id (FK)', 'specialty_id (FK)', 'subdomain_slug (UNIQUE)', 'chamber_address', 'schedule_json'],
  },
  D3: {
    id: 'D3',
    code: 'D3',
    title: 'Appointments & Schedules',
    kind: 'datastore',
    levels: ['level1'],
    summary: 'MySQL table tracking patient bookings, chamber dates, serial numbers, and real-time queue statuses.',
    responsibilities: [
      'Synchronizes booking slots between Patient, Doctor, and Assistant',
    ],
    proposalRef: 'Section 1.4 Objectives 2 & 6',
    mysqlTables: ['appointments'],
    mysqlColumns: ['appointment_id (PK)', 'patient_id (FK)', 'doctor_id (FK)', 'visit_date', 'serial_no', 'status (pending|confirmed|completed)'],
  },
  D4: {
    id: 'D4',
    code: 'D4',
    title: 'Medical Prescriptions (Private)',
    kind: 'datastore',
    levels: ['level1'],
    summary: 'Protected MySQL tables storing diagnostic tests, prescribed medicines, dosages, clinical notes, and auto-synced timestamps.',
    responsibilities: [
      'Persists patient medical history under strict ownership access rules',
    ],
    proposalRef: 'Section 1.4 Objectives 4 & 5',
    mysqlTables: ['prescriptions', 'prescription_items'],
    mysqlColumns: ['rx_id (PK)', 'appointment_id (FK)', 'patient_id (FK)', 'doctor_id (FK)', 'medicines_json', 'tests_json', 'synced_timestamp'],
  },
  D5: {
    id: 'D5',
    code: 'D5',
    title: 'Assistant Permissions',
    kind: 'datastore',
    levels: ['level1'],
    summary: 'MySQL access-control table mapping each assistant account to a supervising doctor with restricted appointment-management privileges.',
    responsibilities: [
      'Enforces least-privilege access so assistants cannot view prescriptions',
    ],
    proposalRef: 'Section 1.4 Objective 6',
    mysqlTables: ['assistant_permissions'],
    mysqlColumns: ['perm_id (PK)', 'assistant_user_id (FK)', 'doctor_id (FK)', 'can_manage_appointments', 'can_view_rx (FALSE)', 'is_active'],
  },
};

export const LEVEL0_FLOWS: DfdFlowMeta[] = [
  {
    id: 'L0-F1',
    label: 'Login & Specialty Search Query',
    fromId: 'E1',
    toId: 'P0',
    level: 'level0',
    description: 'Patient submits login credentials and searches the directory by medical specialty or doctor name.',
    payload: ['credentials', 'specialty_category', 'location_filter'],
  },
  {
    id: 'L0-F2',
    label: 'Doctor Directory & Schedule List',
    fromId: 'P0',
    toId: 'E1',
    level: 'level0',
    description: 'System returns matching doctors, their public sub-domain profiles, and available chamber schedules.',
    payload: ['doctor_profiles[]', 'subdomain_url', 'available_slots[]'],
  },
  {
    id: 'L0-F3',
    label: 'Appointment Booking Request',
    fromId: 'E1',
    toId: 'P0',
    level: 'level0',
    description: 'Patient selects a doctor and time slot to book an online chamber appointment.',
    payload: ['doctor_id', 'patient_id', 'preferred_date'],
  },
  {
    id: 'L0-F4',
    label: 'Booking Confirmation & Serial No.',
    fromId: 'P0',
    toId: 'E1',
    level: 'level0',
    description: 'System issues appointment confirmation and chamber serial number to the patient.',
    payload: ['appointment_id', 'serial_no', 'chamber_time'],
  },
  {
    id: 'L0-F5',
    label: 'Prescription & History Request',
    fromId: 'E1',
    toId: 'P0',
    level: 'level0',
    description: 'Authenticated patient requests their private saved prescriptions and medical visit history.',
    payload: ['patient_session_token', 'rx_filter'],
  },
  {
    id: 'L0-F6',
    label: 'Private Digital Prescription',
    fromId: 'P0',
    toId: 'E1',
    level: 'level0',
    description: 'System returns the verified patient’s digital prescriptions and test records with strict third-party privacy.',
    payload: ['prescription_pdf_view', 'medicines[]', 'tests[]', 'synced_datetime'],
  },
  {
    id: 'L0-F7',
    label: 'Login & Sub-domain Config',
    fromId: 'E2',
    toId: 'P0',
    level: 'level0',
    description: 'Doctor authenticates to the Admin Panel and configures their custom sub-domain slug.',
    payload: ['doctor_credentials', 'subdomain_slug'],
  },
  {
    id: 'L0-F8',
    label: 'Profile & Chamber Schedule',
    fromId: 'E2',
    toId: 'P0',
    level: 'level0',
    description: 'Doctor updates specialty details, qualifications, and chamber appointment timings.',
    payload: ['specialty', 'bio', 'chamber_hours'],
  },
  {
    id: 'L0-F9',
    label: 'Patient Queue & History View',
    fromId: 'P0',
    toId: 'E2',
    level: 'level0',
    description: 'System displays today’s chamber queue, confirmed appointments, and consultation details.',
    payload: ['appointment_queue[]', 'patient_details'],
  },
  {
    id: 'L0-F10',
    label: 'Prescription Data (Meds & Tests)',
    fromId: 'E2',
    toId: 'P0',
    level: 'level0',
    description: 'Doctor enters prescribed medicines, dosages, diagnostic tests, and clinical advice.',
    payload: ['appointment_id', 'medicines[]', 'diagnostic_tests[]', 'notes'],
  },
  {
    id: 'L0-F11',
    label: 'Printable Prescription (Auto Date/Time)',
    fromId: 'P0',
    toId: 'E2',
    level: 'level0',
    description: 'System generates a physical-standard formatted prescription with auto-synced date and time ready to print.',
    payload: ['print_layout_html', 'auto_synced_timestamp'],
  },
  {
    id: 'L0-F12',
    label: 'Assistant Account & Access Rules',
    fromId: 'E2',
    toId: 'P0',
    level: 'level0',
    description: 'Doctor creates password-protected assistant accounts with limited appointment-only permissions.',
    payload: ['assistant_credentials', 'permission_scope'],
  },
  {
    id: 'L0-F13',
    label: 'Limited Password-Protected Login',
    fromId: 'E3',
    toId: 'P0',
    level: 'level0',
    description: 'Assistant signs in using limited password-protected credentials assigned by the doctor.',
    payload: ['assistant_username', 'password'],
  },
  {
    id: 'L0-F14',
    label: 'Simplified Appointment Schedule',
    fromId: 'P0',
    toId: 'E3',
    level: 'level0',
    description: 'System displays a restricted dashboard containing only appointment schedules and queue status.',
    payload: ['daily_appointments[]', 'serial_queue'],
  },
  {
    id: 'L0-F15',
    label: 'Appointment & Queue Updates',
    fromId: 'E3',
    toId: 'P0',
    level: 'level0',
    description: 'Assistant confirms bookings, updates patient check-in status, and manages the live queue.',
    payload: ['appointment_id', 'new_status'],
  },
];

export const BALANCING_MATRIX: BalancingRow[] = [
  {
    entity: 'Patient (E1)',
    direction: 'Input to System',
    level0Flow: 'Login & Specialty Search Query',
    level1Process: '1.0 Auth & 2.0 Directory',
    level1Flow: 'Patient Credentials → 1.0 · Specialty Query → 2.0',
    dataStores: 'D1, D2',
  },
  {
    entity: 'Patient (E1)',
    direction: 'Output from System',
    level0Flow: 'Doctor Directory & Schedule List',
    level1Process: '2.0 Directory & Sub-domain',
    level1Flow: 'Category-wise Doctor List & Slots ← 2.0',
    dataStores: 'D2',
  },
  {
    entity: 'Patient (E1)',
    direction: 'Input to System',
    level0Flow: 'Appointment Booking Request',
    level1Process: '3.0 Appointment & Queue',
    level1Flow: 'Booking Request → 3.0',
    dataStores: 'D2, D3',
  },
  {
    entity: 'Patient (E1)',
    direction: 'Output from System',
    level0Flow: 'Booking Confirmation & Serial No.',
    level1Process: '3.0 Appointment & Queue',
    level1Flow: 'Confirmed Serial & Timing ← 3.0',
    dataStores: 'D3',
  },
  {
    entity: 'Patient (E1)',
    direction: 'Input to System',
    level0Flow: 'Prescription & History Request',
    level1Process: '5.0 History & Privacy Access',
    level1Flow: 'History Request → 5.0',
    dataStores: 'D1, D4',
  },
  {
    entity: 'Patient (E1)',
    direction: 'Output from System',
    level0Flow: 'Private Digital Prescription',
    level1Process: '5.0 History & Privacy Access',
    level1Flow: 'Verified Digital Prescription ← 5.0',
    dataStores: 'D4',
  },
  {
    entity: 'Doctor (E2)',
    direction: 'Input to System',
    level0Flow: 'Login & Sub-domain / Profile Config',
    level1Process: '1.0 Auth & 2.0 Directory',
    level1Flow: 'Doctor Credentials → 1.0 · Profile & Slug → 2.0',
    dataStores: 'D1, D2',
  },
  {
    entity: 'Doctor (E2)',
    direction: 'Output from System',
    level0Flow: 'Patient Queue & History View',
    level1Process: '3.0 Appointment & Queue',
    level1Flow: 'Live Appointment Queue ← 3.0',
    dataStores: 'D3',
  },
  {
    entity: 'Doctor (E2)',
    direction: 'Input to System',
    level0Flow: 'Prescription Data (Meds & Tests)',
    level1Process: '4.0 Smart Prescription Gen',
    level1Flow: 'Medicines, Tests & Notes → 4.0',
    dataStores: 'D2, D3, D4',
  },
  {
    entity: 'Doctor (E2)',
    direction: 'Output from System',
    level0Flow: 'Printable Prescription (Auto Date/Time)',
    level1Process: '4.0 Smart Prescription Gen',
    level1Flow: 'Printable Digital Prescription ← 4.0',
    dataStores: 'D4',
  },
  {
    entity: 'Doctor (E2)',
    direction: 'Input to System',
    level0Flow: 'Assistant Account & Access Rules',
    level1Process: '6.0 Assistant Delegation',
    level1Flow: 'Assistant Credentials & Rules → 6.0',
    dataStores: 'D1, D5',
  },
  {
    entity: 'Assistant (E3)',
    direction: 'Input to System',
    level0Flow: 'Limited Password-Protected Login',
    level1Process: '1.0 Auth & Role Access',
    level1Flow: 'Limited Credentials → 1.0',
    dataStores: 'D1, D5',
  },
  {
    entity: 'Assistant (E3)',
    direction: 'Output from System',
    level0Flow: 'Simplified Appointment Schedule',
    level1Process: '3.0 Appointment & Queue',
    level1Flow: 'Scoped Queue View ← 3.0',
    dataStores: 'D3',
  },
  {
    entity: 'Assistant (E3)',
    direction: 'Input to System',
    level0Flow: 'Appointment & Queue Updates',
    level1Process: '3.0 Appointment & Queue',
    level1Flow: 'Queue Status Updates → 3.0',
    dataStores: 'D3',
  },
];
