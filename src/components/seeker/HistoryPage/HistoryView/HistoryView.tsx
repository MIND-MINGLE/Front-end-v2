import React from 'react';
import styles from './HistoryView.module.css';
import TopAppBar from './TopAppBar';
import FilterChips from './FilterChips';
import CardGrid from './CardGrid';

const HistoryView: React.FC = () => {
  return (
    <main className={styles.content}>
      <TopAppBar />
      <FilterChips />
      <CardGrid />
    </main>
  );
};

export default HistoryView;