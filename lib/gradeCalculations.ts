import { FRENCH_GRADE_SCALE, Grade } from '../types';

/**
 * French Educational System Grade Calculations
 * Implements the standard French grading system (0-20 scale)
 */

export interface WeightedGrade {
  value: number;
  coefficient: number;
  weight: number; // calculated weight
}

export interface GradeStatistics {
  average: number;
  median: number;
  min: number;
  max: number;
  standardDeviation: number;
  gradeCount: number;
  totalCoefficient: number;
}

/**
 * Calculate weighted average for French grading system
 * @param grades Array of grades with coefficients
 * @returns Weighted average (0-20 scale)
 */
export const calculateWeightedAverage = (grades: Grade[]): number => {
  if (grades.length === 0) return 0;

  let totalWeightedScore = 0;
  let totalCoefficient = 0;

  for (const grade of grades) {
    totalWeightedScore += grade.value * grade.coefficient;
    totalCoefficient += grade.coefficient;
  }

  return totalCoefficient > 0 ? totalWeightedScore / totalCoefficient : 0;
};

/**
 * Calculate grade statistics for a set of grades
 * @param grades Array of grades
 * @returns Grade statistics object
 */
export const calculateGradeStatistics = (grades: Grade[]): GradeStatistics => {
  if (grades.length === 0) {
    return {
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      standardDeviation: 0,
      gradeCount: 0,
      totalCoefficient: 0
    };
  }

  const values = grades.map(g => g.value);
  const sortedValues = [...values].sort((a, b) => a - b);

  const average = calculateWeightedAverage(grades);
  const median = calculateMedian(sortedValues);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const standardDeviation = calculateStandardDeviation(values, average);
  const totalCoefficient = grades.reduce((sum, g) => sum + g.coefficient, 0);

  return {
    average,
    median,
    min,
    max,
    standardDeviation,
    gradeCount: grades.length,
    totalCoefficient
  };
};

/**
 * Calculate median value
 * @param sortedValues Sorted array of values
 * @returns Median value
 */
const calculateMedian = (sortedValues: number[]): number => {
  const length = sortedValues.length;
  if (length === 0) return 0;

  if (length % 2 === 0) {
    return (sortedValues[length / 2 - 1] + sortedValues[length / 2]) / 2;
  } else {
    return sortedValues[Math.floor(length / 2)];
  }
};

/**
 * Calculate standard deviation
 * @param values Array of values
 * @param mean Mean value
 * @returns Standard deviation
 */
const calculateStandardDeviation = (values: number[], mean: number): number => {
  if (values.length === 0) return 0;

  const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / values.length;
  return Math.sqrt(variance);
};

/**
 * Get French grade appreciation based on the 0-20 scale
 * @param grade Grade value (0-20)
 * @param isPrimary Whether this is for primary education
 * @returns French appreciation string
 */
export const getFrenchGradeAppreciation = (grade: number, isPrimary: boolean = false): string => {
  if (grade < 0 || grade > 20) return 'Note invalide';

  if (isPrimary) {
    // Primary education uses different appreciation levels
    if (grade >= 18) return 'Très bonne maîtrise';
    if (grade >= 15) return 'Maîtrise satisfaisante';
    if (grade >= 12) return 'Maîtrise fragile';
    if (grade >= 8) return 'Début de maîtrise';
    return 'Maîtrise insuffisante';
  } else {
    // Secondary education (collège/lycée)
    if (grade >= 18) return 'Excellent';
    if (grade >= 16) return 'Très bien';
    if (grade >= 14) return 'Bien';
    if (grade >= 12) return 'Assez bien';
    if (grade >= 10) return 'Passable';
    if (grade >= 8) return 'Insuffisant';
    return 'Très insuffisant';
  }
};

/**
 * Get grade color based on French standards
 * @param grade Grade value (0-20)
 * @returns Color code for UI display
 */
export const getGradeColor = (grade: number): string => {
  if (grade >= 18) return '#4CAF50'; // Green - Excellent
  if (grade >= 16) return '#8BC34A'; // Light Green - Très bien
  if (grade >= 14) return '#CDDC39'; // Lime - Bien
  if (grade >= 12) return '#FFEB3B'; // Yellow - Assez bien
  if (grade >= 10) return '#FF9800'; // Orange - Passable
  if (grade >= 8) return '#FF5722'; // Deep Orange - Insuffisant
  return '#F44336'; // Red - Très insuffisant
};

/**
 * Calculate class average for a specific subject
 * @param studentGrades Map of student ID to their grades
 * @returns Class average
 */
export const calculateClassAverage = (studentGrades: Map<string, Grade[]>): number => {
  const studentAverages: number[] = [];

  for (const [studentId, grades] of studentGrades) {
    if (grades.length > 0) {
      studentAverages.push(calculateWeightedAverage(grades));
    }
  }

  if (studentAverages.length === 0) return 0;

  return studentAverages.reduce((sum, avg) => sum + avg, 0) / studentAverages.length;
};

