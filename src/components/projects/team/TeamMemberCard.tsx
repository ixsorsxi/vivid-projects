
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserX, Loader2 } from 'lucide-react';
import { TeamMember } from './types';
import { TeamMemberAvatar, TeamMemberInfo } from './ui';

interface TeamMemberCardProps {
  member: TeamMember;
  onRemove: (id: string | number) => void;
  isRemoving?: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onRemove, isRemoving = false }) => {
  const handleRemove = () => {
    if (member.id && !isRemoving) {
      onRemove(member.id);
    }
  };

  // Improved format role function to handle kebab-case, snake_case, and camelCase
  const formatRole = (role: string) => {
    return role
      .replace(/([a-z])([A-Z])/g, '$1 $2') // handle camelCase
      .replace(/[_-]/g, ' ')               // handle kebab-case and snake_case
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Improved manager check
  const isManager = !!member.role?.toLowerCase().includes('manager');
  
  // Get formatted role for display
  const displayRole = formatRole(member.role || 'Team Member');

  // Debug log to check data
  console.log('TeamMemberCard rendering with member:', member);

  return (
    <div className="relative flex items-center p-4 border rounded-lg bg-card/40 hover:bg-accent/50 transition-colors shadow-sm">
      <TeamMemberAvatar 
        name={member.name || 'Team Member'} 
        role={displayRole}
        size="md" 
        showStatus={true}
        className="mr-4"
      />
      
      <div className="flex-1">
        <TeamMemberInfo 
          name={member.name || 'Team Member'} 
          role={displayRole}
          isManager={isManager}
        />
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
        onClick={handleRemove}
        disabled={isRemoving}
        aria-label={`Remove ${member.name || 'team member'}`}
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserX className="h-4 w-4" />
        )}
        <span className="sr-only">Remove team member</span>
      </Button>
    </div>
  );
};

export default TeamMemberCard;
