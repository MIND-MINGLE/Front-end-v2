import React from 'react';
import styles from './PropertyFilter.module.css';

interface SelectFieldProps {
  label: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label }) => {
  return (
    <div className={styles.fieldWrapper}>
      <label htmlFor={`select-${label}`} className={styles.fieldLabel}>{label}</label>
      <div className={styles.selectWrapper}>
        <select id={`select-${label}`} className={styles.selectField}>
          <option value="">Select</option>
        </select>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a3e0b814872bd92e642fb95ff07e1a7a0d717cf3e8277635457748cd9316cfb?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.selectArrow} />
      </div>
    </div>
  );
};

export default SelectField;