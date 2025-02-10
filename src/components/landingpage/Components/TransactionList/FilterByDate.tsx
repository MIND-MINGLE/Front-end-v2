import React from 'react';
import styles from './TransactionList.module.css';

const FilterByDate: React.FC = () => {
  return (
    <div className={styles.filterByDate}>
      <span className={styles.filterText}>Filter by date</span>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c583c7db40df50d4a4000b3b236957fcd49133bf428ec378dae801d8dbc1a8c?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Calendar icon" className={styles.calendarIcon} />
    </div>
  );
};

export default FilterByDate;