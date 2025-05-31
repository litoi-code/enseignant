import { useAppStore } from '@/lib/store';
import { Grade, Student } from '@/types';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GradesScreen() {
  const {
    grades,
    students,
    classes,
    selectedClassId,
    isLoading,
    error,
    loadGrades,
    loadStudents,
    loadClasses,
    createGrade,
    updateGrade,
    deleteGrade,
    setSelectedClass,
    clearError
  } = useAppStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    gradeType: '',
    value: '',
    maxValue: '20',
    coefficient: '1',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    if (selectedClassId) {
      loadStudents(selectedClassId);
      loadGrades(selectedClassId);
    }
  }, [selectedClassId, loadStudents, loadGrades]);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classStudents = students.filter(s => s.classId === selectedClassId);
  const classGrades = grades.filter(g => g.classId === selectedClassId);

  const resetForm = () => {
    setFormData({
      studentId: '',
      subject: selectedClass?.subject || '',
      gradeType: '',
      value: '',
      maxValue: '20',
      coefficient: '1',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingGrade(null);
    setSelectedStudent(null);
  };

  const handleAddGrade = (student?: Student) => {
    if (!selectedClassId) {
      Alert.alert('Erreur', 'Veuillez sélectionner une classe');
      return;
    }
    resetForm();
    if (student) {
      setSelectedStudent(student);
      setFormData(prev => ({ ...prev, studentId: student.id }));
    }
    setShowAddModal(true);
  };

  const handleEditGrade = (grade: Grade) => {
    const student = classStudents.find(s => s.id === grade.studentId);
    setFormData({
      studentId: grade.studentId,
      subject: grade.subject,
      gradeType: grade.gradeType,
      value: grade.value.toString(),
      maxValue: grade.maxValue.toString(),
      coefficient: grade.coefficient.toString(),
      description: grade.description || '',
      date: grade.date
    });
    setEditingGrade(grade);
    setSelectedStudent(student || null);
    setShowAddModal(true);
  };

  const handleSaveGrade = async () => {
    if (!formData.studentId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un élève');
      return;
    }

    if (!formData.value || isNaN(Number(formData.value))) {
      Alert.alert('Erreur', 'Veuillez entrer une note valide');
      return;
    }

    const value = Number(formData.value);
    const maxValue = Number(formData.maxValue);

    if (value < 0 || value > maxValue) {
      Alert.alert('Erreur', `La note doit être entre 0 et ${maxValue}`);
      return;
    }

    try {
      const gradeData = {
        ...formData,
        value,
        maxValue,
        coefficient: Number(formData.coefficient),
        classId: selectedClassId!
      };

      if (editingGrade) {
        await updateGrade(editingGrade.id, gradeData);
      } else {
        await createGrade(gradeData);
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving grade:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder la note');
    }
  };

  const handleDeleteGrade = (grade: Grade) => {
    const student = classStudents.find(s => s.id === grade.studentId);
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer la note de ${student?.firstName} ${student?.lastName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteGrade(grade.id)
        }
      ]
    );
  };

  const getGradeColor = (value: number, maxValue: number = 20) => {
    const percentage = (value / maxValue) * 20; // Convert to 20-point scale
    if (percentage >= 16) return '#10b981'; // Excellent
    if (percentage >= 14) return '#22c55e'; // Very Good
    if (percentage >= 12) return '#84cc16'; // Good
    if (percentage >= 10) return '#eab308'; // Satisfactory
    if (percentage >= 8) return '#f97316'; // Insufficient
    return '#ef4444'; // Poor
  };

  const calculateStudentAverage = (studentId: string) => {
    const studentGrades = classGrades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return null;

    const totalPoints = studentGrades.reduce((sum, grade) => {
      const normalizedGrade = (grade.value / grade.maxValue) * 20;
      return sum + (normalizedGrade * grade.coefficient);
    }, 0);

    const totalCoefficients = studentGrades.reduce((sum, grade) => sum + grade.coefficient, 0);
    return totalPoints / totalCoefficients;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Notes</Text>
        <Text style={styles.subtitle}>Système français (0-20)</Text>
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
          {/* Class Statistics */}
          {classGrades.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statistiques de la classe</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{classGrades.length}</Text>
                  <Text style={styles.statLabel}>Notes totales</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {classStudents.filter(s => classGrades.some(g => g.studentId === s.id)).length}
                  </Text>
                  <Text style={styles.statLabel}>Élèves notés</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {classGrades.length > 0 ?
                      (classGrades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0) / classGrades.length).toFixed(1)
                      : '0'
                    }
                  </Text>
                  <Text style={styles.statLabel}>Moyenne classe</Text>
                </View>
              </View>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Sélectionnez une classe</Text>
          <Text style={styles.emptySubtext}>Choisissez une classe pour gérer les notes</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#667eea',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
});
