
import React, { useState } from 'react';
import { Task, DependencyType } from '@/lib/data';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  ChevronDown,
  LinkIcon, 
  X 
} from 'lucide-react';

interface TaskDependenciesProps {
  task: Task;
  allTasks: Task[];
  onDependencyAdd: (taskId: string, type: DependencyType) => void;
  onDependencyRemove: (taskId: string) => void;
}

const TaskDependencies: React.FC<TaskDependenciesProps> = ({
  task,
  allTasks,
  onDependencyAdd,
  onDependencyRemove
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<DependencyType>('blocking');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskToRemove, setTaskToRemove] = useState<string | null>(null);
  
  // Get all valid potential dependency tasks (not the current task, not already a dependency)
  const availableTasks = allTasks.filter(t => {
    // Skip the current task
    if (t.id === task.id) return false;
    
    // Skip tasks that are already dependencies
    if (task.dependencies?.some(dep => dep.taskId === t.id)) return false;
    
    // Skip subtasks of the current task
    if (t.parentId === task.id) return false;
    
    return true;
  });
  
  // Get dependency type label
  const getDependencyTypeLabel = (type: DependencyType) => {
    switch (type) {
      case 'blocking': return 'Blocking';
      case 'waiting-on': return 'Waiting On';
      case 'related': return 'Related';
      default: return type;
    }
  };
  
  // Get dependency type badge color
  const getDependencyTypeBadge = (type: DependencyType) => {
    switch (type) {
      case 'blocking':
        return <Badge variant="destructive">Blocking</Badge>;
      case 'waiting-on':
        return <Badge variant="secondary">Waiting On</Badge>;
      case 'related': 
        return <Badge variant="outline">Related</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };
  
  // Handle add dependency
  const handleAddDependency = () => {
    if (selectedTaskId && selectedType) {
      onDependencyAdd(selectedTaskId, selectedType);
      setSelectedTaskId(null);
      setSelectedType('blocking');
      setIsSelectOpen(false);
    }
  };
  
  // Handle remove dependency
  const handleRemoveDependency = (taskId: string) => {
    setTaskToRemove(taskId);
    setIsConfirmOpen(true);
  };
  
  // Confirm remove dependency
  const confirmRemoveDependency = () => {
    if (taskToRemove) {
      onDependencyRemove(taskToRemove);
      setTaskToRemove(null);
      setIsConfirmOpen(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Dependencies</h4>
      
      {/* Dependencies Table */}
      {task.dependencies && task.dependencies.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {task.dependencies.map(dep => {
                const dependencyTask = allTasks.find(t => t.id === dep.taskId);
                if (!dependencyTask) return null;
                
                return (
                  <TableRow key={dep.taskId}>
                    <TableCell>{dependencyTask.title}</TableCell>
                    <TableCell>{getDependencyTypeBadge(dep.type)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveDependency(dep.taskId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No dependencies set for this task.
        </p>
      )}
      
      {/* Add Dependency Controls */}
      <div className="flex gap-2 mt-4 items-center">
        <Select 
          open={isSelectOpen}
          onOpenChange={setIsSelectOpen}
          value={selectedTaskId || ""}
          onValueChange={setSelectedTaskId}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            {availableTasks.length > 0 ? (
              availableTasks.map(t => (
                <SelectItem key={t.id} value={t.id}>
                  {t.title}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                No available tasks to link
              </div>
            )}
          </SelectContent>
        </Select>
        
        <Select 
          value={selectedType}
          onValueChange={(value) => setSelectedType(value as DependencyType)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Dependency type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blocking">Blocking</SelectItem>
            <SelectItem value="waiting-on">Waiting On</SelectItem>
            <SelectItem value="related">Related</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          size="sm"
          disabled={!selectedTaskId}
          onClick={handleAddDependency}
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
      
      {/* Confirm Remove Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Dependency</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this dependency? This will not delete the task itself.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveDependency}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskDependencies;
