import React from 'react';
import styles from './PropertyFilter.module.css';
import FilterForm from './FilterForm';
import FeatureList from './FeatureList';

const PropertyFilter: React.FC = () => {
  return (
    <section className={styles.filterScreen}>
      <div className={styles.filterContainer}>
        <FilterForm />
        <FeatureList />
      </div>
    </section>
  );
};

export default PropertyFilter;