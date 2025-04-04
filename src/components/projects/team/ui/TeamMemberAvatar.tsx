
import React from 'react';
import Avatar from '@/components/ui/avatar.custom';
import { User } from 'lucide-react';

interface TeamMemberAvatarProps {
  name: string;
  url?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TeamMemberAvatar: React.FC<TeamMemberAvatarProps> = ({ 
  name, 
  url, 
  size = 'md' 
}) => {
  // Get initials from name
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  const sizeClass = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base'
  };
  
  return (
    <Avatar 
      name={name} 
      className={sizeClass[size]}
      src={url}
      size={size === 'lg' ? 'md' : 'sm'}
      showStatus={false}
    />
  );
};

export default TeamMemberAvatar;
