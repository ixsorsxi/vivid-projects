
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import ProjectDetails from './pages/Projects/ProjectDetails';
import Calendar from './pages/Calendar';
import Team from './pages/Team';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import TimeTracking from './pages/TimeTracking';
import ProjectEdit from './pages/Projects/ProjectEdit';
import Tasks from './pages/Tasks';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Messages from './pages/Messages';
import { ThemeProvider } from './components/theme-provider';
import { NotificationsProvider } from './context/notifications/NotificationsContext';
import Auth from './pages/Auth';

// Admin components
import AdminPanel from './pages/Admin/AdminPanel';
import AdminRoute from './components/AdminRoute';
import UserManagement from './pages/Admin/Users';
import AdminDashboard from './pages/Admin/Dashboard';
import SystemSettings from './pages/Admin/Settings';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <NotificationsProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<Auth />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectId" element={<ProjectDetails />} />
            <Route path="projects/:projectId/edit" element={<ProjectEdit />} />
            
            <Route path="tasks" element={<Tasks />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="documents" element={<Documents />} />
            <Route path="team" element={<Team />} />
            <Route path="messages" element={<Messages />} />
            <Route path="time" element={<TimeTracking />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><SystemSettings /></AdminRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </NotificationsProvider>
    </ThemeProvider>
  );
}

export default App;
