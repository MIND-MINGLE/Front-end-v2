import React from 'react';
import styles from './LocationInfo.module.css';

interface LocationInfoProps {
  icon: string;
  address: string;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ icon, address }) => {
  return (
    <div className={styles.mapContainer}>
      <h3 className={styles.mapText}>Map</h3>
      <div className={styles.locationInfo}>
        <img loading="lazy" src={icon} alt="Location icon" className={styles.locationIcon} />
        <p className={styles.locationAddress}>{address}</p>

      </div>
      <div className={styles.imageWrapper}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/85b43d31a61baf4c15cac0ad7a37d2d6e8637748a31a62fc0adeb9610f2d8f89?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
          alt="Descriptive text for the image"
          className={styles.responsiveImage}
        />
      </div>
    </div>
  );
};

export default LocationInfo;