
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { Sidebar } from './components/Sidebar';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import Calendar from './pages/Calendar';
import Team from './pages/Team';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import TimeTracking from './pages/TimeTracking';
import ProjectEdit from './pages/Projects/ProjectEdit';
import { AuthProvider } from './context/auth';
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
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:projectId" element={<Projects />} />
              <Route path="projects/:projectId/edit" element={<ProjectEdit />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="team" element={<Team />} />
              <Route path="time" element={<TimeTracking />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
