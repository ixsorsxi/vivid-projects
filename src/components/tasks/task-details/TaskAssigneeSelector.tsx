
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { X, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Assignee } from '@/lib/data';

interface TaskAssigneeSelectorProps {
  assignees: Assignee[];
  availableUsers: Assignee[];
  onAssigneeAdd: (assignee: Assignee) => void;
  onAssigneeRemove: (assigneeName: string) => void;
}

const TaskAssigneeSelector: React.FC<TaskAssigneeSelectorProps> = ({
  assignees,
  availableUsers,
  onAssigneeAdd,
  onAssigneeRemove
}) => {
  const [selectedUserId, setSelectedUserId] = React.useState<string>('');

  const handleAddAssignee = () => {
    if (!selectedUserId) return;
    
    const selectedUser = availableUsers.find(user => user.id === selectedUserId);
    if (selectedUser) {
      // Check if already assigned
      if (assignees.some(a => a.id === selectedUser.id)) {
        return;
      }
      
      onAssigneeAdd(selectedUser);
      setSelectedUserId('');
    }
  };

  // Filter out users that are already assigned
  const filteredAvailableUsers = availableUsers.filter(
    user => !assignees.some(assignee => assignee.id === user.id)
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mt-1 mb-2">
        {assignees.map((assignee, index) => (
          <Badge key={index} className="flex items-center gap-1">
            {assignee.name}
            <button 
              onClick={() => onAssigneeRemove(assignee.name)}
              className="h-4 w-4 rounded-full hover:bg-primary/20 inline-flex items-center justify-center"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {filteredAvailableUsers.length > 0 ? (
              filteredAvailableUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No more users available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Button type="button" size="sm" onClick={handleAddAssignee} disabled={!selectedUserId}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskAssigneeSelector;
