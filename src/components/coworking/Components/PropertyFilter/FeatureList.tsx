import React from 'react';
import styles from './PropertyFilter.module.css';
import FeatureItem from './FeatureItem';

const features = [
  'Garden', 'Kids Playground', 'Church nearby', 'Swimming Pool', 'Dinner Area',
  'Gym', '24/7 Electricity', 'Mall nearby', '24/7 Wifi', 'Supermarket nearby',
  'Cinema center', '24/7 security'
];

const FeatureList: React.FC = () => {
  return (
    <section className={styles.featureSection}>
      <h3 className={styles.featureTitle}>Click to select feature</h3>
      <div className={styles.featureGrid}>
        {features.map((feature, index) => (
          <FeatureItem key={index} label={feature} />
        ))}
      </div>
    </section>
  );
};

export default FeatureList;