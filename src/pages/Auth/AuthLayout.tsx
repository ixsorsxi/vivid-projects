
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-muted/40">
      <div className="container flex max-w-[400px] flex-col space-y-2 py-12">
        <div className="flex flex-col space-y-2 text-center mb-6">
          <h1 className="text-3xl font-bold">WorkFlow Pro</h1>
          <p className="text-muted-foreground">
            Your complete workspace management solution
          </p>
        </div>
        <div className="mx-auto w-full space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
