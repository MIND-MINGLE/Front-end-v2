// import React from "react";
import styles from "./ThankYouPage.module.css";
import Header from "../Components/Header/Header";

const ThankYouPage = () => {
  return (
    <main className={styles.thankYouPage}>
      <Header />
      <img
        src="/tickicon.svg"
        alt="Payment Confirmation Icon"
        className={styles.confirmationIcon}
      />

      <h1 className={styles.confirmationTitle}>Payment Confirmed</h1>

      <p className={styles.orderNumber}>ORDER #123456</p>

      <p className={styles.confirmationDescription}>
        Thank you John Doe for buying Candleaf. The nature is grateful to
        you. Now that your order is confirmed it will be ready to ship in 2
        days. Please check your inbox in the future for your order updates.
      </p>
      <a href="/LandingPage">
        <button className={styles.homeButton}>Back to Home</button>
      </a>
    </main>
  );
};

export default ThankYouPage;
