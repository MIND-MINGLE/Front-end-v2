/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './EventHeader.module.css';

const EventHeader: React.FC = () => {
  return (
    <section className={styles.header}>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef3d59351bb8a2f9c3742a0cc7ce2700fe29cdb9adc1a46fd39152dd1a439280?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Event" className={styles.eventImage} />
      <div className={styles.eventDetails}>
        <div className={styles.headlineSupportingText}>
          <h2 className={styles.headline}>Event Name</h2>
          <p className={styles.publishedDate}>Published date</p>
          <p className={styles.supportingText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            <br /><br />
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.joinButton}>Join</button>
          <button className={styles.locationButton}>Location</button>
        </div>
      </div>
    </section>
  );
};

export default EventHeader;