/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './Post.module.css';

const Post: React.FC = () => {
  return (
    <article className={styles.post}>
      <header className={styles.postHeader}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d68fedd45a5bd1b0f9c4e956f2d326cbb54bff8cbf0b8482fa3168acc5ee475?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
          alt="Profile of MindMingle"
          className={styles.profilePicture}
        />
        <div className={styles.postInfo}>
          <h2 className={styles.authorName}>MindMingle</h2>
          <div className={styles.postMeta}>
            <time dateTime="2024-10-16" className={styles.postDate}>16/10/2024</time>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/162b616d04396efea770e2538dee9bf824d0e9b33c07f4babe00d353655bfdb1?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
              alt="Post visibility icon"
              className={styles.visibilityIcon}
            />
          </div>
        </div>
      </header>
      <img
        src="/Logo2.png"
        alt="Main content of the post"
        className={styles.postImage}
      />
      <section className={styles.postStats}>
        <div className={styles.reactions}>
          <span className={styles.reactionCount}>62</span>
          <span className={styles.reactionType}>Loves</span>
        </div>
        <div className={styles.comments}>12 comments</div>
        <div className={styles.saves}>299 saves</div>
      </section>
      <section className={styles.postActions}>
        <button className={styles.actionButton}>Love</button>
        <button className={styles.actionButton}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7109554f5d0498dcce70d5b768bd35d3b7120482febb4a65b25ebe1edd1d85f9?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
            alt="Comment icon"
            className={styles.actionIcon}
          />
          Comments
        </button>
        <button className={styles.actionButton}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/44bf6778b831bfca6e35198987bc6b485e7fa6b254cf0a1d16e5188260408971?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
            alt="Save icon"
            className={styles.actionIcon}
          />
          Save
        </button>
      </section>
    </article>
  );
};

export default Post;
