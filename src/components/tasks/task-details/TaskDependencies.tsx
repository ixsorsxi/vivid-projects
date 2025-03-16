
import React from 'react';
import { Task, TaskDependency, DependencyType } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowDownToLine, 
  ArrowLeft, 
  ArrowUpToLine, 
  Link, 
  Plus, 
  X 
} from 'lucide-react';

interface TaskDependenciesProps {
  task: Task;
  allTasks: Task[];
  onAddDependency?: (taskId: string, dependencyType: DependencyType) => void;
  onRemoveDependency?: (taskId: string) => void;
}

export const TaskDependencies: React.FC<TaskDependenciesProps> = ({
  task,
  allTasks,
  onAddDependency,
  onRemoveDependency
}) => {
  const [selectedTaskId, setSelectedTaskId] = React.useState<string>('');
  const [selectedType, setSelectedType] = React.useState<DependencyType>('waiting-on');
  
  // Get tasks that can be added as dependencies (exclude self and current dependencies)
  const availableTasks = allTasks.filter(t => 
    t.id !== task.id && 
    !task.dependencies?.some(dep => dep.taskId === t.id)
  );
  
  // Get the full task objects for dependencies
  const dependencyTasks = task.dependencies?.map(dep => {
    const dependencyTask = allTasks.find(t => t.id === dep.taskId);
    return {
      task: dependencyTask,
      type: dep.type
    };
  }) || [];

  const handleAddDependency = () => {
    if (selectedTaskId && onAddDependency) {
      onAddDependency(selectedTaskId, selectedType);
      setSelectedTaskId('');
    }
  };

  const getDependencyIcon = (type: DependencyType) => {
    switch(type) {
      case 'blocking':
        return <ArrowUpToLine className="h-4 w-4 mr-1" />;
      case 'waiting-on':
        return <ArrowDownToLine className="h-4 w-4 mr-1" />;
      case 'related':
        return <Link className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getDependencyBadge = (type: DependencyType) => {
    switch(type) {
      case 'blocking':
        return <Badge variant="destructive" className="ml-2">Blocking</Badge>;
      case 'waiting-on':
        return <Badge variant="outline" className="ml-2">Waiting On</Badge>;
      case 'related':
        return <Badge variant="secondary" className="ml-2">Related</Badge>;
      default:
        return null;
    }
  };

  if (!task.dependencies || task.dependencies.length === 0) {
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Dependencies</h4>
        {availableTasks.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground mb-2">No dependencies yet</p>
            <div className="flex gap-2">
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  {availableTasks.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as DependencyType)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blocking">Blocking</SelectItem>
                  <SelectItem value="waiting-on">Waiting On</SelectItem>
                  <SelectItem value="related">Related</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleAddDependency}
                disabled={!selectedTaskId}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No available tasks for dependencies</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Dependencies</h4>
      <div className="space-y-2">
        {dependencyTasks.map(dep => dep.task && (
          <div key={dep.task.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
            <div className="flex items-center">
              {getDependencyIcon(dep.type)}
              <span className="text-sm">{dep.task.title}</span>
              {getDependencyBadge(dep.type)}
            </div>
            {onRemoveDependency && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onRemoveDependency(dep.task!.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        {availableTasks.length > 0 && (
          <div className="flex gap-2 mt-3">
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select task" />
              </SelectTrigger>
              <SelectContent>
                {availableTasks.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as DependencyType)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blocking">Blocking</SelectItem>
                <SelectItem value="waiting-on">Waiting On</SelectItem>
                <SelectItem value="related">Related</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleAddDependency}
              disabled={!selectedTaskId}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDependencies;
