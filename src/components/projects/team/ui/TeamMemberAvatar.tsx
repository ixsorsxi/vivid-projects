
import React, { useMemo } from 'react';
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

// Generate a consistent random color based on the user's name
const getColorFromName = (name: string) => {
  // Color palette for user avatars (bright, accessible colors)
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
  
  // Use the string to generate a consistent index
  let hashCode = 0;
  for (let i = 0; i < name.length; i++) {
    hashCode = (hashCode << 5) - hashCode + name.charCodeAt(i);
    hashCode |= 0; // Convert to 32bit integer
  }
  
  // Make sure it's positive and map it to our color array
  const index = Math.abs(hashCode) % colors.length;
  return colors[index];
};

// Get the initials from the name
const getInitials = (name: string) => {
  if (!name) return "?";
  
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || "?";
  
  // Get first letter of first name and first letter of last name
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
};

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

  const initials = useMemo(() => getInitials(name), [name]);
  
  // Generate a random color for the avatar based on the name
  const avatarColor = useMemo(() => getColorFromName(name), [name]);

  return (
    <div className="relative">
      <div 
        className={cn(
          "rounded-full flex items-center justify-center",
          sizeClasses[size],
          avatarColor,
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
