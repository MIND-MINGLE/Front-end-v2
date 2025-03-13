import React, { useState, useEffect } from 'react';
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
const groupQuestionsByCategory = (questions: Question[]) => {
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  // Fetch questions from the API
  const fetchQuestions = async () => {
    try {
      const response = await GetAllQuestions();
      setQuestions(response.result);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle radio button selection
  const handleChange = (questionId: string, answerId: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: answerId }));
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('User Responses:', responses);
    // Here, you can send `responses` to an API or process it further
  };

  // Group questions by category for sectioned layout
  const groupedQuestions = groupQuestionsByCategory(questions);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Mental Health Assessment</h1>
        <hr className={styles.divider} />
        <p className={styles.subtitle}>
          Please answer the following questions to help us match you with the right therapist.
        </p>

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
      </div>
    </div>
  );
};

// Example Usage
const App: React.FC = () => {
  return <DynamicForm />;
};

export default App;
