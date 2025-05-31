import * as SQLite from 'expo-sqlite';
import { DB_TABLES } from '../types';

const DATABASE_NAME = 'enseignant.db';
const DATABASE_VERSION = 1;

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await createTables();
    await insertDefaultSettings();
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

const createTables = async (): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  // Create Classes table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${DB_TABLES.CLASSES} (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      level TEXT NOT NULL,
      subject TEXT NOT NULL,
      year TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Create Students table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${DB_TABLES.STUDENTS} (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth TEXT,
      email TEXT,
      phone TEXT,
      parent_contact TEXT,
      photo TEXT,
      notes TEXT,
      class_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (class_id) REFERENCES ${DB_TABLES.CLASSES}(id) ON DELETE CASCADE
    );
  `);

  // Create Courses table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${DB_TABLES.COURSES} (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      class_id TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      objectives TEXT, -- JSON array
      materials TEXT, -- JSON array
      homework TEXT,
      status TEXT NOT NULL DEFAULT 'planned',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (class_id) REFERENCES ${DB_TABLES.CLASSES}(id) ON DELETE CASCADE
    );
  `);

  // Create Grades table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${DB_TABLES.GRADES} (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      course_id TEXT,
      class_id TEXT NOT NULL,
      value REAL NOT NULL CHECK (value >= 0 AND value <= 20),
      coefficient REAL NOT NULL DEFAULT 1.0,
      type TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES ${DB_TABLES.STUDENTS}(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES ${DB_TABLES.COURSES}(id) ON DELETE SET NULL,
      FOREIGN KEY (class_id) REFERENCES ${DB_TABLES.CLASSES}(id) ON DELETE CASCADE
    );
  `);

  // Create Attendance table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${DB_TABLES.ATTENDANCE} (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      class_id TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES ${DB_TABLES.STUDENTS}(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES ${DB_TABLES.COURSES}(id) ON DELETE CASCADE,
      FOREIGN KEY (class_id) REFERENCES ${DB_TABLES.CLASSES}(id) ON DELETE CASCADE,
      UNIQUE(student_id, course_id, date)
    );
  `);

  // Create Settings table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${DB_TABLES.SETTINGS} (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT 'default',
      grade_scale_min REAL NOT NULL DEFAULT 0,
      grade_scale_max REAL NOT NULL DEFAULT 20,
      grade_scale_passing REAL NOT NULL DEFAULT 10,
      default_coefficient REAL NOT NULL DEFAULT 1.0,
      auto_backup INTEGER NOT NULL DEFAULT 1,
      backup_frequency TEXT NOT NULL DEFAULT 'weekly',
      language TEXT NOT NULL DEFAULT 'fr',
      theme TEXT NOT NULL DEFAULT 'auto',
      notifications_enabled INTEGER NOT NULL DEFAULT 1,
      notifications_reminders INTEGER NOT NULL DEFAULT 1,
      notifications_grade_alerts INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Create indexes for better performance
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_students_class_id ON ${DB_TABLES.STUDENTS}(class_id);
    CREATE INDEX IF NOT EXISTS idx_courses_class_id ON ${DB_TABLES.COURSES}(class_id);
    CREATE INDEX IF NOT EXISTS idx_courses_date ON ${DB_TABLES.COURSES}(date);
    CREATE INDEX IF NOT EXISTS idx_grades_student_id ON ${DB_TABLES.GRADES}(student_id);
    CREATE INDEX IF NOT EXISTS idx_grades_class_id ON ${DB_TABLES.GRADES}(class_id);
    CREATE INDEX IF NOT EXISTS idx_grades_date ON ${DB_TABLES.GRADES}(date);
    CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON ${DB_TABLES.ATTENDANCE}(student_id);
    CREATE INDEX IF NOT EXISTS idx_attendance_course_id ON ${DB_TABLES.ATTENDANCE}(course_id);
    CREATE INDEX IF NOT EXISTS idx_attendance_date ON ${DB_TABLES.ATTENDANCE}(date);
  `);

  console.log('Database tables created successfully');
};

const insertDefaultSettings = async (): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const existingSettings = await db.getFirstAsync(
    `SELECT id FROM ${DB_TABLES.SETTINGS} WHERE user_id = 'default'`
  );

  if (!existingSettings) {
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO ${DB_TABLES.SETTINGS} (
        id, user_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?)`,
      ['default-settings', 'default', now, now]
    );
    console.log('Default settings inserted');
  }
};

export const resetDatabase = async (): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const tables = Object.values(DB_TABLES);
  for (const table of tables) {
    await db.execAsync(`DROP TABLE IF EXISTS ${table}`);
  }
  
  await createTables();
  await insertDefaultSettings();
  console.log('Database reset successfully');
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
    console.log('Database closed');
  }
};

// Utility function to generate UUID
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Utility function to get current timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Database migration helper
export const migrateDatabase = async (targetVersion: number): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const currentVersion = await getDatabaseVersion();
  
  if (currentVersion < targetVersion) {
    console.log(`Migrating database from version ${currentVersion} to ${targetVersion}`);
    // Add migration logic here when needed
    await setDatabaseVersion(targetVersion);
  }
};

const getDatabaseVersion = async (): Promise<number> => {
  if (!db) throw new Error('Database not initialized');
  
  try {
    const result = await db.getFirstAsync('PRAGMA user_version');
    return (result as any)?.user_version || 0;
  } catch {
    return 0;
  }
};

const setDatabaseVersion = async (version: number): Promise<void> => {
  if (!db) throw new Error('Database not initialized');
  await db.execAsync(`PRAGMA user_version = ${version}`);
};
