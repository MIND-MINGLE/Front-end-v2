import React from 'react';
import styles from './CopyrightFooter.module.css';

const CopyrightFooter: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb0c9ba964f60406cb06160677d1755be6c1021d447f4b654dd20f65d443713b?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
        alt={`MindMingle logo`}
        className={styles.logo}
      />
      <p className={styles.copyrightText}>
        © 2024 {" "}
        <span className={styles.companyName}>MindMingle</span>
        . All Rights Reserved.
      </p>
    </footer>
  );
};

export default CopyrightFooter;