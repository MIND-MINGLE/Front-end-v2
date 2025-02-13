import React from 'react';
import styles from './OwnerContactCard.module.css';

interface OwnerContactCardProps {
  ownerName: string;
  avatarSrc: string;
  ratingStarsSrc: string;
}

const OwnerContactCard: React.FC<OwnerContactCardProps> = ({ ownerName, avatarSrc, ratingStarsSrc }) => {
  const contactButtons = [
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/5876eb8818e01d29f44c1e8867044e1fb4ec62d0e71af6be36dbb7ea4a518beb?apiKey=9898e9505b4f4c40982b1ee127dde9c7&", alt: "Contact button 1" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/480618d4a159e9f36921a4f362a1690b88aa70dad0d0fd2e068e1d265beddbd6?apiKey=9898e9505b4f4c40982b1ee127dde9c7&", alt: "Contact button 2" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/58c9cd5977fa5fe91bab89a4e9a8698751f655385521ac3d86a64b2105c56c12?apiKey=9898e9505b4f4c40982b1ee127dde9c7&", alt: "Contact button 3" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/771ad27838141edf652dd04c02c22bd9f4d0fe18ae75b7ee88e1a52f92c54aeb?apiKey=9898e9505b4f4c40982b1ee127dde9c7&", alt: "Contact button 4" }
  ];

  return (
    <section className={styles.contactCard}>
      <h2 className={styles.contactOwner}>Contact Owner</h2>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/811c744dc2ce0c07776518173e16af69bec76ee7560249cefa4b75758829defd?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.divider} />
      <img src={avatarSrc} alt={`${ownerName}'s avatar`} className={styles.ownerAvatar} />
      <p className={styles.ownerName}>{ownerName}</p>
      <img src={ratingStarsSrc} alt="Owner rating" className={styles.ratingStars} />
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/811c744dc2ce0c07776518173e16af69bec76ee7560249cefa4b75758829defd?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.divider} />
      <div className={styles.contactButtons}>
        {[0, 1].map((rowIndex) => (
          <div key={rowIndex} className={styles.buttonRow}>
            {contactButtons.slice(rowIndex * 2, rowIndex * 2 + 2).map((button, index) => (
              <img
                key={index}
                src={button.src}
                alt={button.alt}
                className={styles.contactButton}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default OwnerContactCard;