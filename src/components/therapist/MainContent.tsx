import React from 'react';
import ProfileSection from './ProfileSection/ProfileSection';
import PostSection from './PostSection';
import styles from './MainContent.module.css';

const MainContent: React.FC = () => {
  
  return (
    <main className={styles.mainContent}>
      <ProfileSection />
      <PostSection />
    </main>
  );
};

export default MainContent;