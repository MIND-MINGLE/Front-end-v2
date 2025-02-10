import React from 'react';
import styles from './CoWorkingSpace.module.css';

interface StatItemProps {
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <div className={styles.statItem}>
    <span className={styles.statValue}>{value}</span>
    <span className={styles.statLabel}>{label}</span>
  </div>
);

const Stats: React.FC = () => {
  const stats = [
    { value: '5000+', label: 'Premium Properties' },
    { value: '3000+', label: 'Good Reviews' },
    { value: '10+', label: 'Awards Winning' },
  ];

  return (
    <section className={styles.stats}>
      {stats.map((stat, index) => (
        <StatItem key={index} value={stat.value} label={stat.label} />
      ))}
    </section>
  );
};

export default Stats;