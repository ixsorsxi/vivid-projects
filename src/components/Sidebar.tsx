
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  ChevronLeft,
  Clock,
  FileText,
  Home,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  PlusCircle, 
  Settings,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SlideIn from './animations/SlideIn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const sidebarItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: MessageSquare, label: 'Messages', active: false },
    { icon: FileText, label: 'Documents', active: false },
    { icon: Users, label: 'Team', active: false },
    { icon: Clock, label: 'Time Tracking', active: false },
    { icon: Inbox, label: 'Inbox', active: false },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={cn(
          'fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 z-50 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
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
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          
          {/* New Project Button */}
          <div className="px-4 py-4">
            <SlideIn direction="right" duration={800} delay={100}>
              <Button className="w-full justify-start gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground">
                <PlusCircle className="h-4 w-4" />
                <span>New Project</span>
              </Button>
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
                    <a
                      href="#"
                      className={cn(
                        'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        item.active 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </a>
                  </li>
                </SlideIn>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border/30">
            <SlideIn direction="up" duration={800}>
              <a
                href="#"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground transition-colors"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </a>
            </SlideIn>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
