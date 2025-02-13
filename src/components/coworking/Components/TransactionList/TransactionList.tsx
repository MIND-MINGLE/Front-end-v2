import React from 'react';
import styles from './TransactionList.module.css';
import TransactionItem from './TransactionItem';
import FilterByDate from './FilterByDate';

interface Transaction {
  id: number;
  officeName: string;
  address: string;
  dateRange: string;
  amount: number;
  imageUrl: string;
}

const transactions: Transaction[] = [
  {
    id: 1,
    officeName: "Atlas Office 1",
    address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
    dateRange: "14/10/2022 - 14/11/2022",
    amount: 68.09,
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/ab81c967333b2f69720a7c388edaa306af011062363163e8cab3161461c4c65c?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  },
  {
    id: 2,
    officeName: "Atlas Office 2",
    address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
    dateRange: "14/10/2022 - 14/11/2022",
    amount: 68.09,
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/f3460970e16ee74aa813c0950e7e6fb06022234f372d95840e80e7641e9409c6?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  },
  {
    id: 3,
    officeName: "Atlas Office 3",
    address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
    dateRange: "14/10/2022 - 14/11/2022",
    amount: 68.09,
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/726679bb2860e39bcd6727e5897884c1375dbd4f92be9c99368fef2167871cec?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  },
  {
    id: 4,
    officeName: "Atlas Office 4",
    address: "58 Do Doc Loc, Hoa Xuan, Cam Le, TP. Da Nang",
    dateRange: "14/10/2022 - 14/11/2022",
    amount: 68.09,
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/ba55e045eb1ae37f97bcbbda940bedd219f922135f94ba16366918d3887bbcf8?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  },
  {
    id: 5,
    officeName: "Atlas Office 5",
    address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
    dateRange: "14/10/2022 - 14/11/2022",
    amount: 68.09,
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/338cc97bc1c561a910d06f9ab07bdeed8e9c454fc90d9ba2619ecdd418d8669e?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  },
  {
    id: 6,
    officeName: "Atlas Office 6",
    address: "29 Đ. Lê Duẩn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
    dateRange: "14/10/2022 - 14/11/2022",
    amount: 68.09,
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/ef6e92d9709ae1ef23250baab9901b72a95a6644862b3bb22dedc5ff6f63cafc?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  },
  {
    id: 7,
    officeName: "Atlas Office 7",
    address: "",
    dateRange: "",
    amount: 0,
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/726b70e93fd27c16511498563be9f26cfedc29fb59d4d0b22e5f98538a45351f?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7"
  }
];

const TransactionList: React.FC = () => {
  return (
    <section className={styles.transactionList}>
      <header className={styles.header}>
        <h2 className={styles.title}>List Of Transaction</h2>
        <FilterByDate />
      </header>
      <main className={styles.transactionItems}>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </main>
    </section>
  );
};

export default TransactionList;