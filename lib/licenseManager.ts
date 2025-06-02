/**
 * Device-Specific License Manager
 * Prevents code sharing across multiple devices
 * French Teacher Classroom Management System
 * © 2024 Litoi Code
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Application from 'expo-application';

export interface LicenseInfo {
  code: string;
  deviceId: string;
  deviceName: string;
  activationDate: string;
  isActive: boolean;
  expiryDate?: string;
}

export interface LicenseValidationResult {
  isValid: boolean;
  reason?: string;
  licenseInfo?: LicenseInfo;
}

const STORAGE_KEYS = {
  LICENSE_INFO: 'license_info',
  DEVICE_ID: 'device_id',
  ACTIVATION_COUNT: 'activation_count',
};

// Server simulation - In production, this would be a real server
const LICENSE_SERVER = {
  // Format: code -> { maxDevices, activatedDevices: [deviceId1, deviceId2, ...] }
  licenses: new Map<string, { maxDevices: number; activatedDevices: string[] }>(),
};

export class LicenseManager {
  
  /**
   * Generate unique device identifier
   */
  static async getDeviceId(): Promise<string> {
    let deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    
    if (!deviceId) {
      // Create unique device ID combining multiple device properties
      const deviceInfo = {
        brand: Device.brand || 'unknown',
        modelName: Device.modelName || 'unknown',
        osName: Device.osName || 'unknown',
        osVersion: Device.osVersion || 'unknown',
        installationId: Application.androidId || 'unknown',
        timestamp: Date.now(),
      };
      
      // Create hash-like ID from device properties
      deviceId = btoa(JSON.stringify(deviceInfo)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
      await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
    }
    
    return deviceId;
  }

  /**
   * Initialize license system with predefined codes
   */
  static initializeLicenses() {
    const predefinedCodes = [
      'COFFEE2024',
      'TEACHER_PREMIUM',
      'CAMEROON_EDU',
      'LITOI_UNLOCK',
    ];

    predefinedCodes.forEach(code => {
      if (!LICENSE_SERVER.licenses.has(code)) {
        LICENSE_SERVER.licenses.set(code, {
          maxDevices: 1, // Each code works on only 1 device
          activatedDevices: [],
        });
      }
    });
  }

  /**
   * Generate new license code with device limit
   */
  static generateLicenseCode(prefix: string = 'TEACH', maxDevices: number = 1): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `${prefix}_${timestamp}_${random}`.toUpperCase();
    
    LICENSE_SERVER.licenses.set(code, {
      maxDevices,
      activatedDevices: [],
    });
    
    return code;
  }

  /**
   * Validate and activate license code
   */
  static async validateAndActivateLicense(code: string): Promise<LicenseValidationResult> {
    try {
      this.initializeLicenses();
      
      const deviceId = await this.getDeviceId();
      const deviceName = Device.deviceName || 'Unknown Device';
      const normalizedCode = code.trim().toUpperCase();

      // Check if code exists
      const licenseData = LICENSE_SERVER.licenses.get(normalizedCode);
      if (!licenseData) {
        return {
          isValid: false,
          reason: 'Code de licence invalide. Vérifiez l\'orthographe et réessayez.',
        };
      }

      // Check if device is already activated with this code
      if (licenseData.activatedDevices.includes(deviceId)) {
        const licenseInfo: LicenseInfo = {
          code: normalizedCode,
          deviceId,
          deviceName,
          activationDate: new Date().toISOString(),
          isActive: true,
        };

        await this.saveLicenseInfo(licenseInfo);
        return {
          isValid: true,
          licenseInfo,
        };
      }

      // Check if license has reached device limit
      if (licenseData.activatedDevices.length >= licenseData.maxDevices) {
        return {
          isValid: false,
          reason: `Ce code est déjà utilisé sur ${licenseData.maxDevices} appareil(s). Chaque code ne peut être utilisé que sur un seul appareil. Contactez le support pour obtenir un nouveau code.`,
        };
      }

      // Activate license on this device
      licenseData.activatedDevices.push(deviceId);
      
      const licenseInfo: LicenseInfo = {
        code: normalizedCode,
        deviceId,
        deviceName,
        activationDate: new Date().toISOString(),
        isActive: true,
      };

      await this.saveLicenseInfo(licenseInfo);
      await this.incrementActivationCount();

      return {
        isValid: true,
        licenseInfo,
      };

    } catch (error) {
      console.error('License validation error:', error);
      return {
        isValid: false,
        reason: 'Erreur lors de la validation de la licence. Vérifiez votre connexion et réessayez.',
      };
    }
  }

  /**
   * Check if current device has valid license
   */
  static async checkCurrentLicense(): Promise<LicenseValidationResult> {
    try {
      const licenseInfo = await this.getLicenseInfo();
      if (!licenseInfo) {
        return { isValid: false, reason: 'Aucune licence trouvée sur cet appareil.' };
      }

      const deviceId = await this.getDeviceId();
      if (licenseInfo.deviceId !== deviceId) {
        return { 
          isValid: false, 
          reason: 'Licence invalide pour cet appareil.' 
        };
      }

      // Check if license is still valid on server
      this.initializeLicenses();
      const licenseData = LICENSE_SERVER.licenses.get(licenseInfo.code);
      if (!licenseData || !licenseData.activatedDevices.includes(deviceId)) {
        return { 
          isValid: false, 
          reason: 'Licence révoquée ou expirée.' 
        };
      }

      return {
        isValid: true,
        licenseInfo,
      };

    } catch (error) {
      console.error('License check error:', error);
      return { 
        isValid: false, 
        reason: 'Erreur lors de la vérification de la licence.' 
      };
    }
  }

  /**
   * Deactivate license on current device
   */
  static async deactivateLicense(): Promise<boolean> {
    try {
      const licenseInfo = await this.getLicenseInfo();
      if (!licenseInfo) return false;

      const deviceId = await this.getDeviceId();
      
      // Remove device from server
      this.initializeLicenses();
      const licenseData = LICENSE_SERVER.licenses.get(licenseInfo.code);
      if (licenseData) {
        licenseData.activatedDevices = licenseData.activatedDevices.filter(id => id !== deviceId);
      }

      // Remove local license info
      await AsyncStorage.removeItem(STORAGE_KEYS.LICENSE_INFO);
      
      return true;
    } catch (error) {
      console.error('License deactivation error:', error);
      return false;
    }
  }

  /**
   * Get license information for current device
   */
  static async getLicenseInfo(): Promise<LicenseInfo | null> {
    try {
      const licenseData = await AsyncStorage.getItem(STORAGE_KEYS.LICENSE_INFO);
      return licenseData ? JSON.parse(licenseData) : null;
    } catch (error) {
      console.error('Error getting license info:', error);
      return null;
    }
  }

  /**
   * Save license information
   */
  private static async saveLicenseInfo(licenseInfo: LicenseInfo): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LICENSE_INFO, JSON.stringify(licenseInfo));
  }

  /**
   * Track activation attempts
   */
  private static async incrementActivationCount(): Promise<void> {
    const count = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVATION_COUNT);
    const newCount = (parseInt(count || '0') + 1).toString();
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVATION_COUNT, newCount);
  }

  /**
   * Get device information for support
   */
  static async getDeviceInfo(): Promise<string> {
    const deviceId = await this.getDeviceId();
    const licenseInfo = await this.getLicenseInfo();
    
    return `Device ID: ${deviceId}\n` +
           `Device: ${Device.deviceName || 'Unknown'}\n` +
           `OS: ${Device.osName} ${Device.osVersion}\n` +
           `License: ${licenseInfo?.code || 'None'}\n` +
           `Activated: ${licenseInfo?.activationDate || 'Never'}`;
  }

  /**
   * Admin function: Get license usage statistics
   */
  static getLicenseStats(): { [code: string]: { maxDevices: number; activeDevices: number } } {
    this.initializeLicenses();
    const stats: { [code: string]: { maxDevices: number; activeDevices: number } } = {};
    
    LICENSE_SERVER.licenses.forEach((data, code) => {
      stats[code] = {
        maxDevices: data.maxDevices,
        activeDevices: data.activatedDevices.length,
      };
    });
    
    return stats;
  }

  /**
   * Admin function: Revoke license code
   */
  static revokeLicense(code: string): boolean {
    this.initializeLicenses();
    return LICENSE_SERVER.licenses.delete(code.toUpperCase());
  }

  /**
   * Admin function: Reset device for license (for support)
   */
  static resetDeviceForLicense(code: string, deviceId: string): boolean {
    this.initializeLicenses();
    const licenseData = LICENSE_SERVER.licenses.get(code.toUpperCase());
    if (licenseData) {
      licenseData.activatedDevices = licenseData.activatedDevices.filter(id => id !== deviceId);
      return true;
    }
    return false;
  }
}
