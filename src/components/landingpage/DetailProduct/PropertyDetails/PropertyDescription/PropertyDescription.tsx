import React from 'react';
import styles from './PropertyDescription.module.css';
import FacilityDetail from '../FacilityDetail/FacilityDetail';

interface PropertyDescriptionProps {
  description: string;
}

const PropertyDescription: React.FC<PropertyDescriptionProps> = ({ description }) => {
  const facilities = [
    { iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/cfa34fee82ef165082d7b66adaf4f4d0d0a37e9e63c3f1e7bc57913eeda267d1?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7", name: "Thoải mái" },
    { iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/01ba29d5cb916d97bfcb7ed37c4305ae3a7d5920ca2d39530d684c362dec4812?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7", name: "Tiện nghi" },
    { iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/b6e621f31c44fc75940a328ddf4a67fa63feddf6e26c3f72492c258e6e6f2e48?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7", name: "Chuyên nghiệp" },
    { iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/cd9122f6e542bf02ec6bb9ab8b60f755d0b74351b97bc1d6e2df691dd373e3cf?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7", name: "24/7 wifi" }
  ];

  return (
    <section className={styles.descriptionContainer}>
      <h2>Description</h2>
      <p className={styles.descriptionText}>{description}</p>
      <h3 className={styles.facilitiesTitle}>Facilities details</h3>
      <div className={styles.facilitiesList}>
        {facilities.map((facility, index) => (
          <FacilityDetail key={index} iconSrc={facility.iconSrc} name={facility.name} />
        ))}
      </div>
    </section>
  );
};

export default PropertyDescription;