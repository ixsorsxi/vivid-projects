
import React from 'react';
import { motion } from 'framer-motion';

const LoginHeader = () => {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} 
      className="text-center"
    >
      <h2 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
        Welcome Back
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        Sign in to continue to your workspace
      </p>
    </motion.div>
  );
};

export default LoginHeader;
