
import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
  status?: 'online' | 'offline';
}

export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  src, 
  size = 'md',
  className = '',
  showStatus = false,
  status = 'offline'
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return '?';
    
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <AvatarPrimitive.Root className={cn(`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted`, 
      sizeClasses[size], 
      className
    )}>
      <AvatarPrimitive.Image 
        src={src} 
        alt={name}
        className="h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback 
        className="flex h-full w-full items-center justify-center rounded-full bg-muted"
      >
        {getInitials(name)}
      </AvatarPrimitive.Fallback>
      
      {showStatus && (
        <span className={cn(
          "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-1 ring-white",
          status === 'online' ? 'bg-green-400' : 'bg-gray-300'
        )} />
      )}
    </AvatarPrimitive.Root>
  );
};

// Also export as default for compatibility
export default Avatar;
