import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; // Import useNavigate for navigation
import styles from './TherapyMatchingForm.module.css'; // Import your CSS module
import { GetAllQuestions } from '../../../api/Question/Question';
import { GetAllQuestionCategory } from '../../../api/Category/Category';

// Define TypeScript interfaces for the schema
interface Answer {
  answerId: string;
  answerContent: string;
}
interface Category {
  categoryId: string;
  categoryName: string;
  description: string;
  questions: Question[];
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions from the API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const fetchedQuestions = await GetAllQuestionCategory();
      // Ensure fetchedQuestions is an array; set to empty array if not
      if (Array.isArray(fetchedQuestions.result)) {
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
  };

  // Validate form before submission
  const validateForm = () => {
    const allQuestions = categories.flatMap((category) => category.questions);
    if (allQuestions.length === 0) return false;
    const unansweredQuestions = allQuestions.filter((q) => !responses[q.questionId]);
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

  // Thêm hàm tính phần trăm hoàn thành
  const calculateProgress = (): number => {
    const allQuestions = categories.flatMap((category) => category.questions);
    const totalQuestions = allQuestions.length;
    const answeredQuestions = Object.keys(responses).length;
    return totalQuestions === 0 ? 0 : Math.round((answeredQuestions / totalQuestions) * 100);
  };

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

        {/* Thêm Progress Bar */}
        <div className={styles.progressWrapper}>
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <div className={styles.progressInfo}>
            <span className={styles.progressText}>
              {calculateProgress()}% Completed
            </span>
            <span className={styles.questionCount}>
              {Object.keys(responses).length} / {categories.flatMap(c => c.questions).length} Questions
            </span>
          </div>
        </div>

        <p className={styles.subtitle}>
          Please answer the following questions to help us match you with the right therapist.
        </p>

        {categories.length === 0 && !loading && !error && (
          <p className={styles.subtitle}>No categories available at this time.</p>
        )}

        {categories.length > 0 && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {categories.map((category) => (
              <div key={category.categoryId} className={styles.formSection}>
                {/* Hiển thị CategoryName thay vì CategoryId */}
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

// Example Usage
const App: React.FC = () => {
  return <DynamicForm />;
};

export default App;