import React from 'react';
import ProfileBanner from './ProfileBanner';
import ProfileNavigation from './ProfileNavigation';
import styles from './ProfileSection.module.css'; // Import the CSS file

const ProfileSection: React.FC = () => {
  return (
    <div className={styles.profileSection}> {/* Apply the CSS class */}
      <ProfileBanner
        bannerSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/2a603a8a3b2891f52be0ac40066cf2569bf21c6d59fee09b61e709a40cfe18e4?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
        profilePictureSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/3dcd8301e6ba52c8e7ad6c0fbc106906b53c16036a949e879b4f270c12307399?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
      />
      <ProfileNavigation />
    </div>
  );
};

export default ProfileSection;
