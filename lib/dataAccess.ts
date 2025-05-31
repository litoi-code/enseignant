import {
    Attendance,
    AttendanceStatus,
    Class,
    Course,
    DB_TABLES,
    Grade,
    GradeType,
    Student
} from '../types';
import { generateId, getCurrentTimestamp, getDatabase } from './database';

/**
 * Data Access Layer for French Educational System
 * Provides CRUD operations for all entities
 */

// ============ CLASSES ============

export const createClass = async (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const db = getDatabase();
  const id = generateId();
  const now = getCurrentTimestamp();

  await db.runAsync(
    `INSERT INTO ${DB_TABLES.CLASSES} (
      id, name, level, subject, year, description, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, classData.name, classData.level, classData.subject, classData.year, classData.description || null, now, now]
  );

  return id;
};

export const getClasses = async (): Promise<Class[]> => {
  const db = getDatabase();
  const result = await db.getAllAsync(`SELECT * FROM ${DB_TABLES.CLASSES} ORDER BY name`);

  return result.map(row => ({
    id: (row as any).id,
    name: (row as any).name,
    level: (row as any).level,
    subject: (row as any).subject,
    year: (row as any).year,
    description: (row as any).description,
    createdAt: (row as any).created_at,
    updatedAt: (row as any).updated_at
  }));
};

export const getClassById = async (id: string): Promise<Class | null> => {
  const db = getDatabase();
  const result = await db.getFirstAsync(
    `SELECT * FROM ${DB_TABLES.CLASSES} WHERE id = ?`,
    [id]
  );

  if (!result) return null;

  return {
    id: (result as any).id,
    name: (result as any).name,
    level: (result as any).level,
    subject: (result as any).subject,
    year: (result as any).year,
    description: (result as any).description,
    createdAt: (result as any).created_at,
    updatedAt: (result as any).updated_at
  };
};

export const updateClass = async (id: string, updates: Partial<Omit<Class, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const db = getDatabase();
  const now = getCurrentTimestamp();

  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values: any[] = [...Object.values(updates), now, id];

  await db.runAsync(
    `UPDATE ${DB_TABLES.CLASSES} SET ${fields}, updated_at = ? WHERE id = ?`,
    values
  );
};

export const deleteClass = async (id: string): Promise<void> => {
  const db = getDatabase();
  await db.runAsync(`DELETE FROM ${DB_TABLES.CLASSES} WHERE id = ?`, [id]);
};

// ============ STUDENTS ============

export const createStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const db = getDatabase();
  const id = generateId();
  const now = getCurrentTimestamp();

  await db.runAsync(
    `INSERT INTO ${DB_TABLES.STUDENTS} (
      id, first_name, last_name, date_of_birth, email, phone, parent_contact,
      photo, notes, class_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, studentData.firstName, studentData.lastName, studentData.dateOfBirth || null,
      studentData.email || null, studentData.phone || null, studentData.parentContact || null,
      studentData.photo || null, studentData.notes || null, studentData.classId, now, now
    ]
  );

  return id;
};

export const getStudents = async (classId?: string): Promise<Student[]> => {
  const db = getDatabase();
  let query = `SELECT * FROM ${DB_TABLES.STUDENTS}`;
  const params: any[] = [];

  if (classId) {
    query += ` WHERE class_id = ?`;
    params.push(classId);
  }

  query += ` ORDER BY last_name, first_name`;

  const result = await db.getAllAsync(query, params);

  return result.map(row => ({
    id: (row as any).id,
    firstName: (row as any).first_name,
    lastName: (row as any).last_name,
    dateOfBirth: (row as any).date_of_birth,
    email: (row as any).email,
    phone: (row as any).phone,
    parentContact: (row as any).parent_contact,
    photo: (row as any).photo,
    notes: (row as any).notes,
    classId: (row as any).class_id,
    createdAt: (row as any).created_at,
    updatedAt: (row as any).updated_at
  }));
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  const db = getDatabase();
  const result = await db.getFirstAsync(
    `SELECT * FROM ${DB_TABLES.STUDENTS} WHERE id = ?`,
    [id]
  );

  if (!result) return null;

  return {
    id: (result as any).id,
    firstName: (result as any).first_name,
    lastName: (result as any).last_name,
    dateOfBirth: (result as any).date_of_birth,
    email: (result as any).email,
    phone: (result as any).phone,
    parentContact: (result as any).parent_contact,
    photo: (result as any).photo,
    notes: (result as any).notes,
    classId: (result as any).class_id,
    createdAt: (result as any).created_at,
    updatedAt: (result as any).updated_at
  };
};

