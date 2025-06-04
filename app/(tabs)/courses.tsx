import { useAppStore } from '@/lib/store';
import { Course } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CoursesScreen() {
  const {
    courses,
    classes,
    selectedClassId,
    isLoading,
    error,
    loadCourses,
    loadClasses,
    createCourse,
    updateCourse,
    deleteCourse,
    setSelectedClass,
    clearError
  } = useAppStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: selectedDate,
    startTime: '',
    endTime: '',
    subject: '',
    room: '',
    notes: '',
    classId: selectedClassId || ''
  });

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    if (selectedClassId) {
      loadCourses(selectedClassId, selectedDate);
    }
  }, [selectedClassId, selectedDate, loadCourses]);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const todayCourses = courses.filter(c => c.date === selectedDate && c.classId === selectedClassId);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: selectedDate,
      startTime: '',
      endTime: '',
      subject: selectedClass?.subject || '',
      room: '',
      notes: '',
      classId: selectedClassId || ''
    });
    setEditingCourse(null);
  };

  const handleAddCourse = () => {
    if (!selectedClassId) {
      Alert.alert('Erreur', 'Veuillez sélectionner une classe');
      return;
    }
    resetForm();
    setShowAddModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setFormData({
      title: course.title,
      description: course.description || '',
      date: course.date,
      startTime: course.startTime,
      endTime: course.endTime,
      subject: '', // These fields don't exist in Course type
      room: '',    // These fields don't exist in Course type
      notes: '',   // These fields don't exist in Course type
      classId: course.classId
    });
    setEditingCourse(course);
    setShowAddModal(true);
  };

  const handleSaveCourse = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Erreur', 'Le titre du cours est obligatoire');
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      Alert.alert('Erreur', 'Les heures de début et fin sont obligatoires');
      return;
    }

    try {
      if (editingCourse) {
        // Filter out extra fields for update
        const updateData = {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          classId: selectedClassId!,
          status: 'planned' as const
        };
        await updateCourse(editingCourse.id, updateData);
      } else {
        // Filter out extra fields for create
        const courseData = {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          classId: selectedClassId!,
          status: 'planned' as const
        };
        await createCourse(courseData);
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le cours');
    }
  };

  const handleDeleteCourse = (course: Course) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer le cours "${course.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteCourse(course.id)
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned': return 'Planifié';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Cours</Text>
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
          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date sélectionnée</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.selectedDate}>
                {format(new Date(selectedDate), 'EEEE d MMMM yyyy', { locale: fr })}
              </Text>
              <TouchableOpacity style={styles.changeDateButton}>
                <Text style={styles.changeDateText}>Changer</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add Course Button */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
              <Text style={styles.addButtonText}>+ Ajouter un cours</Text>
            </TouchableOpacity>
          </View>

          {/* Courses List */}
          <ScrollView style={styles.coursesList} contentContainerStyle={styles.coursesContent}>
            {todayCourses.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Aucun cours prévu</Text>
                <Text style={styles.emptySubtext}>Ajoutez votre premier cours pour cette date</Text>
              </View>
            ) : (
              <View style={styles.coursesGrid}>
                {todayCourses.map((course) => (
                  <View key={course.id} style={styles.courseCard}>
                    <View style={styles.courseHeader}>
                      <View style={styles.courseInfo}>
                        <Text style={styles.courseTitle}>{course.title}</Text>
                        <Text style={styles.courseTime}>
                          {course.startTime} - {course.endTime}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(course.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(course.status) }]}>
                          {getStatusText(course.status)}
                        </Text>
                      </View>
                    </View>

                    {/* Subject and room fields don't exist in Course type - removing for now */}

                    {course.description && (
                      <Text style={styles.courseDescription} numberOfLines={2}>
                        {course.description}
                      </Text>
                    )}

                    <View style={styles.courseActions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditCourse(course)}
                      >
                        <Text style={styles.editButtonText}>Modifier</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteCourse(course)}
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
          <Text style={styles.emptySubtext}>Choisissez une classe pour gérer ses cours</Text>
        </View>
      )}

      {/* Add/Edit Course Modal */}
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
              {editingCourse ? 'Modifier le cours' : 'Nouveau cours'}
            </Text>
            <TouchableOpacity onPress={handleSaveCourse}>
              <Text style={styles.saveButton}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Titre du cours *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
                placeholder="Ex: Mathématiques, Français..."
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Heure de début *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.startTime}
                  onChangeText={(text) => setFormData({...formData, startTime: text})}
                  placeholder="09:00"
                />
              </View>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Heure de fin *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.endTime}
                  onChangeText={(text) => setFormData({...formData, endTime: text})}
                  placeholder="10:00"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Matière</Text>
              <TextInput
                style={styles.input}
                value={formData.subject}
                onChangeText={(text) => setFormData({...formData, subject: text})}
                placeholder="Matière enseignée"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Salle</Text>
              <TextInput
                style={styles.input}
                value={formData.room}
                onChangeText={(text) => setFormData({...formData, room: text})}
                placeholder="Numéro de salle"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                placeholder="Description du cours..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({...formData, notes: text})}
                placeholder="Notes additionnelles..."
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
    borderColor: '#667eea',
    backgroundColor: '#eff6ff',
  },
  className: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  selectedClassName: {
    color: '#667eea',
  },
  classLevel: {
    fontSize: 12,
    color: '#64748b',
  },
  selectedClassLevel: {
    color: '#5a67d8',
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
  selectedDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  changeDateButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeDateText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
  coursesList: {
    flex: 1,
  },
  coursesContent: {
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
  coursesGrid: {
    gap: 16,
  },
  courseCard: {
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
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  courseTime: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  courseSubject: {
    fontSize: 14,
    color: '#667eea',
    marginBottom: 4,
    fontWeight: '500',
  },
  courseRoom: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  courseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  cancelButton: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
  },
  saveButton: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});
