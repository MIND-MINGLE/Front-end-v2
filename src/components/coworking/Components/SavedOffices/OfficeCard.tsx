import React from 'react';
import styles from './OfficeCard.module.css';

interface Office {
  name: string;
  address: string;
  rooms: number;
  capacity: number;
  area: string;
  price: string;
  image: string;
}

interface OfficeCardProps {
  office: Office;
}

const OfficeCard: React.FC<OfficeCardProps> = ({ office }) => {
  return (
    <article className={styles.officeCard}>
      <div className={styles.officeCardContent}>
        <img src={office.image} alt={`${office.name} preview`} className={styles.officeImage} />
        <div className={styles.officeDetails}>
          <h3 className={styles.officeName}>{office.name}</h3>
          <p className={styles.officeAddress}>{office.address}</p>
          <div className={styles.officeSpecs}>
            <div className={styles.specItem}>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd6c72f59516247c227aa88cecf042c02c4d9d34e796caae145196ee63dda683?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Rooms" className={styles.specIcon} />
              <span>{office.rooms}</span>
            </div>
            <div className={styles.specItem}>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/41e05ad447f1b8f955568961bc45d6f1e087e93275e1d57f62dc46c60b69c46d?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Capacity" className={styles.specIcon} />
              <span>{office.capacity}</span>
            </div>
            <div className={styles.specItem}>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/352121e1eaf5e9ed165f0d181cbc2282b5d8b13cd6d5f26ec99597620f7f340f?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Area" className={styles.specIcon} />
              <span>{office.area}</span>
            </div>
            <div className={styles.specItem}>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d96c16bf0b73cbc781e767cc754b894d0d5434e61b6ec3edf817738853ce2c5d?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Price" className={styles.specIcon} />
              <span>{office.price}</span>
            </div>
          </div>
        </div>
      </div>
      <button className={styles.favoriteButton} aria-label="Add to favorites">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/c699fc7fa8f59989b82e0925c86ab0e3959aa56517c003efef1b29669e46c315?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.favoriteIcon} />
      </button>
    </article>
  );
};

export default OfficeCard;