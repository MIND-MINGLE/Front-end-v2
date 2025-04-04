import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './TherapyMatchingForm.module.css';
import { GetAllQuestionCategory } from '../../../api/Category/Category';
import { CreateSurveyResult ,CreateResponseResult} from '../../../api/MatchingForm/PatientResponse';
import { Typography } from '@mui/material';
import { Category, Patient, PatientSurveyRequest, PatientResponseRequest } from '../../../interface/IAccount';


// The Form Component
const DynamicForm: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sumLoading, setSumLoading] = useState(false);
  

  // Fetch questions from the API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const fetchedQuestions = await GetAllQuestionCategory();
      if (Array.isArray(fetchedQuestions.result)) {
        console.log(fetchedQuestions.result);
        setCategories(fetchedQuestions.result);
      } else {
        console.error('GetAllQuestions did not return an array:', fetchedQuestions.result);
        setCategories([]);
        setError('Failed to load questions. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching category questions:', err);
      setCategories([]);
      setError('An error occurred while fetching questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle radio button selection
  const handleChange = (questionId: string, answerId: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: answerId }));
    setError(null); // Clear error on change
  };

  // Validate form before submission
  const validateForm = () => {
    const allQuestions = categories.flatMap((category) => category.questions);
    if (allQuestions.length === 0) return false;
    const unansweredQuestions = allQuestions.filter((q) => !responses[q.questionId]);
    if (unansweredQuestions.length > 0) {
      setError('Please answer all questions before submitting.');
      return false;
    }
    setError(null);
    return true;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setSumLoading(true); // Show loading during submission
    try {
      // Step 1: Get patient data and create survey
      const patientData = sessionStorage.getItem('patient');
      if (!patientData) {
        throw new Error('No patient data found in session storage.');
      }
      const patient: Patient = JSON.parse(patientData);
      const patientSurvey: PatientSurveyRequest = {
        patientId: patient.patientId,
        summary: "Pending New Survey", // Initial placeholder, BE will update
        createdAt: new Date(),
      };
      const patientSurveyResponse = await CreateSurveyResult(patientSurvey);
      if (patientSurveyResponse.statusCode !== 200) {
        throw new Error('Failed to create patient survey');
      }
      const patientSurveyId = patientSurveyResponse.result.patientSurveyId;
      console.log('Patient Survey Created:', patientSurveyResponse.result);

      // Step 2: Prepare and send responses
      const patientResponses: PatientResponseRequest[] = Object.entries(responses).map(([questionId, answerId]) => ({
        patientSurveyId: patientSurveyId,
        questionId: questionId,
        answerId: answerId,
        customAnswer: "N/A", // Placeholder for custom answer. We dont do that now
      }));

      const responseResult = await CreateResponseResult(patientResponses);
      if (responseResult.statusCode === 200) {
        //console.log('Responses Submitted:', responseResult.data);
        // Step 3: Navigate to summary page with results
        navigate('/seeker/patient-summary');
      } else {
        throw new Error(responseResult.message || 'Failed to submit responses');
      }
    } catch (err) {
      console.error('Submission error:', err);
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during submission. Please try again.');
      } else {
        setError('An error occurred during submission. Please try again.');
      }
    } finally {
      setSumLoading(false);
    }
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    const allQuestions = categories.flatMap((category) => category.questions);
    const totalQuestions = allQuestions.length;
    const answeredQuestions = Object.keys(responses).length;
    return totalQuestions === 0 ? 0 : Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // Loading state for questions
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Mental Health Assessment</h1>
          <hr className={styles.divider} />
          <p className={styles.subtitle}>Loading questions, please wait...</p>
        </div>
      </div>
    );
  }
  // Loading state for Summary
  if (sumLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Mental Health Assessment</h1>
          <hr className={styles.divider} />
          <p className={styles.subtitle}>We are preparing your result. Please wait calmly...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Mental Health Assessment</h1>
          <hr className={styles.divider} />
          <p className={styles.subtitle} style={{ color: 'red' }}>{error}</p>
          <button onClick={fetchQuestions} className={styles.submitButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Mental Health Assessment</h1>
        <hr className={styles.divider} />
        <div className={styles.progressWrapper}>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${calculateProgress()}%` }} />
          </div>
          <div className={styles.progressInfo}>
            <span className={styles.progressText}>{calculateProgress()}% Completed</span>
            <span className={styles.questionCount}>
              {Object.keys(responses).length} / {categories.flatMap((c) => c.questions).length} Questions
            </span>
          </div>
        </div>
        <p className={styles.subtitle}>
          Please answer the following questions to help us match you with the right therapist.
        </p>
        {categories.length === 0 && (
          <p className={styles.subtitle}>No categories available at this time.</p>
        )}
        {categories.length > 0 && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {categories.map((category) => (
              <div key={category.categoryId} className={styles.formSection}>
                <h2 className={styles.sectionTitle}>~{category.categoryName}~</h2>
                {category.questions.map((question) => (
                  <div key={question.questionId} className={styles.formGroup}>
                    <label className={styles.formLabel}>{question.questionContent}</label>
                    <div className={styles.radioGroup}>
                      {question.answers.map((answer) => (
                        <label key={answer.answerId} className={styles.radioLabel}>
                          <input
                            type="radio"
                            name={question.questionId}
                            value={answer.answerId}
                            checked={responses[question.questionId] === answer.answerId}
                            onChange={() => handleChange(question.questionId, answer.answerId)}
                            className={styles.radioInput}
                            required
                          />
                          {answer.answerContent}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ... (HasAppointmentForm and TherapyMatchingForm unchanged)

function HasAppointmentForm() {
  const navigate = useNavigate();
  const gotoChatPage = () => navigate('therapy-chat');
  const gotoHistory = () => navigate('history');
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Mental Health Assessment</h1>
        <hr className={styles.divider} />
        <Typography marginBottom={2} className={styles.subtitle}>
          You already have an appointment with your doctor. No need to fill the form again.
        </Typography>
        <div className={styles.buttonContainer}>
          <button onClick={gotoChatPage} className={styles.submitButton}>
            Go To Chat Page
          </button>
          <button onClick={gotoHistory} className={styles.submitButton}>
            See Your Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

interface TherapyMatchingFormProps {
  isAppointment: boolean;
}

export default function TherapyMatchingForm({ isAppointment }: TherapyMatchingFormProps) {
  return isAppointment ? <HasAppointmentForm /> : <DynamicForm />;
}