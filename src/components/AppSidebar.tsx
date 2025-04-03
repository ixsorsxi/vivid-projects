
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  MessageSquare, 
  FileText,
  Users,
  Clock,
  Settings,
  FileIcon,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth';
import Logo from '@/components/Logo';
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

const AppSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin } = useAuth();
  
  const mainMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: currentPath === '/dashboard' || currentPath === '/' },
    { icon: FolderKanban, label: 'Projects', path: '/projects', active: currentPath.startsWith('/projects') },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks', active: currentPath === '/tasks' },
    { icon: Calendar, label: 'Calendar', path: '/calendar', active: currentPath === '/calendar' },
    { icon: FileText, label: 'Documents', path: '/documents', active: currentPath === '/documents' },
  ];

  const secondaryMenuItems = [
    { icon: MessageSquare, label: 'Messages', path: '/messages', active: currentPath === '/messages' },
    { icon: Users, label: 'Team', path: '/team', active: currentPath === '/team' },
    { icon: Clock, label: 'Time Tracking', path: '/time', active: currentPath === '/time' },
    { icon: BarChart3, label: 'Reports', path: '/reports', active: currentPath === '/reports' },
  ];

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="h-16 border-b border-border/40 flex items-center px-6">
        <Logo />
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarGroup className="mb-4">
          <div className="px-2">
            <NewProjectModal buttonClassName="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" />
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild
                    isActive={item.active}
                    tooltip={item.label}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center gap-2 w-full',
                        item.active ? 'text-primary font-medium' : 'text-muted-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild
                    isActive={item.active}
                    tooltip={item.label}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center gap-2 w-full',
                        item.active ? 'text-primary font-medium' : 'text-muted-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild
                    isActive={currentPath.startsWith('/admin')}
                    tooltip="Admin Panel"
                  >
                    <Link
                      to="/admin"
                      className={cn(
                        'flex items-center gap-2 w-full',
                        currentPath.startsWith('/admin') ? 'text-primary font-medium' : 'text-muted-foreground'
                      )}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Admin Panel</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border/40">
        <SidebarMenuButton 
          asChild
          isActive={currentPath === '/profile'}
          tooltip="Settings"
        >
          <Link
            to="/profile"
            className={cn(
              'flex items-center gap-2 w-full',
              currentPath === '/profile' ? 'text-primary font-medium' : 'text-muted-foreground'
            )}
          >
            <Settings className="h-5 w-5" />
            <span>Profile & Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
