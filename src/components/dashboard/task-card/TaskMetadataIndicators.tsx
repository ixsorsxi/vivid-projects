
import React from 'react';
import { Layers, Link } from 'lucide-react';
import { SubtaskProps, DependencyProps } from '../types/task-card.types';

const TaskMetadataIndicators: React.FC<SubtaskProps & DependencyProps> = ({ 
  subtasks, 
  dependencies 
}) => {
  const hasSubtasks = subtasks && subtasks.length > 0;
  const hasDependencies = dependencies && dependencies.length > 0;
  
  if (!hasSubtasks && !hasDependencies) return null;
  
  return (
    <div className="flex gap-3 mt-2">
      {hasSubtasks && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Layers className="h-3 w-3 mr-1" />
          <span>{subtasks.length} subtask{subtasks.length !== 1 ? 's' : ''}</span>
        </div>
      )}
      
      {hasDependencies && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Link className="h-3 w-3 mr-1" />
          <span>{dependencies.length} dependenc{dependencies.length !== 1 ? 'ies' : 'y'}</span>
        </div>
      )}
    </div>
  );
};

export default TaskMetadataIndicators;
