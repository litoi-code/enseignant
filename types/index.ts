// Types for French Educational System Classroom Management

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  parentContact?: string;
  photo?: string;
  notes?: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  level: string; // e.g., "6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"
  subject: string;
  year: string; // Academic year e.g., "2024-2025"
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  objectives?: string[];
  materials?: string[];
  homework?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId?: string;
  classId: string;
  value: number; // 0-20 scale
  coefficient: number; // Weight of the grade
  type: GradeType;
  subject: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type GradeType =
  | 'controle' // Test/Quiz
  | 'devoir_surveille' // Supervised assignment
  | 'devoir_maison' // Homework
  | 'oral' // Oral presentation
  | 'projet' // Project
  | 'participation' // Class participation
  | 'dictee' // Dictation (primary)
  | 'lecture' // Reading (primary)
  | 'calcul' // Calculation (primary)
  | 'redaction' // Writing (primary)
  | 'evaluation' // General evaluation
  | 'autre'; // Other

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus =
  | 'present' // Présent
  | 'absent' // Absent
  | 'late' // Retard
  | 'excused'; // Absent excusé

export interface GradeCalculation {
  studentId: string;
  classId: string;
  subject: string;
  average: number;
  totalCoefficient: number;
  gradeCount: number;
  lastUpdated: string;
}

export interface Settings {
  id: string;
  userId: string;
  gradeScale: {
    min: number;
    max: number;
    passingGrade: number;
  };
  defaultCoefficient: number;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  language: 'fr' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    enabled: boolean;
    reminders: boolean;
    gradeAlerts: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExportData {
  students: Student[];
  classes: Class[];
  courses: Course[];
  grades: Grade[];
  attendance: Attendance[];
  exportDate: string;
  version: string;
}

// French Educational System Constants
export const FRENCH_GRADE_SCALE = {
  MIN: 0,
  MAX: 20,
  PASSING: 10,
  GOOD: 14,
  VERY_GOOD: 16,
  EXCELLENT: 18
} as const;

export const FRENCH_EDUCATION_LEVELS = [
  // Primaire (Primary Education)
  { value: 'cp', label: 'CP', category: 'Primaire' },
  { value: 'ce1', label: 'CE1', category: 'Primaire' },
  { value: 'ce2', label: 'CE2', category: 'Primaire' },
  { value: 'cm1', label: 'CM1', category: 'Primaire' },
  { value: 'cm2', label: 'CM2', category: 'Primaire' },

  // Collège (Middle School)
  { value: '6eme', label: '6ème', category: 'Collège' },
  { value: '5eme', label: '5ème', category: 'Collège' },
  { value: '4eme', label: '4ème', category: 'Collège' },
  { value: '3eme', label: '3ème', category: 'Collège' },

  // Lycée (High School)
  { value: '2nde', label: '2nde', category: 'Lycée' },
  { value: '1ere', label: '1ère', category: 'Lycée' },
  { value: 'terminale', label: 'Terminale', category: 'Lycée' }
] as const;

export const GRADE_TYPE_LABELS: Record<GradeType, string> = {
  controle: 'Contrôle',
  devoir_surveille: 'Devoir surveillé',
  devoir_maison: 'Devoir maison',
  oral: 'Oral',
  projet: 'Projet',
  participation: 'Participation',
  dictee: 'Dictée',
  lecture: 'Lecture',
  calcul: 'Calcul',
  redaction: 'Rédaction',
  evaluation: 'Évaluation',
  autre: 'Autre'
};

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Présent',
  absent: 'Absent',
  late: 'Retard',
  excused: 'Absent excusé'
};

// French Education Subjects by Level
export const FRENCH_SUBJECTS = {
  PRIMAIRE: [
    'Français',
    'Mathématiques',
    'Histoire-Géographie',
    'Sciences et Technologie',
    'Éducation Physique et Sportive',
    'Arts Plastiques',
    'Éducation Musicale',
    'Enseignement Moral et Civique',
    'Langue Vivante'
  ],
  COLLEGE: [
    'Français',
    'Mathématiques',
    'Histoire-Géographie',
    'Sciences de la Vie et de la Terre',
    'Physique-Chimie',
    'Technologie',
    'Éducation Physique et Sportive',
    'Arts Plastiques',
    'Éducation Musicale',
    'Enseignement Moral et Civique',
    'Langue Vivante 1',
    'Langue Vivante 2',
    'Latin/Grec'
  ],
  LYCEE: [
    'Français',
    'Philosophie',
    'Histoire-Géographie',
    'Mathématiques',
    'Sciences de la Vie et de la Terre',
    'Physique-Chimie',
    'Sciences Économiques et Sociales',
    'Littérature',
    'Langues Vivantes',
    'Éducation Physique et Sportive',
    'Enseignement Moral et Civique',
    'Spécialités diverses'
  ]
} as const;

// Database table names
export const DB_TABLES = {
  STUDENTS: 'students',
  CLASSES: 'classes',
  COURSES: 'courses',
  GRADES: 'grades',
  ATTENDANCE: 'attendance',
  SETTINGS: 'settings'
} as const;

// Navigation types
export type RootTabParamList = {
  index: undefined;
  students: undefined;
  courses: undefined;
  grades: undefined;
  attendance: undefined;
  settings: undefined;
};

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
}

// Statistics types
export interface ClassStatistics {
  classId: string;
  totalStudents: number;
  averageGrade: number;
  attendanceRate: number;
  gradeDistribution: {
    excellent: number; // 18-20
    veryGood: number; // 16-18
    good: number; // 14-16
    satisfactory: number; // 10-14
    insufficient: number; // 0-10
  };
}

export interface StudentStatistics {
  studentId: string;
  overallAverage: number;
  attendanceRate: number;
  totalAbsences: number;
  gradeCount: number;
  lastGrade?: Grade;
  trend: 'improving' | 'declining' | 'stable';
}
