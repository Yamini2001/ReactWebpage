import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authContext';

export default function ProtectedRoute({ allowedRole }) {
  const { user } = useAuth();

  // If no user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not authorized for this route
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  // If authorized, render the child routes
  return <Outlet />;
}
