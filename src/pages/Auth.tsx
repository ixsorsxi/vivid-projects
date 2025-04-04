
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';

const Auth = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Projectify</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Manage your projects efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Outlet />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 bg-muted/20">
            <p className="text-xs text-center w-full text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
