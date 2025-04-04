
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  MessageSquare,
  BarChart2,
  Settings,
  HelpCircle,
  Zap,
  FileText,
  Calendar,
  Bell
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth';
import { Badge } from '@/components/ui/badge.custom';

const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  
  const mainNavItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: FolderKanban,
    },
    {
      title: 'My Tasks',
      href: '/tasks',
      icon: CheckSquare,
      badge: '5',
    },
    {
      title: 'Calendar',
      href: '/calendar',
      icon: Calendar,
    },
    {
      title: 'Documents',
      href: '/documents',
      icon: FileText,
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      badge: 'New',
      badgeVariant: 'primary'
    },
  ];
  
  const adminNavItems = [
    {
      title: 'Team Members',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart2,
    },
    {
      title: 'Notifications',
      href: '/admin/notifications',
      icon: Bell,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const isAdmin = user?.role === 'admin';
  
  return (
    <Sidebar>
      <SidebarHeader className="py-5">
        <div className="flex items-center px-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="ml-3 text-lg font-bold text-sidebar-foreground">ProjectSync</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              Main
            </h2>
            <nav className="grid gap-1 px-2">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent group",
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-foreground font-medium" 
                        : "hover:translate-x-1 transition-transform"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 transition-colors" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badgeVariant || "default"} 
                      className="ml-auto text-[10px] px-1.5 py-0 h-5"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
          
          {isAdmin && (
            <div>
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                Admin
              </h2>
              <nav className="grid gap-1 px-2">
                {adminNavItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent group",
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-foreground font-medium" 
                          : "hover:translate-x-1 transition-transform"
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 transition-colors" />
                    <span>{item.title}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
          
          <div>
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              Support
            </h2>
            <nav className="grid gap-1 px-2">
              <NavLink
                to="/help"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent group",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-foreground font-medium" 
                      : "hover:translate-x-1 transition-transform"
                  )
                }
              >
                <HelpCircle className="h-4 w-4 transition-colors" />
                <span>Help & Resources</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="mx-2 mb-2 p-2 text-xs text-center text-sidebar-foreground/70">
          <p>© {new Date().getFullYear()} ProjectSync</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
