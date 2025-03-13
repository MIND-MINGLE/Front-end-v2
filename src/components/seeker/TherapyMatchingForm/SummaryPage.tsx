import React from 'react';
import styles from './SummaryPage.module.css';

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
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Your Assessment Summary</h1>
        <hr className={styles.divider} />
        <p className={styles.subtitle}>
          Based on your responses, we've prepared the following summary to help guide your therapy journey.
        </p>

        <div className={styles.summaryCard}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Assessment Results</h2>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Depression:</span>
              <span className={styles.resultValue}>{formData?.depression}</span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Anxiety:</span>
              <span className={styles.resultValue}>{formData?.anxiety}</span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Trauma:</span>
              <span className={styles.resultValue}>{formData?.trauma}</span>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Concerns</h2>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Main Concern:</span>
              <span className={styles.resultValue}>{formData?.concern}</span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Interference Level:</span>
              <span className={styles.resultValue}>{formData?.interference}</span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Urgency:</span>
              <span className={styles.resultValue}>{formData?.urgency}</span>
            </div>
          </div>

          <div className={styles.recommendationBox}>
            <h2 className={styles.sectionTitle}>Our Recommendation</h2>
            <p className={styles.recommendationText}>
              Consider a therapist specializing in depression and stress management.
            </p>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.primaryButton}>Find a Therapist</button>
          <button className={styles.secondaryButton}>Save Summary</button>
        </div>

        <div className={styles.infoBox}>
          <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <p className={styles.infoText}>
            This assessment is a starting point. Your therapist will conduct a more thorough evaluation during your first session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
