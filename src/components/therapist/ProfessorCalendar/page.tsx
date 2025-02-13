import React from "react";
import styles from "./ProfessorCalender.module.css";
import HeaderProf from "../ProfessorWorkshop/Header";
import Frame from "@/app/ProfessorPage/ProfessorCalendar";
import Footer from "@/app/LandingPage/Components/Footer/Footer";
import CopyrightFooter from "@/app/LandingPage/Components/CopyrightFooter/CopyrightFooter";

const PersonalInformation: React.FC = () => {
  return (
    <div className={styles.professorCalendar}>
      <HeaderProf />
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
