import React from 'react';
import styles from './EventView.module.css';
import Card, { CardProps } from './Card';

const cardData: CardProps[] = [
  { imageSrc: "/cardprop.png", title: "Workshop", date: "Updated today" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated yesterday" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated today" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated yesterday" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated today" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated yesterday" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated today" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated yesterday" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop1.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop1.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop1.png", title: "Title", date: "Updated 2 days ago" },
  { imageSrc: "/cardprop1.png", title: "Title", date: "Updated 2 days ago" },
];

const CardGrid: React.FC = () => {
  return (
    <section className={styles.cardGrid}>
      {cardData.map((card, index) => (
          <Card key={index} {...card} />
      ))}
    </section>
  );
};

export default CardGrid;