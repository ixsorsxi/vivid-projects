
import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import TaskCardActions from './task-card/TaskCardActions';
import TaskCardTitle from './task-card/TaskCardTitle';
import TaskBadges from './task-card/TaskBadges';
import TaskDueDate from './task-card/TaskDueDate';
import TaskAssignees from './task-card/TaskAssignees';
import TaskMetadataIndicators from './task-card/TaskMetadataIndicators';
import { TaskCardProps } from './types/task-card.types';

export const TaskCard = ({ 
  task, 
  allTasks = [],
  className, 
  actions, 
  onStatusChange, 
  onViewDetails, 
  onEdit, 
  onDelete 
}: TaskCardProps) => {
  if (!task) {
    console.error('Task is undefined in TaskCard');
    return null;
  }
  
  const { 
    title, 
    description, 
    status, 
    priority, 
    dueDate, 
    project, 
    assignees, 
    completed,
    subtasks,
    dependencies
  } = task;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const [isChecked, setIsChecked] = React.useState(completed || false);
  
  const handleCheckboxChange = (value: boolean | string) => {
    const newState = typeof value === 'boolean' ? value : value === 'true';
    setIsChecked(newState);
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
        <div className="mt-1">
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={handleCheckboxChange}
          />
        </div>
        
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
          
          {/* Show subtasks and dependencies if they exist */}
          <TaskMetadataIndicators 
            subtasks={subtasks} 
            dependencies={dependencies} 
          />
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <TaskDueDate dueDate={dueDate} formatDate={formatDate} />
            <TaskAssignees assignees={assignees || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
