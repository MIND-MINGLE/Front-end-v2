import React from 'react';
import styles from './NotificationComponent.module.css';
import NotificationItem from './NotificationItem';
import SectionHeader from './SectionHeader';

interface NotificationData {
  id: number;
  imageSrc: string;
  senderName: string;
  message: string;
  timeAgo: string;
}

const notificationData: NotificationData[] = [
  {
    id: 1,
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6099f7d2b3033c26f1b487ea1cecaccf561ffa152bff3a40135acd277e73d1cb?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
    senderName: "Quynh Nguyen",
    message: "sent you a letter to confirm your appointment to rent a house next week",
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/826a2f0322b544ea90dba3ee5dbb6011c97038e6d08c2bcb9ad4cb7a9c27e035?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
    senderName: "Quynh Nguyen",
    message: "sent you a letter to confirm your appointment to rent a house next week",
    timeAgo: "2 hours ago"
  },
  {
    id: 3,
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9ff24d410d876f89a56738e2c574ffffd9f830854d872897d40b7b16fd8ffb60?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
    senderName: "Quynh Nguyen",
    message: "sent you a letter to confirm your appointment to rent a house next week",
    timeAgo: "2 hours ago"
  },
  {
    id: 4,
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/3e01550e1286731fef198c3bbb30e7f4f429dba8b7885a8d2fa8f05ffdb40c7c?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
    senderName: "Quynh Nguyen",
    message: "sent you a letter to confirm your appointment to rent a house next week",
    timeAgo: "2 hours ago"
  },
  {
    id: 5,
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/b1c5bd8d3a2b207f87718050e214c44ba17cf733de7d7fd1fd696a513da105a4?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
    senderName: "Quynh Nguyen",
    message: "sent you a letter to confirm your appointment to rent a house next week",
    timeAgo: "2 hours ago"
  },
  {
    id: 6,
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6099f7d2b3033c26f1b487ea1cecaccf561ffa152bff3a40135acd277e73d1cb?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
    senderName: "Quynh Nguyen",
    message: "sent you a letter to confirm your appointment to rent a house next week",
    timeAgo: "2 hours ago"
  }
];

const NotificationComponent: React.FC = () => {
  return (
    <section className={styles.notification}>
      <SectionHeader />
      {notificationData.slice(0, 3).map((notification) => (
        <React.Fragment key={notification.id}>
          <NotificationItem {...notification} />
          <div className={styles.divider} />
        </React.Fragment>
      ))}
      <SectionHeader title="Older" />
      {notificationData.slice(3).map((notification) => (
        <React.Fragment key={notification.id}>
          <NotificationItem {...notification} />
          <div className={styles.divider} />
        </React.Fragment>
      ))}
    </section>
  );
};

export default NotificationComponent;