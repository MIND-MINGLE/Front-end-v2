/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './CommentSection.module.css';

const CommentSection: React.FC = () => {
  return (
    <section className={styles.commentSection}>
      <h3 className={styles.moreComments}>More Comments</h3>
      
      {/* Comment */}
      <div className={styles.comment}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/86531df416f207aa7e39ef6f5043aa7a7ac9398a6f531b43c917802c8440a88e?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
          alt="Commenter avatar" 
          className={styles.commenterAvatar} 
          aria-label="Commenter avatar"
        />
        <div className={styles.commentContent}>
          <h4 className={styles.commenterName}>Pham Van Dong</h4>
          <p className={styles.commentText}>Em tuyet voi lam 🎉</p>
        </div>
      </div>

      {/* Comment Actions */}
      <div className={styles.commentActions}>
        <button className={styles.actionButton} aria-label="Like this comment">
          Love
        </button>
        <button className={styles.actionButton} aria-label="Reply to this comment">
          Reply
        </button>
        <span className={styles.commentTime} aria-label="Comment timestamp">
          10 h ago
        </span>
      </div>

      {/* Comment Form */}
      <form className={styles.commentForm}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/676c92332d2247a0c2c73b9c1019a2fdf76dd03536bac80edf806285b673d11f?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" 
          alt="User avatar" 
          className={styles.userAvatar} 
          aria-label="Your avatar"
        />
        <input
          type="text"
          placeholder="Write your comment..."
          className={styles.commentInput}
          aria-label="Write a comment"
        />
      </form>
    </section>
  );
};

export default CommentSection;
