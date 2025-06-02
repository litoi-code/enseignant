/**
 * Trial Status Banner Component
 * French Teacher Classroom Management System
 * © 2024 Litoi Code
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/Theme';
import { TrialManager, TrialStatus } from '@/lib/trialManager';

interface TrialBannerProps {
  onUpgradePress: () => void;
}

export default function TrialBanner({ onUpgradePress }: TrialBannerProps) {
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadTrialStatus();
  }, []);

  useEffect(() => {
    if (trialStatus && (!trialStatus.isPremium)) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [trialStatus, fadeAnim]);

  const loadTrialStatus = async () => {
    const status = await TrialManager.getTrialStatus();
    setTrialStatus(status);
  };

  if (!trialStatus || trialStatus.isPremium) {
    return null;
  }

  const isExpired = !trialStatus.isTrialActive;
  const isLastDays = trialStatus.daysRemaining <= 3;

  const getBannerStyle = () => {
    if (isExpired) {
      return {
        backgroundColor: Colors.error + '20',
        borderColor: Colors.error + '40',
      };
    }
    if (isLastDays) {
      return {
        backgroundColor: Colors.warning + '20',
        borderColor: Colors.warning + '40',
      };
    }
    return {
      backgroundColor: Colors.primary + '20',
      borderColor: Colors.primary + '40',
    };
  };

  const getTextColor = () => {
    if (isExpired) return Colors.error;
    if (isLastDays) return Colors.warning;
    return Colors.primary;
  };

  const getIcon = () => {
    if (isExpired) return '🔒';
    if (isLastDays) return '⚠️';
    return '⏰';
  };

  const getMessage = () => {
    if (isExpired) {
      return 'Période d\'essai expirée';
    }
    return `Essai: ${TrialManager.formatDaysRemaining(trialStatus.daysRemaining)}`;
  };

  return (
    <Animated.View style={[styles.container, getBannerStyle(), { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <Text style={styles.icon}>{getIcon()}</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.message, { color: getTextColor() }]}>
            {getMessage()}
          </Text>
          <Text style={styles.subtitle}>
            {isExpired 
              ? 'Débloquez pour continuer' 
              : 'Débloquez toutes les fonctionnalités'
            }
          </Text>
        </View>
        <TouchableOpacity style={[styles.upgradeButton, { backgroundColor: getTextColor() }]} onPress={onUpgradePress}>
          <Text style={styles.upgradeButtonText}>
            {isExpired ? '🔓 Débloquer' : '☕ Upgrade'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  icon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  upgradeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  upgradeButtonText: {
    color: Colors.surface,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
});
