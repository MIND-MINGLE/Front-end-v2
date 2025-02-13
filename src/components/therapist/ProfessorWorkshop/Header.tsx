/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './Header.module.css';
import Link from 'next/link';

const HeaderProf: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link href="/ProfessorPage">
        <button className={styles.backButton} aria-label="Back to home">
          <img src="/Logo.png" alt="Company logo" className={styles.logo} />
        </button>
      </Link>
    </header>
  );
};

export default HeaderProf;