
import React from 'react';
import styles from './FeedbackComponent.module.css';

interface FeedbackComponentProps {
  onClose: () => void; // Define the onClose prop
}

const FeedbackComponent: React.FC<FeedbackComponentProps> = ({ onClose }) => {
  return (
    <section className={styles.feedbackContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.headerTitle}>Send us your feedback</h2>
          <p className={styles.headerDescription}>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
          </p>
        </div>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d339e13d3d3d99cf5113febb8b3fede72c5f855f95984e578704e2eedd2daa8e?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.headerIcon} />
      </header>

      <div className={styles.ratingSection}>
        <h3 className={styles.ratingTitle}>How was your rating</h3>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/dffa85b994516f43921d3508d1b752b84c2843c0f025df23ac2283f53113a02f?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Rating stars" className={styles.ratingStars} />
      </div>

      <form className={styles.feedbackSection}>
        <label htmlFor="feedbackInput" className={styles.feedbackTitle}>Give us your feedback</label>
        <textarea
          id="feedbackInput"
          className={styles.feedbackInput}
          placeholder="Enter your experience here..."
          aria-label="Enter your feedback"
        />
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.submitButton}>Send Feedback</button>
        </div>
      </form>
    </section>
  );
};

export default FeedbackComponent;
