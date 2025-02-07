import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  const isTokenValid = () => {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime; 
    } catch (error) {
      return false; 
    }
  };

  
  if (!token || !isTokenValid()) {
    localStorage.removeItem('token'); 
    return <Navigate to="/" />;
  }

  
  return <Outlet />;
};

export default PrivateRoute;