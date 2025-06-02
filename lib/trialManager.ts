/**
 * Trial Period Management System
 * French Teacher Classroom Management System
 * © 2024 Litoi Code
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TrialStatus {
  isTrialActive: boolean;
  trialStartDate: string;
  trialEndDate: string;
  daysRemaining: number;
  isPremium: boolean;
  unlockCode?: string;
}

export interface TrialLimitations {
  maxStudents: number;
  maxClasses: number;
  maxGrades: number;
  maxCourses: number;
  canExportData: boolean;
  canUseAdvancedFeatures: boolean;
}

const TRIAL_DURATION_DAYS = 30; // 1-month trial
const STORAGE_KEYS = {
  TRIAL_START: 'trial_start_date',
  PREMIUM_STATUS: 'premium_status',
  UNLOCK_CODE: 'unlock_code',
};

// Simple unlock codes (in production, use server validation)
const VALID_UNLOCK_CODES = [
  'COFFEE2024',
  'TEACHER_PREMIUM',
  'CAMEROON_EDU',
  'LITOI_UNLOCK',
];

export class TrialManager {
  
  static async initializeTrial(): Promise<void> {
    const trialStart = await AsyncStorage.getItem(STORAGE_KEYS.TRIAL_START);
    if (!trialStart) {
      const startDate = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEYS.TRIAL_START, startDate);
    }
  }

  static async getTrialStatus(): Promise<TrialStatus> {
    const trialStart = await AsyncStorage.getItem(STORAGE_KEYS.TRIAL_START);
    const premiumStatus = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS);
    const unlockCode = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCK_CODE);

    const isPremium = premiumStatus === 'true';

    if (!trialStart) {
      await this.initializeTrial();
      return this.getTrialStatus();
    }

    const startDate = new Date(trialStart);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + TRIAL_DURATION_DAYS);

    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const isTrialActive = daysRemaining > 0;

    return {
      isTrialActive,
      trialStartDate: startDate.toISOString(),
      trialEndDate: endDate.toISOString(),
      daysRemaining,
      isPremium,
      unlockCode: unlockCode || undefined,
    };
  }

  static async unlockPremium(code: string): Promise<{ success: boolean; message?: string }> {
    try {
      // Use new license manager for device-specific validation
      const { LicenseManager } = await import('./licenseManager');
      const result = await LicenseManager.validateAndActivateLicense(code);

      if (result.isValid) {
        await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
        await AsyncStorage.setItem(STORAGE_KEYS.UNLOCK_CODE, code.trim().toUpperCase());
        return { success: true };
      } else {
        return { success: false, message: result.reason };
      }
    } catch (error) {
      console.error('Unlock error:', error);
      return {
        success: false,
        message: 'Erreur lors du déblocage. Vérifiez votre connexion et réessayez.'
      };
    }
  }

  static async resetTrial(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.TRIAL_START);
    await AsyncStorage.removeItem(STORAGE_KEYS.PREMIUM_STATUS);
    await AsyncStorage.removeItem(STORAGE_KEYS.UNLOCK_CODE);
  }

  static getTrialLimitations(isPremium: boolean): TrialLimitations {
    if (isPremium) {
      return {
        maxStudents: Infinity,
        maxClasses: Infinity,
        maxGrades: Infinity,
        maxCourses: Infinity,
        canExportData: true,
        canUseAdvancedFeatures: true,
      };
    }

    return {
      maxStudents: 10,
      maxClasses: 2,
      maxGrades: 50,
      maxCourses: 20,
      canExportData: false,
      canUseAdvancedFeatures: false,
    };
  }

  static async canPerformAction(action: string, currentCount: number): Promise<{ allowed: boolean; reason?: string }> {
    const status = await this.getTrialStatus();
    const limitations = this.getTrialLimitations(status.isPremium);

    if (status.isPremium) {
      return { allowed: true };
    }

    if (!status.isTrialActive) {
      return { 
        allowed: false, 
        reason: 'Période d\'essai expirée. Débloquez la version complète pour continuer.' 
      };
    }

    switch (action) {
      case 'add_student':
        if (currentCount >= limitations.maxStudents) {
          return { 
            allowed: false, 
            reason: `Limite d'essai: ${limitations.maxStudents} élèves maximum. Débloquez pour plus.` 
          };
        }
        break;
      case 'add_class':
        if (currentCount >= limitations.maxClasses) {
          return { 
            allowed: false, 
            reason: `Limite d'essai: ${limitations.maxClasses} classes maximum. Débloquez pour plus.` 
          };
        }
        break;
      case 'add_grade':
        if (currentCount >= limitations.maxGrades) {
          return { 
            allowed: false, 
            reason: `Limite d'essai: ${limitations.maxGrades} notes maximum. Débloquez pour plus.` 
          };
        }
        break;
      case 'add_course':
        if (currentCount >= limitations.maxCourses) {
          return { 
            allowed: false, 
            reason: `Limite d'essai: ${limitations.maxCourses} cours maximum. Débloquez pour plus.` 
          };
        }
        break;
      case 'export_data':
        if (!limitations.canExportData) {
          return { 
            allowed: false, 
            reason: 'Export de données disponible dans la version complète uniquement.' 
          };
        }
        break;
      case 'advanced_features':
        if (!limitations.canUseAdvancedFeatures) {
          return { 
            allowed: false, 
            reason: 'Fonctionnalités avancées disponibles dans la version complète uniquement.' 
          };
        }
        break;
    }

    return { allowed: true };
  }

  static formatDaysRemaining(days: number): string {
    if (days === 0) return 'Dernier jour';
    if (days === 1) return '1 jour restant';
    return `${days} jours restants`;
  }
}
