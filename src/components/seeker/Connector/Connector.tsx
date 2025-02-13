/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from '../css/Connector.module.css';


const TherapistConnector: React.FC = () => {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Connecting you to our<br/> therapists...</h1>
        <hr className={styles.divider} />
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/51ee815b-c1d0-471a-bf33-f5ec662bb330?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" 
          alt="Therapist connecting illustration" 
          className={styles.therapistImage} 
        />
        <section className={styles.notificationBox}>
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1b9807ebee755468a3fb81207ebd412a50e0cb284eb684abe2b1aed05d0d07c5?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" 
            alt="" 
            className={styles.notificationIcon} 
          />
          <p className={styles.notificationText}>
            Therapists are preparing, please wait calmly...
            <br />
            We hope you will enjoy our services
          </p>
        </section>
      </div>
      <img 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/377e1a51022db1b76a69c4c9c4af3b2cd0d7868d382918e7489d101bd0ab9be4?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" 
        alt="Company logo" 
        className={styles.logo} 
      />
    </main>
  );
};

export default TherapistConnector;