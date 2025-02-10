"use client";
import React, { useState } from "react";
import styles from "./Hero.module.css";
import PropertyFilter from "./Components/PropertyFilter/PropertyFilter";

const FilterHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <header className={styles.filterHeader}>
      <button onClick={onClose} className={styles.closeButton}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/4e2b4213140368ee1be803fa56bc09704684a044bd4ba51679daca4a41a056f3?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
          alt="Close"
          className={styles.filterIcon}
        />
      </button>
      <div className={styles.textContainer}>
        <h2 className={styles.filterTitle}>Filter needed property</h2>
        <p className={styles.filterDescription}>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit.
        </p>
      </div>
    </header>
  );
};

const Hero: React.FC = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <section className={styles.container}>
      {isFilterVisible && (
        <div className={styles.overlay}>
          <div className={styles.filterPopup}>
            <FilterHeader onClose={toggleFilter} />
            <PropertyFilter />
          </div>
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              Explore Your Suitable Co-working&nbsp; <br /> Space In A Fastest
              Way
            </h1>
            <p className={styles.description}>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui{" "}
              <br />
              officia deserunt mollit anim id est laborum.
            </p>
            <form className={styles.searchContainer} role="search">
              <label
                htmlFor="locationSearch"
                className={styles["visually-hidden"]}
              ></label>
              <img
                loading="lazy"
                src="/MapPin.svg"
                className={styles.searchIcon}
                alt=""
                width={24}
                height={24}
              />
              <input
                type="search"
                id="locationSearch"
                className={styles.searchText}
                placeholder="Search by location"
                aria-label="Search by location"
              />
              <a href="/LandingPage/Components/SearchResults">
                <button type="button" className={styles.searchButton}>
                  Search
                </button>
              </a>
              <div className={styles.imageWrapperf}>
                <button
                  type="button"
                  onClick={toggleFilter}
                  className={styles.imageButton}
                  aria-label="Navigate to filter"
                >
                  <img
                    src="/FadersHorizontal.svg"
                    alt="Filter options"
                    loading="lazy"
                    className={styles.image}
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.imageWrapper}>
            <img
              loading="lazy"
              src="/fea95af4c492db18accc2ff7ae0b77de.png"
              className={styles.backgroundImage}
              alt="Co-working space background"
              width={633}
              height={388}
            />
            <img
              loading="lazy"
              src="/fea95af4c492db18accc2ff7ae0b77de.png"
              className={styles.foregroundImage}
              alt="Co-working space interior"
              width={633}
              height={388}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
