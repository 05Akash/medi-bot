// ChatContext.js
import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  return (
    <ChatContext.Provider value={{ chatHistory, setChatHistory, currentChat, setCurrentChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);