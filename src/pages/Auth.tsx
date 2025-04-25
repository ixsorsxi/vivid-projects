
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { motion } from 'framer-motion';

const Auth = () => {
  const auth = useAuth();
  
  // Redirect to home if already authenticated
  if (auth.isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400 via-purple-500/30 to-pink-500/20 dark:from-indigo-900/60 dark:via-purple-900/40 dark:to-pink-900/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-20 w-72 h-72 bg-purple-400/30 dark:bg-purple-700/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-indigo-400/30 dark:bg-indigo-700/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-400/30 dark:bg-pink-700/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Card with glassmorphism effect */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="overflow-hidden relative z-10 border border-white/20 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"
        >
          <div className="relative z-10 px-6 pt-8 pb-6 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <motion.h1 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-sm"
            >
              Projectify
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-muted-foreground/80 text-sm max-w-xs mx-auto mt-2"
            >
              Your modern project management solution
            </motion.p>
          </div>
          <div className="relative z-10 px-6 pb-8">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
