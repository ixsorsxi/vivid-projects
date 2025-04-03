
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Status = 'online' | 'offline' | 'busy' | 'away';

interface TeamMemberAvatarProps {
  name: string;
  avatar?: string;
  className?: string;
  status?: Status | null; // Make status optional with null
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

const getInitials = (name: string): string => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const TeamMemberAvatar: React.FC<TeamMemberAvatarProps> = ({
  name,
  avatar,
  className,
  status = null, // Default to null instead of 'none'
  size = 'md',
  showBadge = false
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  // Status color mapping
  const statusColors = {
    online: 'bg-green-500',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
    offline: 'bg-gray-500'
  };

  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size], className)}>
        {avatar && <AvatarImage src={avatar} alt={name} />}
        <AvatarFallback className="bg-primary/10 text-primary">{getInitials(name)}</AvatarFallback>
      </Avatar>
      
      {showBadge && status && (
        <Badge 
          variant="outline" 
          className={cn(
            "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-background",
            statusColors[status] // Only use the status color if status is defined
          )}
        />
      )}
    </div>
  );
};

export default TeamMemberAvatar;
