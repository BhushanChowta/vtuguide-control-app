// src/AnalyticsComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnalyticsComponent = ({ accessToken }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const propertyId = process.env.REACT_APP_PROPERTY_ID;
  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchAnalyticsReports = async () => {
    if (!accessToken || !propertyId || !apiKey) {
      console.error('Missing access token, property ID, or API key');
      return;
    }

    const requestData = {
      requests: [
        {
          "dateRanges": [
            {
              "startDate": "2022-01-01",
              "endDate": "2024-06-30"
            }
          ],
          "dimensions": [
            {
              "name": "country"
            }
          ],
          "metrics": [
            {
              "name": "activeUsers"
            }
          ]
        }
      ],  
    };

    try {
      const response = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports?key=${apiKey}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchAnalyticsReports();
    }
  }, [accessToken]);

  return (
    <div>
      <h2>Analytics Data</h2>
      {analyticsData ? (
        <pre>{JSON.stringify(analyticsData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AnalyticsComponent;
