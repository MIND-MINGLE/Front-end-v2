/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './HistoryView.module.css';
import {Link} from 'react-router';

export interface CardProps {
  imageSrc: string;
  title: string;
  date: string;
}

const Card: React.FC<CardProps> = ({ imageSrc, title, date }) => {
  return (
    <article className={styles.card}>
      <Link to="/SeekerPage/EventPage/EventDetail">
        <img src={imageSrc} alt={title} className={styles.cardImage} />
        <div className={styles.cardContent}>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.cardDate}>{date}</p>
        </div>
      </Link>
    </article>
  );
};

export default Card;