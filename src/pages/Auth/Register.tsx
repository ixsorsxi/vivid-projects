
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertCircle, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

const Register = () => {
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerAnimation}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemAnimation} className="space-y-2 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-3">
          <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold">Registration Restricted</h2>
        <p className="text-sm text-muted-foreground">
          User registration is only available through the admin panel
        </p>
      </motion.div>
      
      <motion.div variants={itemAnimation}>
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            New accounts can only be created by administrators. Please contact your administrator to request an account.
          </AlertDescription>
        </Alert>
      </motion.div>
      
      <motion.div variants={itemAnimation} className="text-center text-sm pt-4">
        <Link to="/auth/login" className="inline-flex items-center text-indigo-500 hover:text-indigo-600 font-medium">
          Return to login
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Register;
