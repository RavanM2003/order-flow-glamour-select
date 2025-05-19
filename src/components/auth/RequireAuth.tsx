
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const RequireAuth = ({ children, allowedRoles = [] }: RequireAuthProps) => {
  const { session, isLoading, checkAccess } = useAuth();
  const location = useLocation();
  
  // Show loading indicator while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!session.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If roles are specified and user doesn't have access, show unauthorized or redirect
  if (allowedRoles.length > 0 && !checkAccess(allowedRoles)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-center">
          You don't have permission to access this page.
          {session.profile?.role && (
            <span> Your role ({session.profile.role}) doesn't have the required permissions.</span>
          )}
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  // User is authenticated and has required role, render children
  return <>{children}</>;
};

export default RequireAuth;
