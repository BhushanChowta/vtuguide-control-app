import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const EXPIRATION_TIME = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

export const AuthProvider = ({ children }) => {
  const getItemWithExpiry = (key) => {
    const item = JSON.parse(localStorage.getItem(key));
    if (!item) return null;
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  const setItemWithExpiry = (key, value) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + EXPIRATION_TIME,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const [accessToken, setAccessToken] = useState(getItemWithExpiry('accessToken'));
  const [selectedBlogId, setSelectedBlogId] = useState(getItemWithExpiry('selectedBlogId'));
  const [blogs, setBlogs] = useState(getItemWithExpiry('blogs') || []);
  const [analyPropertyId, setAnalyPropertyId] = useState(getItemWithExpiry('analyPropertyId'));

  useEffect(() => {
    if (accessToken) {
      setItemWithExpiry('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  useEffect(() => {
    if (selectedBlogId) {
      setItemWithExpiry('selectedBlogId', selectedBlogId);
    } else {
      localStorage.removeItem('selectedBlogId');
    }
  }, [selectedBlogId]);

  useEffect(() => {
    if (blogs.length > 0) {
      setItemWithExpiry('blogs', blogs);
    } else {
      localStorage.removeItem('blogs');
    }
  }, [blogs]);

  useEffect(() => {
    if (analyPropertyId) {
      setItemWithExpiry('analyPropertyId', analyPropertyId);
    } else {
      localStorage.removeItem('analyPropertyId');
    }
  }, [analyPropertyId]);

  return (
    <AuthContext.Provider value={{
      accessToken,
      setAccessToken,
      selectedBlogId,
      setSelectedBlogId,
      blogs,
      setBlogs,
      analyPropertyId,
      setAnalyPropertyId
    }}>
      {children}
    </AuthContext.Provider>
  );
};
