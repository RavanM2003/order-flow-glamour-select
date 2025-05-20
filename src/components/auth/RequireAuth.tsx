
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/models/user.model';
import { ROUTE_PERMISSIONS } from '@/models/role.model';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: string;
}

const RequireAuth = ({ 
  children, 
  allowedRoles = [], 
  requiredPermission
}: RequireAuthProps) => {
  const { session, isLoading, checkAccess, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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

  // Check if the current route requires specific permission
  useEffect(() => {
    const path = location.pathname;
    const requiredPermissionForRoute = ROUTE_PERMISSIONS[path];
    
    if (requiredPermissionForRoute && !hasPermission(requiredPermissionForRoute) && !isMockAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [location, hasPermission, navigate, isMockAuthenticated]);
  
  // Mock user access check
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
      <Navigate to="/admin" replace />
    );
  }
  
  // If roles are specified and user doesn't have access, redirect to dashboard
  if (allowedRoles.length > 0 && !checkAccess(allowedRoles) && !mockUserHasAccess()) {
    return (
      <Navigate to="/admin" replace />
    );
  }
  
  // User is authenticated and has required role, render children
  return <>{children}</>;
};

export default RequireAuth;
