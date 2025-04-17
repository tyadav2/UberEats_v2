import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = JSON.parse(localStorage.getItem('customerToken'));
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
