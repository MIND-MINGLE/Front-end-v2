"use client"
import React, { useState } from 'react';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  name: string;
  address: string;
  price: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ name, address, price }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };
  return (
    <article className={styles.propertyCard}>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/3c3fab6bb30acdb0924690520d30e6e89fb17ebe839c7f6ce8720e4b4ecf9b77?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt={`${name} exterior`} className={styles.propertyImage} />
      <div className={styles.propertyInfo}>
        <h3 className={styles.propertyName}>
          {name}
          <button onClick={toggleFavorite} className={styles.favoriteButton} aria-label="Toggle favorite">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b077da55143cc9de4a9955cb3a6c7d5cd6f3ea38557d79c5f174af48d12537e?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
              alt="Favorite"
              className={`${styles.favoriteIcon} ${isFavorited ? styles.filledHeart : styles.outlineHeart}`}
            />
          </button>
        </h3>
        <p className={styles.propertyAddress}>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/8f5c30c0cc5f019c36607898dfa0f320461973d8e99ec102d28d24aa82ad31b0?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Location" className={styles.locationIcon} />
          {address}
        </p>
        <p className={styles.propertyPrice}>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/42928ec47cf8484da21316bd858d7371520421a2b55e40a33abda99818d8c4e7?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Price" className={styles.priceIcon} />
          {price}/month
        </p>
        <div className={styles.propertyFeatures}>
          <span className={styles.feature}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/cfa34fee82ef165082d7b66adaf4f4d0d0a37e9e63c3f1e7bc57913eeda267d1?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.featureIcon} />
            Thoải mái
          </span>
          <span className={styles.feature}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/01ba29d5cb916d97bfcb7ed37c4305ae3a7d5920ca2d39530d684c362dec4812?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.featureIcon} />
            Tiện nghi
          </span>
          <span className={styles.feature}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b6e621f31c44fc75940a328ddf4a67fa63feddf6e26c3f72492c258e6e6f2e48?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.featureIcon} />
            Chuyên nghiệp
          </span>
          <span className={styles.feature}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/85c9f8a3b4de3c56ee0596da2b22cbea82fbf7985224718431908505323c7141?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.featureIcon} />
            24/7 wifi
          </span>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;