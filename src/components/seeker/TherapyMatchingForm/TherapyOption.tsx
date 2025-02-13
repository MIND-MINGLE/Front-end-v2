import React from 'react';
import styles from './TherapyMatchingForm.module.css';

interface TherapyOptionProps {
  text: string;
}

const TherapyOption: React.FC<TherapyOptionProps> = ({ text }) => {
  return (
    <button className={styles.optionButton}>
      {text}
    </button>
  );
};

export default TherapyOption;