export const updateStudent = async (id: string, updates: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const db = getDatabase();
  const now = getCurrentTimestamp();

  // Convert camelCase to snake_case for database
  const dbUpdates: any = {};
  if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
  if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
  if (updates.dateOfBirth !== undefined) dbUpdates.date_of_birth = updates.dateOfBirth;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.parentContact !== undefined) dbUpdates.parent_contact = updates.parentContact;
  if (updates.photo !== undefined) dbUpdates.photo = updates.photo;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.classId !== undefined) dbUpdates.class_id = updates.classId;

  const fields = Object.keys(dbUpdates).map(key => `${key} = ?`).join(', ');
  const values: any[] = [...Object.values(dbUpdates), now, id];

  await db.runAsync(
    `UPDATE ${DB_TABLES.STUDENTS} SET ${fields}, updated_at = ? WHERE id = ?`,
    values
  );
};

export const deleteStudent = async (id: string): Promise<void> => {
  const db = getDatabase();
  await db.runAsync(`DELETE FROM ${DB_TABLES.STUDENTS} WHERE id = ?`, [id]);
};

// ============ COURSES ============

export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const db = getDatabase();
  const id = generateId();
  const now = getCurrentTimestamp();

  await db.runAsync(
    `INSERT INTO ${DB_TABLES.COURSES} (
      id, title, description, class_id, date, start_time, end_time,
      objectives, materials, homework, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, courseData.title, courseData.description || null, courseData.classId,
      courseData.date, courseData.startTime, courseData.endTime,
      JSON.stringify(courseData.objectives || []), JSON.stringify(courseData.materials || []),
      courseData.homework || null, courseData.status, now, now
    ]
  );

  return id;
};

export const getCourses = async (classId?: string, date?: string): Promise<Course[]> => {
  const db = getDatabase();
  let query = `SELECT * FROM ${DB_TABLES.COURSES}`;
  const params: any[] = [];

  const conditions: string[] = [];
  if (classId) {
    conditions.push('class_id = ?');
    params.push(classId);
  }
  if (date) {
    conditions.push('date = ?');
    params.push(date);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` ORDER BY date, start_time`;

  const result = await db.getAllAsync(query, params);

  return result.map(row => ({
    id: (row as any).id,
    title: (row as any).title,
    description: (row as any).description,
    classId: (row as any).class_id,
    date: (row as any).date,
    startTime: (row as any).start_time,
    endTime: (row as any).end_time,
    objectives: JSON.parse((row as any).objectives || '[]'),
    materials: JSON.parse((row as any).materials || '[]'),
    homework: (row as any).homework,
    status: (row as any).status,
    createdAt: (row as any).created_at,
    updatedAt: (row as any).updated_at
  }));
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  const db = getDatabase();
  const result = await db.getFirstAsync(
    `SELECT * FROM ${DB_TABLES.COURSES} WHERE id = ?`,
    [id]
  );

  if (!result) return null;

  return {
    id: (result as any).id,
    title: (result as any).title,
    description: (result as any).description,
    classId: (result as any).class_id,
    date: (result as any).date,
    startTime: (result as any).start_time,
    endTime: (result as any).end_time,
    objectives: JSON.parse((result as any).objectives || '[]'),
    materials: JSON.parse((result as any).materials || '[]'),
    homework: (result as any).homework,
    status: (result as any).status,
    createdAt: (result as any).created_at,
    updatedAt: (result as any).updated_at
  };
};

export const updateCourse = async (id: string, updates: Partial<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const db = getDatabase();
  const now = getCurrentTimestamp();

  // Convert camelCase to snake_case and handle JSON fields
  const dbUpdates: any = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.classId !== undefined) dbUpdates.class_id = updates.classId;
  if (updates.date !== undefined) dbUpdates.date = updates.date;
  if (updates.startTime !== undefined) dbUpdates.start_time = updates.startTime;
  if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime;
  if (updates.objectives !== undefined) dbUpdates.objectives = JSON.stringify(updates.objectives);
  if (updates.materials !== undefined) dbUpdates.materials = JSON.stringify(updates.materials);
  if (updates.homework !== undefined) dbUpdates.homework = updates.homework;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  const fields = Object.keys(dbUpdates).map(key => `${key} = ?`).join(', ');
  const values: any[] = [...Object.values(dbUpdates), now, id];

  await db.runAsync(
    `UPDATE ${DB_TABLES.COURSES} SET ${fields}, updated_at = ? WHERE id = ?`,
    values
  );
};

export const deleteCourse = async (id: string): Promise<void> => {
  const db = getDatabase();
  await db.runAsync(`DELETE FROM ${DB_TABLES.COURSES} WHERE id = ?`, [id]);
};

// ============ GRADES ============

export const createGrade = async (gradeData: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const db = getDatabase();
  const id = generateId();
  const now = getCurrentTimestamp();

  await db.runAsync(
    `INSERT INTO ${DB_TABLES.GRADES} (
      id, student_id, course_id, class_id, value, coefficient, type,
      subject, description, date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, gradeData.studentId, gradeData.courseId || null, gradeData.classId,
      gradeData.value, gradeData.coefficient, gradeData.type,
      gradeData.subject, gradeData.description || null, gradeData.date, now, now
    ]
  );

  return id;
};

