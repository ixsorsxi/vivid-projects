
import React from 'react';
import { Task, DependencyType } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowUpToLine, ArrowDownToLine, Link as LinkIcon, X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';

interface TaskDependenciesProps {
  task: Task;
  allTasks: Task[];
  onDependencyAdd?: (taskId: string, dependencyType: DependencyType) => void;
  onDependencyRemove?: (taskId: string) => void;
}

export const TaskDependencies: React.FC<TaskDependenciesProps> = ({
  task,
  allTasks,
  onDependencyAdd,
  onDependencyRemove
}) => {
  const [open, setOpen] = React.useState(false);
  const [dependencyType, setDependencyType] = React.useState<DependencyType>('blocking');
  
  // Get all dependencies for this task
  const dependencies = task.dependencies || [];
  
  // Get tasks that can be added as dependencies (not itself, not already a dependency)
  const availableTasks = allTasks.filter(t => 
    t.id !== task.id && 
    !dependencies.some(dep => dep.taskId === t.id)
  );
  
  // Group dependencies by type
  const blockingDependencies = dependencies.filter(dep => dep.type === 'blocking');
  const waitingDependencies = dependencies.filter(dep => dep.type === 'waiting-on');
  const relatedDependencies = dependencies.filter(dep => dep.type === 'related');
  
  // Get a task by ID
  const getTaskById = (taskId: string) => allTasks.find(t => t.id === taskId);
  
  const renderDependencyBadge = (dependencyType: DependencyType) => {
    switch (dependencyType) {
      case 'blocking':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Blocking</Badge>;
      case 'waiting-on':
        return <Badge variant="outline">Waiting On</Badge>;
      case 'related':
        return <Badge variant="secondary">Related</Badge>;
      default:
        return null;
    }
  };
  
  const renderDependencyIcon = (dependencyType: DependencyType) => {
    switch (dependencyType) {
      case 'blocking':
        return <ArrowUpToLine className="h-4 w-4 text-red-500" />;
      case 'waiting-on':
        return <ArrowDownToLine className="h-4 w-4" />;
      case 'related':
        return <LinkIcon className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Dependencies</h4>
      
      <div className="space-y-4">
        {dependencies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No dependencies</p>
        ) : (
          <>
            {blockingDependencies.length > 0 && (
              <div>
                <h5 className="text-xs uppercase text-muted-foreground mb-2">Blocking Dependencies</h5>
                <div className="space-y-2">
                  {blockingDependencies.map(dep => {
                    const depTask = getTaskById(dep.taskId);
                    return depTask ? (
                      <div key={dep.taskId} className="flex items-center justify-between bg-red-50 rounded-md p-2">
                        <div className="flex items-center">
                          <ArrowUpToLine className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm">{depTask.title}</span>
                        </div>
                        {onDependencyRemove && (
                          <Button variant="ghost" size="sm" onClick={() => onDependencyRemove(dep.taskId)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            {waitingDependencies.length > 0 && (
              <div>
                <h5 className="text-xs uppercase text-muted-foreground mb-2">Waiting On</h5>
                <div className="space-y-2">
                  {waitingDependencies.map(dep => {
                    const depTask = getTaskById(dep.taskId);
                    return depTask ? (
                      <div key={dep.taskId} className="flex items-center justify-between bg-muted rounded-md p-2">
                        <div className="flex items-center">
                          <ArrowDownToLine className="h-4 w-4 mr-2" />
                          <span className="text-sm">{depTask.title}</span>
                        </div>
                        {onDependencyRemove && (
                          <Button variant="ghost" size="sm" onClick={() => onDependencyRemove(dep.taskId)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            {relatedDependencies.length > 0 && (
              <div>
                <h5 className="text-xs uppercase text-muted-foreground mb-2">Related Tasks</h5>
                <div className="space-y-2">
                  {relatedDependencies.map(dep => {
                    const depTask = getTaskById(dep.taskId);
                    return depTask ? (
                      <div key={dep.taskId} className="flex items-center justify-between bg-primary/10 rounded-md p-2">
                        <div className="flex items-center">
                          <LinkIcon className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">{depTask.title}</span>
                        </div>
                        {onDependencyRemove && (
                          <Button variant="ghost" size="sm" onClick={() => onDependencyRemove(dep.taskId)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {onDependencyAdd && availableTasks.length > 0 && (
        <div className="mt-4">
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs uppercase text-muted-foreground">Add Dependency</h5>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant={dependencyType === 'blocking' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDependencyType('blocking')}
                  className="h-7 px-2 text-xs"
                >
                  Blocks
                </Button>
                <Button 
                  variant={dependencyType === 'waiting-on' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDependencyType('waiting-on')}
                  className="h-7 px-2 text-xs"
                >
                  Waits on
                </Button>
                <Button 
                  variant={dependencyType === 'related' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDependencyType('related')}
                  className="h-7 px-2 text-xs"
                >
                  Related
                </Button>
              </div>
            </div>
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  {renderDependencyIcon(dependencyType)}
                  <span className="ml-2">Select a task</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[300px]" align="start">
                <Command>
                  <CommandInput placeholder="Search tasks..." />
                  <CommandList>
                    <CommandEmpty>No tasks found</CommandEmpty>
                    <CommandGroup>
                      {availableTasks.map(t => (
                        <CommandItem
                          key={t.id}
                          onSelect={() => {
                            onDependencyAdd(t.id, dependencyType);
                            setOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            {renderDependencyIcon(dependencyType)}
                            <span className="ml-2">{t.title}</span>
                          </div>
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
