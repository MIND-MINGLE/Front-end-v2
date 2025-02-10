import React from "react";
import styles from "./PersonalInformation.module.css";
import Header from "../Components/Header/Header";
import Frame from "../PersonalInformation";
import Footer from "../Components/Footer/Footer";
import CopyrightFooter from "../Components/CopyrightFooter/CopyrightFooter";

const PersonalInformation: React.FC = () => {
  return (
    <div className={styles.personalInformation}>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <Frame />
        </div>
      </div>
      <Footer />
      <CopyrightFooter />
    </div>
  );
};

export default PersonalInformation;
