import { createTheme, ThemeOptions } from '@mui/material/styles';
import { designSystem } from './designSystem';

// Create the Material-UI theme configuration
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: designSystem.colors.primary.main,
      light: designSystem.colors.primary.light,
      dark: designSystem.colors.primary.dark,
      contrastText: designSystem.colors.primary.contrastText,
    },
    secondary: {
      main: designSystem.colors.secondary.main,
      light: designSystem.colors.secondary.light,
      dark: designSystem.colors.secondary.dark,
      contrastText: designSystem.colors.secondary.contrastText,
    },
    success: {
      main: designSystem.colors.success.main,
      light: designSystem.colors.success.light,
      dark: designSystem.colors.success.dark,
      contrastText: designSystem.colors.success.contrastText,
    },
    warning: {
      main: designSystem.colors.warning.main,
      light: designSystem.colors.warning.light,
      dark: designSystem.colors.warning.dark,
      contrastText: designSystem.colors.warning.contrastText,
    },
    error: {
      main: designSystem.colors.error.main,
      light: designSystem.colors.error.light,
      dark: designSystem.colors.error.dark,
      contrastText: designSystem.colors.error.contrastText,
    },
    info: {
      main: designSystem.colors.info.main,
      light: designSystem.colors.info.light,
      dark: designSystem.colors.info.dark,
      contrastText: designSystem.colors.info.contrastText,
    },
    background: {
      default: designSystem.colors.background.default,
      paper: designSystem.colors.background.paper,
    },
    text: {
      primary: designSystem.colors.text.primary,
      secondary: designSystem.colors.text.secondary,
      disabled: designSystem.colors.text.disabled,
    },
    divider: designSystem.colors.border.light,
  },
  
  typography: {
    fontFamily: designSystem.typography.fontFamily.primary,
    h1: {
      ...designSystem.typography.h1,
      fontFamily: designSystem.typography.fontFamily.primary,
    },
    h2: {
      ...designSystem.typography.h2,
      fontFamily: designSystem.typography.fontFamily.primary,
    },
    h3: {
      ...designSystem.typography.h3,
      fontFamily: designSystem.typography.fontFamily.primary,
    },
    h4: {
      ...designSystem.typography.h4,
      fontFamily: designSystem.typography.fontFamily.primary,
    },
    h5: {
      ...designSystem.typography.h5,
      fontFamily: designSystem.typography.fontFamily.primary,
    },
    h6: {
      ...designSystem.typography.h6,
      fontFamily: designSystem.typography.fontFamily.primary,
    },
    body1: {
      ...designSystem.typography.body1,
      fontFamily: designSystem.typography.fontFamily.primary,
    },
    body2: {
      ...designSystem.typography.body2,
      fontFamily: designSystem.typography.fontFamily.primary,
    },
    caption: {
      ...designSystem.typography.caption,
      fontFamily: designSystem.typography.fontFamily.primary,
    },
    overline: {
      ...designSystem.typography.overline,
      fontFamily: designSystem.typography.fontFamily.primary,
    },
    button: {
      fontFamily: designSystem.typography.fontFamily.primary,
      fontWeight: designSystem.typography.fontWeight.medium,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
  },
  
  shape: {
    borderRadius: parseInt(designSystem.borderRadius.base),
  },
  
  spacing: (factor: number) => `${factor * 4}px`,
  
  breakpoints: {
    values: designSystem.breakpoints,
  },
  
  shadows: [
    'none',
    designSystem.shadows.sm,
    designSystem.shadows.base,
    designSystem.shadows.md,
    designSystem.shadows.lg,
    designSystem.shadows.xl,
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
    designSystem.shadows['2xl'],
  ],
  
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: designSystem.colors.background.default,
          color: designSystem.colors.text.primary,
          fontFamily: designSystem.typography.fontFamily.primary,
          fontSize: designSystem.typography.body1.fontSize,
          lineHeight: designSystem.typography.body1.lineHeight,
          fontWeight: designSystem.typography.body1.fontWeight,
          letterSpacing: designSystem.typography.body1.letterSpacing,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '*': {
          boxSizing: 'border-box',
        },
        'html, body': {
          margin: 0,
          padding: 0,
        },
      },
    },
    
    // Button customization
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: designSystem.borderRadius.base,
          padding: `${designSystem.spacing[3]}px ${designSystem.spacing[6]}px`,
          fontSize: designSystem.typography.body2.fontSize,
          fontWeight: designSystem.typography.fontWeight.medium,
          textTransform: 'none',
          transition: designSystem.transitions.base,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: designSystem.shadows.md,
          },
        },
        contained: {
          boxShadow: designSystem.shadows.sm,
          '&:hover': {
            boxShadow: designSystem.shadows.md,
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
        sizeSmall: {
          padding: `${designSystem.spacing[2]}px ${designSystem.spacing[4]}px`,
          fontSize: designSystem.typography.caption.fontSize,
        },
        sizeLarge: {
          padding: `${designSystem.spacing[4]}px ${designSystem.spacing[8]}px`,
          fontSize: designSystem.typography.body1.fontSize,
        },
      },
    },
    
    // Card customization
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designSystem.borderRadius.lg,
          boxShadow: designSystem.shadows.base,
          border: `1px solid ${designSystem.colors.border.light}`,
          overflow: 'hidden',
        },
      },
    },
    
    // Paper customization
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: designSystem.borderRadius.lg,
        },
        elevation1: {
          boxShadow: designSystem.shadows.base,
        },
        elevation2: {
          boxShadow: designSystem.shadows.md,
        },
        elevation3: {
          boxShadow: designSystem.shadows.lg,
        },
      },
    },
    
    // TextField customization
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: designSystem.borderRadius.base,
            '& fieldset': {
              borderColor: designSystem.colors.border.medium,
            },
            '&:hover fieldset': {
              borderColor: designSystem.colors.border.dark,
            },
            '&.Mui-focused fieldset': {
              borderColor: designSystem.colors.primary.main,
              borderWidth: '2px',
            },
          },
        },
      },
    },
    
    // Table customization
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: designSystem.colors.neutral[50],
          '& .MuiTableCell-head': {
            fontWeight: designSystem.typography.fontWeight.semibold,
            borderBottom: `1px solid ${designSystem.colors.border.medium}`,
            color: designSystem.colors.text.primary,
          },
        },
      },
    },
    
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            '&:hover': {
              backgroundColor: designSystem.colors.neutral[50],
            },
            '& .MuiTableCell-body': {
              borderBottom: `1px solid ${designSystem.colors.border.light}`,
              padding: `${designSystem.spacing[4]}px`,
            },
          },
        },
      },
    },
    
    // AppBar customization
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: designSystem.colors.background.paper,
          color: designSystem.colors.text.primary,
          boxShadow: designSystem.shadows.sm,
          borderBottom: `1px solid ${designSystem.colors.border.light}`,
        },
      },
    },
    
    // Toolbar customization
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px',
          padding: `0 ${designSystem.spacing[6]}px`,
        },
      },
    },
    
    // Chip customization
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: designSystem.borderRadius.full,
          fontWeight: designSystem.typography.fontWeight.medium,
        },
        outlined: {
          borderColor: designSystem.colors.border.medium,
        },
      },
    },
    
    // Dialog customization
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: designSystem.borderRadius.xl,
          boxShadow: designSystem.shadows.xl,
        },
      },
    },
    
    // Menu customization
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: designSystem.borderRadius.lg,
          boxShadow: designSystem.shadows.lg,
          border: `1px solid ${designSystem.colors.border.light}`,
        },
      },
    },
    
    // List customization
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: designSystem.borderRadius.base,
          marginBottom: `${designSystem.spacing[1]}px`,
          '&:hover': {
            backgroundColor: designSystem.colors.neutral[50],
          },
        },
      },
    },
    
    // Divider customization
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: designSystem.colors.border.light,
        },
      },
    },
    
    // CircularProgress customization
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: designSystem.colors.primary.main,
        },
      },
    },
    
    // LinearProgress customization
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: designSystem.colors.neutral[200],
          borderRadius: designSystem.borderRadius.full,
        },
        bar: {
          borderRadius: designSystem.borderRadius.full,
        },
      },
    },
    
    // Snackbar customization
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            borderRadius: designSystem.borderRadius.lg,
            boxShadow: designSystem.shadows.lg,
          },
        },
      },
    },
    
    // Alert customization
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: designSystem.borderRadius.lg,
          fontWeight: designSystem.typography.fontWeight.medium,
        },
      },
    },
  },
};

// Create and export the theme
export const theme = createTheme(themeOptions);

// Export theme options for potential customization
export { themeOptions };

// Export the design system for direct access
export { designSystem };
