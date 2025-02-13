import React from 'react';
import styles from './PropertyFilter.module.css';

interface PriceFieldProps {
  label: string;
}

const PriceField: React.FC<PriceFieldProps> = ({ label }) => {
  return (
    <div className={styles.fieldWrapper}>
      <label htmlFor="price-range" className={styles.fieldLabel}>{label}</label>
      <div className={styles.priceWrapper}>
        <input type="text" id="price-range" className={styles.priceField} placeholder="Choose price" />
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/84a110a4b133c3c6850c96016475b563eba04fa21c7cbfd3d9fe2bdf81a7b63a?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.priceIcon} />
      </div>
    </div>
  );
};

export default PriceField;