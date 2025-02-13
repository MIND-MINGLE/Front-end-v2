import React from 'react';
import styles from './NotificationComponent.module.css';

interface NotificationItemProps {
  imageSrc: string;
  senderName: string;
  message: string;
  timeAgo: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ imageSrc, senderName, message, timeAgo }) => {
  return (
    <article className={styles.notificationItem}>
      <img loading="lazy" src={imageSrc} alt={`${senderName}'s profile`} className={styles.profileImage} />
      <div className={styles.notificationContent}>
        <p className={styles.notificationMessage}>
          <strong>{senderName}</strong> {message}
        </p>
        <time className={styles.notificationTime}>{timeAgo}</time>
      </div>
    </article>
  );
};

export default NotificationItem;