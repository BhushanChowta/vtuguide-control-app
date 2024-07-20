// src/GoogleLoginButton.js
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


const GoogleLoginComponent = ({ setBlogs, setAccessToken }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("tokenResponse",tokenResponse);
      const accessToken = tokenResponse.access_token;
      setAccessToken(accessToken); // Set the access token here
      await fetchBloggerData(accessToken);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const fetchBloggerData = async (accessToken) => {
    try {
      const response = await axios.post('http://localhost:5000/api/blogger', {
        accessToken,
      });
      console.log('Blogger data:', response.data);
      setBlogs(response.data.items ?? []);
    } catch (error) {
      console.error('Error fetching Blogger data:', error);
    }
  };

  return (
    <button onClick={() => login()}>
      Login with Google
    </button>
  );
};

export default GoogleLoginComponent;
