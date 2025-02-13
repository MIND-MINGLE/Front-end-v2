import React from 'react';
import SpaceCard from './SpaceCard';
import styles from './HouseForSale.module.css';

const HouseForSale: React.FC = () => {
  const spaces = [
    {
      name: 'Atlas Office 4',
      image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/a34e222a87c08bd79510650c4f0f4a482aed477cced766921f859d0c5921859f?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7',
      location: '29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
      price: '69.00/month',
      features: ['Thoải mái', 'Tiện nghi', 'Chuyên nghiệp', '24/7 wifi'],
    },
    {
      name: 'Atlas Office 5',
      image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/39747f0a64d20b849e20ed24b0989cedc2acf67e68c0e81686e6aa91448a2970?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7',
      location: '29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
      price: '69.00/month',
      features: ['Thoải mái', 'Tiện nghi', 'Chuyên nghiệp', '24/7 wifi'],
    },
    {
      name: 'Atlas Office 6',
      image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f0bd4f90af327c77b6fd728ee75dffb055c646c217e02604d7f6eefa069b9eb8?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7',
      location: '33 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
      price: '69.00/month',
      features: ['Thoải mái', 'Tiện nghi', 'Chuyên nghiệp', '24/7 wifi'],
    },
    {
      name: 'Atlas Office 7',
      image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7d071201d3469e33f1d8bec01ddee10960ab1b2e99b4635e8ea0689b088a0884?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7',
      location: '33 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
      price: '69.00/month',
      features: ['Thoải mái', 'Tiện nghi', 'Chuyên nghiệp', '24/7 wifi'],
    },
  ];

  return (
    <section className={styles.houseForSale}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/f87ca9fa767f49a112c7e6aa290a869b42994d348bddf5d817b7cfc471e640da?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.houseIcon} />
          House for sales
        </h2>
        <p className={styles.saleInfo}></p>
        <button className={styles.seeAllButton}>
          See All
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/321b203280683fc4d456afd14e6d70a3b16fb325dc782db99e568e0807bcb428?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.arrowIcon} />
        </button>
      </div>
      <div className={styles.spaceGrid}>
        {spaces.map((space, index) => (
          <a key={index} href="/LandingPage/DetailProduct">
            <SpaceCard {...space} />
          </a>
        ))}
      </div>
    </section>
  );
};

export default HouseForSale;