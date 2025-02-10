"use client";
import React, { useState } from 'react';
import styles from './TransactionList.module.css';
import FeedBackComponent from './Feedback/FeedbackComponent';

interface Transaction {
  officeName: string;
  address: string;
  dateRange: string;
  amount: number;
  imageUrl: string;
}

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleFeedbackToggle = () => {
    setIsFeedbackOpen((prev) => !prev);
  };

  return (
    <article className={styles.transactionItem}>
      <div className={styles.transactionDetails}>
        <img src={transaction.imageUrl} alt={`${transaction.officeName} logo`} className={styles.officeImage} />
        <div className={styles.officeInfo}>
          <h3 className={styles.officeName}>{transaction.officeName}</h3>
          <div className={styles.addressWrapper}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/57844b1ef9f90b8ac77deb18e392e16a49d8e99bf2ce6bfbfb112f4f5f515689?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.locationIcon} />
            <p className={styles.address}>{transaction.address}</p>
          </div>
          <p className={styles.dateRange}>{transaction.dateRange}</p>
        </div>
      </div>
      <div className={styles.transactionActions}>
        <div className={styles.amountWrapper}>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/5dcf16e1ebfbf86c1b8db071a0d70799618f05535e24696d621e5ca834a157e7?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.currencyIcon} />
          <span className={styles.amount}>{transaction.amount.toFixed(2)}</span>
        </div>
        <button className={styles.feedbackButton} onClick={handleFeedbackToggle}>
          Feedback
        </button>
        {isFeedbackOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <FeedBackComponent onClose={handleFeedbackToggle} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default TransactionItem;
