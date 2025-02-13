import React from 'react';
import styles from './NotificationComponent.module.css';

interface SectionHeaderProps {
  title?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title = "New" }) => {
  return (
    <header className={styles.sectionHeader}>
      {title === "New" ? (
        <>
          <div className={styles.headerLeft}>
            <nav className={styles.headerNav}>
              <button className={styles.headerButton}>All</button>
              <button className={styles.headerButton}>Unread</button>
            </nav>
            <h2 className={styles.headerTitle}>{title}</h2>
          </div>
          <button className={styles.seeAllButton}>See all</button>
        </>
      ) : (
        <>
          <h2 className={styles.headerTitle}>{title}</h2>
          <button className={styles.seeAllButton}>See all</button>
        </>
      )}
    </header>
  );
};

export default SectionHeader;