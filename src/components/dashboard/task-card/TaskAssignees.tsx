
import React from 'react';
import { Avatar } from '@/components/ui/avatar.custom';

interface Assignee {
  name: string;
  avatar?: string;
}

interface TaskAssigneesProps {
  assignees: Assignee[];
}

const TaskAssignees: React.FC<TaskAssigneesProps> = ({ assignees }) => {
  // Ensure we have an array of assignees, even if assignees is undefined
  const safeAssignees = assignees || [];
  
  if (safeAssignees.length === 0) return null;
  
  return (
    <div className="flex -space-x-2">
      {safeAssignees.slice(0, 3).map((assignee, index) => (
        <Avatar 
          key={index}
          name={assignee.name} 
          src={assignee.avatar} 
          size="xs" 
          className="ring-2 ring-background"
        />
      ))}
      
      {safeAssignees.length > 3 && (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium ring-2 ring-background">
          +{safeAssignees.length - 3}
        </div>
      )}
    </div>
  );
};

export default TaskAssignees;
