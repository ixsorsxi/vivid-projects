
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchAvailableUsers } from '@/api/tasks/taskAssignees';
import { Assignee } from '@/lib/data';

interface TaskAssigneeSelectorProps {
  assignees: Assignee[] | undefined;
  handleChange: (field: string, value: any) => void;
}

const TaskAssigneeSelector: React.FC<TaskAssigneeSelectorProps> = ({
  assignees = [],
  handleChange
}) => {
  const [availableUsers, setAvailableUsers] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const users = await fetchAvailableUsers();
        setAvailableUsers(users);
      } catch (error) {
        console.error('Error loading users:', error);
        setAvailableUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleAddAssignee = () => {
    if (!selectedUserId) return;
    
    const selectedUser = availableUsers.find(user => user.id === selectedUserId);
    if (selectedUser) {
      // Check if already assigned
      if (assignees.some(a => a.id === selectedUser.id)) {
        return;
      }
      
      const newAssignees = [...assignees, selectedUser];
      handleChange('assignees', newAssignees);
      setSelectedUserId('');
    }
  };

  const handleRemoveAssignee = (assigneeId: string) => {
    const newAssignees = assignees.filter(a => a.id !== assigneeId);
    handleChange('assignees', newAssignees);
  };

  // Filter out users that are already assigned
  const filteredAvailableUsers = availableUsers.filter(
    user => !assignees.some(assignee => assignee.id === user.id)
  );

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="assignees" className="text-right">
        Assignees
      </Label>
      <div className="col-span-3">
        <div className="flex flex-wrap gap-2 mb-2">
          {assignees.map((assignee, index) => (
            <Badge key={index} className="flex items-center gap-1">
              {assignee.name}
              <button 
                onClick={() => handleRemoveAssignee(assignee.id)}
                className="h-4 w-4 rounded-full hover:bg-primary/20 inline-flex items-center justify-center"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Select 
            value={selectedUserId} 
            onValueChange={setSelectedUserId}
            disabled={isLoading}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={isLoading ? "Loading users..." : "Select user"} />
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
                  {isLoading ? "Loading..." : "No more users available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Button 
            type="button" 
            size="sm" 
            onClick={handleAddAssignee} 
            disabled={!selectedUserId || isLoading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskAssigneeSelector;
