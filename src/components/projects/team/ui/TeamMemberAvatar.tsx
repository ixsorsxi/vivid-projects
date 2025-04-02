
import React from 'react';
import Avatar from '@/components/ui/avatar';

interface TeamMemberAvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  role?: string;
  showStatus?: boolean;
}

/**
 * A specialized avatar component for team members that includes role-based styling
 */
export const TeamMemberAvatar: React.FC<TeamMemberAvatarProps> = ({ 
  name, 
  src, 
  size = 'md',
  role,
  showStatus = false 
}) => {
  // Determine if the member is a manager based on their role
  const isManager = role?.toLowerCase().includes('manager') || false;
  
  // Determine the status based on role (this is a simple example - you might want
  // to enhance this with actual online status in a real app)
  const status = isManager ? 'online' : undefined;
  
  // Custom styling for manager avatars
  const managerClassName = isManager ? 'ring-2 ring-amber-400' : '';
  
  return (
    <Avatar 
      name={name} 
      src={src || `https://avatar.vercel.sh/${name.replace(/\s+/g, '')}.png`}
      size={size}
      status={showStatus ? status : undefined}
      className={managerClassName}
    />
  );
};

export default TeamMemberAvatar;
