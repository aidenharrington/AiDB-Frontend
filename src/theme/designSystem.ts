// Design System for AiDB - Data-Focused Professional Theme
// This file defines the core design tokens and system for the application

export const colors = {
  // Primary Colors - Professional Black & White Focus
  primary: {
    main: '#1a1a1a', // Deep charcoal for primary elements
    light: '#404040', // Lighter charcoal for hover states
    dark: '#000000', // Pure black for emphasis
    contrastText: '#ffffff', // White text on dark backgrounds
  },
  
  // Secondary Colors - Subtle Accents
  secondary: {
    main: '#6b7280', // Professional gray
    light: '#9ca3af', // Light gray for subtle elements
    dark: '#374151', // Dark gray for emphasis
    contrastText: '#ffffff',
  },
  
  // Neutral Colors - Data Readability Focus
  neutral: {
    50: '#fafafa', // Almost white - backgrounds
    100: '#f5f5f5', // Very light gray - subtle backgrounds
    200: '#e5e5e5', // Light gray - borders
    300: '#d4d4d4', // Medium light gray - dividers
    400: '#a3a3a3', // Medium gray - disabled text
    500: '#737373', // Medium gray - secondary text
    600: '#525252', // Dark gray - primary text
    700: '#404040', // Darker gray - headings
    800: '#262626', // Very dark gray - strong emphasis
    900: '#171717', // Almost black - maximum contrast
  },
  
  // Semantic Colors - Data Visualization & Status
  success: {
    main: '#059669', // Professional green
    light: '#10b981',
    dark: '#047857',
    contrastText: '#ffffff',
  },
  
  warning: {
    main: '#d97706', // Professional amber
    light: '#f59e0b',
    dark: '#b45309',
    contrastText: '#ffffff',
  },
  
  error: {
    main: '#dc2626', // Professional red
    light: '#ef4444',
    dark: '#b91c1c',
    contrastText: '#ffffff',
  },
  
  info: {
    main: '#2563eb', // Professional blue
    light: '#3b82f6',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  
  // Background Colors
  background: {
    default: '#ffffff', // Pure white for main background
    paper: '#fafafa', // Slightly off-white for cards
    subtle: '#f5f5f5', // Very light gray for subtle backgrounds
  },
  
  // Text Colors
  text: {
    primary: '#171717', // Almost black for primary text
    secondary: '#525252', // Dark gray for secondary text
    disabled: '#a3a3a3', // Medium gray for disabled text
    inverse: '#ffffff', // White text for dark backgrounds
  },
  
  // Border Colors
  border: {
    light: '#e5e5e5', // Light gray for subtle borders
    medium: '#d4d4d4', // Medium gray for standard borders
    dark: '#a3a3a3', // Darker gray for emphasis borders
  },
  
  // Data Visualization Colors - Professional Palette
  data: {
    blue: '#2563eb',
    green: '#059669',
    orange: '#d97706',
    red: '#dc2626',
    purple: '#7c3aed',
    teal: '#0d9488',
    yellow: '#ca8a04',
    pink: '#db2777',
    indigo: '#4f46e5',
    emerald: '#10b981',
  },
} as const;

export const typography = {
  // Font Family
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Consolas, monospace',
  },
  
  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Typography Scale - Optimized for Data Readability
  h1: {
    fontSize: '2.5rem', // 40px
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  
  h2: {
    fontSize: '2rem', // 32px
    lineHeight: 1.25,
    fontWeight: 600,
    letterSpacing: '-0.025em',
  },
  
  h3: {
    fontSize: '1.5rem', // 24px
    lineHeight: 1.33,
    fontWeight: 600,
    letterSpacing: '-0.025em',
  },
  
  h4: {
    fontSize: '1.25rem', // 20px
    lineHeight: 1.4,
    fontWeight: 600,
    letterSpacing: '-0.025em',
  },
  
  h5: {
    fontSize: '1.125rem', // 18px
    lineHeight: 1.44,
    fontWeight: 600,
    letterSpacing: '-0.025em',
  },
  
  h6: {
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
    fontWeight: 600,
    letterSpacing: '-0.025em',
  },
  
  body1: {
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
    fontWeight: 400,
    letterSpacing: '0.025em',
  },
  
  body2: {
    fontSize: '0.875rem', // 14px
    lineHeight: 1.57,
    fontWeight: 400,
    letterSpacing: '0.025em',
  },
  
  caption: {
    fontSize: '0.75rem', // 12px
    lineHeight: 1.5,
    fontWeight: 400,
    letterSpacing: '0.025em',
  },
  
  overline: {
    fontSize: '0.75rem', // 12px
    lineHeight: 1.5,
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  
  // Data-specific typography
  data: {
    large: {
      fontSize: '1.25rem', // 20px
      lineHeight: 1.4,
      fontWeight: 500,
      letterSpacing: '0.025em',
    },
    medium: {
      fontSize: '1rem', // 16px
      lineHeight: 1.5,
      fontWeight: 500,
      letterSpacing: '0.025em',
    },
    small: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.57,
      fontWeight: 500,
      letterSpacing: '0.025em',
    },
    mono: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,
      fontWeight: 400,
      fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Consolas, monospace',
      letterSpacing: '0.025em',
    },
  },
} as const;

