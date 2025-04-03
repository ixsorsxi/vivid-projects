
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Status = 'online' | 'offline' | 'busy' | 'away' | null;

interface TeamMemberAvatarProps {
  name: string;
  avatar?: string;
  className?: string;
  status?: Status;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

const TeamMemberAvatar: React.FC<TeamMemberAvatarProps> = ({
  name,
  avatar,
  className,
  status = null,
  size = 'md',
  showBadge = false
}) => {
  // Convert size to dimensions
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  // Status color mapping
  const statusColors = {
    online: 'bg-green-500',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
    offline: 'bg-gray-400'
  };

  // Get the initials from the name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = name ? getInitials(name) : '?';

  return (
    <div className="relative">
      <div 
        className={cn(
          "rounded-full flex items-center justify-center bg-primary/10 text-primary font-medium",
          sizeClasses[size],
          className
        )}
      >
        {initials}
      </div>
      
      {showBadge && status && (
        <div 
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-background",
            statusColors[status] || "bg-gray-400",
            size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'
          )}
        />
      )}
    </div>
  );
};

export default TeamMemberAvatar;
