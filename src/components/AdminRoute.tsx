
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/toast-wrapper';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Verifying permissions...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    toast.error("Authentication required", {
      description: "Please log in to access the admin panel",
    });
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if authenticated but not admin
  if (!isAdmin) {
    toast.error("Access denied", {
      description: "You don't have permission to access the admin panel",
    });
    return <Navigate to="/" replace />;
  }

  // Render the admin content
  return <>{children}</>;
};

export default AdminRoute;
