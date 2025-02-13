/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './EventView.module.css';
import {Link} from 'react-router';

const TopAppBar: React.FC = () => {
  return (
    <header className={styles.topAppBar}>
      <div className={styles.leadingTrailingIcons}>
        <button className={styles.leadingIcon} aria-label="Menu">
          <div className={styles.container}>
            <Link to="/seeker">
              <div className={styles.stateLayer}>
                <img src="/topappbar1.svg" alt="" className={styles.iconImage} />
              </div>
            </Link>
          </div>
        </button>
        <img src="/topappbar2.svg" alt="Logo" className={styles.logo} />
      </div>
      <h1 className={styles.headline}>Therapy Event</h1>
    </header>
  );
};

export default TopAppBar;