
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const Auth = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Projectify</CardTitle>
          <CardDescription className="text-center">
            Manage your projects efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
