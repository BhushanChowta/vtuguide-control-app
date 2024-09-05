import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Adjust the path as necessary

const GoogleLoginComponent = () => {
  const { setBlogs, setAccessToken, setAnalyPropertyId  } = useContext(AuthContext);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/blogger',
    onSuccess: async (tokenResponse) => {
      console.log("tokenResponse", tokenResponse);
      const accessToken = tokenResponse.access_token;
      setAccessToken(accessToken); // Set the access token here
      await fetchPropertyId(accessToken); // Fetch property IDs
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

      // Extract and sort property IDs
      const propertyIds = accountSummaries.flatMap(account => 
        account.propertySummaries.map(property => ({
          id: property.property.split('/').pop(), // Extract property ID
          createTime: new Date(property.createTime), // Sort by creation time
        }))
      );

      propertyIds.sort((a, b) => a.createTime - b.createTime); // Sort by creation time

      if (propertyIds.length > 0) {
        // console.log('propertyIds data:', propertyIds[0]);

        setAnalyPropertyId(propertyIds[0].id); // Set the first property ID
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
    <>
      <h1>Google Login</h1>
      <button onClick={() => login()}>
        Login with Google
      </button>
    </>
  );
};

export default GoogleLoginComponent;
