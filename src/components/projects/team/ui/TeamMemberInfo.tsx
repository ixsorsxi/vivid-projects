
import React from 'react';
import RoleBadge from './RoleBadge';

interface TeamMemberInfoProps {
  name: string;
  role: string;
  email?: string;
  isManager?: boolean;
  compact?: boolean;
}

/**
 * A component for displaying team member information (name, role, etc.)
 */
export const TeamMemberInfo: React.FC<TeamMemberInfoProps> = ({ 
  name, 
  role, 
  email,
  isManager = false,
  compact = false
}) => {
  const isManagerRole = isManager || role?.toLowerCase().includes('manager') || false;
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <h3 className="font-medium text-base">
          {name}
          {isManagerRole && (
            <span className="ml-1 text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
                <path d="M12 2L4 22h16L12 2z" />
              </svg>
            </span>
          )}
        </h3>
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <RoleBadge role={role} size={compact ? 'sm' : 'md'} />
        
        {email && !compact && (
          <span className="text-xs text-muted-foreground">{email}</span>
        )}
      </div>
    </div>
  );
};

export default TeamMemberInfo;
