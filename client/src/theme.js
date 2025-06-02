import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(156, 163, 175, 0.8)',
      light: 'rgba(209, 213, 219, 0.8)',
      dark: 'rgba(107, 114, 128, 0.8)',
    },
    secondary: {
      main: 'rgba(75, 85, 99, 0.8)',
      light: 'rgba(107, 114, 128, 0.8)',
      dark: 'rgba(55, 65, 81, 0.8)',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(107, 114, 128, 0.2)',
    },
    text: {
      primary: 'rgba(243, 244, 246, 0.9)',
      secondary: 'rgba(156, 163, 175, 0.8)',
    },
    success: {
      main: 'rgba(34, 197, 94, 0.8)',
      light: 'rgba(34, 197, 94, 0.2)',
    },
    warning: {
      main: 'rgba(251, 191, 36, 0.8)',
      light: 'rgba(251, 191, 36, 0.2)',
    },
    error: {
      main: 'rgba(239, 68, 68, 0.8)',
      light: 'rgba(239, 68, 68, 0.2)',
    },
    info: {
      main: 'rgba(59, 130, 246, 0.8)',
      light: 'rgba(59, 130, 246, 0.2)',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(107, 114, 128, 0.2)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(156, 163, 175, 0.2)',
          borderRadius: '12px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(107, 114, 128, 0.2)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(156, 163, 175, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(107, 114, 128, 0.3)',
            backdropFilter: 'blur(10px)',
            '& fieldset': {
              borderColor: 'rgba(156, 163, 175, 0.4)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(156, 163, 175, 0.6)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(156, 163, 175, 0.8)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(209, 213, 219, 0.8)',
          },
          '& .MuiFormHelperText-root': {
            color: 'rgba(156, 163, 175, 0.8)',
          },
          '& .MuiOutlinedInput-input': {
            color: 'rgba(243, 244, 246, 0.9)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'rgba(107, 114, 128, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(156, 163, 175, 0.3)',
          color: 'rgba(243, 244, 246, 0.9)',
          '&:hover': {
            background: 'rgba(75, 85, 99, 0.8)',
          },
          '&:disabled': {
            background: 'rgba(107, 114, 128, 0.4)',
            color: 'rgba(156, 163, 175, 0.6)',
          },
        },
        outlined: {
          background: 'rgba(107, 114, 128, 0.6)',
          color: 'rgba(243, 244, 246, 0.9)',
          borderColor: 'rgba(156, 163, 175, 0.4)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            background: 'rgba(75, 85, 99, 0.8)',
            borderColor: 'rgba(156, 163, 175, 0.6)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          background: 'rgba(107, 114, 128, 0.3)',
          backdropFilter: 'blur(10px)',
          color: 'rgba(243, 244, 246, 0.9)',
          border: '1px solid rgba(156, 163, 175, 0.2)',
          '& .MuiAlert-icon': {
            color: 'rgba(156, 163, 175, 0.8)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(107, 114, 128, 0.6)',
          backdropFilter: 'blur(10px)',
          color: 'rgba(243, 244, 246, 0.9)',
          border: '1px solid rgba(156, 163, 175, 0.3)',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
  },
});

export default theme;
