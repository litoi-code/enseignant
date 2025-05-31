import { create } from 'zustand';
import { Student, Class, Course, Grade, Attendance, Settings } from '../types';
import * as DataAccess from './dataAccess';
import { initDatabase } from './database';

// ============ TYPES ============

interface AppState {
  // Data
  students: Student[];
  classes: Class[];
  courses: Course[];
  grades: Grade[];
  attendance: Attendance[];
  settings: Settings | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedClassId: string | null;
  selectedStudentId: string | null;
  
  // Actions
  initializeApp: () => Promise<void>;
  
  // Class actions
  loadClasses: () => Promise<void>;
  createClass: (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateClass: (id: string, updates: Partial<Omit<Class, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  setSelectedClass: (classId: string | null) => void;
  
  // Student actions
  loadStudents: (classId?: string) => Promise<void>;
  createStudent: (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateStudent: (id: string, updates: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  setSelectedStudent: (studentId: string | null) => void;
  
  // Course actions
  loadCourses: (classId?: string, date?: string) => Promise<void>;
  createCourse: (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateCourse: (id: string, updates: Partial<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  
  // Grade actions
  loadGrades: (studentId?: string, classId?: string, subject?: string) => Promise<void>;
  createGrade: (gradeData: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateGrade: (id: string, updates: Partial<Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;
  
  // Attendance actions
  loadAttendance: (studentId?: string, courseId?: string, classId?: string, date?: string) => Promise<void>;
  createAttendance: (attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateAttendance: (id: string, updates: Partial<Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteAttendance: (id: string) => Promise<void>;
  createBulkAttendance: (courseId: string, classId: string, date: string, attendanceData: { studentId: string; status: any; notes?: string }[]) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// ============ STORE ============

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  students: [],
  classes: [],
  courses: [],
  grades: [],
  attendance: [],
  settings: null,
  isLoading: false,
  error: null,
  selectedClassId: null,
  selectedStudentId: null,

  // Initialize app
  initializeApp: async () => {
    try {
      set({ isLoading: true, error: null });
      await initDatabase();
      await get().loadClasses();
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      set({ error: 'Erreur lors de l\'initialisation de l\'application' });
    } finally {
      set({ isLoading: false });
    }
  },

  // ============ CLASS ACTIONS ============

  loadClasses: async () => {
    try {
      set({ isLoading: true, error: null });
      const classes = await DataAccess.getClasses();
      set({ classes });
    } catch (error) {
      console.error('Failed to load classes:', error);
      set({ error: 'Erreur lors du chargement des classes' });
    } finally {
      set({ isLoading: false });
    }
  },

  createClass: async (classData) => {
    try {
      set({ isLoading: true, error: null });
      const id = await DataAccess.createClass(classData);
      await get().loadClasses();
      return id;
    } catch (error) {
      console.error('Failed to create class:', error);
      set({ error: 'Erreur lors de la création de la classe' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateClass: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      await DataAccess.updateClass(id, updates);
      await get().loadClasses();
    } catch (error) {
      console.error('Failed to update class:', error);
      set({ error: 'Erreur lors de la mise à jour de la classe' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteClass: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await DataAccess.deleteClass(id);
      await get().loadClasses();
      // Clear selection if deleted class was selected
      if (get().selectedClassId === id) {
        set({ selectedClassId: null });
      }
    } catch (error) {
      console.error('Failed to delete class:', error);
      set({ error: 'Erreur lors de la suppression de la classe' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedClass: (classId) => {
    set({ selectedClassId: classId });
  },

  // ============ STUDENT ACTIONS ============

  loadStudents: async (classId) => {
    try {
      set({ isLoading: true, error: null });
      const students = await DataAccess.getStudents(classId);
      set({ students });
    } catch (error) {
      console.error('Failed to load students:', error);
      set({ error: 'Erreur lors du chargement des élèves' });
    } finally {
      set({ isLoading: false });
    }
  },

  createStudent: async (studentData) => {
    try {
      set({ isLoading: true, error: null });
      const id = await DataAccess.createStudent(studentData);
      await get().loadStudents(studentData.classId);
      return id;
    } catch (error) {
      console.error('Failed to create student:', error);
      set({ error: 'Erreur lors de la création de l\'élève' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateStudent: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      await DataAccess.updateStudent(id, updates);
      // Reload students for the current class
      const currentClassId = get().selectedClassId;
      await get().loadStudents(currentClassId || undefined);
    } catch (error) {
      console.error('Failed to update student:', error);
      set({ error: 'Erreur lors de la mise à jour de l\'élève' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteStudent: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await DataAccess.deleteStudent(id);
      // Reload students for the current class
      const currentClassId = get().selectedClassId;
      await get().loadStudents(currentClassId || undefined);
      // Clear selection if deleted student was selected
      if (get().selectedStudentId === id) {
        set({ selectedStudentId: null });
      }
    } catch (error) {
      console.error('Failed to delete student:', error);
      set({ error: 'Erreur lors de la suppression de l\'élève' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedStudent: (studentId) => {
    set({ selectedStudentId: studentId });
  },

  // ============ COURSE ACTIONS ============

  loadCourses: async (classId, date) => {
    try {
      set({ isLoading: true, error: null });
      const courses = await DataAccess.getCourses(classId, date);
      set({ courses });
    } catch (error) {
      console.error('Failed to load courses:', error);
      set({ error: 'Erreur lors du chargement des cours' });
    } finally {
      set({ isLoading: false });
    }
  },

  createCourse: async (courseData) => {
    try {
      set({ isLoading: true, error: null });
      const id = await DataAccess.createCourse(courseData);
      await get().loadCourses(courseData.classId);
      return id;
    } catch (error) {
      console.error('Failed to create course:', error);
      set({ error: 'Erreur lors de la création du cours' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCourse: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      await DataAccess.updateCourse(id, updates);
      // Reload courses for the current class
      const currentClassId = get().selectedClassId;
      await get().loadCourses(currentClassId || undefined);
    } catch (error) {
      console.error('Failed to update course:', error);
      set({ error: 'Erreur lors de la mise à jour du cours' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCourse: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await DataAccess.deleteCourse(id);
      // Reload courses for the current class
      const currentClassId = get().selectedClassId;
      await get().loadCourses(currentClassId || undefined);
    } catch (error) {
      console.error('Failed to delete course:', error);
      set({ error: 'Erreur lors de la suppression du cours' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ============ GRADE ACTIONS ============

  loadGrades: async (studentId, classId, subject) => {
    try {
      set({ isLoading: true, error: null });
      const grades = await DataAccess.getGrades(studentId, classId, subject);
      set({ grades });
    } catch (error) {
      console.error('Failed to load grades:', error);
      set({ error: 'Erreur lors du chargement des notes' });
    } finally {
      set({ isLoading: false });
    }
  },

  createGrade: async (gradeData) => {
    try {
      set({ isLoading: true, error: null });
      const id = await DataAccess.createGrade(gradeData);
      await get().loadGrades(gradeData.studentId, gradeData.classId);
      return id;
    } catch (error) {
      console.error('Failed to create grade:', error);
      set({ error: 'Erreur lors de la création de la note' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateGrade: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      await DataAccess.updateGrade(id, updates);
      // Reload grades for current context
      const currentClassId = get().selectedClassId;
      const currentStudentId = get().selectedStudentId;
      await get().loadGrades(currentStudentId || undefined, currentClassId || undefined);
    } catch (error) {
      console.error('Failed to update grade:', error);
      set({ error: 'Erreur lors de la mise à jour de la note' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteGrade: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await DataAccess.deleteGrade(id);
      // Reload grades for current context
      const currentClassId = get().selectedClassId;
      const currentStudentId = get().selectedStudentId;
      await get().loadGrades(currentStudentId || undefined, currentClassId || undefined);
    } catch (error) {
      console.error('Failed to delete grade:', error);
      set({ error: 'Erreur lors de la suppression de la note' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ============ ATTENDANCE ACTIONS ============

  loadAttendance: async (studentId, courseId, classId, date) => {
    try {
      set({ isLoading: true, error: null });
      const attendance = await DataAccess.getAttendance(studentId, courseId, classId, date);
      set({ attendance });
    } catch (error) {
      console.error('Failed to load attendance:', error);
      set({ error: 'Erreur lors du chargement des présences' });
    } finally {
      set({ isLoading: false });
    }
  },

  createAttendance: async (attendanceData) => {
    try {
      set({ isLoading: true, error: null });
      const id = await DataAccess.createAttendance(attendanceData);
      await get().loadAttendance(undefined, attendanceData.courseId, attendanceData.classId);
      return id;
    } catch (error) {
      console.error('Failed to create attendance:', error);
      set({ error: 'Erreur lors de la création de la présence' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAttendance: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      await DataAccess.updateAttendance(id, updates);
      // Reload attendance for current context
      const currentClassId = get().selectedClassId;
      await get().loadAttendance(undefined, undefined, currentClassId || undefined);
    } catch (error) {
      console.error('Failed to update attendance:', error);
      set({ error: 'Erreur lors de la mise à jour de la présence' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAttendance: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await DataAccess.deleteAttendance(id);
      // Reload attendance for current context
      const currentClassId = get().selectedClassId;
      await get().loadAttendance(undefined, undefined, currentClassId || undefined);
    } catch (error) {
      console.error('Failed to delete attendance:', error);
      set({ error: 'Erreur lors de la suppression de la présence' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createBulkAttendance: async (courseId, classId, date, attendanceData) => {
    try {
      set({ isLoading: true, error: null });
      await DataAccess.createBulkAttendance(courseId, classId, date, attendanceData);
      await get().loadAttendance(undefined, courseId, classId, date);
    } catch (error) {
      console.error('Failed to create bulk attendance:', error);
      set({ error: 'Erreur lors de la création des présences' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // ============ UTILITY ACTIONS ============

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
