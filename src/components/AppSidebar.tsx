
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Home,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Shield,
  FileText,
  Clock,
  Users,
  Settings,
  FolderKanban,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth';
import SlideIn from './animations/SlideIn';
import NewProjectModal from './projects/NewProjectModal';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export const AppSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin } = useAuth();
  
  const sidebarItems = [
    { icon: Home, label: 'Home', path: '/', active: currentPath === '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: currentPath === '/dashboard' },
    { icon: FolderKanban, label: 'Projects', path: '/projects', active: currentPath === '/projects' || currentPath.startsWith('/projects/') },
    { icon: CheckSquare, label: 'My Tasks', path: '/my-tasks', active: currentPath === '/my-tasks' },
    { icon: Calendar, label: 'Calendar', path: '/calendar', active: currentPath === '/calendar' },
    { icon: MessageSquare, label: 'Messages', path: '/messages', active: currentPath === '/messages' },
    { icon: FileText, label: 'Documents', path: '/documents', active: currentPath === '/documents' },
    { icon: Users, label: 'Team', path: '/team', active: currentPath === '/team' },
    { icon: Clock, label: 'Time Tracking', path: '/time-tracking', active: currentPath === '/time-tracking' },
    { icon: Inbox, label: 'Inbox', path: '/inbox', active: currentPath === '/inbox' },
  ];

  const adminItems = isAdmin ? [
    { icon: Shield, label: 'Admin Panel', path: '/admin', active: currentPath.startsWith('/admin') },
  ] : [];

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 border-b border-sidebar-border/30">
        <SlideIn direction="right" duration={800}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-sidebar-primary rounded-md flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-sidebar-foreground">Projectify</h1>
          </div>
        </SlideIn>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-4">
            <SlideIn direction="right" duration={800} delay={100}>
              <NewProjectModal buttonClassName="w-full justify-start gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground" />
            </SlideIn>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <SlideIn 
                  key={item.label} 
                  direction="right" 
                  duration={800} 
                  delay={150 + index * 50}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild
                      isActive={item.active}
                      tooltip={item.label}
                    >
                      <Link
                        to={item.path}
                        className={cn(
                          'flex items-center gap-2 w-full',
                          item.active 
                            ? 'text-sidebar-accent-foreground' 
                            : 'text-sidebar-foreground/80'
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SlideIn>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section if user is admin */}
        {adminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item, index) => (
                  <SlideIn 
                    key={item.label} 
                    direction="right" 
                    duration={800} 
                    delay={400 + index * 50}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild
                        isActive={item.active}
                        tooltip={item.label}
                      >
                        <Link
                          to={item.path}
                          className={cn(
                            'flex items-center gap-2 w-full',
                            item.active 
                              ? 'text-sidebar-accent-foreground' 
                              : 'text-sidebar-foreground/80'
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SlideIn>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border/30">
        <SlideIn direction="up" duration={800}>
          <SidebarMenuButton 
            asChild
            isActive={currentPath === '/profile'}
            tooltip="Settings"
          >
            <Link
              to="/profile"
              className={cn(
                'flex items-center gap-2 w-full',
                currentPath === '/profile' 
                  ? 'text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground/80'
              )}
            >
              <Settings className="h-5 w-5" />
              <span>Profile & Settings</span>
            </Link>
          </SidebarMenuButton>
        </SlideIn>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
