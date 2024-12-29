import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      // Store in localStorage or sessionStorage based on rememberMe
      const storage = localStorage.getItem('rememberMe') === 'true' ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(userData));
    } else {
      // Clear both storages on logout
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);