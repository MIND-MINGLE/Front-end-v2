import React from 'react';
import styles from './EventDetails.module.css';
import TopAppBar from './TopAppBar';
import EventHeader from './EventHeader';
import RelatedEvents from './RelatedEvents';

const EventDetails: React.FC = () => {
  return (
    <div className={styles.contentWrapper}>
        <TopAppBar />
        <section className={styles.content}>
            <EventHeader />
            <RelatedEvents />
        </section>
    </div>
  );
};

export default EventDetails;