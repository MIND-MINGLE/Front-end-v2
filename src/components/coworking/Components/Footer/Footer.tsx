import React from 'react';
import styles from './Footer.module.css';

interface AppButtonProps {
  icon: string;
  storeName: string;
}

const AppButton: React.FC<AppButtonProps> = ({ icon, storeName }) => (
  <div className={styles.appButton}>
    <img loading="lazy" src={icon} alt={`${storeName} icon`} className={styles.appIcon} />
    <div className={styles.appInfo}>
      <div className={styles.getItNow}>Get it now</div>
      <div className={styles.storeName}>{storeName}</div>
    </div>
  </div>
);

interface TagProps {
  text: string;
  isActive?: boolean;
}

const Tag: React.FC<TagProps> = ({ text, isActive = false }) => (
  <div className={isActive ? styles.activeTag : styles.tag}>{text}</div>
);

const Footer: React.FC = () => {
  const categories = ['Popular', 'Office', 'Ho Chi Minh City', 'Hanoi', 'Virtual Office'];
  const tags = [
    ['District 1', 'District 2', 'Virtual Office'],
    ['Thu Duc City', 'Hosting', 'Short-term']
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.companyInfo}>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/714181fd466e8fcf586c28bde6d24a234acdc1482f185b8dd5e397fb7ce06f17?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Company Logo" className={styles.logo} />
        <p className={styles.description}>
          Your sharing space made for you and for your mind.
        </p>
        <div className={styles.contactInfo}>
          <div className={styles.phoneNumber}>
            <div className={styles.customerSupport}>Customer Supports:</div>
            <div className={styles.phoneNumberText}>(+84) 123 456 789</div>
          </div>
          <div className={styles.address}>FPT University, Thu Duc, HCMC</div>
          <div className={styles.email}>info@agenca.com</div>
        </div>
      </div>

      <nav className={styles.categorySection}>
        <h2 className={styles.sectionTitle}>Top Category</h2>
        <ul className={styles.categoryList}>
          {categories.map((category, index) => (
            <li key={index} className={index === 3 ? styles.activeItem : styles.categoryItem}>
              {index === 3 && <div className={styles.activeDivider} />}
              {category}
            </li>
          ))}
          <li className={styles.browseAllButton}>
            <span className={styles.browseAllText}>Browse All Product</span>
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/636cfcf25cb7b5247df40dfd25211469e924ee05555e20c7e7a80af8a16ae5c2?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Browse icon" className={styles.browseAllIcon} />
          </li>
        </ul>
      </nav>

      <div className={styles.downloadSection}>
        <h2 className={styles.downloadTitle}>Download App</h2>
        <div className={styles.appLinks}>
          <AppButton icon="https://cdn.builder.io/api/v1/image/assets/TEMP/cb349d84bbb6c9ae2db2a07a79fafbbcaa430f6d30fd757fe143ea8bacaedbfe?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" storeName="Google Play" />
        </div>
        <div className={styles.appLinks}>
          <AppButton icon="https://cdn.builder.io/api/v1/image/assets/TEMP/b12b30e1e99aa15249d76759f5b1acea94067cc4c619d2f9133699d49b8a8afd?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" storeName="App Store" />
        </div>
      </div>

      <div className={styles.tagSection}>
        <h2 className={styles.tagTitle}>Popular Tag</h2>
        <div className={styles.tagContainer}>
          {tags.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.tagRow}>
              {row.map((tag, tagIndex) => (
                <Tag key={tagIndex} text={tag} isActive={rowIndex === 1 && tagIndex === 2} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;