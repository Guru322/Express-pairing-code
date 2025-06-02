import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PairingForm from './components/PairingForm';
import PairingStatus from './components/PairingStatus';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('idle'); 
  const [statusMessage, setStatusMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
   
    const isCodespaces = window.location.hostname.includes('app.github.dev');
    const backendUrl = isCodespaces 
      ? window.location.origin.replace('-3000', '-8000') 
      : (process.env.NODE_ENV === 'production' 
          ? window.location.origin 
          : 'http://localhost:8000');
    console.log('Initializing socket connection to:', backendUrl);
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected successfully with ID:', newSocket.id);
    });

    newSocket.on('pairing-code', (data) => {
      console.log('Pairing code received:', data);
      console.log('Setting pairing code:', data.code);
      setPairingCode(data.code);
      setConnectionStatus('code-generated');
      setStatusMessage('Pairing code generated! Enter it in your WhatsApp app.');
      console.log('State updated - status: code-generated, code:', data.code);
    });

    newSocket.onAny((eventName, ...args) => {
      console.log('Socket event received:', eventName, args);
    });

    newSocket.on('connection-success', (data) => {
      console.log('WhatsApp connected:', data);
      setConnectionStatus('connected');
      setStatusMessage('Successfully connected to WhatsApp!');
      setUserInfo(data.userInfo);
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setConnectionStatus('error');
      setStatusMessage(data.error || 'An error occurred');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handlePairingSubmit = async (phone, mongoUrl) => {
    try {
      setConnectionStatus('connecting');
      setStatusMessage('Establishing connection...');
      setPairingCode('');
      setUserInfo(null);
      setSessionId('');
      //Copilot Generated this shit , i will remove this part later
      const isCodespaces = window.location.hostname.includes('app.github.dev');
      const backendUrl = isCodespaces 
        ? window.location.origin.replace('-3000', '-8000') 
        : (process.env.NODE_ENV === 'production' 
            ? '' 
            : 'http://localhost:8000');
      
      const response = await fetch(`${backendUrl}/pair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, mongoUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setSessionId(data.sessionId);
        console.log('Joining session room:', data.sessionId);
        socket.emit('join-session', data.sessionId);
        console.log('Session join emitted, setting status to generating');
        setStatusMessage('Generating pairing code...');
        setConnectionStatus('generating');
      } else {
        setConnectionStatus('error');
        setStatusMessage(data.error || 'Failed to start pairing process');
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
    setSessionId('');
    setUserInfo(null);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box 
          sx={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(30px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            p: 4,
            textAlign: 'center',
            transition: 'all 0.3s ease-in-out',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              transition: 'left 0.5s',
            },
            '&:hover::before': {
              left: '100%',
            }
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box 
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.2) 0%, rgba(18, 140, 126, 0.2) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                mb: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1) rotate(5deg)'
                }
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.9)' }} />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: 700,
                mb: 1,
                background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}
            >
             Guru Ai..
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1.1rem',
                fontWeight: 400
              }}
            >
              Get ur SessionId
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
                sessionId={sessionId}
                userInfo={userInfo}
                onReset={handleReset}
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
