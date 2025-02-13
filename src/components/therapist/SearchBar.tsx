/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar: React.FC = () => {
  return (
    <div className={styles.searchBarContainer}>
      <h3 className={styles.searchLabel}>
        Search:
      </h3>
      <input
        id="searchInput"
        type="text"
        placeholder="Search for articles, products, etc."
        className={styles.searchInput}
        aria-label="Search bar"
      />
      <button className={styles.searchButton} aria-label="Search">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/17d22517583ab521e3b96c0b7e7144f12cb3e51559fefac98e90d691a1322db5?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
          alt="Search"
          className={styles.searchIcon}
        />
      </button>
    </div>
  );
};

export default SearchBar;
