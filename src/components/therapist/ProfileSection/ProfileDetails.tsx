/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './ProfileDetails.module.css';
import {Link} from "react-router";

const ProfileDetails: React.FC = () => {
  return (
    <>
      <a href="https://mindmingle.com" className={styles.websiteLink}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9d1444132eeb7952585321b6dc1ae235e321e0feb74780a6cf7ca20dae1f48d8?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.websiteIcon} />
        <span className={styles.websiteUrl}>mindmingle</span>
      </a>
      <div className={styles.detailsContainer}>
        <div className={styles.nameContainer}>
          <h1 className={styles.companyName}>MindMingle Professor</h1>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/f217c9d551802d1c122737b49ed76e627bf26858f8dd1301f04a70d053678f95?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Verified" className={styles.verifiedIcon} />
        </div>
        <div className={styles.additionalInfo}>
          <span className={styles.username}>@professor</span>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/37a867f2b8452bfa528b85d00951519d15c5b4ce6ddc2e064800b5ce70558609?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.followersIcon} />
          <span className={styles.followersCount}>21 followers</span>
          <span className={styles.companyType}>Vietnam</span>
        </div>
        <div className={styles.actionButtons}>
          <div className={styles.buttonGroup}>
            <button className={styles.followButton}>Follow</button>
            <Link to="/ProfessorPage/ProfessorInfo">
              <button className={styles.messageButton}>
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/720206133655e81fbc8fbd8d52d02803cec56ca58ca1a86953bffa491f068dc8?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.messageIcon} />
                <span>Message</span>
              </button>
            </Link>
          </div>
          <Link to="/ProfessorPage/ProfessorInfo">
            <button className={styles.ctaButton}>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/170d03cfc3db6d0e2f22a13dabd8149906816243f176843a84a2127b2e287473?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.ctaIcon} />
              <span className={styles.ctaText}>Direct links</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;