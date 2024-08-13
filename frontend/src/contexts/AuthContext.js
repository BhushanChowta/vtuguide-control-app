import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [selectedBlogId, setSelectedBlogId] = useState(localStorage.getItem('selectedBlogId') || null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  useEffect(() => {
    if (selectedBlogId) {
      localStorage.setItem('selectedBlogId', selectedBlogId);
    } else {
      localStorage.removeItem('selectedBlogId');
    }
  }, [selectedBlogId]);

  return (
    <AuthContext.Provider value={{
      accessToken,
      setAccessToken,
      selectedBlogId,
      setSelectedBlogId,
      blogs,
      setBlogs
    }}>
      {children}
    </AuthContext.Provider>
  );
};
