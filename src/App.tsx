
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Team from './pages/Team';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import MobileWarning from './components/MobileWarning';
import ResetPassword from './pages/ResetPassword';
import Administration from './pages/Admin';
import AdminRoute from './components/AdminRoute';
import ProjectDetails from './pages/Projects/ProjectDetails';
import ProjectEdit from './pages/Projects/ProjectEdit';
import TimeTracking from './pages/TimeTracking';
import AuthProvider from './context/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

// Create a new QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:projectId" element={<ProjectDetails />} />
              <Route path="projects/:projectId/edit" element={<ProjectEdit />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="team" element={<Team />} />
              <Route path="reports" element={<Reports />} />
              <Route path="time" element={<TimeTracking />} />
              <Route path="admin/*" element={<AdminRoute><Administration /></AdminRoute>} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
        <MobileWarning />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
