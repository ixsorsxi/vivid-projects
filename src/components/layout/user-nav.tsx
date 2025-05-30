
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';

const getRandomColor = () => {
  const colors = [
    'bg-blue-500 text-white',
    'bg-green-500 text-white',
    'bg-purple-500 text-white',
    'bg-pink-500 text-white',
    'bg-yellow-500 text-black',
    'bg-indigo-500 text-white',
    'bg-teal-500 text-white',
    'bg-orange-500 text-white',
    'bg-cyan-500 text-white',
    'bg-rose-500 text-white',
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Helper function to get initials from full name
const getInitials = (name: string) => {
  if (!name) return "U";
  
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || "U";
  
  // Get first letter of first name and first letter of last name
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
};

export function UserNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const avatarColor = useMemo(() => getRandomColor(), [user?.id]);
  const userInitials = useMemo(() => getInitials(user?.name || ""), [user?.name]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 p-0">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${avatarColor}`}>
            <span className="text-xs font-medium">{userInitials}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
