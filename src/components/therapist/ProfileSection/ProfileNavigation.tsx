/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './ProfileNavigation.module.css';

const ProfileNavigation: React.FC = () => {
  return (
    <nav className={styles.navigationContainer}>
      <div className={styles.navItems}>
        <div className={styles.activeNavItem}>
          <span className={styles.activeNavText}>Blog</span>
          <div className={styles.activeIndicator} />
        </div>
        <span>Pin</span>
        <span>Books</span>
        <span>Tips</span>
      </div>
      <div className={styles.moreContainer}>
        <span>More</span>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd3579f3768d2300a3d26e7ecfbfd6f82012e25a7a47c85dd1c3274c69e44d09?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.moreIcon} />
      </div>
    </nav>
  );
};

export default ProfileNavigation;