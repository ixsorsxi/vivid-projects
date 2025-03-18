
import React from 'react';
import { Task, DependencyType } from '@/lib/data';
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
import { GitMerge, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    React.useState<DependencyType>('blocking');
  
  // Get all dependencies
  const dependencies = task.dependencies || [];
  
  // Filter tasks that can be dependencies (exclude current task and already dependent tasks)
  const availableTasks = allTasks.filter(t => 
    t.id !== task.id && 
    !dependencies.some(dep => dep.taskId === t.id)
  );

  // Get the full task object for each dependency
  const dependencyTasks = dependencies.map(dep => {
    const dependencyTask = allTasks.find(t => t.id === dep.taskId);
    return {
      ...dep,
      task: dependencyTask
    };
  });
  
  const dependencyTypeLabels: Record<DependencyType, string> = {
    'blocking': 'Blocking',
    'waiting-on': 'Waiting On',
    'related': 'Related'
  };
  
  const dependencyTypeBadgeVariants: Record<DependencyType, "default" | "secondary" | "outline" | "destructive"> = {
    'blocking': 'destructive',
    'waiting-on': 'secondary',
    'related': 'outline'
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-sm font-medium">Dependencies</h4>
        <GitMerge className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="space-y-2 mb-4">
        {dependencyTasks.length > 0 ? (
          <div className="space-y-2">
            {dependencyTasks.map(({ taskId, type, task: depTask }) => (
              <div key={taskId} className="flex items-center justify-between p-2 bg-muted/40 rounded-md">
                <div className="flex items-center gap-2">
                  <Badge variant={dependencyTypeBadgeVariants[type]} className="capitalize text-xs">
                    {dependencyTypeLabels[type]}
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
                    <CommandEmpty>No tasks found.</CommandEmpty>
                    <CommandGroup>
                      {availableTasks.map(task => (
                        <CommandItem 
                          key={task.id}
                          onSelect={() => {
                            onAddDependency(task.id, selectedDependencyType);
                            setOpen(false);
                          }}
                        >
                          {task.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDependencies;
