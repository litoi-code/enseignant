/**
 * Data Export/Import Manager
 * French Teacher Classroom Management System
 * © 2024 Litoi Code
 */

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { Class, Student, Course, Grade, Attendance } from '@/types';

export interface ExportData {
  version: string;
  exportDate: string;
  classes: Class[];
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
      const exportData: ExportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        classes,
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
        }
      };

      const jsonData = JSON.stringify(exportData, null, 2);
      const fileName = `enseignant_backup_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, jsonData);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exporter les données de l\'application',
        });
      } else {
        Alert.alert(
          'Export réussi',
          `Données exportées vers: ${fileName}\n\nFichier sauvegardé dans le dossier Documents de l'application.`
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
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return null;
      }

      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const importData: ExportData = JSON.parse(fileContent);

      // Validate import data structure
      if (!this.validateImportData(importData)) {
        Alert.alert(
          'Fichier invalide',
          'Le fichier sélectionné n\'est pas un fichier de sauvegarde valide.'
        );
        return null;
      }

      return importData;
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert(
        'Erreur d\'import',
        'Impossible d\'importer les données. Vérifiez que le fichier est valide.'
      );
      return null;
    }
  }

  private static validateImportData(data: any): data is ExportData {
    return (
      data &&
      typeof data === 'object' &&
      data.version &&
      data.exportDate &&
      Array.isArray(data.classes) &&
      Array.isArray(data.students) &&
      Array.isArray(data.courses) &&
      Array.isArray(data.grades) &&
      Array.isArray(data.attendance) &&
      data.metadata
    );
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
