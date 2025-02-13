import React from "react";
import Header from "../Components/Header/Header";
import CheckoutInformation from "./CheckoutInformation";
import Footer from "../Components/Footer/Footer";
import CopyrightFooter from "../Components/CopyrightFooter/CopyrightFooter";
import styles from './CheckoutOrder.module.css';
import OrderSummary from "./OrderSummary";

const CheckoutOrder: React.FC = () => {
  return (
    <div className={styles.checkoutOrder}>
      <Header />
      <main className={styles.mainContent}>
        <CheckoutInformation />
        <OrderSummary />
      </main>
      <Footer />
      <CopyrightFooter />
    </div>
  );
};

export default CheckoutOrder;