export const spacing = {
  // Base spacing unit (4px)
  base: 4,
  
  // Spacing scale - 4px increments for consistency
  0: 0,
  1: 4,   // 4px
  2: 8,   // 8px
  3: 12,  // 12px
  4: 16,  // 16px
  5: 20,  // 20px
  6: 24,  // 24px
  7: 28,  // 28px
  8: 32,  // 32px
  9: 36,  // 36px
  10: 40, // 40px
  12: 48, // 48px
  14: 56, // 56px
  16: 64, // 64px
  20: 80, // 80px
  24: 96, // 96px
  32: 128, // 128px
  40: 160, // 160px
  48: 192, // 192px
  56: 224, // 224px
  64: 256, // 256px
} as const;

export const borderRadius = {
  none: 0,
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
} as const;

export const shadows = {
  // Subtle shadows for data-focused design
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export const transitions = {
  // Smooth transitions for professional feel
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
} as const;

// Component-specific design tokens
export const components = {
  // Card variants
  card: {
    default: {
      backgroundColor: colors.background.paper,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.base,
      border: `1px solid ${colors.border.light}`,
    },
    elevated: {
      backgroundColor: colors.background.paper,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.md,
      border: 'none',
    },
    outlined: {
      backgroundColor: colors.background.default,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.none,
      border: `1px solid ${colors.border.medium}`,
    },
  },
  
  // Button variants
  button: {
    primary: {
      backgroundColor: colors.primary.main,
      color: colors.primary.contrastText,
      '&:hover': {
        backgroundColor: colors.primary.light,
      },
    },
    secondary: {
      backgroundColor: colors.secondary.main,
      color: colors.secondary.contrastText,
      '&:hover': {
        backgroundColor: colors.secondary.light,
      },
    },
    text: {
      backgroundColor: 'transparent',
      color: colors.text.primary,
      '&:hover': {
        backgroundColor: colors.neutral[100],
      },
    },
    outlined: {
      backgroundColor: 'transparent',
      color: colors.text.primary,
      border: `1px solid ${colors.border.medium}`,
      '&:hover': {
        backgroundColor: colors.neutral[100],
        borderColor: colors.border.dark,
      },
    },
  },
  
  // Data table styles
  table: {
    header: {
      backgroundColor: colors.neutral[50],
      borderBottom: `1px solid ${colors.border.medium}`,
      fontWeight: typography.fontWeight.semibold,
    },
    row: {
      borderBottom: `1px solid ${colors.border.light}`,
      '&:hover': {
        backgroundColor: colors.neutral[50],
      },
    },
    cell: {
      padding: `${spacing[4]}px`,
      fontSize: typography.body2.fontSize,
    },
  },
  
  // Form elements
  input: {
    border: `1px solid ${colors.border.medium}`,
    borderRadius: borderRadius.base,
    padding: `${spacing[3]}px`,
    fontSize: typography.body1.fontSize,
    '&:focus': {
      borderColor: colors.primary.main,
      boxShadow: `0 0 0 3px ${colors.primary.main}20`,
    },
  },
  
  // Data visualization
  chart: {
    grid: {
      stroke: colors.border.light,
      strokeWidth: 1,
    },
    axis: {
      stroke: colors.text.secondary,
      fontSize: typography.caption.fontSize,
    },
    tooltip: {
      backgroundColor: colors.neutral[800],
      color: colors.text.inverse,
      borderRadius: borderRadius.base,
      padding: `${spacing[2]}px`,
      fontSize: typography.caption.fontSize,
    },
  },
} as const;

// Export the complete design system
export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  transitions,
  components,
} as const;

export type DesignSystem = typeof designSystem;
