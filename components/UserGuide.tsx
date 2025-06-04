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
      'Appuyez sur "Sauvegarder"',
      'Votre classe apparaît maintenant dans tous les onglets'
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
      'Sélectionnez votre classe dans la liste horizontale',
      'Appuyez sur "Ajouter un élève"',
      'Remplissez les informations obligatoires : nom et prénom',
      'Ajoutez la date de naissance (optionnel)',
      'Saisissez les informations de contact des parents',
      'Ajoutez des notes personnelles si nécessaire',
      'Sauvegardez les informations',
      'L\'élève apparaît dans la liste avec son avatar coloré'
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
      'Naviguez entre les dates avec les flèches ou "Aujourd\'hui"',
      'Appuyez sur "Ajouter un cours"',
      'Définissez le titre du cours (obligatoire)',
      'Indiquez les heures de début et fin (format 24h)',
      'Ajoutez une description détaillée',
      'Enregistrez le cours',
      'Le cours apparaît avec un code couleur selon son statut'
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
      'Sélectionnez la classe concernée',
      'Choisissez un élève dans la liste',
      'Appuyez sur "Ajouter une note"',
      'Sélectionnez le type d\'évaluation (contrôle, devoir, oral, etc.)',
      'Entrez la note sur l\'échelle 0-20',
      'Définissez le coefficient (importance de la note)',
      'Précisez la matière et la date',
      'Ajoutez une description ou commentaire',
      'Sauvegardez la note',
      'La moyenne se calcule automatiquement'
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
      'Naviguez entre les dates avec les flèches ‹ ›',
      'Utilisez "Aujourd\'hui" pour revenir à la date actuelle',
      'Actions rapides disponibles :',
      '  • "✓ Tous présents" pour marquer toute la classe',
      '  • "✗ Tous absents" pour les jours d\'absence',
      '  • "📊 Historique" pour voir les tendances',
      'Pour chaque élève, choisissez le statut :',
      '  • ✓ Présent (vert) - élève en classe',
      '  • ✗ Absent (rouge) - élève absent',
      '  • ⏰ Retard (orange) - arrivée tardive',
      '  • 📝 Excusé (bleu) - absence justifiée',
      'Consultez les statistiques en temps réel',
      'Appuyez sur "💾 Enregistrer les présences"'
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
      'Visualisez le nombre total d\'élèves par classe',
      'Vérifiez le taux de présence du jour',
      'Consultez les moyennes générales de classe',
      'Dans l\'onglet Présences, voir les stats quotidiennes',
      'Accédez à l\'historique des présences',
      'Analysez les tendances hebdomadaires',
      'Utilisez ces données pour adapter votre enseignement',
      'Identifiez les élèves nécessitant un suivi particulier'
    ]
  },
  {
    id: '7',
    title: 'Navigation entre les dates',
    description: 'Maîtrisez la navigation temporelle dans l\'application',
    icon: '📅',
    category: 'Navigation',
    details: [
      'Dans les onglets Cours et Présences, utilisez les contrôles de date',
      'Flèche gauche ‹ : jour précédent',
      'Flèche droite › : jour suivant',
      'Bouton "Aujourd\'hui" : retour à la date actuelle',
      'La date s\'affiche en français complet',
      'Les données se rechargent automatiquement',
      'Naviguez librement dans le passé et le futur',
      'Planifiez vos cours à l\'avance',
      'Consultez l\'historique des présences'
    ]
  },
  {
    id: '8',
    title: 'Actions rapides et raccourcis',
    description: 'Gagnez du temps avec les fonctionnalités avancées',
    icon: '⚡',
    category: 'Productivité',
    details: [
      'Présences : utilisez "Tous présents" pour une classe complète',
      'Présences : "Tous absents" pour les jours fériés ou sorties',
      'Cours : dupliquez un cours en le modifiant',
      'Élèves : les avatars colorés facilitent l\'identification',
      'Notes : le coefficient permet de pondérer les évaluations',
      'Classes : organisez par matière et niveau',
      'Sauvegarde automatique de toutes vos données',
      'Interface intuitive avec codes couleur',
      'Recherche rapide dans les listes d\'élèves'
    ]
  },
  {
    id: '9',
    title: 'Système d\'essai et version premium',
    description: 'Comprenez les limitations et fonctionnalités premium',
    icon: '💎',
    category: 'Premium',
    details: [
      'Version d\'essai : 1 mois gratuit avec toutes les fonctionnalités',
      'Limitations d\'essai après expiration :',
      '  • Maximum 2 classes',
      '  • Maximum 10 élèves par classe',
      '  • Maximum 50 notes au total',
      '  • Maximum 100 présences au total',
      'Fonctionnalités premium exclusives :',
      '  • Classes et élèves illimités',
      '  • Notes et présences illimitées',
      '  • Export/Import complet des données',
      '  • Historique détaillé des présences',
      '  • Statistiques avancées',
      'Déblocage : "Offrir un café" au développeur',
      'Paiement sécurisé via Mobile Money (+237674667234)',
      'Activation instantanée après paiement'
    ]
  },
  {
    id: '10',
    title: 'Export et sauvegarde des données',
    description: 'Protégez et partagez vos données pédagogiques',
    icon: '💾',
    category: 'Sauvegarde',
    details: [
      'Accédez aux Paramètres > Export/Import des données',
      'Export complet : toutes vos classes, élèves, notes, présences',
      'Format JSON sécurisé et portable',
      'Sauvegarde sur votre appareil ou cloud',
      'Import : restaurez vos données sur un nouvel appareil',
      'Fonctionnalité premium : export illimité',
      'Version d\'essai : export limité pour test',
      'Sauvegarde automatique locale en continu',
      'Recommandation : export hebdomadaire de sécurité'
    ]
  },
  {
    id: '11',
    title: 'Types d\'évaluations françaises',
    description: 'Utilisez le système d\'évaluation adapté au contexte français',
    icon: '🎯',
    category: 'Évaluation',
    details: [
      'Contrôle : évaluation courte en classe',
      'Devoir surveillé : évaluation longue et formelle',
      'Devoir maison : travail à faire à domicile',
      'Oral : présentation ou interrogation orale',
      'Projet : travail de longue durée',
      'Participation : évaluation de l\'engagement en classe',
      'Dictée : spécifique au primaire',
      'Lecture : évaluation de la lecture (primaire)',
      'Calcul : évaluation mathématique (primaire)',
      'Rédaction : expression écrite (primaire)',
      'Évaluation : terme générique',
      'Autre : pour les cas spéciaux'
    ]
  },
  {
    id: '12',
    title: 'Résolution des problèmes courants',
    description: 'Solutions aux difficultés fréquemment rencontrées',
    icon: '🔧',
    category: 'Dépannage',
    details: [
      'Problème : "Limite d\'essai atteinte"',
      '  → Débloquez la version premium ou supprimez des données',
      'Problème : "Élève non trouvé"',
      '  → Vérifiez que l\'élève est dans la bonne classe',
      'Problème : "Cours ne s\'affiche pas"',
      '  → Vérifiez la date sélectionnée et la classe',
      'Problème : "Notes ne se sauvegardent pas"',
      '  → Vérifiez la connexion et les champs obligatoires',
      'Problème : "Application lente"',
      '  → Redémarrez l\'application, libérez de la mémoire',
      'Problème : "Données perdues"',
      '  → Utilisez la fonction d\'import si vous avez un export',
      'Support : contactez le développeur via les paramètres'
    ]
  }
];

