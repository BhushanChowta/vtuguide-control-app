import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header'; 
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UploadIcon  from '@mui/icons-material/Backup'; // Import the icon

const ActionLogs = () => {
  const { selectedBlogId: blogId, userInfo, accessToken } = useContext(AuthContext); 
  const [actionLogs, setActionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 10; 

  useEffect(() => {
    const fetchActionLogs = async () => {
      if (!blogId || !accessToken) {
        setError('Missing blog ID or access token.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/actionlogs`, {
          params: { blogId, accessToken, googleID: userInfo.googleID }
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

  // Function to format the date (You can keep your existing formatDate function)
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
  
  // Create a mapping of action types
  const actionTypeMapping = {
    'CREATE_POST': <><AddCircleOutlineIcon /> &nbsp; Created Post</>,
    'DELETE_POST': <><DeleteIcon /> &nbsp; Deleted Post</>, 
    'EDIT_POST': <><EditIcon /> &nbsp; Edited Post</>,
    'DUMPED_POST': <><UploadIcon   /> &nbsp; Dumped Post</>,
  };

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = actionLogs.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <Header /> 

      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 0 }}> 
        User Action History
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 0 }}> {/* Add some top margin */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Action Type</TableCell>
              <TableCell>Blog ID</TableCell>
              <TableCell>Post ID</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {error}
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && currentLogs.length === 0 && ( 
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No action logs found.
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && currentLogs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.userId}</TableCell>
                <TableCell sx={{ display: 'flex', alignItems: 'center' }}> 
                  {actionTypeMapping[log.actionType] || log.actionType} 
                </TableCell>
                <TableCell>{log.blogId || 'N/A'}</TableCell>
                <TableCell>{log.postId || 'N/A'}</TableCell>
                <TableCell>{formatDate(log.timestamp)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination 
        count={Math.ceil(actionLogs.length / itemsPerPage)} 
        page={currentPage} 
        onChange={handlePageChange} 
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }} 
      />
    </div>
  );
};

export default ActionLogs;
