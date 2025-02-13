import React from 'react';
import styles from './SavedOffices.module.css';
import OfficeCard from './OfficeCard';

interface Office {
  id: number;
  name: string;
  address: string;
  rooms: number;
  capacity: number;
  area: string;
  price: string;
  image: string;
}

const officeData: Office[] = [
  {
    id: 1,
    name: "Atlas Office 1",
    address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
    rooms: 1,
    capacity: 8,
    area: "30m2",
    price: "36.90",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/20de36e6fb570516002eb18d0300d8cf51f6afee9def83c9e9807403fced751f?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  },
  {
    id: 2,
    name: "Atlas Office",
    address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
    rooms: 1,
    capacity: 8,
    area: "30m2",
    price: "36.90",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/683ddfb71c63e0cad098d899bd8adaa2917498c75643bf8c952841167b6f3b5c?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  },
  {
    id: 3,
    name: "Atlas Office 4",
    address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
    rooms: 1,
    capacity: 8,
    area: "30m2",
    price: "36.90",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/efffde314eb88b627c7b3f22c1780acc21d23e7cc8dbe13fc34ecdf0bde87dae?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  },
  {
    id: 4,
    name: "Atlas Office 7",
    address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
    rooms: 1,
    capacity: 8,
    area: "30m2",
    price: "36.90",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/1365533f75c4ef68dc4d498cf928459bef0eb8d32ac8aefedb530097cfd4464f?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  },
  {
    id: 5,
    name: "Atlas Office 9",
    address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
    rooms: 1,
    capacity: 8,
    area: "30m2",
    price: "36.90",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bd9f0d3cd2fe5f0c5111bedfd59f0cf86b4eb7eb2ad2b3323c7bd65f56b3ae41?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  }
];

const SavedOffices: React.FC = () => {
  return (
    <section className={styles.savedOffices}>
      <h2 className={styles.savedOfficesTitle}>Save</h2>
      {officeData.map((office) => (
        <OfficeCard key={office.id} office={office} />
      ))}
      <article className={styles.officePreview}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/97f3dfe345051a2ba369440fe2ec6031fd6b5efb293127cf83734bfcf77a5826?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="Atlas Office 2 preview" className={styles.officePreviewImage} />
        <h3 className={styles.officePreviewTitle}>Atlas Office 2</h3>
      </article>
    </section>
  );
};

export default SavedOffices;