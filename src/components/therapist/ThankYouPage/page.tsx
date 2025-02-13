/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './ThankYouPage.module.css';
import HeaderProf from '../ProfessorWorkshop/Header';
import {Link} from 'react-router';

const ThankYouPage: React.FC = () => {
  return (
    <div className={styles.thankYouPage}>
      <div className={styles.headerWrapper}>
        <HeaderProf />
      </div>
      <img 
        src="/tickicon.svg" 
        alt="Payment Confirmation Icon" 
        className={styles.confirmationIcon}
      />

      <h1 className={styles.confirmationTitle}>Booking Confirmed</h1>

      <p className={styles.orderNumber}>ORDER #123456</p>

      <p className={styles.confirmationDescription}>
        Thank you John Doe for buying Candleaf. The nature is grateful to you. 
        Now that your order is confirmed it will be ready to ship in 2 days. 
        Please check your inbox in the future for your order updates.
      </p>
        <Link to="/doctor">
            <button className={styles.homeButton}>
                Back to Home
            </button>
        </Link>
    </div>
  );
};

export default ThankYouPage;