/**
 * Calculate grade distribution for French system
 * @param grades Array of grade values
 * @returns Distribution object with French categories
 */
export const calculateGradeDistribution = (grades: number[]) => {
  const distribution = {
    excellent: 0,    // 18-20
    veryGood: 0,     // 16-18
    good: 0,         // 14-16
    satisfactory: 0, // 10-14
    insufficient: 0  // 0-10
  };

  for (const grade of grades) {
    if (grade >= 18) distribution.excellent++;
    else if (grade >= 16) distribution.veryGood++;
    else if (grade >= 14) distribution.good++;
    else if (grade >= 10) distribution.satisfactory++;
    else distribution.insufficient++;
  }

  return distribution;
};

/**
 * Validate grade value according to French system
 * @param value Grade value to validate
 * @returns Validation result
 */
export const validateGrade = (value: number): { isValid: boolean; message?: string } => {
  if (isNaN(value)) {
    return { isValid: false, message: 'La note doit être un nombre' };
  }

  if (value < FRENCH_GRADE_SCALE.MIN) {
    return { isValid: false, message: `La note ne peut pas être inférieure à ${FRENCH_GRADE_SCALE.MIN}` };
  }

  if (value > FRENCH_GRADE_SCALE.MAX) {
    return { isValid: false, message: `La note ne peut pas être supérieure à ${FRENCH_GRADE_SCALE.MAX}` };
  }

  return { isValid: true };
};

/**
 * Validate coefficient value
 * @param coefficient Coefficient to validate
 * @returns Validation result
 */
export const validateCoefficient = (coefficient: number): { isValid: boolean; message?: string } => {
  if (isNaN(coefficient)) {
    return { isValid: false, message: 'Le coefficient doit être un nombre' };
  }

  if (coefficient <= 0) {
    return { isValid: false, message: 'Le coefficient doit être supérieur à 0' };
  }

  if (coefficient > 10) {
    return { isValid: false, message: 'Le coefficient ne peut pas être supérieur à 10' };
  }

  return { isValid: true };
};

/**
 * Round grade to appropriate precision for French system
 * @param grade Grade value to round
 * @param precision Number of decimal places (default: 2)
 * @returns Rounded grade
 */
export const roundGrade = (grade: number, precision: number = 2): number => {
  return Math.round(grade * Math.pow(10, precision)) / Math.pow(10, precision);
};

/**
 * Calculate trend for student grades over time
 * @param grades Array of grades sorted by date (oldest first)
 * @returns Trend direction
 */
export const calculateGradeTrend = (grades: Grade[]): 'improving' | 'declining' | 'stable' => {
  if (grades.length < 3) return 'stable';

  // Take the last 5 grades for trend calculation
  const recentGrades = grades.slice(-5);
  const firstHalf = recentGrades.slice(0, Math.ceil(recentGrades.length / 2));
  const secondHalf = recentGrades.slice(Math.ceil(recentGrades.length / 2));

  const firstAverage = calculateWeightedAverage(firstHalf);
  const secondAverage = calculateWeightedAverage(secondHalf);

  const difference = secondAverage - firstAverage;

  if (difference > 0.5) return 'improving';
  if (difference < -0.5) return 'declining';
  return 'stable';
};

/**
 * Check if a class level is primary education
 * @param level Education level (e.g., 'cp', '6eme', etc.)
 * @returns True if primary education
 */
export const isPrimaryEducation = (level: string): boolean => {
  const primaryLevels = ['cp', 'ce1', 'ce2', 'cm1', 'cm2'];
  return primaryLevels.includes(level.toLowerCase());
};

/**
 * Get education category from level
 * @param level Education level
 * @returns Education category
 */
export const getEducationCategory = (level: string): 'Primaire' | 'Collège' | 'Lycée' => {
  const lowerLevel = level.toLowerCase();

  if (['cp', 'ce1', 'ce2', 'cm1', 'cm2'].includes(lowerLevel)) {
    return 'Primaire';
  } else if (['6eme', '5eme', '4eme', '3eme'].includes(lowerLevel)) {
    return 'Collège';
  } else {
    return 'Lycée';
  }
};

/**
 * Format grade for display in French format
 * @param grade Grade value
 * @param showAppreciation Whether to include appreciation
 * @param level Education level for appropriate appreciation
 * @returns Formatted grade string
 */
export const formatGradeDisplay = (grade: number, showAppreciation: boolean = false, level?: string): string => {
  const roundedGrade = roundGrade(grade);
  const gradeStr = `${roundedGrade}/20`;

  if (showAppreciation) {
    const isPrimary = level ? isPrimaryEducation(level) : false;
    const appreciation = getFrenchGradeAppreciation(grade, isPrimary);
    return `${gradeStr} (${appreciation})`;
  }

  return gradeStr;
};
