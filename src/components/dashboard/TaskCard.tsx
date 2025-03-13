
import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import TaskCardActions from './task-card/TaskCardActions';
import TaskCardTitle from './task-card/TaskCardTitle';
import TaskBadges from './task-card/TaskBadges';
import TaskDueDate from './task-card/TaskDueDate';
import TaskAssignees from './task-card/TaskAssignees';

export interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string;
    project?: string;
    assignees: { name: string; avatar?: string }[];
    completed?: boolean;
  };
  className?: string;
  actions?: React.ReactNode;
  onStatusChange?: () => void;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TaskCard = ({ 
  task, 
  className, 
  actions, 
  onStatusChange, 
  onViewDetails, 
  onEdit, 
  onDelete 
}: TaskCardProps) => {
  const { title, description, status, priority, dueDate, project, assignees, completed } = task;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const [isChecked, setIsChecked] = React.useState(completed || false);
  
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (onStatusChange) {
      onStatusChange();
    }
  };
  
  return (
    <div className={cn(
      "glass-card rounded-xl p-4 hover-lift transition-all duration-300",
      isChecked && "opacity-70",
      className
    )}>
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={isChecked} 
          onCheckedChange={handleCheckboxChange}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="space-y-1 min-w-0">
              <TaskCardTitle 
                title={title} 
                priority={priority} 
                isChecked={isChecked} 
              />
              
              {description && (
                <p className="text-muted-foreground text-sm line-clamp-1">{description}</p>
              )}
            </div>
            
            <TaskCardActions 
              actions={actions} 
              onViewDetails={onViewDetails} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          </div>
          
          <TaskBadges status={status} project={project} />
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <TaskDueDate dueDate={dueDate} formatDate={formatDate} />
            <TaskAssignees assignees={assignees} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