const categories = [
  'Tous',
  'Démarrage',
  'Gestion des élèves',
  'Gestion des cours',
  'Évaluation',
  'Suivi quotidien',
  'Analyse',
  'Navigation',
  'Productivité',
  'Premium',
  'Sauvegarde',
  'Dépannage'
];

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
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Conseils d'expert</Text>
                <Text style={styles.tipText}>
                  • Commencez par créer vos classes et ajouter vos élèves
                </Text>
                <Text style={styles.tipText}>
                  • Utilisez les actions rapides pour gagner du temps
                </Text>
                <Text style={styles.tipText}>
                  • Exportez régulièrement vos données pour les sauvegarder
                </Text>
                <Text style={styles.tipText}>
                  • L'application sauvegarde automatiquement toutes vos modifications
                </Text>
              </View>
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
            <Text style={styles.introTitle}>Guide complet de votre assistant pédagogique</Text>
            <Text style={styles.introText}>
              Ce guide détaillé vous accompagne dans la maîtrise complète de votre application
              de gestion de classe. Découvrez toutes les fonctionnalités, des bases aux
              fonctions avancées, y compris le système d'essai et les options premium.
            </Text>
            <View style={styles.introStats}>
              <Text style={styles.introStatsText}>
                📚 12 guides détaillés • 🎯 9 catégories • ⚡ Conseils d'expert
              </Text>
            </View>
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
    marginBottom: Spacing.md,
  },
  introStats: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  introStatsText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
    textAlign: 'center',
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
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.relaxed * Typography.sm,
    marginBottom: 4,
  },
});
