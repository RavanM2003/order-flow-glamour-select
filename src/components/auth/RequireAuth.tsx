
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/models/user.model';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[];
  requiredPermission?: string;
}

const RequireAuth = ({ 
  children, 
  allowedRoles = [], 
  requiredPermission
}: RequireAuthProps) => {
  const { session, isLoading, checkAccess, hasPermission } = useAuth();
  const location = useLocation();
  const [isMockAuthenticated, setIsMockAuthenticated] = useState(false);
  const [mockUserRole, setMockUserRole] = useState<UserRole | null>(null);
  
  // Check for mock authentication
  useEffect(() => {
    const mockUserData = localStorage.getItem('MOCK_USER_DATA');
    if (mockUserData) {
      try {
        const { user, expiry } = JSON.parse(mockUserData);
        if (expiry && expiry > Date.now()) {
          setIsMockAuthenticated(true);
          setMockUserRole(user.role as UserRole);
        } else {
          localStorage.removeItem('MOCK_USER_DATA');
        }
      } catch (e) {
        localStorage.removeItem('MOCK_USER_DATA');
      }
    }
  }, []);
  
  // Check mock user access
  const mockUserHasAccess = () => {
    if (!isMockAuthenticated || !mockUserRole) return false;
    
    // Super admin has access to everything
    if (mockUserRole === 'super_admin') return true;
    
    // Check if user's role is in the allowed roles
    return allowedRoles.includes(mockUserRole);
  };
  
  // Show loading indicator while checking auth status
  if (isLoading && !isMockAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }
  
  // If mock authenticated and has access, allow access
  if (isMockAuthenticated && mockUserHasAccess()) {
    return <>{children}</>;
  }
  
  // If not authenticated, redirect to login
  if (!session.isAuthenticated && !isMockAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If permission is required, check for it
  if (requiredPermission && !hasPermission(requiredPermission) && !mockUserHasAccess()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-center">
          You don't have the required permission to access this page.
          {session.profile?.role && (
            <span> Your role ({session.profile.role}) doesn't have the necessary permissions.</span>
          )}
          {isMockAuthenticated && mockUserRole && (
            <span> Your role ({mockUserRole}) doesn't have the necessary permissions.</span>
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
  
  // If roles are specified and user doesn't have access, show unauthorized or redirect
  if (allowedRoles.length > 0 && !checkAccess(allowedRoles) && !mockUserHasAccess()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-center">
          You don't have permission to access this page.
          {session.profile?.role && (
            <span> Your role ({session.profile.role}) doesn't have the required permissions.</span>
          )}
          {isMockAuthenticated && mockUserRole && (
            <span> Your role ({mockUserRole}) doesn't have the required permissions.</span>
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
