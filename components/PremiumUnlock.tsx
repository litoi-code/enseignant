/**
 * Premium Unlock Component - "Buy Me a Coffee" Style
 * French Teacher Classroom Management System
 * © 2024 Litoi Code
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Theme';
import { TrialManager, TrialStatus } from '@/lib/trialManager';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PremiumUnlockProps {
  visible: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

export default function PremiumUnlock({ visible, onClose, onUnlocked }: PremiumUnlockProps) {
  const [unlockCode, setUnlockCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);

  useEffect(() => {
    if (visible) {
      loadTrialStatus();
    }
  }, [visible]);

  const loadTrialStatus = async () => {
    const status = await TrialManager.getTrialStatus();
    setTrialStatus(status);
  };

  const handleUnlock = async () => {
    if (!unlockCode.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un code de déblocage');
      return;
    }

    setIsLoading(true);
    const result = await TrialManager.unlockPremium(unlockCode);
    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        '🎉 Félicitations !',
        'Vous avez débloqué la version complète sur cet appareil !\n\n' +
        '✅ Toutes les fonctionnalités sont maintenant disponibles\n' +
        '🔒 Licence liée à cet appareil uniquement\n\n' +
        'Merci pour votre soutien ! ☕',
        [
          {
            text: 'Parfait !',
            onPress: () => {
              onUnlocked();
              onClose();
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Échec du déblocage',
        result.message || 'Le code de déblocage n\'est pas valide. Veuillez vérifier et réessayer.',
        [
          { text: 'Réessayer', style: 'default' },
          {
            text: 'Support',
            onPress: () => Linking.openURL('mailto:teacher.app@education.cm?subject=Problème de déblocage&body=Code utilisé: ' + unlockCode)
          }
        ]
      );
    }
  };

  const openCoffeeLink = () => {
    Alert.alert(
      '☕ Soutenez le développement',
      'Merci de vouloir soutenir le développement de cette application !\n\n' +
      '💰 Pour débloquer la version complète :\n' +
      '1. Envoyez 2000 FCFA via Mobile Money\n' +
      '2. Numéro : +237674667234\n' +
      '3. Nom : LITOI CODE\n' +
      '4. Mentionnez "ENSEIGNANT APP"\n' +
      '5. Recevez votre code de déblocage par SMS\n\n' +
      '📧 Ou contactez-nous : teacher.app@education.cm\n\n' +
      '🔓 Codes de test disponibles pour développeurs',
      [
        { text: 'Plus tard', style: 'cancel' },
        {
          text: 'Appeler',
          onPress: () => Linking.openURL('tel:+237674667234')
        },
        {
          text: 'SMS',
          onPress: () => Linking.openURL('sms:+237674667234?body=Bonjour, je souhaite débloquer ENSEIGNANT APP')
        }
      ]
    );
  };

  const premiumFeatures = [
    { icon: '👥', title: 'Élèves illimités', description: 'Ajoutez autant d\'élèves que nécessaire' },
    { icon: '🏫', title: 'Classes illimitées', description: 'Gérez toutes vos classes sans restriction' },
    { icon: '📊', title: 'Notes illimitées', description: 'Enregistrez toutes les évaluations' },
    { icon: '📚', title: 'Cours illimités', description: 'Planifiez tous vos cours' },
    { icon: '📤', title: 'Export de données', description: 'Exportez vos données en PDF/Excel' },
    { icon: '⚡', title: 'Fonctionnalités avancées', description: 'Statistiques détaillées et rapports' },
    { icon: '🔄', title: 'Mises à jour gratuites', description: 'Toutes les futures améliorations' },
    { icon: '💬', title: 'Support prioritaire', description: 'Assistance technique rapide' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Fermer</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Version Complète</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Trial Status */}
          {trialStatus && (
            <View style={styles.trialCard}>
              <Text style={styles.trialIcon}>⏰</Text>
              <View style={styles.trialInfo}>
                <Text style={styles.trialTitle}>
                  {trialStatus.isTrialActive ? 'Période d\'essai active' : 'Période d\'essai expirée'}
                </Text>
                <Text style={styles.trialSubtitle}>
                  {trialStatus.isTrialActive 
                    ? TrialManager.formatDaysRemaining(trialStatus.daysRemaining)
                    : 'Débloquez pour continuer à utiliser l\'application'
                  }
                </Text>
              </View>
            </View>
          )}

          {/* Coffee Support */}
          <View style={styles.coffeeCard}>
            <Text style={styles.coffeeIcon}>☕</Text>
            <Text style={styles.coffeeTitle}>Soutenez le développement</Text>
            <Text style={styles.coffeeDescription}>
              Cette application est développée avec passion pour les enseignants camerounais. 
              Votre soutien nous aide à continuer d'améliorer l'outil et à ajouter de nouvelles fonctionnalités.
            </Text>
            <TouchableOpacity style={styles.coffeeButton} onPress={openCoffeeLink}>
              <Text style={styles.coffeeButtonText}>☕ Offrir un café & obtenir le code</Text>
            </TouchableOpacity>
          </View>

          {/* Premium Features */}
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>🎓 Fonctionnalités complètes</Text>
            <View style={styles.featuresList}>
              {premiumFeatures.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Unlock Code Input */}
          <View style={styles.unlockCard}>
            <Text style={styles.unlockTitle}>🔓 Déjà un code de déblocage ?</Text>
            <TextInput
              style={styles.codeInput}
              placeholder="Entrez votre code de déblocage"
              value={unlockCode}
              onChangeText={setUnlockCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={[styles.unlockButton, !unlockCode.trim() && styles.unlockButtonDisabled]} 
              onPress={handleUnlock}
              disabled={!unlockCode.trim() || isLoading}
            >
              <Text style={styles.unlockButtonText}>
                {isLoading ? 'Vérification...' : '🔓 Débloquer'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Support Info */}
          <View style={styles.supportCard}>
            <Text style={styles.supportTitle}>💬 Besoin d'aide ?</Text>
            <Text style={styles.supportText}>
              Contactez-nous pour toute question sur le déblocage ou l'utilisation de l'application.
            </Text>
            <TouchableOpacity 
              style={styles.supportButton}
              onPress={() => Linking.openURL('mailto:teacher.app@education.cm')}
            >
              <Text style={styles.supportButtonText}>📧 Contacter le support</Text>
            </TouchableOpacity>
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
  trialCard: {
    flexDirection: 'row',
    backgroundColor: Colors.warning + '20',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
  },
  trialIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  trialInfo: {
    flex: 1,
  },
  trialTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.warning,
    marginBottom: Spacing.xs,
  },
  trialSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  coffeeCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coffeeIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  coffeeTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  coffeeDescription: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.relaxed * Typography.base,
    marginBottom: Spacing.xl,
  },
  coffeeButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    shadowColor: 'rgba(139, 69, 19, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  coffeeButtonText: {
    color: Colors.surface,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    textAlign: 'center',
  },
  featuresCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  featuresList: {
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    width: 32,
    textAlign: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  featureDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  unlockCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unlockTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  codeInput: {
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    fontSize: Typography.base,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    fontWeight: Typography.medium,
    letterSpacing: 2,
  },
  unlockButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  unlockButtonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  unlockButtonText: {
    color: Colors.surface,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  supportCard: {
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  supportText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  supportButton: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  supportButtonText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
});
