import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Tooltip
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PairingForm from './components/PairingForm';
import PairingStatus from './components/PairingStatus';

// Material Design 3 inspired theme
const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#25d366', // WhatsApp green
      light: '#4caf50',
      dark: '#1b5e20',
    },
    background: {
      default: mode === 'light' ? '#f8f9fa' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#1a1a1a' : '#ffffff',
      secondary: mode === 'light' ? '#5f6368' : '#b3b3b3',
    },
    success: {
      main: '#25d366',
    },
    error: {
      main: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? '#f8f9fa' : '#121212',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 24,
          padding: '12px 24px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: mode === 'light' 
              ? '0 2px 8px rgba(0, 0, 0, 0.15)' 
              : '0 2px 8px rgba(255, 255, 255, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0 2px 12px rgba(0, 0, 0, 0.08)' 
            : '0 2px 12px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
            : '0 2px 8px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

function App() {
  const [pairingCode, setPairingCode] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('idle'); 
  const [statusMessage, setStatusMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const theme = createAppTheme(darkMode ? 'dark' : 'light');

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handlePairingSubmit = async (phone) => {
    try {
      setConnectionStatus('generating');
      setStatusMessage('Generating pairing code...');
      setPairingCode('');
      
      // Determine the backend URL based on environment
      const isCodespaces = window.location.hostname.includes('app.github.dev');
      const backendUrl = isCodespaces 
        ? window.location.origin.replace('-3000', '-8000') 
        : (process.env.NODE_ENV === 'production' 
            ? '' 
            : 'http://localhost:8000');
      
      const response = await fetch(`${backendUrl}/pair?phone=${encodeURIComponent(phone)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.code) {
        setPairingCode(data.code);
        setConnectionStatus('code-generated');
        setStatusMessage('Pairing code generated! Enter it in your WhatsApp app.');
      } else {
        setConnectionStatus('error');
        setStatusMessage(data.error || 'Failed to generate pairing code');
      }
    } catch (error) {
      console.error('Error:', error);
      setConnectionStatus('error');
      setStatusMessage('Network error occurred');
    }
  };

  const handleReset = () => {
    setConnectionStatus('idle');
    setStatusMessage('');
    setPairingCode('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          : 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}>
        <Container maxWidth="md">
          {/* macOS Tab Design Container */}
          <Box
            sx={{
              position: 'relative',
              backgroundColor: theme.palette.background.paper,
              borderRadius: 0,
              width: '100%',
              maxWidth: '1080px',
              minHeight: '480px',
              margin: '0 auto',
              boxShadow: theme.palette.mode === 'light' 
                ? '0 -2px 20px rgba(0, 0, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.08)' 
                : '0 -2px 20px rgba(0, 0, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.palette.mode === 'light' 
                  ? '0 -4px 25px rgba(0, 0, 0, 0.12), 0 8px 25px rgba(0, 0, 0, 0.1)' 
                  : '0 -4px 25px rgba(0, 0, 0, 0.4), 0 8px 25px rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            {/* macOS Tab Header */}
            <Box
              sx={{
                height: '36px',
                backgroundColor: theme.palette.mode === 'light' ? '#f6f6f6' : '#2d2d2d',
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                borderRadius: 0,
              }}
            >
              {/* Traffic Light Buttons */}
              <Box sx={{ display: 'flex', gap: 0.8 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#ff5f57',
                    border: theme.palette.mode === 'light' ? '0.5px solid #e04640' : 'none',
                  }}
                />
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#ffbd2e',
                    border: theme.palette.mode === 'light' ? '0.5px solid #dea123' : 'none',
                  }}
                />
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#28ca42',
                    border: theme.palette.mode === 'light' ? '0.5px solid #1aab29' : 'none',
                  }}
                />
              </Box>
              
              {/* Tab Title */}
              <Typography
                variant="caption"
                sx={{
                  ml: 2,
                  color: theme.palette.text.secondary,
                  fontSize: '13px',
                  fontWeight: 500,
                  userSelect: 'none',
                }}
              >
                GURU AI - Session Generator
              </Typography>
            </Box>

            {/* Main Content Area */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                textAlign: 'center',
                backgroundColor: theme.palette.background.paper,
                border: 'none',
                borderRadius: 0,
                position: 'relative',
              }}
            >
            {/* Theme Toggle Button */}
            <Box sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16 
            }}>
              <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton 
                  onClick={toggleTheme}
                  color="inherit"
                  sx={{ 
                    bgcolor: theme.palette.action.hover,
                    '&:hover': {
                      bgcolor: theme.palette.action.selected,
                    }
                  }}
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            </Box>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Box 
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#1a237e' : '#e3f2fd',
                  mb: 3,
                }}
              >
                <SmartToyIcon sx={{ fontSize: 32, color: '#1976d2' }} />
              </Box>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                GURU AI
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary,
                }}
              >
                Generate your session id
              </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {connectionStatus === 'idle' && (
                <PairingForm onSubmit={handlePairingSubmit} />
              )}

              {connectionStatus !== 'idle' && (
                <PairingStatus
                  status={connectionStatus}
                  message={statusMessage}
                  pairingCode={pairingCode}
                  onReset={handleReset}
                />
              )}
            </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
