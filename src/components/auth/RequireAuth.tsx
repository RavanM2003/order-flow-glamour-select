
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading screen while checking authentication
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user || !session) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
