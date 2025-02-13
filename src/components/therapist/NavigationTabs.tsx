/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './NavigationTabs.module.css';

const NavigationTabs: React.FC = () => {
  const tabs = ['Blog', 'Pin', 'Books', 'Tips', 'More'];

  return (
    <nav className={styles.navigationTabs}>
      {tabs.map((tab, index) => (
        <button key={index} className={`${styles.tab} ${index === 0 ? styles.activeTab : ''}`}>
          {tab}
          {index === tabs.length - 1 && (
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd3579f3768d2300a3d26e7ecfbfd6f82012e25a7a47c85dd1c3274c69e44d09?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="More options" className={styles.moreIcon} />
          )}
        </button>
      ))}
    </nav>
  );
};

export default NavigationTabs;