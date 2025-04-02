
import React from 'react';
import { TeamMembersList } from '@/components/projects/team/ui';

interface MemberType {
  id?: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface ProjectCardMembersProps {
  members?: MemberType[];
  maxVisible?: number;
}

const ProjectCardMembers: React.FC<ProjectCardMembersProps> = ({ 
  members = [], 
  maxVisible = 3 
}) => {
  // Safely ensure members is always an array
  const safeMembers = Array.isArray(members) ? members : [];
  
  if (safeMembers.length === 0) {
    return null;
  }
  
  // Transform the members array to match the TeamMember type
  const teamMembers = safeMembers.map(member => ({
    id: member.id || String(Date.now()),
    name: member.name,
    role: member.role || 'Team Member',
    user_id: undefined
  }));
  
  return (
    <div className="mr-2">
      <TeamMembersList 
        members={teamMembers} 
        maxVisible={maxVisible} 
        size="xs" 
      />
    </div>
  );
};

export default ProjectCardMembers;
