import React from 'react';
import styles from './ChatItem.module.css';

interface ChatItemProps {
  name: string;
  avatar: string;
  message: string;
  timestamp: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ name, avatar, message, timestamp }) => {
  return (
    <div className={styles.chatItemWrapper}>
      <div className={styles.chatItemContent}>
        <img src={avatar} alt={`${name}'s avatar`} className={styles.avatar} />
        <div className={styles.textContent}>
          <h3 className={styles.userName}>{name}</h3>
          <p className={styles.messagePreview}>{message}</p>
        </div>
      </div>
      <time className={styles.timestamp}>{timestamp}</time>
    </div>
  );
};

export default ChatItem;