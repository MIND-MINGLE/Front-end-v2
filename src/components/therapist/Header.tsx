"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import TransactionList from "../coworking/Components/TransactionList/TransactionList";
import NotificationComponent from "../coworking/Components/NotificationModule/NotificationComponent";
import ChatList from "../coworking/Components/ChatNoti/ChatList";
import SavedOffices from "../coworking/Components/SavedOffices/SavedOffices";
import {Link} from "react-router";

const Header: React.FC = () => {
  const [showTransactionList, setShowTransactionList] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const [showSavedOffices, setShowSavedOffices] = useState(false);
  const transactionRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const savedOfficesRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      transactionRef.current &&
      !transactionRef.current.contains(event.target as Node)
    ) {
      setShowTransactionList(false);
    }
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target as Node)
    ) {
      setShowNotification(false);
    }
    if (
      chatListRef.current &&
      !chatListRef.current.contains(event.target as Node)
    ) {
      setShowChatList(false);
    }
    if (
      savedOfficesRef.current &&
      !savedOfficesRef.current.contains(event.target as Node)
    ) {
      setShowSavedOffices(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <Link to="/">
        <button className={styles.backButton} aria-label="Back to home">
          <img src="/Logo.png" alt="Company logo" className={styles.logo} />
        </button>
      </Link>
      {/* Navigation buttons */}
      <div className={styles.navButtons}>
        <Link to="session-calendar">
          <button className={styles.createButton}>
            Create
          </button>
        </Link>
        <button className={styles.navButton} aria-label="Home">
          <img src="/SquaresFour.svg" alt="Home icon" />
        </button>
        <button
          className={styles.navButton}
          aria-label="Search"
          onClick={() => {
            setShowTransactionList((prev) => {
              console.log("Transaction List:", !prev);
              return !prev;
            });
          }}
        >
          <img src="/Recycle.svg" alt="Search icon" />
        </button>
        {showTransactionList && (
          <div ref={transactionRef} className={`${styles.dropdown}`}>
            <TransactionList />
          </div>
        )}

        <button
          className={styles.navButton}
          aria-label="Notifications"
          onClick={() => setShowNotification((prev) => !prev)}
        >
          <img src="/Heart.svg" alt="Notifications icon" />
        </button>
        {showNotification && (
          <div ref={notificationRef} className={`${styles.dropdown}`}>
            <SavedOffices />
          </div>
        )}

        <button
          className={styles.navButton}
          aria-label="Chat"
          onClick={() => setShowChatList((prev) => !prev)}
        >
          <img src="/ChatDots.svg" alt="Chat icon" />
        </button>
        {showChatList && (
          <div ref={chatListRef} className={`${styles.dropdown}`}>
            <ChatList />
          </div>
        )}

        <button
          className={styles.navButton}
          aria-label="Messages"
          onClick={() => setShowSavedOffices((prev) => !prev)}
        >
          <img src="/Bell.svg" alt="Messages icon" />
        </button>
        {showSavedOffices && (
          <div ref={savedOfficesRef} className={`${styles.dropdown}`}>

            <NotificationComponent />
          </div>
        )}
        {/* Profile icon */}
        <Link to="profile">
          <button className={styles.navMenu} aria-label="Profile">
            <img src="/Ellipse 11.svg" alt="Profile icon" />
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
