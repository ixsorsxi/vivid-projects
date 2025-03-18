
import React from 'react';

interface TeamMembersListProps {
  teamMembers: string[];
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({ teamMembers }) => {
  return (
    <div className="flex -space-x-2 mt-4">
      {teamMembers.slice(0, 5).map((name, index) => (
        <div key={index} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium ring-2 ring-background">
          {name.charAt(0).toUpperCase()}
        </div>
      ))}
      
      {teamMembers.length > 5 && (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-medium ring-2 ring-background">
          +{teamMembers.length - 5}
        </div>
      )}
    </div>
  );
};

export default TeamMembersList;
