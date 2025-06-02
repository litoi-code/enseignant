/**
 * License Information Component
 * Shows device-specific license details
 * French Teacher Classroom Management System
 * © 2024 Litoi Code
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Theme';
import { LicenseInfo as LicenseInfoType, LicenseManager } from '@/lib/licenseManager';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LicenseInfoProps {
  visible: boolean;
  onClose: () => void;
}

export default function LicenseInfo({ visible, onClose }: LicenseInfoProps) {
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfoType | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadLicenseInfo();
    }
  }, [visible]);

  const loadLicenseInfo = async () => {
    setIsLoading(true);
    try {
      const license = await LicenseManager.getLicenseInfo();
      const device = await LicenseManager.getDeviceInfo();
      setLicenseInfo(license);
      setDeviceInfo(device);
    } catch (error) {
      console.error('Error loading license info:', error);
    }
    setIsLoading(false);
  };

  const handleDeactivateLicense = () => {
    Alert.alert(
      'Désactiver la licence',
      'Êtes-vous sûr de vouloir désactiver la licence sur cet appareil ?\n\n' +
      'Cette action :\n' +
      '• Supprimera la licence de cet appareil\n' +
      '• Permettra d\'utiliser le code sur un autre appareil\n' +
      '• Remettra les limitations d\'essai\n\n' +
      'Vous devrez entrer le code à nouveau pour réactiver.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Désactiver', 
          style: 'destructive',
          onPress: performDeactivation
        }
      ]
    );
  };

  const performDeactivation = async () => {
    setIsLoading(true);
    const success = await LicenseManager.deactivateLicense();
    setIsLoading(false);

    if (success) {
      Alert.alert(
        'Licence désactivée',
        'La licence a été désactivée avec succès. Vous pouvez maintenant utiliser le code sur un autre appareil.',
        [{ text: 'OK', onPress: onClose }]
      );
    } else {
      Alert.alert(
        'Erreur',
        'Impossible de désactiver la licence. Contactez le support si le problème persiste.'
      );
    }
  };

  const handleShareDeviceInfo = async () => {
    try {
      await Share.share({
        message: `Informations de l'appareil - Enseignant App\n\n${deviceInfo}`,
        title: 'Informations de licence',
      });
    } catch (error) {
      console.error('Error sharing device info:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Fermer</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Informations de Licence</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {licenseInfo ? (
            <>
              {/* License Status */}
              <View style={styles.statusCard}>
                <Text style={styles.statusIcon}>✅</Text>
                <View style={styles.statusContent}>
                  <Text style={styles.statusTitle}>Licence Active</Text>
                  <Text style={styles.statusSubtitle}>
                    Version complète débloquée sur cet appareil
                  </Text>
                </View>
              </View>

              {/* License Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Détails de la licence</Text>
                
                <View style={styles.detailCard}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Code de licence</Text>
                    <Text style={styles.detailValue}>{licenseInfo.code}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date d'activation</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(licenseInfo.activationDate)}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Appareil</Text>
                    <Text style={styles.detailValue}>{licenseInfo.deviceName}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>ID de l'appareil</Text>
                    <Text style={styles.detailValueMono}>{licenseInfo.deviceId}</Text>
                  </View>
                </View>
              </View>

              {/* Features Unlocked */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fonctionnalités débloquées</Text>
                <View style={styles.featuresCard}>
                  {[
                    '👥 Élèves illimités',
                    '🏫 Classes illimitées',
                    '📊 Notes illimitées',
                    '📚 Cours illimités',
                    '📤 Export/Import de données',
                    '📄 Rapports PDF',
                    '💬 Support prioritaire',
                  ].map((feature, index) => (
                    <Text key={index} style={styles.featureItem}>{feature}</Text>
                  ))}
                </View>
              </View>

              {/* Device Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informations de l'appareil</Text>
                <View style={styles.deviceCard}>
                  <Text style={styles.deviceInfo}>{deviceInfo}</Text>
                  <TouchableOpacity 
                    style={styles.shareButton}
                    onPress={handleShareDeviceInfo}
                  >
                    <Text style={styles.shareButtonText}>📤 Partager les infos</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Actions</Text>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleDeactivateLicense}
                >
                  <Text style={styles.actionIcon}>🔓</Text>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Désactiver la licence</Text>
                    <Text style={styles.actionDescription}>
                      Libère le code pour utilisation sur un autre appareil
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

            </>
          ) : (
            <View style={styles.noLicenseCard}>
              <Text style={styles.noLicenseIcon}>🔒</Text>
              <Text style={styles.noLicenseTitle}>Aucune licence active</Text>
              <Text style={styles.noLicenseDescription}>
                Cet appareil utilise la version d'essai. Obtenez un code de déblocage pour 
                accéder à toutes les fonctionnalités.
              </Text>
            </View>
          )}

          {/* Support */}
          <View style={styles.supportCard}>
            <Text style={styles.supportTitle}>💬 Besoin d'aide ?</Text>
            <Text style={styles.supportText}>
              Pour toute question sur votre licence ou pour signaler un problème :
            </Text>
            <Text style={styles.supportContact}>
              📧 teacher.app@education.cm{'\n'}
              📱 +237674667234
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  closeButton: {
    fontSize: Typography.base,
    color: Colors.error,
    fontWeight: Typography.medium,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  statusCard: {
    flexDirection: 'row',
    backgroundColor: Colors.success + '20',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.success + '40',
  },
  statusIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  statusSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  detailValueMono: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.text,
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'right',
  },
  featuresCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureItem: {
    fontSize: Typography.base,
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: Typography.relaxed * Typography.base,
  },
  deviceCard: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  deviceInfo: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    lineHeight: Typography.relaxed * Typography.sm,
    marginBottom: Spacing.md,
  },
  shareButton: {
    backgroundColor: Colors.primary + '20',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  shareButtonText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.warning,
    marginBottom: Spacing.xs,
  },
  actionDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  noLicenseCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noLicenseIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  noLicenseTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  noLicenseDescription: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.relaxed * Typography.base,
  },
  supportCard: {
    backgroundColor: Colors.primary + '10',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  supportTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  supportText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  supportContact: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
});
