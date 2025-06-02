import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Fade,
  Zoom
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonIcon from '@mui/icons-material/Person';

const PairingStatus = ({ 
  status, 
  message, 
  pairingCode, 
  sessionId, 
  userInfo, 
  onReset 
}) => {
  const [copied, setCopied] = useState(false);

  // Debug logging
  console.log('PairingStatus props:', { status, message, pairingCode, sessionId, userInfo });

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
      case 'connecting':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <CircularProgress 
              size={80} 
              thickness={4}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
              }} 
            />
          </Box>
        );
      case 'generating':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <CircularProgress 
              size={80} 
              thickness={4}
              sx={{ 
                color: 'rgba(147, 197, 253, 0.9)',
                filter: 'drop-shadow(0 0 20px rgba(147, 197, 253, 0.4))'
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
                mb: 2,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                margin: '0 auto',
                animation: 'pulse 2s infinite'
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 50, color: 'rgba(34, 197, 94, 0.9)' }} />
            </Box>
          </Zoom>
        );
      case 'connected':
        return (
          <Zoom in={true} timeout={500}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mb: 2,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(34, 197, 94, 0.4)',
                margin: '0 auto',
                boxShadow: '0 0 40px rgba(34, 197, 94, 0.3)'
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 50, color: 'rgba(34, 197, 94, 1)' }} />
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
                mb: 2,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                margin: '0 auto'
              }}
            >
              <ErrorIcon sx={{ fontSize: 50, color: 'rgba(239, 68, 68, 0.9)' }} />
            </Box>
          </Zoom>
        );
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'connecting':
        return 'Establishing Connection';
      case 'generating':
        return 'Generating Pairing Code';
      case 'code-generated':
        return 'Pairing Code Ready!';
      case 'connected':
        return 'Successfully Connected!';
      case 'error':
        return 'Connection Failed';
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
          variant="h4" 
          sx={{ 
            mb: 2,
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}
        >
          {getStatusTitle()}
        </Typography>
      </Fade>

      {/* Status Message */}
      <Fade in={true} timeout={1200}>
        <Box 
          sx={{
            display: 'inline-block',
            px: 4,
            py: 2,
            mb: 4,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
              fontSize: '1.1rem'
            }}
          >
            {message}
          </Typography>
        </Box>
      </Fade>

      {/* Pairing Code Display */}
      {pairingCode && (
        <Fade in={true} timeout={1500}>
          <Box sx={{ mb: 4 }}>
            <Box 
              sx={{
                display: 'inline-block',
                p: 4,
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                boxShadow: '0 8px 40px rgba(34, 197, 94, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                  animation: 'shimmer 3s infinite'
                }
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(34, 197, 94, 0.9)',
                  mb: 2,
                  fontWeight: 600
                }}
              >
                🔑 Your Pairing Code
              </Typography>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  color: 'rgba(255, 255, 255, 0.95)',
                  letterSpacing: '0.2em',
                  textShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {pairingCode}
              </Typography>
              <Button
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={() => copyToClipboard(pairingCode)}
                sx={{
                  background: copied 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '20px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1,
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                {copied ? '✓ Copied!' : 'Copy Code'}
              </Button>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 3, 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}
            >
              Open WhatsApp → Settings → Linked Devices → Link a Device<br />
              Then enter this code to complete the pairing
            </Typography>
          </Box>
        </Fade>
      )}

      {/* User Info Display - Only shown when connected */}
      {status === 'connected' && userInfo && (
        <Fade in={true} timeout={1500}>
          <Box sx={{ mb: 4 }}>
            <Box 
              sx={{
                display: 'inline-block',
                p: 4,
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                boxShadow: '0 8px 40px rgba(34, 197, 94, 0.2)',
                minWidth: '300px'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <PersonIcon sx={{ mr: 2, color: 'rgba(34, 197, 94, 0.9)', fontSize: 28 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(34, 197, 94, 0.9)',
                    fontWeight: 600
                  }}
                >
                  Connected Account
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'left', maxWidth: '250px', mx: 'auto' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                      mb: 0.5
                    }}
                  >
                    Phone Number
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontWeight: 600,
                      fontFamily: 'monospace'
                    }}
                  >
                    {userInfo.id?.split('@')[0] || 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                      mb: 0.5
                    }}
                  >
                    Name
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontWeight: 600
                    }}
                  >
                    {userInfo.name || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
      )}

      {/* Session ID Display - Only shown when connected */}
      {status === 'connected' && sessionId && (
        <Fade in={true} timeout={1800}>
          <Box sx={{ mb: 4 }}>
            <Box 
              sx={{
                display: 'inline-block',
                p: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                minWidth: '300px'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 1,
                  fontSize: '0.85rem'
                }}
              >
                Session ID
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace',
                    color: 'rgba(255, 255, 255, 0.95)',
                    wordBreak: 'break-all',
                    flex: 1,
                    fontSize: '0.9rem'
                  }}
                >
                  {sessionId}
                </Typography>
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copyToClipboard(sessionId)}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    minWidth: 'auto',
                    px: 2,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Copy
                </Button>
              </Box>
            </Box>
          </Box>
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
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '25px',
            backdropFilter: 'blur(20px)',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          Start New Session
        </Button>
      </Fade>

      {/* CSS Animation for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </Box>
  );
};

export default PairingStatus;
