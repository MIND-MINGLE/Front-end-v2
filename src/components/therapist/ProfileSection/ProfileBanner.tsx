/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './ProfileBanner.module.css';
import ProfileDetails from './ProfileDetails';

interface ProfileBannerProps {
  bannerSrc: string;
  profilePictureSrc: string;
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({ bannerSrc, profilePictureSrc }) => {
  return (
    <div className={styles.bannerContainer}>
      <img src={bannerSrc} alt="Profile Banner" className={styles.bannerImage} />
      <div className={styles.profileInfo}>
        <img src={profilePictureSrc} alt="Profile Picture" className={styles.profilePicture} />
        <div className={styles.infoContainer}>
          <ProfileDetails />
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;