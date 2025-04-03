import React from 'react';
import { Avatar } from '@/components/ui/avatar';
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
  // Convert our size to the Avatar component's size
  const avatarSize = {
    sm: 'xs',
    md: 'sm',
    lg: 'md'
  }[size] as 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  // Status color mapping
  const statusColors = {
    online: 'bg-green-500',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
    offline: 'bg-gray-400'
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <div className="relative">
      <Avatar 
        src={avatar}
        name={name}
        size={avatarSize}
        status={status || undefined}
        showStatus={showBadge}
        className={cn(sizeClasses[size], className)}
      />
      
      {/* We don't need an extra badge since Avatar component now has built-in status indicator */}
    </div>
  );
};

export default TeamMemberAvatar;
