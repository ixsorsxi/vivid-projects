
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Task } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import TaskColumn from './components/TaskColumn';
import TaskForm from './components/TaskForm';
import useTaskDragHandlers from './components/TaskDragContext';

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
  const [localTasks, setLocalTasks] = React.useState<Task[]>(tasks);
  const [newTask, setNewTask] = React.useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'to-do'
  });
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

  const { onDragStart, onDragOver, onDrop } = useTaskDragHandlers(handleTaskStatusChange);

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
            <TaskColumn
              key={status}
              title={status === 'not-started' ? 'Not Started' :
                     status === 'in-progress' ? 'In Progress' : 'Completed'}
              status={status}
              tasks={statusTasks}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragStart={onDragStart}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </div>

      <TaskForm
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAddTask={handleAddTask}
        newTask={newTask}
        setNewTask={setNewTask}
      />
    </>
  );
};

export default TasksSection;
