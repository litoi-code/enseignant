import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/Theme';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  details: string[];
}

interface UserGuideProps {
  visible: boolean;
  onClose: () => void;
}

const guideSteps: GuideStep[] = [
  {
    id: '1',
    title: 'Créer votre première classe',
    description: 'Commencez par créer une classe pour organiser vos élèves',
    icon: '🏫',
    category: 'Démarrage',
    details: [
      'Appuyez sur "Créer ma première classe" sur l\'écran d\'accueil',
      'Sélectionnez le niveau d\'éducation (Primaire, Collège, Lycée)',
      'Choisissez le niveau spécifique (CP, CE1, 6ème, etc.)',
      'Sélectionnez la matière principale',
      'Donnez un nom à votre classe',
      'Ajoutez une description (optionnel)',
      'Appuyez sur "Sauvegarder"'
    ]
  },
  {
    id: '2',
    title: 'Ajouter des élèves',
    description: 'Enregistrez les informations de vos élèves',
    icon: '👥',
    category: 'Gestion des élèves',
    details: [
      'Allez dans l\'onglet "Élèves"',
      'Sélectionnez votre classe',
      'Appuyez sur "Ajouter un élève"',
      'Remplissez les informations : nom, prénom, date de naissance',
      'Ajoutez les informations de contact des parents',
      'Sauvegardez les informations'
    ]
  },
  {
    id: '3',
    title: 'Planifier des cours',
    description: 'Organisez votre emploi du temps et vos leçons',
    icon: '📚',
    category: 'Gestion des cours',
    details: [
      'Accédez à l\'onglet "Cours"',
      'Sélectionnez votre classe',
      'Choisissez la date du cours',
      'Appuyez sur "Ajouter un cours"',
      'Définissez le titre et la matière',
      'Indiquez les heures de début et fin',
      'Ajoutez la salle et une description',
      'Enregistrez le cours'
    ]
  },
  {
    id: '4',
    title: 'Saisir des notes',
    description: 'Évaluez vos élèves avec le système français 0-20',
    icon: '📊',
    category: 'Évaluation',
    details: [
      'Ouvrez l\'onglet "Notes"',
      'Sélectionnez la classe',
      'Choisissez un élève et appuyez sur "+ Note"',
      'Sélectionnez le type d\'évaluation',
      'Entrez la note sur 20 (ou autre échelle)',
      'Définissez le coefficient',
      'Ajoutez une description',
      'Sauvegardez la note'
    ]
  },
  {
    id: '5',
    title: 'Prendre les présences',
    description: 'Suivez la présence quotidienne de vos élèves',
    icon: '✅',
    category: 'Suivi quotidien',
    details: [
      'Rendez-vous dans l\'onglet "Présences"',
      'Sélectionnez votre classe',
      'Vérifiez la date (aujourd\'hui par défaut)',
      'Pour chaque élève, appuyez sur le statut approprié :',
      '  • ✓ Présent (vert)',
      '  • ✗ Absent (rouge)',
      '  • ⏰ Retard (orange)',
      '  • 📝 Excusé (bleu)',
      'Appuyez sur "Enregistrer les présences"'
    ]
  },
  {
    id: '6',
    title: 'Consulter les statistiques',
    description: 'Analysez les performances de votre classe',
    icon: '📈',
    category: 'Analyse',
    details: [
      'Sur l\'écran d\'accueil, consultez le tableau de bord',
      'Visualisez le nombre total d\'élèves',
      'Vérifiez le taux de présence du jour',
      'Consultez les moyennes de classe',
      'Accédez aux détails dans chaque section',
      'Utilisez ces données pour adapter votre enseignement'
    ]
  }
];

const categories = ['Tous', 'Démarrage', 'Gestion des élèves', 'Gestion des cours', 'Évaluation', 'Suivi quotidien', 'Analyse'];

export default function UserGuide({ visible, onClose }: UserGuideProps) {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedStep, setSelectedStep] = useState<GuideStep | null>(null);

  const filteredSteps = selectedCategory === 'Tous'
    ? guideSteps
    : guideSteps.filter(step => step.category === selectedCategory);

  const renderStepCard = (step: GuideStep) => (
    <TouchableOpacity
      key={step.id}
      style={styles.stepCard}
      onPress={() => setSelectedStep(step)}
    >
      <View style={styles.stepHeader}>
        <Text style={styles.stepIcon}>{step.icon}</Text>
        <View style={styles.stepInfo}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepCategory}>{step.category}</Text>
        </View>
        <Text style={styles.stepArrow}>›</Text>
      </View>
      <Text style={styles.stepDescription}>{step.description}</Text>
    </TouchableOpacity>
  );

  const renderStepDetail = () => {
    if (!selectedStep) return null;

    return (
      <Modal
        visible={!!selectedStep}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.detailContainer}>
          <View style={styles.detailHeader}>
            <TouchableOpacity onPress={() => setSelectedStep(null)}>
              <Text style={styles.backButton}>← Retour</Text>
            </TouchableOpacity>
            <Text style={styles.detailTitle}>Guide détaillé</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.detailContent}>
            <View style={styles.detailStepHeader}>
              <Text style={styles.detailStepIcon}>{selectedStep.icon}</Text>
              <Text style={styles.detailStepTitle}>{selectedStep.title}</Text>
              <Text style={styles.detailStepCategory}>{selectedStep.category}</Text>
            </View>

            <Text style={styles.detailDescription}>{selectedStep.description}</Text>

            <View style={styles.stepsContainer}>
              <Text style={styles.stepsTitle}>Étapes à suivre :</Text>
              {selectedStep.details.map((detail, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{detail}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tipContainer}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>
                Conseil : Prenez votre temps pour vous familiariser avec chaque fonctionnalité.
                L'application sauvegarde automatiquement vos données.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>Fermer</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Guide d'utilisation</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.introContainer}>
            <Text style={styles.introIcon}>📖</Text>
            <Text style={styles.introTitle}>Bienvenue dans votre assistant pédagogique</Text>
            <Text style={styles.introText}>
              Ce guide vous accompagne dans la découverte de toutes les fonctionnalités
              de votre application de gestion de classe.
            </Text>
          </View>

          <View style={styles.categoriesContainer}>
            <Text style={styles.categoriesTitle}>Catégories :</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoriesList}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category && styles.selectedCategoryButton
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.selectedCategoryButtonText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <ScrollView style={styles.stepsContainer} showsVerticalScrollIndicator={false}>
            {filteredSteps.map(renderStepCard)}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {renderStepDetail()}
    </>
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
    ...Shadows.sm,
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
  introContainer: {
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  introIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  introTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  introText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.relaxed * Typography.base,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  categoriesTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  categoriesList: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  selectedCategoryButtonText: {
    color: Colors.surface,
  },
  stepsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  stepCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  stepIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  stepCategory: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  stepArrow: {
    fontSize: Typography.lg,
    color: Colors.textTertiary,
    fontWeight: Typography.bold,
  },
  stepDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.relaxed * Typography.sm,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Shadows.sm,
  },
  detailTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
  backButton: {
    fontSize: Typography.base,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  detailContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  detailStepHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  detailStepIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  detailStepTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  detailStepCategory: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.semibold,
    textTransform: 'uppercase',
  },
  detailDescription: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.relaxed * Typography.lg,
  },
  stepsTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  stepNumberText: {
    color: Colors.surface,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  stepText: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.text,
    lineHeight: Typography.relaxed * Typography.base,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xl,
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.relaxed * Typography.sm,
  },
});
