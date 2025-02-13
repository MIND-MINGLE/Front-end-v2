import React from "react";
import styles from "./SearchResults.module.css";
import Header from "../Header/Header";
import PropertyCard from "./PropertyCard";
import Footer from "../Footer/Footer";
import CopyrightFooter from "../CopyrightFooter/CopyrightFooter";

const SearchResults: React.FC = () => {
  const properties = [
    {
      id: 7,
      name: "Atlas Office 7",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
    },
    {
      id: 8,
      name: "Atlas Office 8",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
    },
    {
      id: 1,
      name: "Atlas Office 1",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
    },
    {
      id: 2,
      name: "Atlas Office 2",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
    },
    {
      id: 9,
      name: "Atlas Office 9",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
    },
    {
      id: 10,
      name: "Atlas Office 10",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
    },
    {
      id: 11,
      name: "Atlas Office 11",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
    },
    {
      id: 3,
      name: "Atlas Office 3",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
    },
    {
      id: 4,
      name: "Atlas Office 4",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
    },
    {
      id: 6,
      name: "Atlas Office 6",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
    },
    {
      id: 12,
      name: "Atlas Office 12",
      address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
      price: "69.00",
    },
  ];

  const resultCount = properties.length;
  const searchLocation = "Thành phố Hồ Chí Minh";

  return (
    <main className={styles.searchResults}>
      <Header />
      <section className={styles.resultsContainer}>
        <h2 className={styles.resultsHeading}>
          <a href="/LandingPage">
            <button type="button" className={styles.searchButton}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a9aeae5af1c631b5d464026844826d3869b581b8cf0eddd089651ca4c537fef2?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
                alt="Search Icon"
                className={styles.searchIcon}
              />
            </button>
          </a>
          <span className={styles.resultsText}>
            <span className={styles.resultsCount}>Results found for</span> There
            are {resultCount}+ Atlas Office in {searchLocation}
          </span>
        </h2>
        <div className={styles.propertyGrid}>
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
        <button className={styles.seeAllProperties}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/527ea3301a72b0c7403f20e6db99a84557a340ea4cca1c5f130b2e40cc4d0b36?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
            alt=""
            className={styles.arrowIcon}
          />
          See all properties
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/57a307da478215816f5436687f799747d8c012ea8236835e1b3db4af9c659e29?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
            alt=""
            className={styles.arrowIcon}
          />
        </button>
      </section>
      <Footer />
      <CopyrightFooter />
    </main>
  );
};

export default SearchResults;
