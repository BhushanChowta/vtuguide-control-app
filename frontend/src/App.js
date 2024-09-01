import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import GoogleProvider from './components/GoogleProvider';
import GoogleLoginComponent from './components/GoogleLoginComponent';
import { AuthContext } from './contexts/AuthContext';
import './style.css'; // Import custom CSS for styling

const App = () => {
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to /dashboard if the user is authenticated and visits the root /
  useEffect(() => {
    if (accessToken) {
      navigate('/dashboard');
    }
  }, [accessToken, navigate]);

  return (
    <GoogleProvider>
      <div className="App">
        {!accessToken &&
          <GoogleLoginComponent />
        }
        {accessToken && (
          <nav>
            <Link to="/dashboard">Dashboard</Link>
          </nav>
        )}
      </div>
      <Outlet />
    </GoogleProvider>
  );
};

export default App;
