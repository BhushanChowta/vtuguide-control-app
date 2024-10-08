import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { AuthContext } from '../contexts/AuthContext';
import { Typography, Box } from '@mui/material'; 

const AnalyticsComponent = () => {
  const { accessToken, analyPropertyId } = useContext(AuthContext);
  const [analyticsData, setAnalyticsData] = useState([]);
  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchAnalyticsReports = async () => {
    if (!accessToken || !analyPropertyId || !apiKey) {
      console.error('Missing access token, property ID, or API key');
      return;
    }

    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
    const currentYear = currentDate.getFullYear();
    const startDate = `${currentYear}-${currentMonth}-01`; // First day of the current month
    const endDate = `${currentYear}-${currentMonth}-${new Date(currentYear, currentMonth, 0).getDate()}`; // Last day of the current month
  
    const requestData = {
      requests: [
        {
          dateRanges: [
            {
              startDate: startDate,
              endDate: endDate
            }
          ],
          dimensions: [
            {
              name: "date"
            }
          ],
          metrics: [
            {
              name: "screenPageViews"
            }
          ]
        }
      ],
    };

    try {
      const response = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${analyPropertyId}:batchRunReports?key=${apiKey}`,
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

      // Sort data by date in ascending order
      data.sort((a, b) => a.date.localeCompare(b.date));

      // Convert the sorted dates to DD-MM-YYYY format
      const formattedData = data.map(item => {
        const year = item.date.substring(0, 4);
        const month = item.date.substring(4, 6);
        const day = item.date.substring(6, 8);
      
        return {
          ...item,
          date: `${day}-${month}-${year}`
        };
      });
      
      setAnalyticsData(formattedData);
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
      text: 'This Month Views by Date'
    }
  };

  const chartSeries = [
    {
      name: 'Total Views',
      data: analyticsData.map(data => data.views)
    }
  ];

  return (
    <Box sx={{ p: 2 }}> {/* Add padding here */}
      <Typography variant="h4" gutterBottom> 
        Analytics Data
      </Typography>
      {analyticsData.length > 0 ? (
        <Chart 
          options={chartOptions} 
          series={chartSeries} 
          type="bar" 
          height={350} 
          width="100%" // Make chart responsive
        />
      ) : (
        <Typography variant="body1">Loading...</Typography> 
      )}
    </Box>
  );
};

export default AnalyticsComponent;
