/**
 * Data Export/Import Manager
 * French Teacher Classroom Management System
 * © 2024 Litoi Code
 */

import { Attendance, Class, Course, Grade, Student } from '@/types';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export interface ExportData {
  version: string;
  exportDate: string;
  classes: (Class & { educationLevel?: string })[];
  students: Student[];
  courses: Course[];
  grades: Grade[];
  attendance: Attendance[];
  metadata: {
    totalClasses: number;
    totalStudents: number;
    totalGrades: number;
    totalCourses: number;
    totalAttendance: number;
    appVersion: string;
    exportFormat: string;
  };
}

export class DataExportImport {
  
  static async exportAllData(
    classes: Class[],
    students: Student[],
    courses: Course[],
    grades: Grade[],
    attendance: Attendance[]
  ): Promise<boolean> {
    try {
      // Add compatibility fields to classes
      const compatibleClasses = classes.map(cls => ({
        ...cls,
        educationLevel: cls.level, // Add compatibility field
      }));

      const exportData: ExportData = {
        version: '1.1.0',
        exportDate: new Date().toISOString(),
        classes: compatibleClasses,
        students,
        courses,
        grades,
        attendance,
        metadata: {
          totalClasses: classes.length,
          totalStudents: students.length,
          totalGrades: grades.length,
          totalCourses: courses.length,
          totalAttendance: attendance.length,
          appVersion: '1.1.0',
          exportFormat: 'ClassMaster-JSON',
        }
      };

      const jsonData = JSON.stringify(exportData, null, 2);
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `ClassMaster_backup_${timestamp}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Check available storage space
      const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
      if (!fileInfo.exists) {
        throw new Error('Document directory not accessible');
      }

      await FileSystem.writeAsStringAsync(fileUri, jsonData);

      // Verify file was written correctly
      const writtenFile = await FileSystem.getInfoAsync(fileUri);
      if (!writtenFile.exists || writtenFile.size === 0) {
        throw new Error('Failed to write export file');
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exporter les données ClassMaster',
          UTI: 'public.json',
        });
      } else {
        Alert.alert(
          'Export réussi',
          `Données exportées vers: ${fileName}\n\n` +
          `Taille: ${(writtenFile.size / 1024).toFixed(1)} KB\n` +
          `Fichier sauvegardé dans le dossier Documents de l'application.`
        );
      }

