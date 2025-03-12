
import React from 'react';
import { cn } from '@/lib/utils';
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
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SlideIn from './animations/SlideIn';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import NewProjectModal from './projects/NewProjectModal';

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin } = useAuth();
  
  const sidebarItems = [
    { icon: Home, label: 'Home', path: '/', active: currentPath === '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', active: currentPath === '/' },
    { icon: Calendar, label: 'Calendar', path: '/calendar', active: currentPath === '/calendar' },
    { icon: MessageSquare, label: 'Messages', path: '/messages', active: currentPath === '/messages' },
    { icon: FileText, label: 'Documents', path: '/documents', active: currentPath === '/documents' },
    { icon: Users, label: 'Team', path: '/team', active: currentPath === '/team' },
    { icon: Clock, label: 'Time Tracking', path: '/time-tracking', active: currentPath === '/time-tracking' },
    { icon: Inbox, label: 'Inbox', path: '/inbox', active: currentPath === '/inbox' },
  ];

  // Admin items only shown to admin users
  const adminItems = isAdmin ? [
    { icon: Shield, label: 'Admin Panel', path: '/admin', active: currentPath.startsWith('/admin') },
  ] : [];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 z-40 bg-sidebar border-r border-sidebar-border">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border/30">
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
        </div>
        
        {/* New Project Button */}
        <div className="px-4 py-4">
          <SlideIn direction="right" duration={800} delay={100}>
            <NewProjectModal buttonClassName="w-full justify-start gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground" />
          </SlideIn>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map((item, index) => (
              <SlideIn 
                key={item.label} 
                direction="right" 
                duration={800} 
                delay={150 + index * 50} 
                className="w-full"
              >
                <li>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      item.active 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              </SlideIn>
            ))}

            {/* Admin Section if user is admin */}
            {adminItems.length > 0 && (
              <>
                <li className="mt-6 mb-2 px-3">
                  <div className="text-xs uppercase font-semibold text-sidebar-foreground/50">
                    Administration
                  </div>
                </li>
                {adminItems.map((item, index) => (
                  <SlideIn 
                    key={item.label} 
                    direction="right" 
                    duration={800} 
                    delay={400 + index * 50} 
                    className="w-full"
                  >
                    <li>
                      <Link
                        to={item.path}
                        className={cn(
                          'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                          item.active 
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'
                        )}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </Link>
                    </li>
                  </SlideIn>
                ))}
              </>
            )}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border/30">
          <SlideIn direction="up" duration={800}>
            <Link
              to="/profile"
              className={cn(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                currentPath === '/profile' 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'
              )}
            >
              <Settings className="mr-3 h-5 w-5" />
              Profile & Settings
            </Link>
          </SlideIn>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
