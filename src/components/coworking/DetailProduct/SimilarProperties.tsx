import React from 'react';
import styles from './SimilarProperties.module.css';

interface PropertyCardProps {
  image: string;
  title: string;
  address: string;
  price: string;
  facilities: string[];
}

const PropertyCard: React.FC<PropertyCardProps> = ({ image, title, address, price, facilities }) => (
  <div className={styles.propertyCard}>
    <img src={image} alt={title} className={styles.propertyImage} />
    <div className={styles.propertyInfo}>
      <h3 className={styles.propertyTitle}>{title}</h3>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1ccc764c0302e6724ba79d9a1b5107bac778bf39e0ff2698ae4a203cb9fb6600?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Favorite" className={styles.favoriteIcon} />
    </div>
    <address className={styles.propertyAddress}>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/8f5c30c0cc5f019c36607898dfa0f320461973d8e99ec102d28d24aa82ad31b0?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Location" className={styles.icon} />
      {address}
    </address>
    <div className={styles.propertyPrice}>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0df51536818e7682b82a01d176738d2d8cdfee8cfb25261dc3619fd48b54e277?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Price" className={styles.icon} />
      {price}/month
    </div>
    <div className={styles.facilityList}>
      {facilities.map((facility, index) => (
        <div key={index} className={styles.facilityItem}>
          <img src={`http://b.io/ext_${37 + index}-`} alt={facility} className={styles.facilityIcon} />
          <span>{facility}</span>
        </div>
      ))}
    </div>
  </div>
);

const SimilarProperties: React.FC = () => {
  const properties: PropertyCardProps[] = [
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/cd7df489ccd80b6c7d38f1007ebc92181af4ec55b3043aaff0980b5220ae7c91?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      title: "Atlas Office 6",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
      facilities: ["Thoải mái", "Tiện nghi", "Chuyên nghiệp", "24/7 wifi"]
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/dbacf549a5487835a4591a6776aee5cca1eaf1f6897cb69651356bb23dad30de?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      title: "Atlas Office 1",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
      facilities: ["Thoải mái", "Tiện nghi", "Chuyên nghiệp", "24/7 wifi"]
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/3ac3ff6ad9db5d40a41179d39a65089bf4373eca228191953a45473fd7e4b764?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      title: "Atlas Office 9",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
      facilities: ["Thoải mái", "Tiện nghi", "Chuyên nghiệp", "24/7 wifi"]
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d5e6e38b4529f4bff0c0b0728fb641efc7a07c50ea4881d057831e6c4fd107eb?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      title: "Atlas Office",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
      facilities: ["Thoải mái", "Tiện nghi", "Chuyên nghiệp", "24/7 wifi"]
    }
  ];

  return (
    <section className={styles.similarProperties}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Similar Property</h2>
        <button className={styles.seeAllButton}>
          <span>See All</span>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ca2d67bbbb721e947a4e59870c0d23539dde937c92b5f4f85849284dabf67a9?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Arrow right" className={styles.arrowIcon} />
        </button>
      </div>
      <div className={styles.propertyGrid}>
        {properties.map((property, index) => (
          <PropertyCard key={index} {...property} />
        ))}
      </div>
    </section>
  );
};

export default SimilarProperties;