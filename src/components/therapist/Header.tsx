"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import NotificationComponent from "../coworking/Components/NotificationModule/NotificationComponent";
import ChatList from "../coworking/Components/ChatNoti/ChatList";
import {Link} from "react-router";

const Header: React.FC = () => {
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
    }
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target as Node)
    ) {
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
        <Link to="/doctor/session-calendar">
          <button className={styles.createButton}>
            Create
          </button>
        </Link>
        <Link to="/doctor/chat">
        <button
          className={styles.navButton}
          aria-label="Chat"
          onClick={() => setShowChatList((prev) => !prev)}
        >
          <img src="/ChatDots.svg" alt="Chat icon" />
        </button>
        </Link>
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
        <Link to="/doctor/profile">
          <button className={styles.navMenu} aria-label="Profile">
            <img src="/Ellipse 11.svg" alt="Profile icon" />
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
