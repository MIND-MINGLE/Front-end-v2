import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; // Import useNavigate for navigation
import styles from './TherapyMatchingForm.module.css'; // Import your CSS module
import { GetAllQuestions } from '../../../api/Question/Question';

// Define TypeScript interfaces for the schema
interface Answer {
  answerId: string;
  answerContent: string;
}

interface Question {
  questionId: string;
  questionContent: string;
  categoryId: string;
  createdAt: string;
  answers: Answer[];
}

// Helper function to group questions by categoryId
const groupQuestionsByCategory = (questions: Question[]): { [key: string]: Question[] } => {
  // Ensure questions is an array; return empty object if not
  if (!Array.isArray(questions)) {
    console.warn('groupQuestionsByCategory: Expected an array, received:', questions);
    return {};
  }

  return questions.reduce((acc, question) => {
    const category = question.categoryId;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(question);
    return acc;
  }, {} as { [key: string]: Question[] });
};

// The Form Component
const DynamicForm: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions from the API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const fetchedQuestions = await GetAllQuestions();
      // Ensure fetchedQuestions is an array; set to empty array if not
      if (Array.isArray(fetchedQuestions.result)) {
        setQuestions(fetchedQuestions.result);
      } else {
        console.error('GetAllQuestions did not return an array:', fetchedQuestions.result);
        setQuestions([]);
        setError('Failed to load questions. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setQuestions([]);
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
  };

  // Validate form before submission
  const validateForm = () => {
    if (questions.length === 0) return false;
    const unansweredQuestions = questions.filter((q) => !responses[q.questionId]);
    if (unansweredQuestions.length > 0) {
      alert('Please answer all questions before submitting.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    console.log('User Responses:', responses);
    // Navigate to summary page after submission
    navigate('patient-summary', { state: { responses } });
  };

  // Group questions by category for sectioned layout
  const groupedQuestions = groupQuestionsByCategory(questions);

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Mental Health Assessment</h1>
          <hr className={styles.divider} />
          <p className={styles.subtitle} style={{ color: 'red' }}>
            {error}
          </p>
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
        <p className={styles.subtitle}>
          Please answer the following questions to help us match you with the right therapist.
        </p>

        {questions.length === 0 && !loading && !error && (
          <p className={styles.subtitle}>No questions available at this time.</p>
        )}

        {questions.length > 0 && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {Object.entries(groupedQuestions).map(([categoryId, categoryQuestions]) => (
              <div key={categoryId} className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Category {categoryId}</h2>
                {categoryQuestions.map((question) => (
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
                            required // Ensure browser validation
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

// Example Usage
const App: React.FC = () => {
  return <DynamicForm />;
};

export default App;