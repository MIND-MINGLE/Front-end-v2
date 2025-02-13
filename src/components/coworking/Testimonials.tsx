import React from 'react';
import styles from './CoWorkingSpace.module.css';

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, content }) => (
  <article className={styles.testimonialCard}>
    <img
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/660ec051f48e5ecbbdebcf0c86f123c1ea92551fc75cb2fb984b7188a46fd3ff?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
      alt={name}
      className={styles.testimonialAvatar}
    />
    <h3 className={styles.testimonialName}>{name}</h3>
    <p className={styles.testimonialRole}>{role}</p>
    <img
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c92e504668af848056e5ed60ce34c694d49c820ae86aa6ddb9edbd869c6baf9?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
      alt="Rating"
      className={styles.testimonialRating}
    />
    <p className={styles.testimonialContent}>{content}</p>
  </article>
);

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Celine Dion',
      role: 'Cafe Owner',
      content: '“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque egestas massa at nisi faucibus, non venenatis dui efficitur.”',
    },
    {
      name: 'John Doe',
      role: 'Restaurant Manager',
      content: '“Fusce vitae purus eu nulla laoreet gravida a et elit. Nulla facilisi. Aliquam erat volutpat.”',
    },
    {
      name: 'Jane Smith',
      role: 'Baker',
      content: '“Phasellus tristique libero eu interdum tempor. Cras et lorem eget nulla interdum hendrerit non at elit.”',
    },
  ];

  return (
    <section className={styles.testimonials}>
      <h2 className={styles.testimonialsTitle}>Testimonials</h2>
      <p className={styles.testimonialsSubtitle}>Some quotes from our happy customers</p>
      <div className={styles.testimonialRating}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef29a2989f02c0222155a45112645cf85da4e3f8c5f2ed76cdad1342ceb3154c?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Star rating" />
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b26e80c0fb27f0a7878be36ade26ac221a6da2db27651b0365befb788107e523?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Star rating" />
      </div>
      <div className={styles.testimonialGrid}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
