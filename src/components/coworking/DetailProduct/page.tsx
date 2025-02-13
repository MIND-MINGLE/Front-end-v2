import React from "react";
import styles from "./DetailProduct.module.css";
import Header from "../Components/Header/Header";
import PropertyDetails from "./PropertyDetails/PropertyDetails";
import ReviewSection from "./ReviewSection";
import SimilarProperties from "./SimilarProperties";
import Footer from "../Components/Footer/Footer";
import LocationInfo from "./LocationInfo";
import CopyrightFooter from "../Components/CopyrightFooter/CopyrightFooter";
import Frame from "./ImageGallery1";

const DetailProduct: React.FC = () => {
  const locationIcon = "/MapPin.svg";
  const address = "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh";
  return (
    <div>
      <Header />
      <main className={styles.detailProduct}>
        <div className={styles.container}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f613e5a681b43bdfba505afa64a2e49eb6c8101e6a90e4ba2e9d6eb3bffbfa09?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
            alt="Property overview"
            className={styles.propertyOverview}
          />
          <div className={styles.contentWrapper}>
            <PropertyDetails />
          </div>
          <div className={styles.frameWrapper}>
            <Frame />
          </div>
          <LocationInfo icon={locationIcon} address={address} />
          <ReviewSection />
          <SimilarProperties />
        </div>
        <div className={styles.footerFullWidth}>
          <Footer />
          <CopyrightFooter />
        </div>
      </main>
    </div>
  );
};

export default DetailProduct;
