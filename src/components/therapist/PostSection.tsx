import React from 'react';
import SearchBar from './SearchBar';
import Post from './Post';
import CommentSection from './CommentSection';
import styles from './PostSection.module.css';

const PostSection: React.FC = () => {
  return (
    <section className={styles.postSection}>
      <SearchBar />
      <Post />
      <CommentSection />
    </section>
  );
};

export default PostSection;