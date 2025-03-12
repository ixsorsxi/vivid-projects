import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from '@/lib/data';
import TaskCard from '../dashboard/TaskCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TasksSectionProps {
  projectId: string;
  tasks: Task[];
  onAddTask?: (task: Partial<Task>) => void;
  onUpdateTaskStatus?: (taskId: string, newStatus: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

const TasksSection: React.FC<TasksSectionProps> = ({ 
  projectId, 
  tasks,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask 
}) => {
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState<string | null>(null);
  const [newTask, setNewTask] = React.useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'to-do'
  });
  const [localTasks, setLocalTasks] = React.useState<Task[]>(tasks);
  const { toast } = useToast();

  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const tasksByStatus = {
    'not-started': localTasks.filter(task => task.status === 'to-do'),
    'in-progress': localTasks.filter(task => task.status === 'in-progress'),
    'completed': localTasks.filter(task => task.status === 'completed')
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const taskToAdd: Partial<Task> = {
      ...newTask,
      project: projectId,
      assignees: [],
      completed: newTask.status === 'completed'
    };

    if (onAddTask) {
      onAddTask(taskToAdd);
    } else {
      const newTaskWithId: Task = {
        ...taskToAdd,
        id: `task-${Date.now()}`,
        assignees: [],
        completed: newTask.status === 'completed'
      } as Task;
      
      setLocalTasks([...localTasks, newTaskWithId]);
      
      toast({
        title: "Task created",
        description: "New task has been added to the project",
      });
    }

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'to-do'
    });
    setIsAddTaskOpen(false);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    if (onUpdateTaskStatus) {
      onUpdateTaskStatus(taskId, newStatus);
    } else {
      const updatedTasks = localTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status: newStatus,
            completed: newStatus === 'completed'
          };
        }
        return task;
      });
      
      setLocalTasks(updatedTasks);
      
      toast({
        title: "Task updated",
        description: `Task status changed to ${newStatus}`,
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (onDeleteTask) {
      onDeleteTask(taskId);
    } else {
      const updatedTasks = localTasks.filter(task => task.id !== taskId);
      setLocalTasks(updatedTasks);
      
      toast({
        title: "Task deleted",
        description: "Task has been removed from the project",
      });
    }
  };

  const onDragStart = (e: React.DragEvent, taskId: string, currentStatus: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('currentStatus', currentStatus);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, dropStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const currentStatus = e.dataTransfer.getData('currentStatus');
    
    if (currentStatus !== dropStatus) {
      handleTaskStatusChange(taskId, dropStatus === 'not-started' ? 'to-do' : dropStatus);
    }
  };

  return (
    <>
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Project Tasks</h2>
          <Button size="sm" onClick={() => setIsAddTaskOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div 
              key={status} 
              className="border rounded-lg p-4"
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, status)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">
                  {status === 'not-started' ? 'Not Started' :
                   status === 'in-progress' ? 'In Progress' : 'Completed'}
                </h3>
                <Badge variant="outline">{statusTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {statusTasks.map((task) => (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id, status)}
                    className="cursor-move"
                  >
                    <TaskCard 
                      task={{
                        ...task,
                        status: task.status as 'to-do' | 'in-progress' | 'in-review' | 'completed',
                        priority: task.priority as 'low' | 'medium' | 'high',
                        assignees: task.assignees || []
                      }}
                      actions={
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      }
                    />
                  </div>
                ))}

                {statusTasks.length === 0 && (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <p className="text-muted-foreground text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for this project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Task Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={newTask.status}
                onValueChange={(value) => setNewTask({ ...newTask, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to-do">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date <span className="text-destructive">*</span></Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TasksSection;
