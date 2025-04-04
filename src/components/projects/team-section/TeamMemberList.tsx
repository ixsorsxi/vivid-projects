
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamMember } from '@/components/projects/team/types';

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  updateTeamMember: (memberId: string, field: keyof TeamMember, value: string) => void;
  removeTeamMember: (memberId: string) => void;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({
  teamMembers,
  updateTeamMember,
  removeTeamMember
}) => {
  if (teamMembers.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <p className="text-muted-foreground">No team members added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teamMembers.map((member, index) => (
        <div key={member.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Team Member {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeTeamMember(member.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Member name"
                value={member.name}
                onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={member.role}
                onValueChange={(value) => updateTeamMember(member.id, 'role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project-manager">Project Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="tester">QA Tester</SelectItem>
                  <SelectItem value="analyst">Business Analyst</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="Email address"
                type="email"
                value={member.email || ''}
                onChange={(e) => updateTeamMember(member.id, 'email', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMemberList;
