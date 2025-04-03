
import React from 'react';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTaskAssignees, TaskAssignee } from '@/hooks/useTaskAssignees';
import { toast } from '@/components/ui/toast-wrapper';

interface TaskAssigneeSelectorProps {
  assignees: Array<{ id?: string; name: string; avatar?: string }>;
  projectId?: string;
  selectedMember: string;
  setSelectedMember: React.Dispatch<React.SetStateAction<string>>;
  handleAddAssignee: () => void;
  handleRemoveAssignee: (name: string) => void;
}

const TaskAssigneeSelector: React.FC<TaskAssigneeSelectorProps> = ({
  assignees,
  projectId,
  selectedMember,
  setSelectedMember,
  handleAddAssignee,
  handleRemoveAssignee
}) => {
  console.log('TaskAssigneeSelector - projectId:', projectId);
  console.log('TaskAssigneeSelector - current assignees:', assignees);
  
  const { assignees: availableAssignees, loading } = useTaskAssignees(projectId);
  
  console.log('TaskAssigneeSelector - available assignees from hook:', availableAssignees);
  
  // Filter out already selected assignees
  const filteredAssignees = availableAssignees.filter(
    a => !assignees.some(selected => selected.name === a.name)
  );
  
  console.log('TaskAssigneeSelector - filtered assignees:', filteredAssignees);

  const handleSelectChange = (value: string) => {
    console.log('Selected member changed to:', value);
    setSelectedMember(value);
  };

  const handleAddClick = () => {
    console.log('Adding member:', selectedMember);
    handleAddAssignee();
  };

  return (
    <div>
      <Label>Assignees</Label>
      <div className="flex gap-2 mt-1 mb-2 flex-wrap">
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
        {assignees.length === 0 && (
          <span className="text-sm text-muted-foreground">No assignees selected</span>
        )}
      </div>
      <div className="flex gap-2">
        <Select value={selectedMember} onValueChange={handleSelectChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={loading ? "Loading members..." : "Select team member"} />
          </SelectTrigger>
          <SelectContent>
            {loading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : filteredAssignees.length > 0 ? (
              filteredAssignees.map(member => (
                <SelectItem key={member.id} value={member.name}>
                  {member.name}
                </SelectItem>
              ))
            ) : (
              <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center text-amber-500 gap-2 text-sm">
                  <Info className="h-4 w-4" />
                  <span>No available team members</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add team members to this project first to assign tasks to them.
                </p>
              </div>
            )}
          </SelectContent>
        </Select>
        <Button 
          type="button" 
          size="sm" 
          onClick={handleAddClick}
          disabled={!selectedMember || loading} 
          title={!selectedMember ? "Select a team member first" : "Add assignee"}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskAssigneeSelector;
