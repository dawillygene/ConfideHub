import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from './AppProvider';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  const location = useLocation();

  if (user && location.pathname === '/auth') {
    return <Navigate to="/feed" replace />;
  }
  if (user === null && location.pathname !== '/auth') {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;
