import { useAppStore } from '@/lib/store';
import { FRENCH_EDUCATION_LEVELS, FRENCH_SUBJECTS } from '@/types';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ClassCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onClassCreated?: (classId: string) => void;
}

export default function ClassCreationModal({ visible, onClose, onClassCreated }: ClassCreationModalProps) {
  const { createClass } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    level: '',
    subject: '',
    year: '2025-2026',
    description: ''
  });

  const [selectedCategory, setSelectedCategory] = useState<'Primaire' | 'Collège' | 'Lycée'>('Primaire');

  const resetForm = () => {
    setFormData({
      name: '',
      level: '',
      subject: '',
      year: '2025-2026',
      description: ''
    });
    setSelectedCategory('Primaire');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Erreur', 'Le nom de la classe est obligatoire');
      return;
    }

    if (!formData.level) {
      Alert.alert('Erreur', 'Veuillez sélectionner un niveau');
      return;
    }

    if (!formData.subject.trim()) {
      Alert.alert('Erreur', 'La matière est obligatoire');
      return;
    }

    try {
      const classId = await createClass(formData);
      onClassCreated?.(classId);
      handleClose();
    } catch (error) {
      console.error('Error creating class:', error);
      Alert.alert('Erreur', 'Impossible de créer la classe');
    }
  };

  const levelsByCategory = FRENCH_EDUCATION_LEVELS.filter(level => level.category === selectedCategory);

  // Get subjects based on category
  const getSubjectsForCategory = (category: string) => {
    switch (category) {
      case 'Primaire':
        return FRENCH_SUBJECTS.PRIMAIRE;
      case 'Collège':
        return FRENCH_SUBJECTS.COLLEGE;
      case 'Lycée':
        return FRENCH_SUBJECTS.LYCEE;
      default:
        return FRENCH_SUBJECTS.PRIMAIRE;
    }
  };

  const subjectsByCategory = getSubjectsForCategory(selectedCategory);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nouvelle Classe</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Créer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Class Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Nom de la classe *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Ex: CP A, 6ème B, Terminale S..."
            />
          </View>

          {/* Education Category */}
          <View style={styles.section}>
            <Text style={styles.label}>Niveau d'enseignement</Text>
            <View style={styles.categorySelector}>
              {(['Primaire', 'Collège', 'Lycée'] as const).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    setFormData({...formData, level: '', subject: ''});
                  }}
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
          </View>

          {/* Level Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Niveau *</Text>
            <View style={styles.levelGrid}>
              {levelsByCategory && levelsByCategory.length > 0 ? (
                levelsByCategory.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.levelButton,
                      formData.level === level.value && styles.selectedLevelButton
                    ]}
                    onPress={() => setFormData({...formData, level: level.value})}
                  >
                    <Text style={[
                      styles.levelButtonText,
                      formData.level === level.value && styles.selectedLevelButtonText
                    ]}>
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noSubjectsText}>Aucun niveau disponible</Text>
              )}
            </View>
          </View>

          {/* Subject Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Matière principale *</Text>
            <View style={styles.subjectGrid}>
              {subjectsByCategory && subjectsByCategory.length > 0 ? (
                subjectsByCategory.map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      styles.subjectButton,
                      formData.subject === subject && styles.selectedSubjectButton
                    ]}
                    onPress={() => setFormData({...formData, subject})}
                  >
                    <Text style={[
                      styles.subjectButtonText,
                      formData.subject === subject && styles.selectedSubjectButtonText
                    ]}>
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noSubjectsText}>Aucune matière disponible</Text>
              )}
            </View>
          </View>

          {/* Academic Year */}
          <View style={styles.section}>
            <Text style={styles.label}>Année scolaire</Text>
            <TextInput
              style={styles.input}
              value={formData.year}
              onChangeText={(text) => setFormData({...formData, year: text})}
              placeholder="2024-2025"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Description de la classe..."
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
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
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  selectedCategoryButton: {
    borderColor: '#667eea',
    backgroundColor: '#eff6ff',
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedCategoryButtonText: {
    color: '#007AFF',
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedLevelButton: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedLevelButtonText: {
    color: '#007AFF',
  },
  subjectGrid: {
    gap: 8,
  },
  subjectButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  selectedSubjectButton: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  subjectButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedSubjectButtonText: {
    color: '#007AFF',
  },
  noSubjectsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 16,
  },
});
