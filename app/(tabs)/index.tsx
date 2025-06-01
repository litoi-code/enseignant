import ClassCreationModal from '@/components/ClassCreationModal';
import UserGuide from '@/components/UserGuide';
import { BorderRadius, Colors, EducationTheme, Shadows, Spacing, Typography } from '@/constants/Theme';
import { getEducationCategory } from '@/lib/gradeCalculations';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [showClassModal, setShowClassModal] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(false);

  const {
    classes,
    students,
    courses,
    grades,
    attendance,
    isLoading,
    error,
    selectedClassId,
    loadClasses,
    loadStudents,
    loadCourses,
    loadGrades,
    loadAttendance,
    setSelectedClass,
    createClass,
    clearError
  } = useAppStore();

  const [todayDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    if (selectedClassId) {
      loadStudents(selectedClassId);
      loadCourses(selectedClassId, todayDate);
      loadGrades(undefined, selectedClassId);
      loadAttendance(undefined, undefined, selectedClassId);
    }
  }, [selectedClassId, todayDate, loadStudents, loadCourses, loadGrades, loadAttendance]);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const todayCourses = courses.filter(c => c.date === todayDate);
  const classStudents = students.filter(s => s.classId === selectedClassId);

  // Calculate statistics
  const totalStudents = classStudents.length;
  const classGrades = grades.filter(g => g.classId === selectedClassId);
  const averageGrade = classGrades.length > 0
    ? classGrades.reduce((sum, g) => sum + g.value * g.coefficient, 0) /
      classGrades.reduce((sum, g) => sum + g.coefficient, 0)
    : 0;

  const todayAttendance = attendance.filter(a => a.date === todayDate && a.classId === selectedClassId);
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;
  const attendanceRate = todayAttendance.length > 0 ? (presentToday / todayAttendance.length) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              {/*<Text style={styles.title}>Tableau de Bord</Text>*/}
              <Text style={styles.title}>
                {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => setShowUserGuide(true)}
            >
              <Text style={styles.helpButtonText}>📖</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Class Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Classe Sélectionnée</Text>
          {classes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucune classe créée</Text>
              <Text style={styles.emptySubtext}>Créez votre première classe pour commencer</Text>
              <TouchableOpacity style={styles.createClassButton} onPress={() => setShowClassModal(true)}>
                <Text style={styles.createClassButtonText}>+ Créer ma première classe</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classSelector}>
              {classes.map((cls) => (
                <TouchableOpacity
                  key={cls.id}
                  style={[
                    styles.classCard,
                    selectedClassId === cls.id && styles.selectedClassCard,
                    selectedClassId === cls.id && {
                      borderColor: EducationTheme[getEducationCategory(cls.level) as keyof typeof EducationTheme]?.primary,
                      backgroundColor: EducationTheme[getEducationCategory(cls.level) as keyof typeof EducationTheme]?.background,
                    }
                  ]}
                  onPress={() => setSelectedClass(cls.id)}
                >
                  <Text style={[
                    styles.className,
                    selectedClassId === cls.id && styles.selectedClassName
                  ]}>
                    {cls.name}
                  </Text>
                  <Text style={[
                    styles.classLevel,
                    selectedClassId === cls.id && styles.selectedClassLevel
                  ]}>
                    {getEducationCategory(cls.level)} - {cls.level.toUpperCase()}
                  </Text>
                  <Text style={[
                    styles.classSubject,
                    selectedClassId === cls.id && styles.selectedClassSubject
                  ]}>
                    {cls.subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {selectedClass && (
          <>
            {/* Quick Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statistiques Rapides</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{totalStudents}</Text>
                  <Text style={styles.statLabel}>Élèves</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{averageGrade.toFixed(1)}/20</Text>
                  <Text style={styles.statLabel}>Moyenne</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{attendanceRate.toFixed(0)}%</Text>
                  <Text style={styles.statLabel}>Présence</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{todayCourses.length}</Text>
                  <Text style={styles.statLabel}>Cours Aujourd'hui</Text>
                </View>
              </View>
            </View>

            {/* Today's Courses */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cours d'Aujourd'hui</Text>
              {todayCourses.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>Aucun cours prévu</Text>
                </View>
              ) : (
                <View style={styles.coursesList}>
                  {todayCourses.map((course) => (
                    <View key={course.id} style={styles.courseCard}>
                      <View style={styles.courseHeader}>
                        <Text style={styles.courseTitle}>{course.title}</Text>
                        <Text style={styles.courseTime}>
                          {course.startTime} - {course.endTime}
                        </Text>
                      </View>
                      {course.description && (
                        <Text style={styles.courseDescription}>{course.description}</Text>
                      )}
                      <View style={[styles.statusBadge, styles[`status${course.status}`]]}>
                        <Text style={styles.statusText}>
                          {course.status === 'planned' && 'Planifié'}
                          {course.status === 'in-progress' && 'En cours'}
                          {course.status === 'completed' && 'Terminé'}
                          {course.status === 'cancelled' && 'Annulé'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Actions Rapides</Text>
              <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionText}>📝 Nouvelle Note</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionText}>✅ Prendre Présences</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionText}>📚 Nouveau Cours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionText}>👥 Gérer Élèves</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <ClassCreationModal
        visible={showClassModal}
        onClose={() => setShowClassModal(false)}
        onClassCreated={(classId: string) => {
          setSelectedClass(classId);
          setShowClassModal(false);
        }}
      />

      <UserGuide
        visible={showUserGuide}
        onClose={() => setShowUserGuide(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xxl,
    paddingVertical: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  helpButtonText: {
    fontSize: 20,
  },
  title: {
    fontSize: Typography.huge,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  emptyState: {
    backgroundColor: Colors.surface,
    padding: Spacing.xxl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  emptyText: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  createClassButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  createClassButtonText: {
    color: Colors.surface,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  classSelector: {
    flexDirection: 'row',
  },
  classCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    minWidth: 160,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  selectedClassCard: {
    borderColor: Colors.primary,
    ...Shadows.md,
  },
  className: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  selectedClassName: {
    color: Colors.primary,
  },
  classLevel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  selectedClassLevel: {
    color: Colors.primaryDark,
  },
  classSubject: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  selectedClassSubject: {
    color: Colors.primaryDark,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flex: 1,
    minWidth: 150,
    alignItems: 'center',
    ...Shadows.md,
  },
  statNumber: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  coursesList: {
    gap: Spacing.md,
  },
  courseCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  courseTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    flex: 1,
  },
  courseTime: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  courseDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.relaxed * Typography.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusplanned: {
    backgroundColor: Colors.info + '20',
  },
  'statusin-progress': {
    backgroundColor: Colors.warning + '20',
  },
  statuscompleted: {
    backgroundColor: Colors.success + '20',
  },
  statuscancelled: {
    backgroundColor: Colors.error + '20',
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.text,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flex: 1,
    minWidth: 150,
    alignItems: 'center',
    ...Shadows.sm,
  },
  actionText: {
    color: Colors.surface,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
});
