/**
 * Data Export/Import Component
 * French Teacher Classroom Management System
 * © 2024 Litoi Code
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Theme';
import { DataExportImport } from '@/lib/dataExportImport';
import { useAppStore } from '@/lib/store';
import { TrialManager } from '@/lib/trialManager';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DataExportImportProps {
  visible: boolean;
  onClose: () => void;
}

export default function DataExportImportComponent({ visible, onClose }: DataExportImportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const {
    classes,
    students,
    courses,
    grades,
    attendance,
    selectedClassId,
    createClass,
    createStudent,
    createCourse,
    createGrade,
    createAttendance,
  } = useAppStore();

  const checkPremiumAccess = async (): Promise<boolean> => {
    const canExport = await TrialManager.canPerformAction('export_data', 0);
    if (!canExport.allowed) {
      Alert.alert('Fonctionnalité Premium', canExport.reason || 'Export disponible dans la version complète uniquement.');
      return false;
    }
    return true;
  };

  const handleExportAll = async () => {
    if (!(await checkPremiumAccess())) return;

    setIsLoading(true);
    setLoadingMessage('Export de toutes les données...');

    const success = await DataExportImport.exportAllData(
      classes,
      students,
      courses,
      grades,
      attendance
    );

    setIsLoading(false);
    if (success) {
      Alert.alert('Export réussi', 'Toutes vos données ont été exportées avec succès !');
    }
  };

  const handleExportPDF = async () => {
    if (!(await checkPremiumAccess())) return;

    setIsLoading(true);
    setLoadingMessage('Génération du rapport PDF...');

    const success = await DataExportImport.exportToPDF(classes, students, grades);

    setIsLoading(false);
    if (success) {
      Alert.alert('Rapport généré', 'Le rapport PDF a été généré avec succès !');
    }
  };

  const handleExportCSV = async () => {
    if (!(await checkPremiumAccess())) return;

    setIsLoading(true);
    setLoadingMessage('Export des notes en CSV...');

    const success = await DataExportImport.exportToCSV(students, grades, selectedClassId);

    setIsLoading(false);
    if (success) {
      Alert.alert('Export CSV réussi', 'Les notes ont été exportées en format CSV !');
    }
  };

  const handleImportData = async () => {
    Alert.alert(
      'Importer des données',
      'Cette action remplacera toutes vos données actuelles. Voulez-vous continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: performImport }
      ]
    );
  };

  const performImport = async () => {
    setIsLoading(true);
    setLoadingMessage('Import des données...');

    const importData = await DataExportImport.importData();

    if (importData) {
      try {
        // Import classes
        for (const cls of importData.classes) {
          await createClass({
            name: cls.name,
            level: cls.level,
            educationLevel: cls.educationLevel,
            subject: cls.subject,
            description: cls.description || '',
          });
        }

        // Import students
        for (const student of importData.students) {
          await createStudent(student);
        }

        // Import courses
        for (const course of importData.courses) {
          await createCourse(course);
        }

        // Import grades
        for (const grade of importData.grades) {
          await createGrade(grade);
        }

        // Import attendance
        for (const att of importData.attendance) {
          await createAttendance(att);
        }

        Alert.alert(
          'Import réussi',
          `Données importées avec succès !\n\n` +
          `Classes: ${importData.metadata.totalClasses}\n` +
          `Élèves: ${importData.metadata.totalStudents}\n` +
          `Notes: ${importData.metadata.totalGrades}\n` +
          `Cours: ${importData.metadata.totalCourses}\n` +
          `Présences: ${importData.metadata.totalAttendance}`
        );
      } catch (error) {
        console.error('Import error:', error);
        Alert.alert('Erreur d\'import', 'Une erreur est survenue lors de l\'import des données.');
      }
    }

    setIsLoading(false);
  };

  const exportOptions = [
    {
      id: 'all',
      title: 'Export complet',
      description: 'Toutes les données (classes, élèves, notes, cours, présences)',
      icon: '📦',
      action: handleExportAll,
    },
    {
      id: 'pdf',
      title: 'Rapport PDF',
      description: 'Rapport détaillé avec statistiques et notes',
      icon: '📄',
      action: handleExportPDF,
    },
    {
      id: 'csv',
      title: 'Notes CSV',
      description: 'Notes des élèves en format tableur',
      icon: '📊',
      action: handleExportCSV,
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Fermer</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Export / Import</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Export Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📤 Exporter les données</Text>
            <Text style={styles.sectionDescription}>
              Sauvegardez vos données pour les partager ou les conserver en sécurité.
            </Text>

            {exportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={option.action}
                disabled={isLoading}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Import Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📥 Importer les données</Text>
            <Text style={styles.sectionDescription}>
              Restaurez vos données à partir d'un fichier de sauvegarde.
            </Text>

            <TouchableOpacity
              style={styles.importCard}
              onPress={handleImportData}
              disabled={isLoading}
            >
              <Text style={styles.importIcon}>📁</Text>
              <View style={styles.importContent}>
                <Text style={styles.importTitle}>Restaurer depuis un fichier</Text>
                <Text style={styles.importDescription}>
                  Sélectionnez un fichier de sauvegarde (.json) pour restaurer vos données
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Données actuelles</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{classes.length}</Text>
                <Text style={styles.statLabel}>Classes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{students.length}</Text>
                <Text style={styles.statLabel}>Élèves</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{grades.length}</Text>
                <Text style={styles.statLabel}>Notes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{courses.length}</Text>
                <Text style={styles.statLabel}>Cours</Text>
              </View>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Important</Text>
              <Text style={styles.warningText}>
                • L'import remplace toutes les données existantes{'\n'}
                • Effectuez un export avant d'importer{'\n'}
                • Les fichiers sont compatibles uniquement avec cette application
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>{loadingMessage}</Text>
            </View>
          </View>
        )}
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: Typography.relaxed * Typography.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  optionDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  optionArrow: {
    fontSize: Typography.lg,
    color: Colors.textTertiary,
    fontWeight: Typography.bold,
  },
  importCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
  },
  importIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  importContent: {
    flex: 1,
  },
  importTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  importDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: 80,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: Colors.warning + '20',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.warning,
    marginBottom: Spacing.xs,
  },
  warningText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.relaxed * Typography.sm,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    fontSize: Typography.base,
    color: Colors.text,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
