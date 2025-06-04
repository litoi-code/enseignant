import { useAppStore } from '@/lib/store';
import { Grade, Student } from '@/types';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

          {/* Add Grade Button */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.addButton} onPress={() => handleAddGrade()}>
              <Text style={styles.addButtonText}>+ Ajouter une note</Text>
            </TouchableOpacity>
          </View>

          {/* Students and Grades */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Élèves et Notes</Text>
            {classStudents.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Aucun élève dans cette classe</Text>
                <Text style={styles.emptySubtext}>Ajoutez des élèves pour commencer à noter</Text>
              </View>
            ) : (
              <View style={styles.studentsContainer}>
                {classStudents.map((student) => {
                  const studentGrades = classGrades.filter(g => g.studentId === student.id);
                  const average = studentGrades.length > 0
                    ? studentGrades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20 * g.coefficient, 0) /
                      studentGrades.reduce((sum, g) => sum + g.coefficient, 0)
                    : 0;

                  return (
                    <View key={student.id} style={styles.studentCard}>
                      <View style={styles.studentHeader}>
                        <View style={styles.studentInfo}>
                          <View style={styles.studentAvatar}>
                            <Text style={styles.studentInitials}>
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </Text>
                          </View>
                          <View style={styles.studentDetails}>
                            <Text style={styles.studentName}>
                              {student.firstName} {student.lastName}
                            </Text>
                            <Text style={styles.studentAverage}>
                              Moyenne: {studentGrades.length > 0 ? `${average.toFixed(1)}/20` : 'Aucune note'}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.addGradeButton}
                          onPress={() => handleAddGrade(student)}
                        >
                          <Text style={styles.addGradeButtonText}>+ Note</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Student Grades */}
                      {studentGrades.length > 0 && (
                        <View style={styles.gradesContainer}>
                          {studentGrades.map((grade) => (
                            <View key={grade.id} style={styles.gradeItem}>
                              <View style={styles.gradeInfo}>
                                <Text style={styles.gradeSubject}>{grade.subject}</Text>
                                <Text style={styles.gradeType}>{grade.gradeType}</Text>
                                <Text style={styles.gradeDate}>{new Date(grade.date).toLocaleDateString('fr-FR')}</Text>
                              </View>
                              <View style={styles.gradeValue}>
                                <Text style={[
                                  styles.gradeScore,
                                  { color: getGradeColor(grade.value, grade.maxValue) }
                                ]}>
                                  {grade.value}/{grade.maxValue}
                                </Text>
                                <Text style={styles.gradeCoeff}>Coeff. {grade.coefficient}</Text>
                              </View>
                              <View style={styles.gradeActions}>
                                <TouchableOpacity
                                  style={styles.editButton}
                                  onPress={() => handleEditGrade(grade)}
                                >
                                  <Text style={styles.editButtonText}>✏️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.deleteButton}
                                  onPress={() => handleDeleteGrade(grade)}
                                >
                                  <Text style={styles.deleteButtonText}>🗑️</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Sélectionnez une classe</Text>
          <Text style={styles.emptySubtext}>Choisissez une classe pour gérer les notes</Text>
        </View>
      )}

      {/* Add/Edit Grade Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Annuler</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingGrade ? 'Modifier la note' : 'Nouvelle note'}
            </Text>
            <TouchableOpacity onPress={handleSaveGrade}>
              <Text style={styles.saveButton}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Student Selection */}
            {!selectedStudent && (
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Élève *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.studentSelector}>
                  {classStudents.map((student) => (
                    <TouchableOpacity
                      key={student.id}
                      style={[
                        styles.studentOption,
                        formData.studentId === student.id && styles.selectedStudentOption
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, studentId: student.id }))}
                    >
                      <Text style={[
                        styles.studentOptionText,
                        formData.studentId === student.id && styles.selectedStudentOptionText
                      ]}>
                        {student.firstName} {student.lastName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {selectedStudent && (
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Élève</Text>
                <View style={styles.selectedStudentCard}>
                  <Text style={styles.selectedStudentName}>
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </Text>
                </View>
              </View>
            )}

            {/* Subject */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Matière *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.subject}
                onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
                placeholder="Ex: Mathématiques, Français..."
              />
            </View>

            {/* Grade Type */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Type d'évaluation *</Text>
              <View style={styles.gradeTypeContainer}>
                {['Contrôle', 'Devoir', 'Interrogation', 'Examen', 'Oral', 'Projet'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.gradeTypeButton,
                      formData.gradeType === type && styles.selectedGradeTypeButton
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, gradeType: type }))}
                  >
                    <Text style={[
                      styles.gradeTypeButtonText,
                      formData.gradeType === type && styles.selectedGradeTypeButtonText
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Grade Value and Max Value */}
            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Text style={styles.formLabel}>Note *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.value}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, value: text }))}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formHalf}>
                <Text style={styles.formLabel}>Sur</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.maxValue}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, maxValue: text }))}
                  placeholder="20"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Coefficient */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Coefficient</Text>
              <TextInput
                style={styles.formInput}
                value={formData.coefficient}
                onChangeText={(text) => setFormData(prev => ({ ...prev, coefficient: text }))}
                placeholder="1"
                keyboardType="numeric"
              />
            </View>

            {/* Date */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Date</Text>
              <TextInput
                style={styles.formInput}
                value={formData.date}
                onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
                placeholder="YYYY-MM-DD"
              />
            </View>

            {/* Description */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Description (optionnel)</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Commentaires sur l'évaluation..."
                multiline
                numberOfLines={3}
              />
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 8,
  },
  classInfo: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },

  // Class Selection
  classSelector: {
    marginBottom: 8,
  },
  classCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedClassCard: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  selectedClassName: {
    color: '#667eea',
  },
  classLevel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedClassLevel: {
    color: '#667eea',
  },

  // Statistics
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Add Button
  addButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Students Container
  studentsContainer: {
    gap: 16,
  },
  studentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  studentInitials: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  studentAverage: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  addGradeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addGradeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Grades Container
  gradesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
  },
  gradeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  gradeInfo: {
    flex: 1,
  },
  gradeSubject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  gradeType: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  gradeDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  gradeValue: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  gradeScore: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  gradeCoeff: {
    fontSize: 10,
    color: '#64748b',
  },
  gradeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f59e0b',
  },
  editButtonText: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
    fontSize: 12,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  cancelButton: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  saveButton: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // Form Styles
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  formHalf: {
    flex: 1,
  },

  // Student Selection
  studentSelector: {
    marginBottom: 8,
  },
  studentOption: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedStudentOption: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  studentOptionText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  selectedStudentOptionText: {
    color: '#ffffff',
  },
  selectedStudentCard: {
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  selectedStudentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },

  // Grade Type Selection
  gradeTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gradeTypeButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedGradeTypeButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  gradeTypeButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedGradeTypeButtonText: {
    color: '#ffffff',
  },
});
