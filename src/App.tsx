
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toast-wrapper';
import { AuthProvider } from '@/context/auth';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import ProjectDetails from '@/pages/Projects/ProjectDetails';
import MyTasks from '@/pages/MyTasks';
import Calendar from '@/pages/Calendar';
import Messages from '@/pages/Messages';
import Documents from '@/pages/Documents';
import Inbox from '@/pages/Inbox';
import Settings from '@/pages/Settings';
import Teams from '@/pages/Teams';
import TimeTracking from '@/pages/TimeTracking';
import AdminPanel from '@/pages/Admin/AdminPanel';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import AuthLayout from '@/pages/Auth/AuthLayout';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:projectId" element={<ProjectDetails />} />
              <Route path="my-tasks" element={<MyTasks />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="messages" element={<Messages />} />
              <Route path="documents" element={<Documents />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="settings" element={<Settings />} />
              <Route path="teams" element={<Teams />} />
              <Route path="time-tracking" element={<TimeTracking />} />
              <Route path="admin" element={<AdminPanel />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
