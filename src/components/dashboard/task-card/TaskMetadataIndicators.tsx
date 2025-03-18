
import React from 'react';
import { GitMerge, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SubtaskProps, DependencyProps } from '../types/task-card.types';

const TaskMetadataIndicators: React.FC<SubtaskProps & DependencyProps> = ({ subtasks = [], dependencies = [] }) => {
  const hasDependencies = dependencies && dependencies.length > 0;
  const hasSubtasks = subtasks && subtasks.length > 0;
  
  if (!hasDependencies && !hasSubtasks) return null;
  
  return (
    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
      {hasSubtasks && (
        <div className="flex items-center gap-1">
          <ListChecks className="h-3.5 w-3.5" />
          <span>
            {subtasks.filter(st => st.completed).length}/{subtasks.length}
          </span>
        </div>
      )}
      
      {hasDependencies && (
        <div className="flex items-center gap-1">
          <GitMerge className="h-3.5 w-3.5" />
          <span>{dependencies.length}</span>
        </div>
      )}
    </div>
  );
};

export default TaskMetadataIndicators;
