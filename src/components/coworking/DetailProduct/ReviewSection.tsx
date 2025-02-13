import React from 'react';
import styles from './ReviewSection.module.css';

interface ReviewProps {
  name: string;
  avatar: string;
  rating: string;
  review: string;
}

const Review: React.FC<ReviewProps> = ({ name, avatar, rating, review }) => (
  <div className={styles.review}>
    <img src={avatar} alt={`${name}'s avatar`} className={styles.reviewerAvatar} />
    <div className={styles.reviewContent}>
      <h4 className={styles.reviewerName}>{name}</h4>
      <img src={rating} alt="Rating" className={styles.reviewRating} />
      <p className={styles.reviewText}>{review}</p>
    </div>
  </div>
);

const ReviewSection: React.FC = () => {
  const reviews: ReviewProps[] = [
    {
      name: "M. Barham",
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/870f270346c189f8cd0bbeef661d873271d7fa89d6fd7dada7f9062e95e24a86?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      rating: "https://cdn.builder.io/api/v1/image/assets/TEMP/d68cb1e564bdff0343ae235d274c5437d3c4dd23d8b98321555aed924ccd43bf?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      review: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequa Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
    },
    {
      name: "E. Bambridge",
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/7846b5eb1688b11ba13caeb91bd9e2862c86246561ab50187e2041d17a09869e?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      rating: "https://cdn.builder.io/api/v1/image/assets/TEMP/c44872085f871ef42a895e03ea321ce80bff8732c96ebc5b357d1eed2736a8ce?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      review: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequa Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
    },
    {
      name: "D. Alli",
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/5e05ab59ff8577fc03ea1a13d85981b9113820f40581c0f08a313490061a1830?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      rating: "https://cdn.builder.io/api/v1/image/assets/TEMP/7fbef31e77b3647dfb82cd95aeac1aeab8b0b78297eade8ad169b6180dbfc7a4?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      review: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequa Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
    },
    {
      name: "A. Amos",
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/44327059df7de6a59770720f1a22da1a63a99575bf30084c9fd15cfeb1a5feb0?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      rating: "https://cdn.builder.io/api/v1/image/assets/TEMP/d68cb1e564bdff0343ae235d274c5437d3c4dd23d8b98321555aed924ccd43bf?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      review: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequa Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
    },
    {
      name: "J. Baker",
      avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/3f678988667baf08013c9289fec2a6b28cc9845b4ce7b10d8a0befec74a03689?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      rating: "https://cdn.builder.io/api/v1/image/assets/TEMP/c44872085f871ef42a895e03ea321ce80bff8732c96ebc5b357d1eed2736a8ce?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7",
      review: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequa Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
    },
  ];

  return (
    <section className={styles.reviewSection}>
      <h2 className={styles.sectionTitle}>Review</h2>
      <div className={styles.overallRating}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/f3ebebe42813857aad9e0308c5cdcb2b0823a2998a6b197c511c1c11a5828ca4?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Star icon" className={styles.starIcon} />
        <span className={styles.ratingText}>
          <span className={styles.ratingScore}>4.5</span> (50 reviews)
        </span>
      </div>
      <div className={styles.ratingBreakdown}>
        {['Cleanliness', 'Facilities', 'Service', 'Internet', 'Staff', 'Breakfast'].map((category, index) => (
          <div key={index} className={styles.ratingCategory}>
            <span className={styles.categoryName}>{category}</span>
            <div className={styles.ratingBar}>
              <div className={styles.ratingFill} style={{ width: '70%' }}></div>
            </div>
            <span className={styles.ratingPercentage}>70%</span>
          </div>
        ))}
      </div>
      <div className={styles.reviewList}>
        {reviews.map((review, index) => (
          <Review key={index} {...review} />
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;