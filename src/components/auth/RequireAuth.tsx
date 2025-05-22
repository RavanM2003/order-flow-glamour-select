
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';
import { UserRole } from '@/models/user.model';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!user) {
    toast({
      variant: "destructive",
      title: "Unauthorized",
      description: "You need to login to access this page."
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role as UserRole)) {
    toast({
      variant: "destructive",
      title: "Forbidden",
      description: "You do not have permission to access this page."
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
