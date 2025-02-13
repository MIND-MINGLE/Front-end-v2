/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './ProfessorWorkshop.module.css';
import Footer from '@/app/LandingPage/Components/Footer/Footer';
import CopyrightFooter from '@/app/LandingPage/Components/CopyrightFooter/CopyrightFooter';
import HeaderProf from './Header';

const ProfessorWorkshop: React.FC = () => {
  return (
    <main className={styles.professorWorkshop}>
      <HeaderProf />
      <img 
        src="/professor-workshop.png" 
        alt="Professor Workshop Banner" 
        className={styles.bannerImage} 
      />
      <Footer />
      <CopyrightFooter />
    </main>
  );
};

export default ProfessorWorkshop;