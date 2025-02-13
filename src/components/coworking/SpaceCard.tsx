"use client"
import React, { useState } from 'react';
import styles from './SpaceCard.module.css';

interface SpaceCardProps {
  name: string;
  image: string;
  location: string;
  price: string;
  features: string[];
}

const SpaceCard: React.FC<SpaceCardProps> = ({ name, image, location, price, features }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const featureIcons = [
    "https://cdn.builder.io/api/v1/image/assets/TEMP/5d745e8ce1ec0ddbc2896ff69fbf7e67ecf125a1aa8972bddd715265d05b305d?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/955e031896eddb3e83637f82cffb644b8ab9913525eb701121a57a7bb2457cab?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/be09ea09cbfdae4a2f18c96b7695e644fa785e169ce2624a7a8aa5f26d403241?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/93148193-1c4b-400c-813a-2a12132b98c8?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  ];

  return (
    <article className={styles.spaceCard}>
      <img src={image} alt={name} className={styles.spaceImage} />
      <div className={styles.spaceInfo}>
        <h3 className={styles.spaceName}>{name}</h3>
        <button onClick={toggleFavorite} className={styles.favoriteButton} aria-label="Toggle favorite">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b077da55143cc9de4a9955cb3a6c7d5cd6f3ea38557d79c5f174af48d12537e?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
            alt="Favorite"
            className={`${styles.favoriteIcon} ${isFavorited ? styles.filledHeart : styles.outlineHeart}`}
          />
        </button>
      </div>
      <p className={styles.spaceLocation}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/4f40a908bb925d6ef76985f2b712b3ba4076725f3b11af1d5c1beff7ce8c1213?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.locationIcon} />
        {location}
      </p>
      <p className={styles.spacePrice}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ea923e8eba50ed5c3fe9b25c6c697720a474fb726015ad6b30c8dc668a35591b?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.priceIcon} />
        {price}
      </p>
      {/* Container for icons and feature text */}
      <div className={styles.featuresContainer}>
        {/* Feature icons above the feature text */}
        <div className={styles.iconContainer}>
          {featureIcons.map((icon, index) => (
            <img key={`icon-${index}`} src={icon} alt={`Feature icon ${index + 1}`} className={styles.featureIcon} />
          ))}
        </div>
        <ul className={styles.featureList}>
          {features.map((feature, index) => (
            <li key={index} className={styles.featureItem}>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default SpaceCard;
