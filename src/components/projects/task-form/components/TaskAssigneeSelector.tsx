
import React from 'react';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TeamMember } from '@/components/projects/team/types';

interface TaskAssigneeSelectorProps {
  assignees: Array<{ name: string }>;
  teamMembers: TeamMember[];
  selectedMember: string;
  setSelectedMember: React.Dispatch<React.SetStateAction<string>>;
  handleAddAssignee: () => void;
  handleRemoveAssignee: (name: string) => void;
}

const TaskAssigneeSelector: React.FC<TaskAssigneeSelectorProps> = ({
  assignees,
  teamMembers,
  selectedMember,
  setSelectedMember,
  handleAddAssignee,
  handleRemoveAssignee
}) => {
  return (
    <div>
      <Label>Assignees</Label>
      <div className="flex gap-2 mt-1 mb-2">
        {assignees.map((assignee, index) => (
          <Badge key={index} className="flex items-center gap-1">
            {assignee.name}
            <button 
              onClick={() => handleRemoveAssignee(assignee.name)}
              className="h-4 w-4 rounded-full hover:bg-primary/20 inline-flex items-center justify-center"
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.length > 0 ? (
              teamMembers.map(member => (
                <SelectItem key={member.id} value={member.name}>
                  {member.name} - {member.role}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-members" disabled>
                No team members available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Button 
          type="button" 
          size="sm" 
          onClick={handleAddAssignee}
          disabled={!selectedMember} // Disable if no member selected
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskAssigneeSelector;