export const getGrades = async (studentId?: string, classId?: string, subject?: string): Promise<Grade[]> => {
  const db = getDatabase();
  let query = `SELECT * FROM ${DB_TABLES.GRADES}`;
  const params: any[] = [];

  const conditions: string[] = [];
  if (studentId) {
    conditions.push('student_id = ?');
    params.push(studentId);
  }
  if (classId) {
    conditions.push('class_id = ?');
    params.push(classId);
  }
  if (subject) {
    conditions.push('subject = ?');
    params.push(subject);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` ORDER BY date DESC`;

  const result = await db.getAllAsync(query, params);

  return result.map(row => ({
    id: (row as any).id,
    studentId: (row as any).student_id,
    courseId: (row as any).course_id,
    classId: (row as any).class_id,
    value: (row as any).value,
    coefficient: (row as any).coefficient,
    type: (row as any).type as GradeType,
    subject: (row as any).subject,
    description: (row as any).description,
    date: (row as any).date,
    createdAt: (row as any).created_at,
    updatedAt: (row as any).updated_at
  }));
};

export const getGradeById = async (id: string): Promise<Grade | null> => {
  const db = getDatabase();
  const result = await db.getFirstAsync(
    `SELECT * FROM ${DB_TABLES.GRADES} WHERE id = ?`,
    [id]
  );

  if (!result) return null;

  return {
    id: (result as any).id,
    studentId: (result as any).student_id,
    courseId: (result as any).course_id,
    classId: (result as any).class_id,
    value: (result as any).value,
    coefficient: (result as any).coefficient,
    type: (result as any).type as GradeType,
    subject: (result as any).subject,
    description: (result as any).description,
    date: (result as any).date,
    createdAt: (result as any).created_at,
    updatedAt: (result as any).updated_at
  };
};

export const updateGrade = async (id: string, updates: Partial<Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const db = getDatabase();
  const now = getCurrentTimestamp();

  // Convert camelCase to snake_case for database
  const dbUpdates: any = {};
  if (updates.studentId !== undefined) dbUpdates.student_id = updates.studentId;
  if (updates.courseId !== undefined) dbUpdates.course_id = updates.courseId;
  if (updates.classId !== undefined) dbUpdates.class_id = updates.classId;
  if (updates.value !== undefined) dbUpdates.value = updates.value;
  if (updates.coefficient !== undefined) dbUpdates.coefficient = updates.coefficient;
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.subject !== undefined) dbUpdates.subject = updates.subject;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.date !== undefined) dbUpdates.date = updates.date;

  const fields = Object.keys(dbUpdates).map(key => `${key} = ?`).join(', ');
  const values: any[] = [...Object.values(dbUpdates), now, id];

  await db.runAsync(
    `UPDATE ${DB_TABLES.GRADES} SET ${fields}, updated_at = ? WHERE id = ?`,
    values
  );
};

export const deleteGrade = async (id: string): Promise<void> => {
  const db = getDatabase();
  await db.runAsync(`DELETE FROM ${DB_TABLES.GRADES} WHERE id = ?`, [id]);
};

// ============ ATTENDANCE ============

