
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CalendarDays, Users, BarChart3, Settings, FileText, FolderKanban } from 'lucide-react';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ setOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath.startsWith(path);

  const handleClick = () => {
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-r bg-background">
      <div className="flex h-16 items-center px-4 py-6 md:h-[60px]">
        <Logo />
      </div>
      <nav className="grid gap-1 px-2 group-[.active]:bg-accent md:grid-cols-1">
        <Button
          variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
          className={cn(
            'h-10 justify-start px-4 py-2',
            isActive('/dashboard')
              ? 'bg-accent text-accent-foreground hover:bg-accent/90'
              : ''
          )}
          asChild
          onClick={handleClick}
        >
          <Link to="/dashboard">
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Link>
        </Button>
        <Button
          variant={isActive('/projects') ? 'secondary' : 'ghost'}
          className={cn(
            'h-10 justify-start px-4 py-2',
            isActive('/projects')
              ? 'bg-accent text-accent-foreground hover:bg-accent/90'
              : ''
          )}
          asChild
          onClick={handleClick}
        >
          <Link to="/projects">
            <FolderKanban className="mr-2 h-5 w-5" />
            Projects
          </Link>
        </Button>
        <Button
          variant={isActive('/tasks') ? 'secondary' : 'ghost'}
          className={cn(
            'h-10 justify-start px-4 py-2',
            isActive('/tasks')
              ? 'bg-accent text-accent-foreground hover:bg-accent/90'
              : ''
          )}
          asChild
          onClick={handleClick}
        >
          <Link to="/tasks">
            <FileText className="mr-2 h-5 w-5" />
            Tasks
          </Link>
        </Button>
        <Button
          variant={isActive('/calendar') ? 'secondary' : 'ghost'}
          className={cn(
            'h-10 justify-start px-4 py-2',
            isActive('/calendar')
              ? 'bg-accent text-accent-foreground hover:bg-accent/90'
              : ''
          )}
          asChild
          onClick={handleClick}
        >
          <Link to="/calendar">
            <CalendarDays className="mr-2 h-5 w-5" />
            Calendar
          </Link>
        </Button>
        <Button
          variant={isActive('/team') ? 'secondary' : 'ghost'}
          className={cn(
            'h-10 justify-start px-4 py-2',
            isActive('/team')
              ? 'bg-accent text-accent-foreground hover:bg-accent/90'
              : ''
          )}
          asChild
          onClick={handleClick}
        >
          <Link to="/team">
            <Users className="mr-2 h-5 w-5" />
            Team
          </Link>
        </Button>
        <Button
          variant={isActive('/reports') ? 'secondary' : 'ghost'}
          className={cn(
            'h-10 justify-start px-4 py-2',
            isActive('/reports')
              ? 'bg-accent text-accent-foreground hover:bg-accent/90'
              : ''
          )}
          asChild
          onClick={handleClick}
        >
          <Link to="/reports">
            <BarChart3 className="mr-2 h-5 w-5" />
            Reports
          </Link>
        </Button>
        <Button
          variant={isActive('/settings') ? 'secondary' : 'ghost'}
          className={cn(
            'h-10 justify-start px-4 py-2',
            isActive('/settings')
              ? 'bg-accent text-accent-foreground hover:bg-accent/90'
              : ''
          )}
          asChild
          onClick={handleClick}
        >
          <Link to="/settings">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Link>
        </Button>
      </nav>
    </div>
  );
};
