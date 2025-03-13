
import React from 'react';
import { Task } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export const useTaskManagement = (initialTasks: Task[]) => {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  const [filterPriority, setFilterPriority] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<'dueDate' | 'priority' | 'status'>('dueDate');
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);
  const [isViewTaskOpen, setIsViewTaskOpen] = React.useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const { toast } = useToast();
  
  // Effect to sync tab state with filterStatus
  React.useEffect(() => {
    if (activeTab === 'all') {
      setFilterStatus(null);
    } else {
      setFilterStatus(activeTab);
    }
  }, [activeTab]);
  
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      // Apply search filter
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      // Apply status filter
      const matchesStatus = filterStatus === null || task.status === filterStatus;
      
      // Apply priority filter
      const matchesPriority = filterPriority === null || task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
              priorityOrder[b.priority as keyof typeof priorityOrder];
      } else { // status
        const statusOrder = { 'to-do': 0, 'in-progress': 1, 'in-review': 2, 'completed': 3 };
        return statusOrder[a.status as keyof typeof statusOrder] - 
              statusOrder[b.status as keyof typeof statusOrder];
      }
    });
  }, [searchQuery, filterStatus, filterPriority, tasks, sortBy]);

  const handleToggleStatus = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
          const newCompleted = newStatus === 'completed';
          
          toast({
            title: `Task ${newCompleted ? 'completed' : 'reopened'}`,
            description: `"${task.title}" has been ${newCompleted ? 'marked as complete' : 'reopened'}`,
          });
          
          // If this is the selected task, update it too
          if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask({
              ...task,
              status: newStatus,
              completed: newCompleted
            });
          }
          
          return {
            ...task,
            status: newStatus,
            completed: newCompleted
          };
        }
        return task;
      })
    );
  };

  const handleAddTask = (newTask: Partial<Task>) => {
    const taskId = `task-${Date.now()}`;
    const task: Task = {
      id: taskId,
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      status: newTask.status || 'to-do',
      priority: newTask.priority || 'medium',
      dueDate: newTask.dueDate || new Date().toISOString(),
      completed: newTask.completed || false,
      project: 'Personal Tasks',
      assignees: newTask.assignees || [{ name: 'Me' }]
    };
    
    setTasks(prevTasks => [...prevTasks, task]);
    
    toast({
      title: "Task added",
      description: `"${task.title}" has been added to your tasks`,
    });
    
    // Close the add task form
    setIsAddTaskOpen(false);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask({...task});
    setIsViewTaskOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask({...task});
    setIsEditTaskOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    if (!taskToDelete) return;
    
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    
    // If the deleted task is selected, clear selection
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
      setIsViewTaskOpen(false);
      setIsEditTaskOpen(false);
    }
    
    toast({
      title: "Task deleted",
      description: `"${taskToDelete.title}" has been removed from your tasks`,
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === updatedTask.id) {
          toast({
            title: "Task updated",
            description: `"${updatedTask.title}" has been updated`,
          });
          
          return updatedTask;
        }
        return task;
      })
    );
    
    // Update the selected task too
    setSelectedTask(updatedTask);
    setIsEditTaskOpen(false);
  };

  const formatDueDate = (date: string) => {
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(taskDate);
    }
  };

  return {
    tasks,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    sortBy,
    setSortBy,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isViewTaskOpen,
    setIsViewTaskOpen,
    isEditTaskOpen,
    setIsEditTaskOpen,
    activeTab,
    setActiveTab,
    selectedTask,
    setSelectedTask,
    filteredTasks,
    handleToggleStatus,
    handleAddTask,
    handleViewTask,
    handleEditTask,
    handleDeleteTask,
    handleUpdateTask,
    formatDueDate
  };
};
