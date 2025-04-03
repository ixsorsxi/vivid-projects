
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { Sidebar } from './components/Sidebar';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import ProjectDetails from './pages/Projects/ProjectDetails';
import Calendar from './pages/Calendar';
import Team from './pages/Team';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import TimeTracking from './pages/TimeTracking';
import ProjectEdit from './pages/Projects/ProjectEdit';
import { ThemeProvider } from './components/theme-provider';
import { NotificationsProvider } from './context/notifications/NotificationsContext';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <NotificationsProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectId" element={<ProjectDetails />} />
            <Route path="projects/:projectId/edit" element={<ProjectEdit />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="team" element={<Team />} />
            <Route path="time" element={<TimeTracking />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </NotificationsProvider>
    </ThemeProvider>
  );
}

export default App;
