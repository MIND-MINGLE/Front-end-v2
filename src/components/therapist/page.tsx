import React from 'react';
import Header from './Header';
import MainContent from './MainContent';
import Footer from '../coworking/Components/Footer/Footer';
import CopyrightFooter from '../coworking/Components/CopyrightFooter/CopyrightFooter';
import styles from './FacebookBusinessPage.module.css';

const TherapistPage: React.FC = () => {
  return (
    <div className={styles.facebookBusinessPage}>
      <Header />
      <MainContent />
      <Footer />
      <CopyrightFooter />
    </div>
  );
};

export default TherapistPage;