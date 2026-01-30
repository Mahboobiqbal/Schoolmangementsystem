import { createTheme, alpha } from '@mui/material/styles';

// Design System Color Palette
export const colors = {
  // Primary Colors - Deep Academic Blue/Indigo
  primary: {
    main: '#4F46E5',
    light: '#818CF8',
    dark: '#3730A3',
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  
  // Secondary Colors - Soft Teal
  secondary: {
    main: '#14B8A6',
    light: '#5EEAD4',
    dark: '#0F766E',
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },
  
  // Accent Colors - Soft Purple
  accent: {
    main: '#8B5CF6',
    light: '#A78BFA',
    dark: '#7C3AED',
  },
  
  // Background Colors
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
    dark: '#0F172A',
    subtle: '#F1F5F9',
    hover: '#E2E8F0',
  },
  
  // Text Colors
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    disabled: '#94A3B8',
    inverse: '#FFFFFF',
  },
  
  // Status Colors
  success: {
    main: '#10B981',
    light: '#D1FAE5',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FEF3C7',
    dark: '#D97706',
    contrastText: '#1E293B',
  },
  error: {
    main: '#EF4444',
    light: '#FEE2E2',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#3B82F6',
    light: '#DBEAFE',
    dark: '#2563EB',
    contrastText: '#FFFFFF',
  },
  
  // Neutral/Gray Scale
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
    secondary: 'linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)',
    accent: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    dark: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    warm: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
  },
};

// Typography Configuration
const typography = {
  fontFamily: '"Inter", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: {
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.5,
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.6,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  button: {
    fontWeight: 600,
    fontSize: '0.875rem',
    textTransform: 'none',
    letterSpacing: '0.02em',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
};

// Shadow Configuration
const shadows = [
  'none',
  '0px 1px 2px rgba(15, 23, 42, 0.06)',
  '0px 1px 3px rgba(15, 23, 42, 0.1)',
  '0px 2px 4px rgba(15, 23, 42, 0.06), 0px 4px 6px rgba(15, 23, 42, 0.1)',
  '0px 4px 6px rgba(15, 23, 42, 0.05), 0px 10px 15px rgba(15, 23, 42, 0.1)',
  '0px 10px 15px rgba(15, 23, 42, 0.04), 0px 20px 25px rgba(15, 23, 42, 0.1)',
  '0px 20px 25px rgba(15, 23, 42, 0.04), 0px 25px 50px rgba(15, 23, 42, 0.15)',
  '0px 25px 50px rgba(15, 23, 42, 0.25)',
  ...Array(17).fill('none'), // Fill remaining shadow levels
];

// Create the theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: '#FFFFFF',
    },
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.gray[200],
    grey: colors.gray,
  },
  typography,
  shadows,
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.default,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: colors.gray[100],
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: colors.gray[300],
            borderRadius: '4px',
            '&:hover': {
              background: colors.gray[400],
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: shadows[3],
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: shadows[4],
          },
        },
        containedPrimary: {
          background: colors.gradients.primary,
          '&:hover': {
            background: colors.gradients.primary,
            opacity: 0.9,
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        sizeLarge: {
          padding: '14px 28px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 14px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 1px 3px rgba(15, 23, 42, 0.08), 0px 1px 2px rgba(15, 23, 42, 0.06)',
          border: `1px solid ${colors.gray[100]}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 10px 40px rgba(15, 23, 42, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: shadows[2],
        },
        elevation2: {
          boxShadow: shadows[3],
        },
        elevation3: {
          boxShadow: shadows[4],
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: colors.background.paper,
            transition: 'all 0.2s ease-in-out',
            '& fieldset': {
              borderColor: colors.gray[200],
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: colors.primary[300],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.text.secondary,
            '&.Mui-focused': {
              color: colors.primary.main,
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: colors.gray[50],
          '& .MuiTableCell-head': {
            color: colors.text.primary,
            fontWeight: 600,
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: `2px solid ${colors.gray[200]}`,
            padding: '14px 16px',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease-in-out',
          '&:hover': {
            backgroundColor: colors.gray[50],
          },
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '14px 16px',
          borderBottom: `1px solid ${colors.gray[100]}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.8125rem',
        },
        colorSuccess: {
          backgroundColor: colors.success.light,
          color: colors.success.dark,
        },
        colorWarning: {
          backgroundColor: colors.warning.light,
          color: colors.warning.dark,
        },
        colorError: {
          backgroundColor: colors.error.light,
          color: colors.error.dark,
        },
        colorInfo: {
          backgroundColor: colors.info.light,
          color: colors.info.dark,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          padding: '10px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary.main, 0.12),
            color: colors.primary.main,
            '& .MuiListItemIcon-root': {
              color: colors.primary.main,
            },
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.16),
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: shadows[3],
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${colors.gray[100]}`,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        colorDefault: {
          backgroundColor: colors.primary[100],
          color: colors.primary.main,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.gray[800],
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: shadows[6],
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          minWidth: 100,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        standardSuccess: {
          backgroundColor: colors.success.light,
          color: colors.success.dark,
        },
        standardWarning: {
          backgroundColor: colors.warning.light,
          color: colors.warning.dark,
        },
        standardError: {
          backgroundColor: colors.error.light,
          color: colors.error.dark,
        },
        standardInfo: {
          backgroundColor: colors.info.light,
          color: colors.info.dark,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
