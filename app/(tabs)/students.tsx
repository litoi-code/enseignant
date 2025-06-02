import { useAppStore } from '@/lib/store';
import { TrialManager } from '@/lib/trialManager';
import { Student } from '@/types';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudentsScreen() {
  const {
    students,
    classes,
    selectedClassId,
    isLoading,
    error,
    loadStudents,
    loadClasses,
    createStudent,
    updateStudent,
    deleteStudent,
    setSelectedClass,
    clearError
  } = useAppStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    parentContact: '',
    notes: '',
    classId: selectedClassId || ''
  });

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    if (selectedClassId) {
      loadStudents(selectedClassId);
    }
  }, [selectedClassId, loadStudents]);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classStudents = students.filter(s => s.classId === selectedClassId);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      parentContact: '',
      notes: '',
      classId: selectedClassId || ''
    });
    setEditingStudent(null);
  };

  const handleAddStudent = async () => {
    if (!selectedClassId) {
      Alert.alert('Erreur', 'Veuillez sélectionner une classe');
      return;
    }

    // Check trial limitations
    const currentStudentCount = students.filter(s => s.classId === selectedClassId).length;
    const canAdd = await TrialManager.canPerformAction('add_student', currentStudentCount);

    if (!canAdd.allowed) {
      Alert.alert('Limite atteinte', canAdd.reason || 'Limite d\'essai atteinte');
      return;
    }

    resetForm();
    setShowAddModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth || '',
      email: student.email || '',
      phone: student.phone || '',
      parentContact: student.parentContact || '',
      notes: student.notes || '',
      classId: student.classId
    });
    setEditingStudent(student);
    setShowAddModal(true);
  };

  const handleSaveStudent = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert('Erreur', 'Le prénom et le nom sont obligatoires');
      return;
    }

    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData);
      } else {
        await createStudent({
          ...formData,
          classId: selectedClassId!
        });
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer ${student.firstName} ${student.lastName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteStudent(student.id)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Élèves</Text>
        {selectedClass && (
          <Text style={styles.subtitle}>
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
          {/* Add Student Button */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddStudent}>
              <Text style={styles.addButtonText}>+ Ajouter un élève</Text>
            </TouchableOpacity>
          </View>

          {/* Students List */}
          <ScrollView style={styles.studentsList} contentContainerStyle={styles.studentsContent}>
            {classStudents.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Aucun élève dans cette classe</Text>
                <Text style={styles.emptySubtext}>Ajoutez votre premier élève pour commencer</Text>
              </View>
            ) : (
              <View style={styles.studentsGrid}>
                {classStudents.map((student) => (
                  <View key={student.id} style={styles.studentCard}>
                    <View style={styles.studentHeader}>
                      <View style={styles.studentAvatar}>
                        <Text style={styles.studentInitials}>
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>
                          {student.firstName} {student.lastName}
                        </Text>
                        {student.email && (
                          <Text style={styles.studentEmail}>{student.email}</Text>
                        )}
                      </View>
                    </View>

                    {student.parentContact && (
                      <Text style={styles.studentContact}>
                        Contact parent: {student.parentContact}
                      </Text>
                    )}

                    {student.notes && (
                      <Text style={styles.studentNotes} numberOfLines={2}>
                        {student.notes}
                      </Text>
                    )}

                    <View style={styles.studentActions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditStudent(student)}
                      >
                        <Text style={styles.editButtonText}>Modifier</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteStudent(student)}
                      >
                        <Text style={styles.deleteButtonText}>Supprimer</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Sélectionnez une classe</Text>
          <Text style={styles.emptySubtext}>Choisissez une classe pour voir ses élèves</Text>
        </View>
      )}

      {/* Add/Edit Student Modal */}
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
              {editingStudent ? 'Modifier l\'élève' : 'Nouvel élève'}
            </Text>
            <TouchableOpacity onPress={handleSaveStudent}>
              <Text style={styles.saveButton}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Prénom *</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => setFormData({...formData, firstName: text})}
                placeholder="Prénom de l'élève"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => setFormData({...formData, lastName: text})}
                placeholder="Nom de l'élève"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date de naissance</Text>
              <TextInput
                style={styles.input}
                value={formData.dateOfBirth}
                onChangeText={(text) => setFormData({...formData, dateOfBirth: text})}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="email@exemple.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                placeholder="Numéro de téléphone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Contact parent</Text>
              <TextInput
                style={styles.input}
                value={formData.parentContact}
                onChangeText={(text) => setFormData({...formData, parentContact: text})}
                placeholder="Contact du parent/tuteur"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({...formData, notes: text})}
                placeholder="Notes sur l'élève..."
                multiline
                numberOfLines={4}
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
    padding: 16,
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
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  classSelector: {
    flexDirection: 'row',
  },
  classCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 120,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedClassCard: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  className: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  selectedClassName: {
    color: '#007AFF',
  },
  classLevel: {
    fontSize: 12,
    color: '#666',
  },
  selectedClassLevel: {
    color: '#0056CC',
  },
  addButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  studentsList: {
    flex: 1,
  },
  studentsContent: {
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
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  studentsGrid: {
    gap: 16,
  },
  studentCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  studentInitials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 14,
    color: '#666',
  },
  studentContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  studentNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  studentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#FF3B30',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
