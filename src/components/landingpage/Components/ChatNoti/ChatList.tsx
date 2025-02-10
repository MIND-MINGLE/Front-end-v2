import React from 'react';
import styles from './ChatList.module.css';
import ChatItem from './ChatItem';

interface ChatData {
  id: string;
  name: string;
  avatar: string;
  message: string;
  timestamp: string;
}

const chatData: ChatData[] = [
  { id: '1', name: 'W. Barton', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e1bf6e9b188e07b80c8088f7fce5a0b0fcf5e7fa0b68fc3b53d9841fd2cf3b54?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7', message: 'Hello. I want to rent a house...', timestamp: '10:20' },
  { id: '2', name: 'T. Baddeley', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/af6c9e8cfbf30afe4de2999a0fe6a8be4f670d36f8e56e721356477439574faf?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7', message: 'Hello. I want to rent a house...', timestamp: '10:20' },
  { id: '3', name: 'N. Bailey', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/091dc9f5e2ff85672e693bac0186e15cd91e18f51ce208df7f9a8ff557d6c2a1?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7', message: 'Hello. I want to rent a house...', timestamp: '10:20' },
  { id: '4', name: 'H. Arthur', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/dbe189dc13011b3f98d59ab5b94ce851f5852a8147ec28a3a9cd47fed87a9bb3?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7', message: 'Hello. I want to rent a house...', timestamp: '10:20' },
  { id: '5', name: 'D. Armstrong', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/637bf68c33727b8cd552a0c18db25dde27b6fe7c38184afe9c1308c7843337aa?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7', message: 'Hello. I want to rent a house...', timestamp: '10:20' },
  { id: '6', name: 'A. Baker', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/a801ff97ffccc6c32056ee9b461ba0ef249753fa3d7656bd1e8058e1ed3570ad?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7', message: 'Hello. I want to rent a house...', timestamp: '10:20' },
  { id: '7', name: 'J. Alderson', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/83d98348628b496731a4419a5f6b1c47c17dd9a19600ca88044fc54b516d8ffd?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7', message: 'Hello. I want to rent a house...', timestamp: '10:20' },
];

const ChatList: React.FC = () => {
  return (
    <section className={styles.chatContainer}>
      <h2 className={styles.chatTitle}>Chat</h2>
      <div className={styles.searchBar}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/c6dd40ba7cfd43452c329c9030e3b5144e65dda9f88553310c811687b2b7a98e?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.searchIcon} />
        <span className={styles.searchPlaceholder}>Searching in chat</span>
      </div>
      <div className={styles.chatListContainer}>
        {chatData.map((chat, index) => (
          <React.Fragment key={chat.id}>
            <ChatItem {...chat} />
            {index < chatData.length - 1 && <div className={styles.divider} />}
          </React.Fragment>
        ))}
      </div>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ba5453621542a804b0790388b285c475a317613b95103584e095e3c831078ab2?placeholderIfAbsent=true&apiKey=9898e9505b4f4c40982b1ee127dde9c7" alt="" className={styles.loadMoreIndicator} />
    </section>
  );
};

export default ChatList;