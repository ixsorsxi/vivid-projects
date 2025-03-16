
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Moon, Search, Settings, Sun, User, LogOut } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SlideIn from './animations/SlideIn';
import { useAuth } from '@/context/AuthContext';

export const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <SlideIn direction="down" duration={600} className="sticky top-0 z-50 w-full">
      <header className="frosted px-4 h-16 flex items-center justify-between border-b border-border/40">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <div className="relative md:w-64 w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="glass-input w-full py-2 pl-10 pr-4 rounded-full text-sm focus:outline-none"
            />
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            )}
          </Button>
          
          {isAuthenticated && (
            <>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" aria-label="Settings">
                <Settings className="h-5 w-5" />
              </Button>
            </>
          )}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2 flex items-center gap-2">
                  <Avatar name={user?.name || "User"} size="sm" status="online" />
                  <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" asChild>
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </header>
    </SlideIn>
  );
};

export default Navbar;
