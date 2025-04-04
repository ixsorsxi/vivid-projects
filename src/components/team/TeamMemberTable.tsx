
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { TeamMember } from './types';

interface TeamMemberTableProps {
  teamMembers: TeamMember[];
}

const TeamMemberTable: React.FC<TeamMemberTableProps> = ({ teamMembers }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Department</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Location</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Tasks</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
            <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {teamMembers.map((member) => (
            <tr key={member.id} className="hover:bg-muted/50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Avatar 
                    name={member.name} 
                    size="md" 
                    showStatus={true}
                    status={member.status === 'active' ? 'online' : 'offline'} 
                  />
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-muted-foreground text-sm">{member.role}</td>
              <td className="py-3 px-4 text-sm">{member.department}</td>
              <td className="py-3 px-4 text-muted-foreground text-sm">{member.location}</td>
              <td className="py-3 px-4">
                <div className="flex flex-col gap-1 w-32">
                  <div className="flex justify-between text-xs">
                    <span>{member.tasksCompleted}/{member.tasks}</span>
                    <span className="text-muted-foreground">{Math.round((member.tasksCompleted / member.tasks) * 100)}%</span>
                  </div>
                  <Progress value={(member.tasksCompleted / member.tasks) * 100} />
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge 
                  variant={member.status === 'active' ? 'success' : 'outline'} 
                  size="sm"
                >
                  {member.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMemberTable;
