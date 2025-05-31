// Enhanced Theme System for French Educational App

export const Colors = {
  // Primary Colors - French Educational Theme
  primary: '#667eea',
  primaryDark: '#5a67d8',
  primaryLight: '#7c8aed',

  // Secondary Colors
  secondary: '#764ba2',
  secondaryDark: '#6b4190',
  secondaryLight: '#8b5fb5',

  // Cameroonian Flag Colors
  cameroonianGreen: '#007A5E',
  cameroonianRed: '#CE1126',
  cameroonianYellow: '#FCD116',

  // Educational Colors
  primaryEducation: '#4CAF50',    // Green for Primary
  middleEducation: '#2196F3',     // Blue for Middle School
  highEducation: '#9C27B0',       // Purple for High School

  // Neutral Colors
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9',

  // Text Colors
  text: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  textLight: '#cbd5e1',

  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Grade Colors (French 0-20 scale)
  gradeExcellent: '#10b981',      // 18-20
  gradeVeryGood: '#22c55e',       // 16-18
  gradeGood: '#84cc16',           // 14-16
  gradeSatisfactory: '#eab308',   // 10-14
  gradeInsufficient: '#f97316',   // 8-10
  gradePoor: '#ef4444',           // 0-8

  // Attendance Colors
  present: '#10b981',
  absent: '#ef4444',
  late: '#f59e0b',
  excused: '#6366f1',

  // Border Colors
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderDark: '#cbd5e1',

  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const Typography = {
  // Font Sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,

  // Font Weights
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,

  // Line Heights
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
};

export const Layout = {
  // Container widths
  containerPadding: Spacing.lg,
  sectionSpacing: Spacing.xxl,

  // Card styles
  cardPadding: Spacing.lg,
  cardRadius: BorderRadius.lg,

  // Button styles
  buttonHeight: 48,
  buttonRadius: BorderRadius.md,
  buttonPadding: Spacing.lg,

  // Input styles
  inputHeight: 48,
  inputRadius: BorderRadius.md,
  inputPadding: Spacing.md,
};

// Education Level Theme Colors
export const EducationTheme = {
  Primaire: {
    primary: Colors.primaryEducation,
    background: '#f0f9ff',
    border: '#bae6fd',
    text: '#0c4a6e',
  },
  Collège: {
    primary: Colors.middleEducation,
    background: '#eff6ff',
    border: '#bfdbfe',
    text: '#1e3a8a',
  },
  Lycée: {
    primary: Colors.highEducation,
    background: '#faf5ff',
    border: '#d8b4fe',
    text: '#581c87',
  },
};

// Grade Theme Colors
export const GradeTheme = {
  getGradeColor: (grade: number): string => {
    if (grade >= 18) return Colors.gradeExcellent;
    if (grade >= 16) return Colors.gradeVeryGood;
    if (grade >= 14) return Colors.gradeGood;
    if (grade >= 10) return Colors.gradeSatisfactory;
    if (grade >= 8) return Colors.gradeInsufficient;
    return Colors.gradePoor;
  },

  getGradeBackground: (grade: number): string => {
    if (grade >= 18) return '#ecfdf5';
    if (grade >= 16) return '#f0fdf4';
    if (grade >= 14) return '#f7fee7';
    if (grade >= 10) return '#fefce8';
    if (grade >= 8) return '#fff7ed';
    return '#fef2f2';
  },
};

// Common Component Styles
export const CommonStyles = {
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },

  button: {
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonRadius,
    paddingHorizontal: Layout.buttonPadding,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  input: {
    height: Layout.inputHeight,
    borderRadius: Layout.inputRadius,
    paddingHorizontal: Layout.inputPadding,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    fontSize: Typography.base,
    color: Colors.text,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  section: {
    marginBottom: Layout.sectionSpacing,
  },

  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.containerPadding,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Shadows.sm,
  },
};
