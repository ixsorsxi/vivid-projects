
import React from 'react';
import { Avatar } from '@/components/ui/avatar.custom';
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
  return (
    <Avatar 
      name={name} 
      className={size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'}
      src={url}
      size={size}
      showStatus={false}
    />
  );
};

export default TeamMemberAvatar;
