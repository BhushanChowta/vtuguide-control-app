import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActionLogs = ({ blogId, accessToken }) => {
  const [actionLogs, setActionLogs] = useState([]);

  useEffect(() => {
    const fetchActionLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/actionlogs', {
            params: { blogId , accessToken}
        });
        setActionLogs(response.data);
      } catch (error) {
        console.error('Error fetching action logs:', error);
      }
    };

    fetchActionLogs();
  }, []);

  return (
    <div>
      <h2>Action Logs</h2>
      <table>
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
          {actionLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.userId}</td>
              <td>{log.actionType}</td>
              <td>{log.blogId || 'N/A'}</td>
              <td>{log.postId || 'N/A'}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActionLogs;