export const createAttendance = async (attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const db = getDatabase();
  const id = generateId();
  const now = getCurrentTimestamp();

  await db.runAsync(
    `INSERT INTO ${DB_TABLES.ATTENDANCE} (
      id, student_id, course_id, class_id, date, status, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, attendanceData.studentId, attendanceData.courseId, attendanceData.classId,
      attendanceData.date, attendanceData.status, attendanceData.notes || null, now, now
    ]
  );

  return id;
};

export const getAttendance = async (studentId?: string, courseId?: string, classId?: string, date?: string): Promise<Attendance[]> => {
  const db = getDatabase();
  let query = `SELECT * FROM ${DB_TABLES.ATTENDANCE}`;
  const params: any[] = [];

  const conditions: string[] = [];
  if (studentId) {
    conditions.push('student_id = ?');
    params.push(studentId);
  }
  if (courseId) {
    conditions.push('course_id = ?');
    params.push(courseId);
  }
  if (classId) {
    conditions.push('class_id = ?');
    params.push(classId);
  }
  if (date) {
    conditions.push('date = ?');
    params.push(date);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` ORDER BY date DESC`;

  const result = await db.getAllAsync(query, params);

  return result.map(row => ({
    id: (row as any).id,
    studentId: (row as any).student_id,
    courseId: (row as any).course_id,
    classId: (row as any).class_id,
    date: (row as any).date,
    status: (row as any).status as AttendanceStatus,
    notes: (row as any).notes,
    createdAt: (row as any).created_at,
    updatedAt: (row as any).updated_at
  }));
};

export const updateAttendance = async (id: string, updates: Partial<Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const db = getDatabase();
  const now = getCurrentTimestamp();

  // Convert camelCase to snake_case for database
  const dbUpdates: any = {};
  if (updates.studentId !== undefined) dbUpdates.student_id = updates.studentId;
  if (updates.courseId !== undefined) dbUpdates.course_id = updates.courseId;
  if (updates.classId !== undefined) dbUpdates.class_id = updates.classId;
  if (updates.date !== undefined) dbUpdates.date = updates.date;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

  const fields = Object.keys(dbUpdates).map(key => `${key} = ?`).join(', ');
  const values: any[] = [...Object.values(dbUpdates), now, id];

  await db.runAsync(
    `UPDATE ${DB_TABLES.ATTENDANCE} SET ${fields}, updated_at = ? WHERE id = ?`,
    values
  );
};

export const deleteAttendance = async (id: string): Promise<void> => {
  const db = getDatabase();
  await db.runAsync(`DELETE FROM ${DB_TABLES.ATTENDANCE} WHERE id = ?`, [id]);
};

// ============ BULK OPERATIONS ============

export const createBulkAttendance = async (courseId: string, classId: string, date: string, attendanceData: { studentId: string; status: AttendanceStatus; notes?: string }[]): Promise<void> => {
  const db = getDatabase();
  const now = getCurrentTimestamp();

  // Delete existing attendance for this course and date
  await db.runAsync(
    `DELETE FROM ${DB_TABLES.ATTENDANCE} WHERE course_id = ? AND date = ?`,
    [courseId, date]
  );

  // Insert new attendance records
  for (const record of attendanceData) {
    const id = generateId();
    await db.runAsync(
      `INSERT INTO ${DB_TABLES.ATTENDANCE} (
        id, student_id, course_id, class_id, date, status, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, record.studentId, courseId, classId, date, record.status, record.notes || null, now, now]
    );
  }
};

// ============ STATISTICS ============

export const getStudentGradeAverage = async (studentId: string, classId?: string, subject?: string): Promise<number> => {
  const grades = await getGrades(studentId, classId, subject);
  if (grades.length === 0) return 0;

  let totalWeightedScore = 0;
  let totalCoefficient = 0;

  for (const grade of grades) {
    totalWeightedScore += grade.value * grade.coefficient;
    totalCoefficient += grade.coefficient;
  }

  return totalCoefficient > 0 ? totalWeightedScore / totalCoefficient : 0;
};

export const getStudentAttendanceRate = async (studentId: string, classId?: string): Promise<number> => {
  const db = getDatabase();
  let query = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present
    FROM ${DB_TABLES.ATTENDANCE}
    WHERE student_id = ?
  `;
  const params: any[] = [studentId];

  if (classId) {
    query += ` AND class_id = ?`;
    params.push(classId);
  }

  const result = await db.getFirstAsync(query, params);

  if (!result || (result as any).total === 0) return 0;

  return ((result as any).present / (result as any).total) * 100;
};
