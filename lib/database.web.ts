// Web fallback for database functionality
// Uses localStorage for web compatibility when SQLite is not available

import { DB_TABLES } from '../types';

let isInitialized = false;

export const initDatabase = async (): Promise<any> => {
  if (isInitialized) {
    return Promise.resolve({});
  }

  try {
    // Initialize localStorage-based storage for web
    if (typeof window !== 'undefined' && window.localStorage) {
      // Check if tables exist, if not create them
      Object.values(DB_TABLES).forEach(table => {
        if (!localStorage.getItem(table)) {
          localStorage.setItem(table, JSON.stringify([]));
        }
      });
      
      // Initialize settings if not exists
      if (!localStorage.getItem('app_settings')) {
        const defaultSettings = {
          id: 'default-settings',
          user_id: 'default',
          grade_scale_min: 0,
          grade_scale_max: 20,
          grade_scale_passing: 10,
          default_coefficient: 1.0,
          auto_backup: 1,
          backup_frequency: 'weekly',
          language: 'fr',
          theme: 'auto',
          notifications_enabled: 1,
          notifications_reminders: 1,
          notifications_grade_alerts: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        localStorage.setItem('app_settings', JSON.stringify(defaultSettings));
      }
      
      isInitialized = true;
      console.log('Web database (localStorage) initialized successfully');
      return Promise.resolve({});
    } else {
      throw new Error('localStorage not available');
    }
  } catch (error) {
    console.error('Error initializing web database:', error);
    throw error;
  }
};

export const getDatabase = (): any => {
  if (!isInitialized) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  
  return {
    // Mock database interface for web
    runAsync: async (query: string, params?: any[]) => {
      console.log('Web DB Query:', query, params);
      return Promise.resolve({ changes: 1, lastInsertRowId: Date.now() });
    },
    
    getAllAsync: async (query: string, params?: any[]) => {
      console.log('Web DB Query (getAll):', query, params);
      
      // Extract table name from query
      const tableMatch = query.match(/FROM\s+(\w+)/i);
      if (tableMatch) {
        const tableName = tableMatch[1];
        const data = localStorage.getItem(tableName);
        return data ? JSON.parse(data) : [];
      }
      
      return [];
    },
    
    getFirstAsync: async (query: string, params?: any[]) => {
      console.log('Web DB Query (getFirst):', query, params);
      
      // Extract table name from query
      const tableMatch = query.match(/FROM\s+(\w+)/i);
      if (tableMatch) {
        const tableName = tableMatch[1];
        const data = localStorage.getItem(tableName);
        const items = data ? JSON.parse(data) : [];
        return items.length > 0 ? items[0] : null;
      }
      
      return null;
    },
    
    execAsync: async (query: string) => {
      console.log('Web DB Exec:', query);
      return Promise.resolve();
    },
    
    closeAsync: async () => {
      console.log('Web DB Close');
      return Promise.resolve();
    }
  };
};

export const resetDatabase = async (): Promise<void> => {
  if (typeof window !== 'undefined' && window.localStorage) {
    Object.values(DB_TABLES).forEach(table => {
      localStorage.removeItem(table);
    });
    localStorage.removeItem('app_settings');
    isInitialized = false;
    await initDatabase();
    console.log('Web database reset successfully');
  }
};

export const closeDatabase = async (): Promise<void> => {
  isInitialized = false;
  console.log('Web database closed');
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

// Database migration helper (no-op for web)
export const migrateDatabase = async (targetVersion: number): Promise<void> => {
  console.log(`Web database migration to version ${targetVersion} (no-op)`);
  return Promise.resolve();
};
