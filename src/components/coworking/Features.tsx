import React from 'react';
import styles from './Features.module.css';
/* eslint-disable @next/next/no-img-element */

interface FeatureProps {
  iconSrc: string;
  text: string;
}

const Feature: React.FC<FeatureProps> = ({ iconSrc, text }) => (
  <div className={styles.featureList}>
    <img loading="lazy" src={iconSrc} alt="" className={styles.featureIcon} />
    <div className={styles.featureText} dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

const CleanFragrantSoyWax: React.FC = () => {
  const features = [
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/02075f3557b75baab0f77ac632b07aa54ade5ac854d733bfe09a44ed14247705?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      text: "<span style='font-weight: 500;'>Eco-sustainable:</span> All recyclable materials, 0% CO2 emissions"
    },
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/2d4d65b17b84bd2503d41ed97f529e9ae94abddfa5a46131efc56d5aeb181a35?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      text: "<span style='font-weight: 500;'>Hypoallergenic: </span>100% natural, human-friendly ingredients"
    },
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/5fc067e18b94bdb3dde97296b830e55cc88905a4979609ccb2b357a65b31804b?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      text: "<span style='font-weight: 500;'>Handmade: </span>All candles are crafted with love."
    },
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/45bc67c3179fcb706a6cb2b2df1a5cfae84b91b6a620a3e3c916fc702e43b384?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      text: "<span style='font-weight: 500;'>Long burning:</span> No more waste. Created to last long."
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.textColumn}>
            <div className={styles.textContent}>
              <h2 className={styles.title}>Clean and Fragrant Soy Wax</h2>
              <p className={styles.subtitle}>Made for your home and your wellness</p>
              {features.map((feature, index) => (
                <Feature key={index} iconSrc={feature.iconSrc} text={feature.text} />
              ))}
              <button className={styles.ctaButton}>Learn More</button>
            </div>
          </div>
          <div className={styles.imageColumn}>
            <img 
              loading="lazy" 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/abdfb97b0e1ea94cd7ef35b98aa5f661a3c18c9ec647ff2115bd0ffed2d33c98?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" 
              alt="Clean and Fragrant Soy Wax Product" 
              className={styles.productImage} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature };
export default CleanFragrantSoyWax;
