
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
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  useSidebar 
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth';
import { Badge } from '@/components/ui/badge.custom';
import { Button } from '@/components/ui/button';

const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { collapsed, setCollapsed } = useSidebar();
  
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
      badgeVariant: 'primary' as const
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
      <SidebarHeader className="py-4 px-2 flex items-center justify-between">
        <div className="flex items-center px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && <h1 className="ml-2 text-base font-semibold text-sidebar-foreground">ProjectSync</h1>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="space-y-4">
          <div>
            {!collapsed && (
              <h2 className="mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                Main
              </h2>
            )}
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
                  {!collapsed && (
                    <>
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badgeVariant || "default"} 
                          className="ml-auto text-[10px] px-1.5 py-0 h-5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
          
          {isAdmin && (
            <div>
              {!collapsed && (
                <h2 className="mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                  Admin
                </h2>
              )}
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
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
          
          <div>
            {!collapsed && (
              <h2 className="mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                Support
              </h2>
            )}
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
                {!collapsed && <span>Help & Resources</span>}
              </NavLink>
            </nav>
          </div>
        </div>
      </SidebarContent>
      
      {!collapsed && (
        <SidebarFooter>
          <div className="mx-2 mb-1 p-2 text-xs text-center text-sidebar-foreground/60">
            <p>© {new Date().getFullYear()} ProjectSync</p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
