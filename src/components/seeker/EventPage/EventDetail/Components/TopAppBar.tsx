/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './TopAppBar.module.css';
import {Link} from 'react-router';

const TopAppBar: React.FC = () => {
  return (
    <header className={styles.topAppBar}>
      <div className={styles.leadingTrailingIcons}>
        <Link to="/SeekerPage/EventPage">
            <button className={styles.leadingIcon} aria-label="Menu">
            <img src="/topappbar1.svg" alt="" className={styles.iconImage} />
            </button>
        </Link>
        <img src="/topappbar2.svg" alt="Logo" className={styles.logo} />
      </div>
      <h1 className={styles.headline}>Therapy Events</h1>
    </header>
  );
};

export default TopAppBar;