
import React from 'react';
import { motion } from 'framer-motion';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';
import RestrictedRegistrationAlert from '@/components/auth/RestrictedRegistrationAlert';

const Login = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <LoginHeader />
      <LoginForm />
      <RestrictedRegistrationAlert />
    </motion.div>
  );
};

export default Login;
