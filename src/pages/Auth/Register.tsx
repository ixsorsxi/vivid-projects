
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Register = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">Registration Restricted</h2>
        <p className="text-sm text-muted-foreground">
          User registration is only available through the admin panel
        </p>
      </div>
      
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          New accounts can only be created by administrators. Please contact your administrator to request an account.
        </AlertDescription>
      </Alert>
      
      <div className="text-center text-sm mt-6">
        Already have an account?{' '}
        <Link to="/auth/login" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
