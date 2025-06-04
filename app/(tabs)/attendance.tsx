import { useAppStore } from '@/lib/store';
import { Student } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AttendanceScreen() {
  const {
    attendance,
    students,
    classes,
    selectedClassId,
    isLoading,
    error,
    loadAttendance,
    loadStudents,
    loadClasses,
    createAttendance,
    updateAttendance,
    setSelectedClass,
    clearError
  } = useAppStore();

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceData, setAttendanceData] = useState<{[key: string]: string}>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAttendanceHistory, setShowAttendanceHistory] = useState(false);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    if (selectedClassId) {
      loadStudents(selectedClassId);
      loadAttendance(undefined, undefined, selectedClassId, selectedDate);
    }
  }, [selectedClassId, selectedDate, loadStudents, loadAttendance]);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  useEffect(() => {
    // Initialize attendance data for the selected date
    if (selectedClassId) {
      const classStudents = students.filter(s => s.classId === selectedClassId);
      const todayAttendance = attendance.filter(a => a.date === selectedDate && a.classId === selectedClassId);

      const initialData: {[key: string]: string} = {};
      classStudents.forEach(student => {
        const existingAttendance = todayAttendance.find(a => a.studentId === student.id);
        initialData[student.id] = existingAttendance?.status || 'present';
      });
      setAttendanceData(initialData);
    }
  }, [students, attendance, selectedDate, selectedClassId]);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classStudents = students.filter(s => s.classId === selectedClassId);
  const todayAttendance = attendance.filter(a => a.date === selectedDate && a.classId === selectedClassId);

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassId) {
      Alert.alert('Erreur', 'Veuillez sélectionner une classe');
      return;
    }

    // Check trial limitations
    const currentAttendanceCount = attendance.length;
    const canAdd = await TrialManager.canPerformAction('add_attendance', currentAttendanceCount);

    if (!canAdd.allowed) {
      Alert.alert(
        'Limite atteinte',
        canAdd.reason || 'Limite d\'essai atteinte',
        [
          { text: 'OK', style: 'default' },
          {
            text: 'Débloquer',
            onPress: () => {
              console.log('Navigate to premium unlock');
            }
          }
        ]
      );
      return;
    }

    try {
      const attendancePromises = Object.entries(attendanceData).map(async ([studentId, status]) => {
        const existingAttendance = todayAttendance.find(a => a.studentId === studentId);

        const attendanceRecord = {
          studentId,
          courseId: 'daily-attendance', // Placeholder for daily attendance
          classId: selectedClassId,
          date: selectedDate,
          status,
          notes: ''
        };

        if (existingAttendance) {
          return updateAttendance(existingAttendance.id, attendanceRecord);
        } else {
          return createAttendance(attendanceRecord);
        }
      });

      await Promise.all(attendancePromises);
      Alert.alert('Succès', 'Présences enregistrées avec succès');
    } catch (error) {
      console.error('Error saving attendance:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les présences');
    }
  };

  const getAttendanceStats = () => {
    const total = classStudents.length;
    const present = Object.values(attendanceData).filter(status => status === 'present').length;
    const absent = Object.values(attendanceData).filter(status => status === 'absent').length;
    const late = Object.values(attendanceData).filter(status => status === 'late').length;
    const excused = Object.values(attendanceData).filter(status => status === 'excused').length;

    return { total, present, absent, late, excused };
  };

  // Bulk actions
  const handleMarkAllPresent = () => {
    const newData: {[key: string]: string} = {};
    classStudents.forEach(student => {
      newData[student.id] = 'present';
    });
    setAttendanceData(newData);
  };

  const handleMarkAllAbsent = () => {
    const newData: {[key: string]: string} = {};
    classStudents.forEach(student => {
      newData[student.id] = 'absent';
    });
    setAttendanceData(newData);
  };

  // Date navigation
  const handlePreviousDay = () => {
    const prevDate = subDays(new Date(selectedDate), 1);
    setSelectedDate(format(prevDate, 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const nextDate = addDays(new Date(selectedDate), 1);
    setSelectedDate(format(nextDate, 'yyyy-MM-dd'));
  };

  const handleToday = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      case 'excused': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Présent';
      case 'absent': return 'Absent';
      case 'late': return 'Retard';
      case 'excused': return 'Excusé';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return '✓';
      case 'absent': return '✗';
      case 'late': return '⏰';
      case 'excused': return '📝';
      default: return '?';
    }
  };

  const renderStudentAttendance = ({ item: student }: { item: Student }) => {
    const currentStatus = attendanceData[student.id] || 'present';
    const statusOptions = ['present', 'absent', 'late', 'excused'];

    return (
      <View style={styles.studentCard}>
        <View style={styles.studentInfo}>
          <View style={[styles.studentAvatar, { backgroundColor: getStatusColor(currentStatus) }]}>
            <Text style={styles.studentInitials}>
              {student.firstName[0]}{student.lastName[0]}
            </Text>
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>
              {student.firstName} {student.lastName}
            </Text>
            <Text style={[styles.currentStatus, { color: getStatusColor(currentStatus) }]}>
              {getStatusIcon(currentStatus)} {getStatusText(currentStatus)}
            </Text>
          </View>
        </View>

        <View style={styles.statusButtons}>
          {statusOptions.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                { backgroundColor: getStatusColor(status) + (currentStatus === status ? 'FF' : '20') }
              ]}
              onPress={() => handleAttendanceChange(student.id, status)}
            >
              <Text style={[
                styles.statusButtonText,
                { color: currentStatus === status ? '#ffffff' : getStatusColor(status) }
              ]}>
                {getStatusIcon(status)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const stats = getAttendanceStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Présences</Text>
        <Text style={styles.subtitle}>Suivi quotidien des présences</Text>
        {selectedClass && (
          <Text style={styles.classInfo}>
            {selectedClass.name} - {selectedClass.level}
          </Text>
        )}
      </View>

      {/* Class Selection */}
      {classes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sélectionner une classe</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classSelector}>
            {classes.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                style={[
                  styles.classCard,
                  selectedClassId === cls.id && styles.selectedClassCard
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
                  {cls.level}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {selectedClass ? (
        <>
          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date sélectionnée</Text>
            <View style={styles.dateContainer}>
              <TouchableOpacity style={styles.dateNavButton} onPress={handlePreviousDay}>
                <Text style={styles.dateNavText}>‹</Text>
              </TouchableOpacity>
              <View style={styles.dateInfo}>
                <Text style={styles.selectedDate}>
                  {format(new Date(selectedDate), 'EEEE d MMMM yyyy', { locale: fr })}
                </Text>
                <TouchableOpacity style={styles.todayButton} onPress={handleToday}>
                  <Text style={styles.todayButtonText}>Aujourd'hui</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.dateNavButton} onPress={handleNextDay}>
                <Text style={styles.dateNavText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bulk Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <View style={styles.bulkActionsContainer}>
              <TouchableOpacity style={[styles.bulkActionButton, { backgroundColor: '#10b981' }]} onPress={handleMarkAllPresent}>
                <Text style={styles.bulkActionText}>✓ Tous présents</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.bulkActionButton, { backgroundColor: '#ef4444' }]} onPress={handleMarkAllAbsent}>
                <Text style={styles.bulkActionText}>✗ Tous absents</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.bulkActionButton, { backgroundColor: '#6366f1' }]} onPress={() => setShowAttendanceHistory(true)}>
                <Text style={styles.bulkActionText}>📊 Historique</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Attendance Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistiques du jour</Text>
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, { backgroundColor: '#10b981' + '20' }]}>
                <Text style={[styles.statNumber, { color: '#10b981' }]}>{stats.present}</Text>
                <Text style={styles.statLabel}>Présents</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#ef4444' + '20' }]}>
                <Text style={[styles.statNumber, { color: '#ef4444' }]}>{stats.absent}</Text>
                <Text style={styles.statLabel}>Absents</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#f59e0b' + '20' }]}>
                <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{stats.late}</Text>
                <Text style={styles.statLabel}>Retards</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#6366f1' + '20' }]}>
                <Text style={[styles.statNumber, { color: '#6366f1' }]}>{stats.excused}</Text>
                <Text style={styles.statLabel}>Excusés</Text>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAttendance}>
              <Text style={styles.saveButtonText}>💾 Enregistrer les présences</Text>
            </TouchableOpacity>
          </View>

          {/* Students Attendance List */}
          {classStudents.length > 0 ? (
            <FlatList
              data={classStudents}
              renderItem={renderStudentAttendance}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.studentsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucun élève dans cette classe</Text>
              <Text style={styles.emptySubtext}>Ajoutez des élèves pour prendre les présences</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Sélectionnez une classe</Text>
          <Text style={styles.emptySubtext}>Choisissez une classe pour gérer les présences</Text>
        </View>
      )}

      {/* Attendance History Modal */}
      <Modal
        visible={showAttendanceHistory}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAttendanceHistory(false)}>
              <Text style={styles.modalCloseButton}>Fermer</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Historique des présences</Text>
            <View style={styles.modalSpacer} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.historyTitle}>
              {selectedClass?.name} - Historique
            </Text>

            {/* Weekly Summary */}
            <View style={styles.historySummary}>
              <Text style={styles.historySummaryTitle}>Résumé de la semaine</Text>
              <View style={styles.historyStatsContainer}>
                <View style={styles.historyStatCard}>
                  <Text style={styles.historyStatNumber}>85%</Text>
                  <Text style={styles.historyStatLabel}>Taux de présence</Text>
                </View>
                <View style={styles.historyStatCard}>
                  <Text style={styles.historyStatNumber}>3</Text>
                  <Text style={styles.historyStatLabel}>Jours cette semaine</Text>
                </View>
              </View>
            </View>

            {/* Recent Attendance */}
            <View style={styles.historySection}>
              <Text style={styles.historySectionTitle}>Présences récentes</Text>
              <Text style={styles.historyNote}>
                Fonctionnalité complète disponible dans la version premium
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#10b981',
    marginTop: 4,
    fontWeight: '600',
  },
  classInfo: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  classSelector: {
    flexDirection: 'row',
  },
  classCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 120,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedClassCard: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  className: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  selectedClassName: {
    color: '#10b981',
  },
  classLevel: {
    fontSize: 12,
    color: '#64748b',
  },
  selectedClassLevel: {
    color: '#059669',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateNavButton: {
    backgroundColor: '#f1f5f9',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNavText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748b',
  },
  dateInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  todayButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Bulk Actions
  bulkActionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  bulkActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bulkActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 80,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: 'rgba(16, 185, 129, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  studentsList: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  studentCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  studentInitials: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  currentStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalSpacer: {
    width: 60,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // History Styles
  historyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
  },
  historySummary: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historySummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  historyStatsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  historyStatCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  historyStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 4,
  },
  historyStatLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  historySection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  historyNote: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});
