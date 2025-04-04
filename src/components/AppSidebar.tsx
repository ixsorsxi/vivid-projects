
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
  ChevronRight
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth';

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
      title: 'Messages',
      href: '/messages',
      icon: MessageSquare,
    },
  ];
  
  const adminNavItems = [
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart2,
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
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-primary-foreground">PS</span>
          </div>
          <h1 className="ml-3 text-lg font-bold text-sidebar-foreground">ProjectSync</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="space-y-4">
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
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent",
                      isActive && "bg-sidebar-accent text-sidebar-foreground font-medium"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-primary text-[10px] font-medium text-sidebar-primary-foreground">
                      {item.badge}
                    </span>
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
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent",
                        isActive && "bg-sidebar-accent text-sidebar-foreground font-medium"
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
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
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent",
                    isActive && "bg-sidebar-accent text-sidebar-foreground font-medium"
                  )
                }
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help & Resources</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="mx-2 mb-2 rounded-lg bg-sidebar-accent p-4">
          <div className="mb-2 flex items-center">
            <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
              <ChevronRight className="h-4 w-4 text-sidebar-primary" />
            </div>
            <h3 className="ml-3 text-sm font-medium text-sidebar-foreground">Upgrade to Pro</h3>
          </div>
          <p className="text-xs text-sidebar-foreground/70">
            Get additional features and advanced tools
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
