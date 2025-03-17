
import React from 'react';
import Avatar from '@/components/ui/avatar';

interface Assignee {
  name: string;
  avatar?: string;
}

interface TaskAssigneesProps {
  assignees: Assignee[];
}

const TaskAssignees: React.FC<TaskAssigneesProps> = ({ assignees }) => {
  if (!assignees || assignees.length === 0) return null;
  
  return (
    <div className="flex -space-x-2">
      {assignees.slice(0, 3).map((assignee, index) => (
        <Avatar 
          key={index}
          name={assignee.name} 
          src={assignee.avatar} 
          size="xs" 
          className="ring-2 ring-background"
        />
      ))}
      
      {assignees.length > 3 && (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium ring-2 ring-background">
          +{assignees.length - 3}
        </div>
      )}
    </div>
  );
};

export default TaskAssignees;
