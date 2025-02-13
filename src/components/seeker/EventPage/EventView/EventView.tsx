import React from 'react';
import styles from './EventView.module.css';
import TopAppBar from './TopAppBar';
import FilterChips from './FilterChips';
import CardGrid from './CardGrid';

const EventView: React.FC = () => {
  return (
    <main className={styles.content}>
      <TopAppBar />
      <FilterChips />
      <CardGrid />
    </main>
  );
};

export default EventView;