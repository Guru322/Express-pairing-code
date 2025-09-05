import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Fade,
  Zoom,
  Card,
  CardContent,
  Alert,
  Chip,
  useTheme
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PairingStatus = ({ 
  status, 
  message, 
  pairingCode, 
  onReset 
}) => {
  const [copied, setCopied] = useState(false);
  const theme = useTheme();

  // Debug logging
  console.log('PairingStatus props:', { status, message, pairingCode });

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'generating':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <CircularProgress 
              size={64} 
              thickness={4}
              sx={{ 
                color: theme.palette.primary.main,
              }} 
            />
          </Box>
        );
      case 'code-generated':
        return (
          <Zoom in={true} timeout={500}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mb: 3,
                width: 80,
                height: 80,
                borderRadius: '20px',
                backgroundColor: theme.palette.mode === 'light' ? '#e8f5e8' : '#1b5e20',
                margin: '0 auto',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40, color: '#25d366' }} />
            </Box>
          </Zoom>
        );
      case 'error':
        return (
          <Zoom in={true} timeout={500}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mb: 3,
                width: 80,
                height: 80,
                borderRadius: '20px',
                backgroundColor: theme.palette.mode === 'light' ? '#ffebee' : '#d32f2f20',
                margin: '0 auto'
              }}
            >
              <ErrorIcon sx={{ fontSize: 40, color: '#d32f2f' }} />
            </Box>
          </Zoom>
        );
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'generating':
        return 'Generating pairing code';
      case 'code-generated':
        return 'Code ready!';
      case 'error':
        return 'Something went wrong';
      default:
        return '';
    }
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      {/* Status Icon */}
      <Fade in={true} timeout={800}>
        <Box>
          {getStatusIcon()}
        </Box>
      </Fade>

      {/* Status Title */}
      <Fade in={true} timeout={1000}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 2,
            color: theme.palette.text.primary,
            fontWeight: 500,
          }}
        >
          {getStatusTitle()}
        </Typography>
      </Fade>

      {/* Status Message */}
      <Fade in={true} timeout={1200}>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.text.secondary,
            mb: 3,
          }}
        >
          {message}
        </Typography>
      </Fade>

      {/* Pairing Code Display */}
      {pairingCode && (
        <Fade in={true} timeout={1500}>
          <Box sx={{ mb: 4 }}>
            <Card 
              variant="outlined" 
              sx={{
                maxWidth: 400,
                mx: 'auto',
                border: `2px solid ${theme.palette.secondary.main}`,
                backgroundColor: theme.palette.mode === 'light' ? '#f8fff8' : theme.palette.background.paper,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <WhatsAppIcon sx={{ mr: 1, color: '#25d366', fontSize: 24 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: 500
                    }}
                  >
                    Your pairing code
                  </Typography>
                </Box>
                
                <Box 
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    mb: 3
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: theme.palette.text.primary,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {pairingCode}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copyToClipboard(pairingCode)}
                  fullWidth
                  sx={{
                    backgroundColor: copied ? theme.palette.secondary.main : theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    py: 1.5,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: copied ? theme.palette.secondary.dark : theme.palette.primary.dark,
                    }
                  }}
                >
                  {copied ? 'Copied!' : 'Copy code'}
                </Button>
              </CardContent>
            </Card>
            
            <Alert 
              severity="info" 
              sx={{ 
                mt: 3, 
                maxWidth: 400, 
                mx: 'auto',
                backgroundColor: theme.palette.mode === 'light' ? '#e3f2fd' : theme.palette.background.paper,
                '& .MuiAlert-icon': {
                  color: theme.palette.primary.main
                }
              }}
            >
              <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                Open WhatsApp → Settings → Linked Devices → Link a Device<br />
                Enter this code to complete pairing. Your session will be sent via WhatsApp.
              </Typography>
            </Alert>
          </Box>
        </Fade>
      )}

      {/* Error Display */}
      {status === 'error' && (
        <Fade in={true} timeout={1500}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              maxWidth: 400, 
              mx: 'auto',
              backgroundColor: theme.palette.mode === 'light' ? '#ffebee' : theme.palette.background.paper
            }}
          >
            <Typography variant="body2">
              {message}
            </Typography>
          </Alert>
        </Fade>
      )}

      {/* Reset Button */}
      <Fade in={true} timeout={2000}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onReset}
          size="large"
          sx={{
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
            px: 3,
            py: 1.5,
            fontWeight: 500,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main
            }
          }}
        >
          Try again
        </Button>
      </Fade>
    </Box>
  );
};

export default PairingStatus;
