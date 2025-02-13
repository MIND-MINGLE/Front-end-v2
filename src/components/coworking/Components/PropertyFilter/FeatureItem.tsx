import React from 'react';
import styles from './PropertyFilter.module.css';

interface FeatureItemProps {
  label: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ label }) => {
  return (
    <div className={styles.featureItem}>
      <input type="checkbox" id={`feature-${label}`} className={styles.featureCheckbox} />
      <label htmlFor={`feature-${label}`} className={styles.featureLabel}>{label}</label>
    </div>
  );
};

export default FeatureItem;