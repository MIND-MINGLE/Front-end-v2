/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './TherapyMatchingForm.module.css';
import TherapyOption from './TherapyOption';

const therapyOptions = [
  "Individual Therapy (I want to do this for myself)",
  "Group Therapy (I want to do this for me and others)",
  "Not Sure (Just wander around for now)"
];

interface TherapyMatchingFormProps {
    onClick: () => void;
  }

const TherapyMatchingForm: React.FC<TherapyMatchingFormProps> = ({ onClick }) => {
  return (
    <section className={styles.container} onClick={onClick}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Help us match the right therapist <br /> For You!
        </h1>
        <hr className={styles.divider} />
        <h2 className={styles.subtitle}>
          What type of therapy you are looking for?
        </h2>
        {therapyOptions.map((option, index) => (
          <TherapyOption key={index} text={option} />
        ))}
        <div className={styles.infoBox}>
          <img 
            src="/info.svg" 
            alt="" 
            className={styles.infoIcon} 
          />
          <p className={styles.infoText}>
            The questions provided to you are to help us know more about you, and how we can search the best-suited therapist.
          </p>
        </div>
      </div>
      <img 
        src="/Logo3.png" 
        alt="Company Logo" 
        className={styles.logo} 
      />
    </section>
  );
};

export default TherapyMatchingForm;