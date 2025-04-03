
import React, { useEffect, useState } from 'react';
import { Task } from '@/lib/types/task';
import { DependencyType } from '@/lib/types/common';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  GitMerge, 
  Plus, 
  X, 
  ChevronUp, 
  ChevronDown, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { wouldCreateCircularDependency } from '@/api/projects/modules/projectData/taskDependenciesApi';

interface TaskDependenciesProps {
  task: Task;
  allTasks: Task[];
  onAddDependency?: (taskId: string, dependencyType: DependencyType) => void;
  onRemoveDependency?: (dependencyTaskId: string) => void;
}

export const TaskDependencies: React.FC<TaskDependenciesProps> = ({
  task,
  allTasks,
  onAddDependency,
  onRemoveDependency
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedDependencyType, setSelectedDependencyType] = 
    React.useState<DependencyType>('blocks');
  const [expanded, setExpanded] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  
  const dependencies = task.dependencies || [];
  
  const availableTasks = allTasks.filter(t => 
    t.id !== task.id && 
    !dependencies.some(dep => dep.taskId === t.id)
  );

  const dependencyTasks = dependencies.map(dep => {
    const dependencyTask = allTasks.find(t => t.id === dep.taskId);
    return {
      ...dep,
      task: dependencyTask
    };
  });
  
  const dependencyTypeLabels: Record<DependencyType, string> = {
    'blocks': 'Blocks',
    'is-blocked-by': 'Is Blocked By',
    'relates-to': 'Relates To',
    'duplicates': 'Duplicates',
    'blocking': 'Blocking',
    'waiting-on': 'Waiting On',
    'related': 'Related'
  };
  
  const dependencyTypeBadgeVariants: Record<DependencyType, "default" | "secondary" | "outline"> = {
    'blocks': 'default',
    'is-blocked-by': 'secondary',
    'relates-to': 'outline',
    'duplicates': 'outline',
    'blocking': 'default',
    'waiting-on': 'secondary',
    'related': 'outline'
  };

  // Check for potential circular dependencies when selecting a task
  const checkCircularDependency = async (taskId: string) => {
    try {
      const wouldCreateCircular = await wouldCreateCircularDependency(task.id, taskId);
      if (wouldCreateCircular) {
        setValidationErrors(prev => ({ ...prev, [taskId]: true }));
        return true;
      }
      
      setValidationErrors(prev => ({ ...prev, [taskId]: false }));
      return false;
    } catch (error) {
      console.error('Error checking circular dependency:', error);
      return false;
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">Dependencies</h4>
          <GitMerge className="h-4 w-4 text-muted-foreground" />
        </div>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {expanded && (
        <>
          <div className="space-y-2 mb-4">
            {dependencyTasks.length > 0 ? (
              <div className="space-y-2">
                {dependencyTasks.map(({ taskId, type, task: depTask }) => (
                  <div key={taskId} className="flex items-center justify-between p-2 bg-muted/40 rounded-md">
                    <div className="flex items-center gap-2">
                      <Badge variant={dependencyTypeBadgeVariants[type as DependencyType]} className="capitalize text-xs">
                        {dependencyTypeLabels[type as DependencyType]}
                      </Badge>
                      <span className="text-sm truncate">
                        {depTask ? depTask.title : 'Unknown Task'}
                      </span>
                    </div>
                    {onRemoveDependency && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onRemoveDependency(taskId)}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No dependencies set</p>
            )}
          </div>
          
          {onAddDependency && availableTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <select 
                  value={selectedDependencyType}
                  onChange={(e) => setSelectedDependencyType(e.target.value as DependencyType)}
                  className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="blocks">Blocks</option>
                  <option value="is-blocked-by">Is Blocked By</option>
                  <option value="relates-to">Relates To</option>
                  <option value="duplicates">Duplicates</option>
                  <option value="blocking">Blocking</option>
                  <option value="waiting-on">Waiting On</option>
                  <option value="related">Related</option>
                </select>
                
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add dependency
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search for a task..." />
                      <CommandList>
                        <CommandEmpty>No tasks found</CommandEmpty>
                        <CommandGroup>
                          {availableTasks.map((t) => (
                            <CommandItem
                              key={t.id}
                              onSelect={async () => {
                                const isCircular = await checkCircularDependency(t.id);
                                
                                if (!isCircular && onAddDependency) {
                                  onAddDependency(t.id, selectedDependencyType);
                                  setOpen(false);
                                }
                              }}
                              className="flex justify-between"
                            >
                              <span>{t.title}</span>
                              
                              {validationErrors[t.id] && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Would create a circular dependency</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Info className="h-3 w-3" />
                <span>
                  Dependency type explains the relationship between tasks.
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskDependencies;
