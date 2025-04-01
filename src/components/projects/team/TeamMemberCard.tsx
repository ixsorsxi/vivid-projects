
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, UserX } from 'lucide-react';
import { TeamMember } from './types';

interface TeamMemberCardProps {
  member: TeamMember;
  onRemove: (id: string | number) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onRemove }) => {
  const handleRemove = () => {
    if (member.id) {
      onRemove(member.id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string = '') => {
    switch (role.toLowerCase()) {
      case 'project manager':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'developer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'designer':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'qa engineer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="relative flex items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage src={`https://avatar.vercel.sh/${member.name}.png`} alt={member.name} />
        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="font-medium text-base">{member.name}</h3>
          {member.role?.toLowerCase() === 'project manager' && (
            <BadgeCheck className="h-4 w-4 ml-1 text-primary" />
          )}
        </div>
        <div className={`text-xs px-2 py-0.5 rounded-full inline-flex mt-1 ${getRoleColor(member.role)}`}>
          {member.role || 'Team Member'}
        </div>
      </div>
      
      <Button variant="ghost" size="sm" className="shrink-0" onClick={handleRemove}>
        <UserX className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TeamMemberCard;
