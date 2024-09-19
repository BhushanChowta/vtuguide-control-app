import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; 
import { Button } from '@mui/material';

const GoogleLoginComponent = () => {
  const { setUserInfo, setBlogs, setAccessToken, setAnalyPropertyId } = useContext(AuthContext);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/blogger',
    onSuccess: async (tokenResponse) => {
      console.log("tokenResponse", tokenResponse);
      const accessToken = tokenResponse.access_token;
      setAccessToken(accessToken); 

      const user = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
        accessToken: accessToken, 
      });
      setUserInfo(user.data);

      await fetchPropertyId(accessToken); 
      await fetchBloggerData(accessToken);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const fetchPropertyId = async (accessToken) => {
    try {
      const response = await axios.get(
        'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );

      const accountSummaries = response.data.accountSummaries;

      if (accountSummaries.length === 0) {
        throw new Error('No account summaries found.');
      }

      const propertyIds = accountSummaries.flatMap(account => 
        account.propertySummaries.map(property => ({
          id: property.property.split('/').pop(), 
          createTime: new Date(property.createTime),
        }))
      );

      propertyIds.sort((a, b) => a.createTime - b.createTime); 

      if (propertyIds.length > 0) {
        setAnalyPropertyId(propertyIds[0].id); 
      } else {
        throw new Error('No properties found.');
      }
    } catch (error) {
      console.error('Error fetching property IDs:', error);
    }
  };

  const fetchBloggerData = async (accessToken) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/blogger`, {
        accessToken,
      });
      console.log('Blogger data:', response.data);
      setBlogs(response.data.items ?? []);
    } catch (error) {
      console.error('Error fetching Blogger data:', error);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <Button variant="contained" onClick={() => login()}>
        Login with Google
      </Button>
    </div>
  );
};

export default GoogleLoginComponent;
