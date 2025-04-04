import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../../../interface/IAccount';
import { getLatestPatientSurvey } from '../../../api/MatchingForm/PatientResponse';

const SummaryPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [surveyData, setSurveyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch latest survey on mount
  useEffect(() => {
    const fetchLatestSurvey = async () => {
      try {
        const patientData = sessionStorage.getItem('patient');
        if (!patientData) {
          throw new Error('No patient data found in session storage');
        }
        const patient: Patient = JSON.parse(patientData);
        const response = await getLatestPatientSurvey(patient.patientId);
        if (response.statusCode === 200) {
          setSurveyData(response.result);
        } else {
          throw new Error(response.message || 'Failed to fetch survey');
        }
      } catch (err:any) {
        setError(err.message || 'Error fetching your latest assessment');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSurvey();
  }, []);

  // Parse summary into diagnoses
  const diagnoses = surveyData?.summary
    ? surveyData.summary.split('; ').reduce((acc: { [key: string]: string }, item: string) => {
        const [category, diag] = item.split(': ');
        acc[category.toLowerCase()] = diag;
        return acc;
      }, {})
    : {};

  // Calculate scores by category based on questionId prefixes
  const scoreMap = surveyData?.patientResponses
    ? surveyData.patientResponses.reduce((acc: { [key: string]: number }, resp: any) => {
        let categoryName: string;
        if (resp.questionId.startsWith('b6319') || resp.questionId.startsWith('b6570') || resp.questionId.startsWith('e5e67')) {
          categoryName = 'phq9'; // PHQ-9
        } else if (resp.questionId.startsWith('7b5d4') || resp.questionId.startsWith('d94e2')) {
          categoryName = 'gad7'; // GAD-7
        } else {
          categoryName = 'pcptsd5'; // PC-PTSD-5
        }
        acc[categoryName] = (acc[categoryName] || 0) + resp.score;
        return acc;
      }, {})
    : {};

  const gotoConnector = () => {
    navigate('../connector');
  };

  const handleSaveSummary = () => {
    if (!surveyData) {
      alert('No summary data available to save.');
      return;
    }

    const content = `
Mental Health Assessment Summary
Patient Survey ID: ${surveyData.patientSurveyId || 'N/A'}

Assessment Results:
- Depression (PHQ-9): ${diagnoses['phq9'] || 'N/A'} (Score: ${scoreMap['phq9'] || 'N/A'}/10)
- Anxiety (GAD-7): ${diagnoses['gad7'] || 'N/A'} (Score: ${scoreMap['gad7'] || 'N/A'}/10)
- Trauma (PC-PTSD-5): ${diagnoses['pcptsd5'] || 'N/A'} (Score: ${scoreMap['pcptsd5'] || 'N/A'}/10)

Recommendation:
Consider a therapist specializing in your assessed needs based on the above results.

Note: This is a preliminary assessment. A full evaluation will be conducted by your therapist.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mental_Health_Summary_${surveyData.patientSurveyId || 'Unknown'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', margin: '30px auto', maxWidth: '750px' }}>
        <Typography variant="h5">Loading your summary...</Typography>
      </Box>
    );
  }

  if (error || !surveyData) {
    return (
      <Box sx={{ textAlign: 'center', margin: '30px auto', maxWidth: '750px' }}>
        <Typography variant="h5" color="error">
          {error || 'No summary data available. Please complete the assessment first.'}
        </Typography>
        <Button
          onClick={() => navigate(-1)}
          sx={{ mt: 2, backgroundColor: '#3498db', color: 'white' }}
        >
          Go Back
        </Button>
      </Box>
    );
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
              <Typography sx={{ fontWeight: 500, color: '#555' }}>Depression (PHQ-9):</Typography>
              <Typography sx={{ fontWeight: 600, color: '#2c3e50' }}>
                {diagnoses['phq9'] || 'N/A'} ({scoreMap['phq9'] || 'N/A'}/10)
              </Typography>
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
              <Typography sx={{ fontWeight: 500, color: '#555' }}>Anxiety (GAD-7):</Typography>
              <Typography sx={{ fontWeight: 600, color: '#2c3e50' }}>
                {diagnoses['gad7'] || 'N/A'} ({scoreMap['gad7'] || 'N/A'}/10)
              </Typography>
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
              <Typography sx={{ fontWeight: 500, color: '#555' }}>Trauma (PC-PTSD-5):</Typography>
              <Typography sx={{ fontWeight: 600, color: '#2c3e50' }}>
                {diagnoses['pcptsd5'] || 'N/A'} ({scoreMap['pcptsd5'] || 'N/A'}/10)
              </Typography>
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
              Based on your results, consider a therapist specializing in{' '}
              {Object.values(diagnoses)
                .filter((d) => d !== 'No Depression' && d !== 'No Anxiety' && d !== 'PTSD Unlikely')
                .join(' and ') || 'your assessed needs'}.
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
            onClick={gotoConnector}
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
            onClick={handleSaveSummary}
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