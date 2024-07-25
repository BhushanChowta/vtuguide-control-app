// src/AnalyticsComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

const AnalyticsComponent = ({ accessToken }) => {
  const [analyticsData, setAnalyticsData] = useState([]);
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
          dateRanges: [
            {
              startDate: "2024-06-01",
              endDate: "2024-06-30"
            }
          ],
          dimensions: [
            {
              name: "date"
            }
          ],
          metrics: [
            {
              name: "screenPageViews" // Use "screenPageViews" for total views in GA4
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

      const data = response.data.reports[0].rows.map(row => ({
        date: row.dimensionValues[0].value,
        views: parseInt(row.metricValues[0].value, 10)
      }));

      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching reports:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchAnalyticsReports();
    }
  }, [accessToken]);

  const chartOptions = {
    chart: {
      type: 'bar'
    },
    xaxis: {
      categories: analyticsData.map(data => data.date)
    },
    title: {
      text: 'Total Views by Date'
    }
  };

  const chartSeries = [
    {
      name: 'Total Views',
      data: analyticsData.map(data => data.views)
    }
  ];

  return (
    <div>
      <h2>Analytics Data</h2>
      {analyticsData.length > 0 ? (
        <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AnalyticsComponent;
