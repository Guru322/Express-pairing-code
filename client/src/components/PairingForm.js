import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const PairingForm = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  const validateForm = () => {
    const newErrors = {};

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{10,14}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number with country code';
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
      await onSubmit(phone.replace(/\s/g, ''));
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
            color: theme.palette.text.primary,
            fontWeight: 500,
            textAlign: 'center',
            mb: 1
          }}
        >
          Enter your phone number
        </Typography>

        <TextField
          fullWidth
          label="Phone number"
          placeholder="919876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone || 'Include country code without + sign'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.background.paper,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
            },
            '& .MuiInputLabel-root': {
              color: theme.palette.text.secondary,
              '&.Mui-focused': {
                color: theme.palette.primary.main
              }
            },
            '& .MuiFormHelperText-root': {
              color: errors.phone ? theme.palette.error.main : theme.palette.text.secondary
            }
          }}
        />

        <Card variant="outlined" sx={{ 
          backgroundColor: theme.palette.mode === 'light' ? '#f8f9fa' : theme.palette.background.default, 
          border: `1px solid ${theme.palette.divider}` 
        }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 20, mt: 0.1 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 500, color: theme.palette.text.primary, mb: 1 }}>
                  How it works
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.5 }}>
                  • Enter your phone number with country code<br/>
                  • Get a pairing code to link your device<br/>
                  • Open WhatsApp → Settings → Linked Devices<br/>
                  • Enter the code to complete pairing<br/>
                  • Session will be sent to you via WhatsApp
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          endIcon={<SendIcon />}
          sx={{ 
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 500,
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            boxShadow: '0 2px 4px rgba(26, 26, 26, 0.4)',
            '&:hover': {
              backgroundColor: '#000000',
              boxShadow: '0 4px 8px rgba(26, 26, 26, 0.6)',
            },
            '&:disabled': {
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
              boxShadow: 'none'
            }
          }}
        >
          {isSubmitting ? 'Generating...' : 'Generate pairing code'}
        </Button>
      </Box>
    </Box>
  );
};

export default PairingForm;
