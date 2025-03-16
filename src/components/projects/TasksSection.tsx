
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Task } from '@/lib/data';
import { toast } from "@/components/ui/toast-wrapper";
import TaskColumn from './components/TaskColumn';
import TaskForm from './task-form';
import useTaskDragHandlers from './components/TaskDragContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksCalendarView from './components/TasksCalendarView';
import TasksKanbanView from './components/TasksKanbanView';

interface TasksSectionProps {
  projectId: string;
  tasks: Task[];
  teamMembers: Array<{ id: number, name: string, role: string }>;
  onAddTask?: (task: Partial<Task>) => void;
  onUpdateTaskStatus?: (taskId: string, newStatus: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

const TasksSection: React.FC<TasksSectionProps> = ({ 
  projectId, 
  tasks,
  teamMembers,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask 
}) => {
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);
  const [localTasks, setLocalTasks] = React.useState<Task[]>(tasks);
  const [viewType, setViewType] = React.useState<'kanban' | 'calendar'>('kanban');
  const [newTask, setNewTask] = React.useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'to-do',
    assignees: [],
  });

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
      completed: newTask.status === 'completed'
    };

    if (onAddTask) {
      onAddTask(taskToAdd);
    } else {
      const newTaskWithId: Task = {
        ...taskToAdd,
        id: `task-${Date.now()}`,
        completed: newTask.status === 'completed'
      } as Task;
      
      setLocalTasks([...localTasks, newTaskWithId]);
      
      toast("Task created", {
        description: "New task has been added to the project",
      });
    }

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'to-do',
      assignees: []
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
      
      toast("Task updated", {
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
      
      toast("Task deleted", {
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
          <div className="flex items-center gap-3">
            <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'kanban' | 'calendar')} className="mr-4">
              <TabsList>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm" onClick={() => setIsAddTaskOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
        
        {viewType === 'kanban' ? (
          <TasksKanbanView
            tasksByStatus={tasksByStatus}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <TasksCalendarView 
            tasks={localTasks} 
            onDeleteTask={handleDeleteTask}
            onUpdateTaskStatus={handleTaskStatusChange}
          />
        )}
      </div>

      <TaskForm
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAddTask={handleAddTask}
        teamMembers={teamMembers}
        newTask={newTask}
        setNewTask={setNewTask}
      />
    </>
  );
};

export default TasksSection;
