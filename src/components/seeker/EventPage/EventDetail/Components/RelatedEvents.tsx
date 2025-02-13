/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './RelatedEvents.module.css';

interface RelatedEvent {
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
}

const RelatedEvents: React.FC = () => {
  const events: RelatedEvent[] = [
    {
      title: "Title",
      description: "Description duis aute irure dolor in reprehenderit in voluptate velit.",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/f7395ef08f6123d0e5281367e488e7011ee3b7c501a41d830825cac3a9ee6ca1?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      date: "Today",
      time: "23 min"
    },
    {
      title: "Title",
      description: "Description duis aute irure dolor in reprehenderit in voluptate velit.",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/f7395ef08f6123d0e5281367e488e7011ee3b7c501a41d830825cac3a9ee6ca1?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      date: "Today",
      time: "23 min"
    },
    {
      title: "Title",
      description: "",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/ca046a62429c37a5d23bb1958ac42ad182f0ee37fd489e5948612e413e1fc012?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      date: "",
      time: ""
    }
  ];

  return (
    <section className={styles.relatedEvents}>
      <header className={styles.titleHeader}>
        <h2 className={styles.title}>Related Events</h2>
        <button className={styles.iconButton} aria-label="More options">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d85cc389d575d1c745432ced908ae74c42a36354e058c8c03f0993604723707f?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.iconImage} />
        </button>
      </header>
      <ul className={styles.eventList}>
        {events.map((event, index) => (
          <li key={index} className={styles.eventItem}>
            <img src={event.image} alt={event.title} className={styles.eventImage} />
            <div className={styles.eventContent}>
              <h3 className={styles.eventTitle}>{event.title}</h3>
              {event.description && <p className={styles.eventDescription}>{event.description}</p>}
              {event.date && event.time && (
                <div className={styles.eventMeta}>
                  <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/c72d7454873655f9bc5121e1ca8d3e63c4e2ebb32e0be176010ae51dbba4c8a5?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.metaIcon} />
                  <span className={styles.metaDate}>{event.date}</span>
                  <span className={styles.metaSeparator}>•</span>
                  <span className={styles.metaTime}>{event.time}</span>
                  <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b8a15172d10d9958fd471575e210405265b5373fd10ca96d467e5ff67100e17?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.metaIcon} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RelatedEvents;