import React from 'react';
import styles from './TherapyMatchingForm.module.css';

interface TherapyOptionProps {
  text: string;
}

const TherapyOption: React.FC<TherapyOptionProps> = ({ text }) => {
  return (
    <div className={styles.optionButton}>
      {text}
    </div>
  );
};

export default TherapyOption;
