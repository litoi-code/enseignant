/**
 * ClassCM - Assistant Pédagogique Camerounais
 * Copyright (c) 2024 Litoi Code. All rights reserved.
 *
 * This software is available under a freemium license model:
 * - Free trial: 1 month with full functionality
 * - Premium unlock: "Buy a cup of coffee" payment model
 * - Designed specifically for Cameroonian educators
 *
 * For support and premium unlock: +237674667234 (Mobile Money)
 */

import { Colors, Spacing, Typography } from '@/constants/Theme';
import React, { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CopyrightNoticeProps {
  variant?: 'full' | 'compact' | 'footer';
  showLicense?: boolean;
}

export default function CopyrightNotice({
  variant = 'compact',
  showLicense = false
}: CopyrightNoticeProps) {
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const showLicenseInfo = () => {
    if (Platform.OS === 'web') {
      // Use custom modal for web
      setShowLicenseModal(true);
    } else {
      // Use native alert for mobile
      Alert.alert(
        'Informations de Licence',
        'ClassCM - Assistant Pédagogique Camerounais\n\n' +
        '© 2024 Litoi Code. Tous droits réservés.\n\n' +
        '📋 MODÈLE FREEMIUM :\n' +
        '• Essai gratuit : 1 mois avec toutes les fonctionnalités\n' +
        '• Déblocage premium : "Offrir un café" aux développeurs\n' +
        '• Usage éducatif encouragé dans le monde entier\n\n' +
        '💰 DÉBLOCAGE PREMIUM :\n' +
        '• Paiement Mobile Money : +237674667234\n' +
        '• Classes et élèves illimités\n' +
        '• Export/Import complet des données\n' +
        '• Support technique prioritaire\n\n' +
        '📞 SUPPORT :\n' +
        'WhatsApp/Appel : +237674667234\n' +
        'Développé avec ❤️ pour les enseignants',
        [
          { text: 'Fermer', style: 'cancel' },
          {
            text: 'Débloquer Premium',
            style: 'default',
            onPress: () => {
              Alert.alert(
                'Déblocage Premium',
                'Pour débloquer la version premium :\n\n' +
                '1. Envoyez ce que vous estimez au +237674667234\n' +
                '2. Contactez-nous avec votre numéro de transaction\n' +
                '3. Recevez votre code de déblocage instantanément\n\n' +
                'Merci de soutenir le développement ! ☕',
                [{ text: 'Compris', style: 'default' }]
              );
            }
          }
        ]
      );
    }
  };

  const showPremiumInfo = () => {
    if (Platform.OS === 'web') {
      setShowPremiumModal(true);
    } else {
      Alert.alert(
        'Déblocage Premium',
        'Pour débloquer la version premium :\n\n' +
        '1. Envoyez ce que vous estimez au +237674667234\n' +
        '2. Contactez-nous avec votre numéro de transaction\n' +
        '3. Recevez votre code de déblocage instantanément\n\n' +
        'Merci de soutenir le développement ! ☕',
        [{ text: 'Compris', style: 'default' }]
      );
    }
  };

  // License Modal for Web
  const LicenseModal = () => (
    <Modal
      visible={showLicenseModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowLicenseModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Informations de Licence</Text>
            <Text style={styles.modalSubtitle}>ClassCM - Assistant Pédagogique Camerounais</Text>

            <Text style={styles.modalText}>© 2024 Litoi Code. Tous droits réservés.</Text>

            <Text style={styles.sectionTitle}>📋 MODÈLE FREEMIUM :</Text>
            <Text style={styles.modalText}>• Essai gratuit : 1 mois avec toutes les fonctionnalités</Text>
            <Text style={styles.modalText}>• Déblocage premium : "Offrir un café" au développeur</Text>
            <Text style={styles.modalText}>• Usage éducatif encouragé dans le monde entier</Text>

            <Text style={styles.sectionTitle}>💰 DÉBLOCAGE PREMIUM :</Text>
            <Text style={styles.modalText}>• Paiement Mobile Money : +237674667234</Text>
            <Text style={styles.modalText}>• Classes et élèves illimités</Text>
            <Text style={styles.modalText}>• Export/Import complet des données</Text>
            <Text style={styles.modalText}>• Support technique prioritaire</Text>

            <Text style={styles.sectionTitle}>📞 SUPPORT :</Text>
            <Text style={styles.modalText}>WhatsApp/Appel : +237674667234</Text>
            <Text style={styles.modalText}>Développé avec ❤️ pour les enseignants</Text>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowLicenseModal(false)}
            >
              <Text style={styles.cancelButtonText}>Fermer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.premiumButton]}
              onPress={() => {
                setShowLicenseModal(false);
                setShowPremiumModal(true);
              }}
            >
              <Text style={styles.premiumButtonText}>Débloquer Premium</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Premium Modal for Web
  const PremiumModal = () => (
    <Modal
      visible={showPremiumModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowPremiumModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Déblocage Premium</Text>

            <Text style={styles.modalText}>Pour débloquer la version premium :</Text>

            <Text style={styles.stepText}>1. Envoyez ce que vous estimez</Text>
            <Text style={styles.stepText}>2. Via Mobile Money au +237674667234</Text>
            <Text style={styles.stepText}>3. Contactez-nous avec votre numéro de transaction</Text>
            <Text style={styles.stepText}>4. Recevez votre code de déblocage instantanément</Text>

            <Text style={styles.thankYouText}>Merci de soutenir le développement ! ☕</Text>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowPremiumModal(false)}
            >
              <Text style={styles.cancelButtonText}>Compris</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (variant === 'full') {
    return (
      <>
        <View style={styles.fullContainer}>
          <Text style={styles.appTitle}>ClassCM</Text>
          <Text style={styles.subtitle}>Assistant Pédagogique Camerounais</Text>
          <View style={styles.copyrightContainer}>
            <Text style={styles.copyrightText}>© 2024 Litoi Code. Tous droits réservés.</Text>
            <Text style={styles.licenseText}>
              Modèle freemium - Essai gratuit 1 mois
            </Text>
          </View>
          {showLicense && (
            <TouchableOpacity style={styles.licenseButton} onPress={showLicenseInfo}>
              <Text style={styles.licenseButtonText}>📄 Voir la licence</Text>
            </TouchableOpacity>
          )}
          <View style={styles.attributionContainer}>
            <Text style={styles.attributionText}>🎓 Pour les enseignants</Text>
            <Text style={styles.contactText}>Support: +237674667234 (WhatsApp)</Text>
          </View>
        </View>
        <LicenseModal />
        <PremiumModal />
      </>
    );
  }

  if (variant === 'footer') {
    return (
      <>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            © 2024 Litoi Code • ClassCM - Assistant Pédagogique Camerounais
          </Text>
          {showLicense && (
            <TouchableOpacity onPress={showLicenseInfo}>
              <Text style={styles.footerLinkText}>Licence</Text>
            </TouchableOpacity>
          )}
        </View>
        <LicenseModal />
        <PremiumModal />
      </>
    );
  }

  // Compact variant (default)
  return (
    <>
      <View style={styles.compactContainer}>
        <Text style={styles.compactText}>
          © 2024 Litoi Code • ClassCM - Assistant Pédagogique Camerounais
        </Text>
        {showLicense && (
          <TouchableOpacity onPress={showLicenseInfo} style={styles.compactLicenseButton}>
            <Text style={styles.compactLicenseText}>ℹ️</Text>
          </TouchableOpacity>
        )}
      </View>
      <LicenseModal />
      <PremiumModal />
    </>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontStyle: 'italic',
  },
  copyrightContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  copyrightText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  licenseText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  licenseButton: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 25,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  licenseButtonText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    textAlign: 'center',
  },
  attributionContainer: {
    alignItems: 'center',
  },
  attributionText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  contactText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  footerLinkText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  compactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  compactText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    flex: 1,
  },
  compactLicenseButton: {
    padding: Spacing.xs,
  },
  compactLicenseText: {
    fontSize: Typography.sm,
    color: Colors.primary,
  },
  // Modal styles for web compatibility
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    maxWidth: 500,
    width: '100%',
    maxHeight: '80%',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContent: {
    padding: Spacing.xl,
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalSubtitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  modalText: {
    fontSize: Typography.sm,
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: Typography.relaxed * Typography.sm,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  stepText: {
    fontSize: Typography.sm,
    color: Colors.text,
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.md,
    lineHeight: Typography.relaxed * Typography.sm,
  },
  thankYouText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.textTertiary + '20',
    borderWidth: 1,
    borderColor: Colors.textTertiary + '40',
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  premiumButton: {
    backgroundColor: Colors.primary,
  },
  premiumButtonText: {
    color: Colors.surface,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
});
