import React from 'react';
import styles from './PropertyFilter.module.css';

interface DateFieldProps {
  label: string;
}

const DateField: React.FC<DateFieldProps> = ({ label }) => {
  return (
    <div className={styles.fieldWrapper}>
      <label htmlFor={`date-${label}`} className={styles.fieldLabel}>{label}</label>
      <input
        type="date"
        id={`date-${label}`}
        className={styles.dateField}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default DateField;