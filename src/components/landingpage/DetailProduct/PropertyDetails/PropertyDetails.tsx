import React from 'react';
import styles from './PropertyDetails.module.css';
import PropertyDescription from '../PropertyDetails/PropertyDescription/PropertyDescription';
import OwnerContactCard from '../PropertyDetails/OwnerContactCard/OwnerContactCard';

const PropertyDetails: React.FC = () => {
  const description = "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequa Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequa";

  return (
    <main className={styles.container}>
      <div className={styles.descriptionColumn}>
        <PropertyDescription description={description} />
      </div>
      <div className={styles.contactColumn}>
        <OwnerContactCard
          ownerName="Quỳnh Nguyễn"
          avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/37118e392356347cf07432d785152fe137cd5f2431be31ff800a9283d2037de6?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
          ratingStarsSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/c942a962af7c3cbc4b704f75a999a20166c59c7781400c82535d9ec7c63f94ad?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
        />
      </div>
    </main>
  );
};

export default PropertyDetails;