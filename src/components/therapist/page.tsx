import React, { useEffect } from 'react';
import Header from './Header';
import MainContent from './MainContent';
import Footer from '../coworking/Components/Footer/Footer';
import CopyrightFooter from '../coworking/Components/CopyrightFooter/CopyrightFooter';
import styles from './FacebookBusinessPage.module.css';
import { AccountProps } from '../../interface/IAccount';
import { getTherapistById } from '../../api/Therapist/Therapist';

const TherapistPage: React.FC = () => {
  useEffect(() => {
    const getPatient = async() => {
        const localData = sessionStorage.getItem('patient');
        if(!localData){
            const sessionAccount = sessionStorage.getItem('account');
            if(sessionAccount){
                const data:AccountProps = JSON.parse(sessionAccount)
                const therapistData = await getTherapistById(data.UserId)
                if(therapistData.statusCode === 200){
                    sessionStorage.setItem('therapist', JSON.stringify(therapistData.result))
                }
            }
           
        }
    }
    getPatient()
},[])
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