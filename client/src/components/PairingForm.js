import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import StorageIcon from '@mui/icons-material/Storage';
import SendIcon from '@mui/icons-material/Send';

const PairingForm = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');
  const [mongoUrl, setMongoUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{10,14}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number with country code';
    }

    if (!mongoUrl.trim()) {
      newErrors.mongoUrl = 'MongoDB connection URL is required';
    } else if (!mongoUrl.startsWith('mongodb://') && !mongoUrl.startsWith('mongodb+srv://')) {
      newErrors.mongoUrl = 'Please enter a valid MongoDB connection URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(phone.replace(/\s/g, ''), mongoUrl.trim());
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 600,
            textAlign: 'center',
            mb: 2
          }}
        >
          Enter Ur Details
        </Typography>

        <TextField
          fullWidth
          label="Phone Number"
          placeholder="+9176059020xx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone || 'Enter your phone number with country code'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: '2px',
              },
              color: 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease'
            }
          }}
          InputLabelProps={{
            sx: { 
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: 'rgba(255, 255, 255, 0.9)'
              }
            }
          }}
          FormHelperTextProps={{
            sx: { color: 'rgba(255, 255, 255, 0.6)' }
          }}
          variant="outlined"
          required
        />

        <TextField
          fullWidth
          label="MongoDB Connection URL"
          placeholder="mongodb+srv://guru:password@cluster.mongodb.net/"
          value={mongoUrl}
          onChange={(e) => setMongoUrl(e.target.value)}
          error={!!errors.mongoUrl}
          helperText={errors.mongoUrl || 'Your MongoDB connection string'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <StorageIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: '2px',
              },
              color: 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease'
            }
          }}
          InputLabelProps={{
            sx: { 
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: 'rgba(255, 255, 255, 0.9)'
              }
            }
          }}
          FormHelperTextProps={{
            sx: { color: 'rgba(255, 255, 255, 0.6)' }
          }}
          variant="outlined"
          type="password"
          required
        />

        <Box 
          sx={{ 
            p: 3, 
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            textAlign: 'left'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
            📱 Quick Guide
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
            1. Enter your phone number with country code<br/>
            2. Add your MongoDB connection URL<br/>
            3. Click "Generate Code" and wait<br/>
            4. Enter code in WhatsApp<br/>
            5. Your session will be stored securely
          </Typography>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          endIcon={<SendIcon />}
          sx={{ 
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.8) 0%, rgba(18, 140, 126, 0.8) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.9) 0%, rgba(18, 140, 126, 0.9) 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(37, 211, 102, 0.3)'
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.5)',
              transform: 'none',
              boxShadow: 'none'
            }
          }}
        >
          {isSubmitting ? 'Connecting...' : 'Generate Pairing Code'}
        </Button>
      </Box>
    </Box>
  );
};

export default PairingForm;
