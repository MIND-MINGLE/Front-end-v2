/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './HistoryView.module.css';

const FilterChips: React.FC = () => {
  return (
    <nav className={styles.filterChipsCarousel}>
      <button className={styles.filterChip}>
        <div className={styles.stateLayer}>A-Z</div>
      </button>
      <button className={`${styles.filterChip} ${styles.filterChipActive}`}>
        <div className={styles.stateLayer}>
          <img src="/filterchips1.svg" alt="" className={styles.chipIcon} />
          <span className={styles.labelText}>NEWEST</span>
        </div>
      </button>
      <button className={styles.filterChip}>
        <div className={styles.stateLayer}>DATE</div>
      </button>
    </nav>
  );
};

export default FilterChips;