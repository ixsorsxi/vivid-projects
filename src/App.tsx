
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import Documents from "./pages/Documents";
import Team from "./pages/Team";
import TimeTracking from "./pages/TimeTracking";
import Inbox from "./pages/Inbox";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import UserManagement from "./pages/Admin/Users";
import SystemSettings from "./pages/Admin/Settings";
import AuditLogs from "./pages/Admin/AuditLogs";
import SystemHealth from "./pages/Admin/SystemHealth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
            <Route path="/time-tracking" element={<ProtectedRoute><TimeTracking /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><SystemSettings /></AdminRoute>} />
            <Route path="/admin/audit-logs" element={<AdminRoute><AuditLogs /></AdminRoute>} />
            <Route path="/admin/system-health" element={<AdminRoute><SystemHealth /></AdminRoute>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
