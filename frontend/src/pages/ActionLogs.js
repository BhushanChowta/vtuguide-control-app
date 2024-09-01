import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const ActionLogs = () => {
  const { selectedBlogId: blogId, accessToken } = useContext(AuthContext); // Access context values
  const [actionLogs, setActionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActionLogs = async () => {
      if (!blogId || !accessToken) {
        setError('Missing blog ID or access token.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/actionlogs`, {
          params: { blogId, accessToken }
        });
        setActionLogs(response.data.reverse()); // Reverse the order of the logs
      } catch (error) {
        setError('Error fetching action logs.');
        console.error('Error fetching action logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActionLogs();
  }, [blogId, accessToken]); 
  
  // Function to format the date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Action Logs</h2>
      <table className="action-logs-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Action Type</th>
            <th>Blog ID</th>
            <th>Post ID</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {actionLogs.length > 0 ? (
            actionLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.userId}</td>
                <td>{log.actionType}</td>
                <td>{log.blogId || 'N/A'}</td>
                <td>{log.postId || 'N/A'}</td>
                <td>{formatDate(log.timestamp)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No action logs found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActionLogs;
