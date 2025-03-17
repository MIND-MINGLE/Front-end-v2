// src/pages/SummaryPage.tsx
import React from 'react';
import {
  Box,
  Button,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router';

interface SummaryPageProps {
  formData: {
    depression: string;
    anxiety: string;
    trauma: string;
    concern: string;
    interference: string;
    urgency: string;
  };
}

const SummaryPage: React.FC<SummaryPageProps> = ({ formData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const nav = useNavigate()
  const gotoConnector = ()=>{
    nav("../connector")
  }
  return (
    <Box
      sx={{
        backgroundColor: '#f8f9fa',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '750px',
        margin: '30px auto',
        padding: { xs: '20px 15px', md: '30px' },
        fontFamily: "'Roboto', sans-serif",
        color: '#333',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '15px',
            color: '#2c3e50',
          }}
        >
          Your Assessment Summary
        </Typography>

        <Divider
          sx={{
            width: '100%',
            height: '2px',
            background: 'linear-gradient(to right, transparent, #3498db, transparent)',
            margin: '20px 0',
            border: 'none',
          }}
        />

        <Typography
          variant="subtitle1"
          sx={{
            fontSize: '18px',
            textAlign: 'center',
            marginBottom: '30px',
            color: '#555',
            lineHeight: 1.5,
          }}
        >
          Based on your responses, we've prepared the following summary to help guide your therapy journey.
        </Typography>

        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            padding: { xs: '15px', md: '25px' },
            width: '100%',
            marginBottom: '30px',
          }}
        >
          <Box sx={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '22px',
                fontWeight: 600,
                marginBottom: '15px',
                color: '#2c3e50',
                borderLeft: '4px solid #3498db',
                paddingLeft: '10px',
              }}
            >
              Assessment Results
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                padding: '8px 10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
              }}
            >
              <Typography sx={{ fontWeight: 500, color: '#555' }}>Depression:</Typography>
              <Typography sx={{ fontWeight: 600, color: '#2c3e50' }}>{formData?.depression}</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                padding: '8px 10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
              }}
            >
              <Typography sx={{ fontWeight: 500, color: '#555' }}>Anxiety:</Typography>
              <Typography sx={{ fontWeight: 600, color: '#2c3e50' }}>{formData?.anxiety}</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                padding: '8px 10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
              }}
            >
              <Typography sx={{ fontWeight: 500, color: '#555' }}>Trauma:</Typography>
              <Typography sx={{ fontWeight: 600, color: '#2c3e50' }}>{formData?.trauma}</Typography>
            </Box>
          </Box>

          <Box sx={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '22px',
                fontWeight: 600,
                marginBottom: '15px',
                color: '#2c3e50',
                borderLeft: '4px solid #3498db',
                paddingLeft: '10px',
              }}
            >
              Your Concerns
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                padding: '8px 10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
              }}
            >
              <Typography sx={{ fontWeight: 500, color: '#555' }}>Main Concern:</Typography>
              <Typography sx={{ fontWeight: 600, color: '#2c3e50' }}>{formData?.concern}</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                padding: '8px 10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
              }}
            >
              <Typography sx={{ fontWeight: 500, color: '#555' }}>Interference Level:</Typography>
              <Typography sx={{ fontWeight: 600, color: '#2c3e50' }}>{formData?.interference}</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                padding: '8px 10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
              }}
            >
              <Typography sx={{ fontWeight: 500, color: '#555' }}>Urgency:</Typography>
              <Typography sx={{ fontWeight: 600, color: '#2c3e50' }}>{formData?.urgency}</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              backgroundColor: '#e8f4fd',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '10px',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: '22px',
                fontWeight: 600,
                marginBottom: '15px',
                color: '#2c3e50',
                borderLeft: '4px solid #3498db',
                paddingLeft: '10px',
              }}
            >
              Our Recommendation
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                lineHeight: 1.5,
                color: '#2980b9',
              }}
            >
              Consider a therapist specializing in depression and stress management.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '15px',
            margin: '25px 0',
            width: '100%',
            justifyContent: 'center',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Button
          onClick={()=>{gotoConnector()}}
            sx={{
              background: 'linear-gradient(to right, #3498db, #2980b9)',
              color: 'white',
              borderRadius: '30px',
              padding: '14px 30px',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              width: { xs: '100%', md: 'auto' },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(41, 128, 185, 0.3)',
                background: 'linear-gradient(to right, #3498db, #2980b9)',
              },
            }}
          >
            Find a Therapist
          </Button>

          <Button
            sx={{
              backgroundColor: 'white',
              color: '#3498db',
              border: '2px solid #3498db',
              borderRadius: '30px',
              padding: '12px 28px',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              width: { xs: '100%', md: 'auto' },
              '&:hover': {
                backgroundColor: '#f1f9ff',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Save Summary
          </Button>
        </Box>

        <Box
          sx={{
            backgroundColor: '#e8f4fd',
            borderLeft: '4px solid #3498db',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '600px',
            color: '#2980b9',
            margin: '25px auto',
            padding: '15px 20px',
            borderRadius: '6px',
          }}
        >
          <InfoIcon sx={{ width: '24px', marginRight: '15px', color: '#3498db' }} />
          <Typography
            sx={{
              flex: 1,
              fontSize: '15px',
              lineHeight: 1.5,
            }}
          >
            This assessment is a starting point. Your therapist will conduct a more thorough evaluation during your first session.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SummaryPage;