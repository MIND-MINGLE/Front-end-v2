import React from 'react';
import styles from './SummaryPage.module.css';

const SummaryPage: React.FC = () => {
  // Simulate data received from backend or state
  const formData = {
    depression: 'Moderate (PHQ-9: 5)',
    anxiety: 'Mild (GAD-7: 4)',
    trauma: 'Low (PC-PTSD-5: 1)',
    concern: 'Stress',
    interference: '3 (Moderately)',
    urgency: 'Low',
  };

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Assessment Summary</h1>
        <div className={styles.summary}>
          <p><strong>Depression:</strong> {formData.depression}</p>
          <p><strong>Anxiety:</strong> {formData.anxiety}</p>
          <p><strong>Trauma:</strong> {formData.trauma}</p>
          <p><strong>Main Concern:</strong> {formData.concern}</p>
          <p><strong>Interference Level:</strong> {formData.interference}</p>
          <p><strong>Urgency:</strong> {formData.urgency}</p>
          <p><strong>Recommendation:</strong> Consider a therapist specializing in depression and stress management.</p>
        </div>
      </div>
    </section>
  );
};

export default SummaryPage;