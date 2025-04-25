
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout';
import { useAuth } from './context/auth/AuthContext';

function App() {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
