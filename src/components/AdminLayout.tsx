
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Bell,
  HardDrive,
  LifeBuoy,
  Database,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FadeIn from '@/components/animations/FadeIn';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  currentTab: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, currentTab }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: LifeBuoy, label: 'System Health', path: '/admin/system-health' },
    { icon: Database, label: 'Backup & Recovery', path: '/admin/backup' },
    { icon: ClipboardList, label: 'Audit Logs', path: '/admin/audit-logs' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 z-30 h-full bg-sidebar border-r border-border transition-all",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!collapsed && (
            <div className="font-semibold text-lg flex items-center">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground mr-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                </svg>
              </div>
              Admin Panel
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="py-4">
          <nav>
            <ul className="space-y-1 px-2">
              {sidebarItems.map((item) => (
                <li key={item.path}>
                  <Button
                    variant={item.path.startsWith(`/admin/${currentTab}`) || (item.path === '/admin' && currentTab === '') ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed && "justify-center px-2"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all",
        collapsed ? "ml-16" : "ml-64"
      )}>
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="text-xl font-semibold">{title}</h1>
        </header>
        
        <main className="p-6">
          <FadeIn>
            {children}
          </FadeIn>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
