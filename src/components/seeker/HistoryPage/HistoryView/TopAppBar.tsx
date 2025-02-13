/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './HistoryView.module.css';

const TopAppBar: React.FC = () => {
  return (
    <header className={styles.topAppBar}>
      <div className={styles.leadingTrailingIcons}>
          <button className={styles.leadingIcon} aria-label="Menu">
              <div className={styles.container}>
                  <div className={styles.stateLayer}>
                  <img src="/topappbar1.svg" alt="" className={styles.iconImage} />
                  </div>
              </div>
          </button>
        <img src="/topappbar2.svg" alt="Logo" className={styles.logo} />
      </div>
      <h1 className={styles.headline}>History</h1>
    </header>
  );
};

export default TopAppBar;