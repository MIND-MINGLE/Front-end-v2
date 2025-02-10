import React from 'react';
import SpaceCard from './SpaceCard';
import styles from './PopularSpaces.module.css';

const PopularSpaces: React.FC = () => {
  const spaces = [
    {
      name: 'Atlas Office',
      image: '/landing.png',
      location: '29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
      price: '79.00/month',
      features: ['Thoải mái', 'Tiện nghi', 'Chuyên nghiệp', '24/7 wifi'],
    },
    {
      name: 'Atlas Office 1',
      image: '/landing.png',
      location: '33 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
      price: '89.00/month',
      features: ['Thoải mái', 'Tiện nghi', 'Chuyên nghiệp', '24/7 wifi'],
    },
    {
      name: 'Atlas Office 2',
      image: '/landing.png',
      location: '33 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
      price: '69.00/month',
      features: ['Thoải mái', 'Tiện nghi', 'Chuyên nghiệp', '24/7 wifi'],
    },
    {
      name: 'Atlas Office 3',
      image: '/landing.png',
      location: '29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
      price: '69.00/month',
      features: ['Thoải mái', 'Tiện nghi', 'Chuyên nghiệp', '24/7 wifi'],
    },
  ];

  return (
    <section className={styles.popularSpaces}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/a338acefd72a791516eeaa14b7a9c60063b8d855873550e26a100df13159637c?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.popularIcon} />
          Our Popular Co-working space
        </h2>
        <button className={styles.seeAllButton}>
          See All
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/321b203280683fc4d456afd14e6d70a3b16fb325dc782db99e568e0807bcb428?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.arrowIcon} />
        </button>
      </div>
      <div className={styles.spaceGrid}>
        {spaces.map((space, index) => (
          <SpaceCard key={index} {...space} />
        ))}
      </div>
    </section>
  );
};

export default PopularSpaces;