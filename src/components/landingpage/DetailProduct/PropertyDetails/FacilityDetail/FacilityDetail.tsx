import React from 'react';
import styles from './FacilityDetail.module.css';

interface FacilityDetailProps {
  iconSrc: string;
  name: string;
}

const FacilityDetail: React.FC<FacilityDetailProps> = ({ iconSrc, name }) => {
  return (
    <div className={styles.facilityItem}>
      <img src={iconSrc} alt={`${name} icon`} className={styles.facilityIcon} />
      <span className={styles.facilityName}>{name}</span>
    </div>
  );
};

export default FacilityDetail;