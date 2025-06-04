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
    // Enhanced database interface for web with localStorage
    runAsync: async (query: string, params?: any[]) => {
      console.log('Web DB Query:', query, params);

      try {
        // Handle INSERT queries
        if (query.toUpperCase().includes('INSERT INTO')) {
          const tableMatch = query.match(/INSERT INTO\s+(\w+)/i);
          if (tableMatch && params) {
            const tableName = tableMatch[1];
            const data = localStorage.getItem(tableName);
            const items = data ? JSON.parse(data) : [];

            // Extract column names from query
            const columnsMatch = query.match(/\(([^)]+)\)/);
            if (columnsMatch) {
              const columns = columnsMatch[1].split(',').map(col => col.trim());
              const newItem: any = {};

              columns.forEach((col, index) => {
                if (params[index] !== undefined) {
                  newItem[col] = params[index];
                }
              });

              items.push(newItem);
              localStorage.setItem(tableName, JSON.stringify(items));
              console.log(`Inserted into ${tableName}:`, newItem);
            }
          }
        }

        // Handle UPDATE queries
        if (query.toUpperCase().includes('UPDATE')) {
          const tableMatch = query.match(/UPDATE\s+(\w+)/i);
          if (tableMatch && params) {
            const tableName = tableMatch[1];
            const data = localStorage.getItem(tableName);
            const items = data ? JSON.parse(data) : [];

            // Simple update implementation - update by id (last param)
            const id = params[params.length - 1];
            const itemIndex = items.findIndex((item: any) => item.id === id);

            if (itemIndex !== -1) {
              // Extract SET clause
              const setMatch = query.match(/SET\s+(.+?)\s+WHERE/i);
              if (setMatch) {
                const setPairs = setMatch[1].split(',');
                setPairs.forEach((pair, index) => {
                  const [column] = pair.trim().split('=');
                  if (params[index] !== undefined) {
                    items[itemIndex][column.trim()] = params[index];
                  }
                });

                localStorage.setItem(tableName, JSON.stringify(items));
                console.log(`Updated ${tableName} item:`, items[itemIndex]);
              }
            }
          }
        }

        // Handle DELETE queries
        if (query.toUpperCase().includes('DELETE FROM')) {
          const tableMatch = query.match(/DELETE FROM\s+(\w+)/i);
          if (tableMatch && params) {
            const tableName = tableMatch[1];
            const data = localStorage.getItem(tableName);
            const items = data ? JSON.parse(data) : [];

            // Simple delete by id
            const id = params[0];
            const filteredItems = items.filter((item: any) => item.id !== id);
            localStorage.setItem(tableName, JSON.stringify(filteredItems));
            console.log(`Deleted from ${tableName} where id =`, id);
          }
        }

        return Promise.resolve({ changes: 1, lastInsertRowId: Date.now() });
      } catch (error) {
        console.error('Web DB runAsync error:', error);
        return Promise.resolve({ changes: 0, lastInsertRowId: 0 });
      }
    },

    getAllAsync: async (query: string, params?: any[]) => {
      console.log('Web DB Query (getAll):', query, params);

      try {
        // Extract table name from query
        const tableMatch = query.match(/FROM\s+(\w+)/i);
        if (tableMatch) {
          const tableName = tableMatch[1];
          const data = localStorage.getItem(tableName);
          let items = data ? JSON.parse(data) : [];

          // Handle WHERE clauses for simple filtering
          if (query.toUpperCase().includes('WHERE') && params && params.length > 0) {
            const whereMatch = query.match(/WHERE\s+(\w+)\s*=\s*\?/i);
            if (whereMatch) {
              const column = whereMatch[1];
              const value = params[0];
              items = items.filter((item: any) => item[column] === value);
            }
          }

          console.log(`Retrieved ${items.length} items from ${tableName}`);
          return items;
        }

        return [];
      } catch (error) {
        console.error('Web DB getAllAsync error:', error);
        return [];
      }
    },
    
    getFirstAsync: async (query: string, params?: any[]) => {
      console.log('Web DB Query (getFirst):', query, params);

      try {
        // Extract table name from query
        const tableMatch = query.match(/FROM\s+(\w+)/i);
        if (tableMatch) {
          const tableName = tableMatch[1];
          const data = localStorage.getItem(tableName);
          let items = data ? JSON.parse(data) : [];

          // Handle WHERE clauses for simple filtering
          if (query.toUpperCase().includes('WHERE') && params && params.length > 0) {
            const whereMatch = query.match(/WHERE\s+(\w+)\s*=\s*\?/i);
            if (whereMatch) {
              const column = whereMatch[1];
              const value = params[0];
              items = items.filter((item: any) => item[column] === value);
            }
          }

          return items.length > 0 ? items[0] : null;
        }

        return null;
      } catch (error) {
        console.error('Web DB getFirstAsync error:', error);
        return null;
      }
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
