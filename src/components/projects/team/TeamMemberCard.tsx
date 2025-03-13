
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { TeamMember } from './types';
import { toast } from "@/components/ui/toast-wrapper";

interface TeamMemberCardProps {
  member: TeamMember;
  onRemove: (id: number) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onRemove }) => {
  const handleRemove = () => {
    onRemove(member.id);
    
    toast("Team member removed", {
      description: "The team member has been removed from the project",
    });
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
        {member.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1">
        <p className="font-medium">{member.name}</p>
        <p className="text-sm text-muted-foreground">{member.role}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-destructive"
        onClick={handleRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TeamMemberCard;
