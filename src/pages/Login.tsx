
import React from 'react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  return <Navigate to="/auth/login" replace />;
};

export default Login;
