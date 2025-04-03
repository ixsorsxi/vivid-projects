
import React from 'react';
import Avatar from '@/components/ui/avatar.custom';

interface TeamMemberAvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
}

const TeamMemberAvatar: React.FC<TeamMemberAvatarProps> = ({ 
  name,
  imageUrl,
  size = 'md',
  status = 'none'
}) => {
  // Map size to pixel dimensions
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <Avatar 
      name={name} 
      src={imageUrl} 
      className={sizeMap[size]}
      status={status}
    />
  );
};

export default TeamMemberAvatar;
