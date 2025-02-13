import React from "react";
import Header from "./Components/Header/Header";
import Hero from "./Hero";
import Stats from "./Stats";
import PopularSpaces from "./PopularSpaces";
import HouseForSale from "./HouseForSale";
import Features from "./Features";
import Testimonials from "./Testimonials";
import Footer from "./Components/Footer/Footer";
import styles from "./CoWorkingSpace.module.css";
import CopyrightFooter from "./Components/CopyrightFooter/CopyrightFooter";

const CoWorkingSpace: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      <Header />
      <main>
        <Hero />
        <Stats />
        <PopularSpaces />
        <HouseForSale />
        <Features />
        <Testimonials />
      </main>
      <Footer />
      <CopyrightFooter />
    </div>
  );
};

export default CoWorkingSpace;
