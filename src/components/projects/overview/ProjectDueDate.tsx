
import React from 'react';
import { Calendar } from 'lucide-react';

interface ProjectDueDateProps {
  dueDate: string;
  daysRemaining: number;
}

const ProjectDueDate: React.FC<ProjectDueDateProps> = ({ dueDate, daysRemaining }) => {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-5 w-5 text-primary" />
      <div>
        <h3 className="font-medium">Due Date</h3>
        <p className="text-sm text-muted-foreground">
          {new Date(dueDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
          {daysRemaining > 0 ? ` (${daysRemaining} days remaining)` : ' (Overdue)'}
        </p>
      </div>
    </div>
  );
};

export default ProjectDueDate;
