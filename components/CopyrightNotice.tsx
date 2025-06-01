/**
 * French Teacher Classroom Management System
 * Copyright (c) 2024 Litoi Code. All rights reserved.
 * 
 * This software is licensed for educational use in Cameroonian institutions only.
 * Commercial use, redistribution, or use outside of Cameroon requires written permission.
 * 
 * For licensing inquiries: teacher.app@education.cm
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/Theme';

interface CopyrightNoticeProps {
  variant?: 'full' | 'compact' | 'footer';
  showLicense?: boolean;
}

export default function CopyrightNotice({ 
  variant = 'compact', 
  showLicense = false 
}: CopyrightNoticeProps) {
  
  const showLicenseInfo = () => {
    Alert.alert(
      'Informations de Licence',
      'French Teacher Classroom Management System\n\n' +
      '© 2024 Litoi Code. Tous droits réservés.\n\n' +
      'Ce logiciel est sous licence pour un usage éducatif dans les institutions camerounaises uniquement.\n\n' +
      'Usage commercial, redistribution, ou utilisation en dehors du Cameroun nécessite une autorisation écrite.\n\n' +
      'Pour les demandes de licence: teacher.app@education.cm',
      [
        { text: 'Compris', style: 'default' }
      ]
    );
  };

  if (variant === 'full') {
    return (
      <View style={styles.fullContainer}>
        <Text style={styles.appTitle}>French Teacher Classroom Management System</Text>
        <Text style={styles.subtitle}>Système de Gestion de Classe pour le Cameroun</Text>
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>© 2024 Litoi Code. Tous droits réservés.</Text>
          <Text style={styles.licenseText}>
            Sous licence pour usage éducatif au Cameroun
          </Text>
        </View>
        {showLicense && (
          <TouchableOpacity style={styles.licenseButton} onPress={showLicenseInfo}>
            <Text style={styles.licenseButtonText}>📄 Voir la licence</Text>
          </TouchableOpacity>
        )}
        <View style={styles.attributionContainer}>
          <Text style={styles.attributionText}>🇨🇲 Conçu pour les éducateurs camerounais</Text>
          <Text style={styles.contactText}>Contact: teacher.app@education.cm</Text>
        </View>
      </View>
    );
  }

  if (variant === 'footer') {
    return (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          © 2024 Litoi Code • Usage éducatif au Cameroun
        </Text>
        {showLicense && (
          <TouchableOpacity onPress={showLicenseInfo}>
            <Text style={styles.footerLinkText}>Licence</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Compact variant (default)
  return (
    <View style={styles.compactContainer}>
      <Text style={styles.compactText}>
        © 2024 Litoi Code • French Teacher Classroom Management System
      </Text>
      {showLicense && (
        <TouchableOpacity onPress={showLicenseInfo} style={styles.compactLicenseButton}>
          <Text style={styles.compactLicenseText}>ℹ️</Text>
        </TouchableOpacity>
      )}
    </View>
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
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginBottom: Spacing.md,
  },
  licenseButtonText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
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
});