      return true;
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(
        'Erreur d\'export',
        'Impossible d\'exporter les données. Veuillez réessayer.'
      );
      return false;
    }
  }

  static async exportToPDF(
    classes: Class[],
    students: Student[],
    grades: Grade[]
  ): Promise<boolean> {
    try {
      // Generate HTML content for PDF
      const htmlContent = this.generateHTMLReport(classes, students, grades);
      const fileName = `rapport_enseignant_${new Date().toISOString().split('T')[0]}.html`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, htmlContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/html',
          dialogTitle: 'Exporter le rapport PDF',
        });
      }

      return true;
    } catch (error) {
      console.error('PDF export error:', error);
      Alert.alert(
        'Erreur d\'export PDF',
        'Impossible de générer le rapport PDF. Veuillez réessayer.'
      );
      return false;
    }
  }

  static async exportToCSV(
    students: Student[],
    grades: Grade[],
    selectedClassId?: string
  ): Promise<boolean> {
    try {
      const filteredStudents = selectedClassId 
        ? students.filter(s => s.classId === selectedClassId)
        : students;

      const csvContent = this.generateCSVContent(filteredStudents, grades);
      const fileName = `notes_eleves_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csvContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Exporter les notes en CSV',
        });
      }

      return true;
    } catch (error) {
      console.error('CSV export error:', error);
      Alert.alert(
        'Erreur d\'export CSV',
        'Impossible d\'exporter les données CSV. Veuillez réessayer.'
      );
      return false;
    }
  }

  static async importData(): Promise<ExportData | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/plain'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return null;
      }

      const selectedFile = result.assets[0];

      // Check file size (max 50MB)
      if (selectedFile.size && selectedFile.size > 50 * 1024 * 1024) {
        Alert.alert(
          'Fichier trop volumineux',
          'Le fichier sélectionné est trop volumineux (max 50MB).'
        );
        return null;
      }

      // Check file extension
      if (!selectedFile.name?.toLowerCase().endsWith('.json')) {
        Alert.alert(
          'Format de fichier incorrect',
          'Veuillez sélectionner un fichier JSON (.json).'
        );
        return null;
      }

      const fileContent = await FileSystem.readAsStringAsync(selectedFile.uri);

      if (!fileContent || fileContent.trim().length === 0) {
        Alert.alert(
          'Fichier vide',
          'Le fichier sélectionné est vide ou illisible.'
        );
        return null;
      }

      let importData: ExportData;
      try {
        importData = JSON.parse(fileContent);
      } catch (parseError) {
        Alert.alert(
          'Fichier JSON invalide',
          'Le fichier sélectionné n\'est pas un fichier JSON valide.'
        );
        return null;
      }

      // Validate import data structure
      if (!this.validateImportData(importData)) {
        Alert.alert(
          'Fichier de sauvegarde invalide',
          'Le fichier sélectionné n\'est pas un fichier de sauvegarde ClassMaster valide ou est incompatible avec cette version.'
        );
        return null;
      }

      return importData;
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert(
        'Erreur d\'import',
        'Impossible d\'importer les données. Vérifiez que le fichier est accessible et valide.'
      );
      return null;
    }
  }

  private static validateImportData(data: any): data is ExportData {
    try {
      if (!data || typeof data !== 'object') {
        console.log('Invalid data: not an object');
        return false;
      }

      // Check required fields
      const requiredFields = ['version', 'exportDate', 'classes', 'students', 'courses', 'grades', 'attendance', 'metadata'];
      for (const field of requiredFields) {
        if (!(field in data)) {
          console.log(`Missing required field: ${field}`);
          return false;
        }
      }

      // Check arrays
      const arrayFields = ['classes', 'students', 'courses', 'grades', 'attendance'];
      for (const field of arrayFields) {
        if (!Array.isArray(data[field])) {
          console.log(`Field ${field} is not an array`);
          return false;
        }
      }

      // Check metadata
      if (!data.metadata || typeof data.metadata !== 'object') {
        console.log('Invalid metadata');
        return false;
      }

      // Check version compatibility
      const supportedVersions = ['1.0.0', '1.1.0'];
      if (!supportedVersions.includes(data.version)) {
        console.log(`Unsupported version: ${data.version}`);
        return false;
      }

      console.log('Import data validation passed');
      return true;
    } catch (error) {
      console.error('Error validating import data:', error);
      return false;
    }
  }

  private static generateHTMLReport(
    classes: Class[],
    students: Student[],
    grades: Grade[]
  ): string {
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rapport Enseignant - ${currentDate}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat-card { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📚 Rapport de Gestion de Classe</h1>
        <p>Généré le ${currentDate}</p>
        <p>© 2024 Litoi Code - Enseignant App</p>
    </div>

    <div class="stats">
        <div class="stat-card">
            <h3>${classes.length}</h3>
            <p>Classes</p>
        </div>
        <div class="stat-card">
            <h3>${students.length}</h3>
            <p>Élèves</p>
        </div>
        <div class="stat-card">
            <h3>${grades.length}</h3>
            <p>Notes</p>
        </div>
    </div>

    <div class="section">
        <h2>📋 Classes</h2>
        <table>
            <tr><th>Nom</th><th>Niveau</th><th>Matière</th><th>Élèves</th></tr>
            ${classes.map(cls => `
                <tr>
                    <td>${cls.name}</td>
                    <td>${cls.level}</td>
                    <td>${cls.subject}</td>
                    <td>${students.filter(s => s.classId === cls.id).length}</td>
                </tr>
            `).join('')}
        </table>
    </div>

    <div class="section">
        <h2>👥 Élèves par Classe</h2>
        ${classes.map(cls => {
          const classStudents = students.filter(s => s.classId === cls.id);
          return `
            <h3>${cls.name}</h3>
            <table>
                <tr><th>Nom</th><th>Prénom</th><th>Date de naissance</th><th>Moyenne</th></tr>
                ${classStudents.map(student => {
                  const studentGrades = grades.filter(g => g.studentId === student.id);
                  const average = studentGrades.length > 0 
                    ? (studentGrades.reduce((sum, g) => sum + g.value, 0) / studentGrades.length).toFixed(2)
                    : 'N/A';
                  return `
                    <tr>
                        <td>${student.lastName}</td>
                        <td>${student.firstName}</td>
                        <td>${student.dateOfBirth}</td>
                        <td>${average}/20</td>
                    </tr>
                  `;
                }).join('')}
            </table>
          `;
        }).join('')}
    </div>
</body>
</html>`;
  }

  private static generateCSVContent(students: Student[], grades: Grade[]): string {
    const headers = ['Nom', 'Prénom', 'Date de naissance', 'Nombre de notes', 'Moyenne'];
    const rows = students.map(student => {
      const studentGrades = grades.filter(g => g.studentId === student.id);
      const average = studentGrades.length > 0 
        ? (studentGrades.reduce((sum, g) => sum + g.value, 0) / studentGrades.length).toFixed(2)
        : '0';
      
      return [
        student.lastName,
        student.firstName,
        student.dateOfBirth,
        studentGrades.length.toString(),
        average
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
}
