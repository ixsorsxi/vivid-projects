
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Auth = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden border-none shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-indigo-600/5 to-purple-600/10 opacity-50 z-0 rounded-lg"></div>
          <CardHeader className="relative z-10 space-y-2 pb-6 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center mb-3 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
              Projectify
            </h1>
            <p className="text-muted-foreground/80 text-sm max-w-xs mx-auto">
              Your modern project management solution
            </p>
          </CardHeader>
          <CardContent className="relative z-10 px-8 pb-8">
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
