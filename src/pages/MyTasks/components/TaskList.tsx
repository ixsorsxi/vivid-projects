
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/dashboard/TaskCard';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/data';

interface TaskListProps {
  filteredTasks: Task[];
  filterPriority: string | null;
  setFilterPriority: (priority: string | null) => void;
  handleToggleStatus: (taskId: string) => void;
  handleViewTask: (task: Task) => void;
  handleEditTask: (task: Task) => void;
  handleDeleteTask: (taskId: string) => void;
  sortBy: 'dueDate' | 'priority' | 'status';
  formatDueDate: (date: string) => string;
  onAddTaskClick: () => void;
}

const priorityColorMap = {
  high: 'bg-rose-500/15 text-rose-500 border-rose-500/20',
  medium: 'bg-amber-500/15 text-amber-500 border-amber-500/20',
  low: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
};

const TaskList: React.FC<TaskListProps> = ({
  filteredTasks,
  filterPriority,
  setFilterPriority,
  handleToggleStatus,
  handleViewTask,
  handleEditTask,
  handleDeleteTask,
  sortBy,
  formatDueDate,
  onAddTaskClick,
}) => {
  // Ensure filteredTasks is an array
  const tasks = Array.isArray(filteredTasks) ? filteredTasks : [];

  return (
    <div className="space-y-3">
      {filterPriority && (
        <div className="mb-4 flex items-center">
          <span className="text-sm text-muted-foreground mr-2">Filtered by:</span>
          <Badge 
            variant="outline" 
            className={priorityColorMap[filterPriority as keyof typeof priorityColorMap]}
          >
            {filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)} Priority
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 ml-2 p-0 text-xs"
            onClick={() => setFilterPriority(null)}
          >
            Clear
          </Button>
        </div>
      )}
      
      {tasks.length > 0 ? (
        <>
          {/* Regular task list */}
          {sortBy !== 'dueDate' && (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={() => handleToggleStatus(task.id)}
                  onViewDetails={() => handleViewTask(task)}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))}
            </div>
          )}
          
          {/* Task groups by due date */}
          {sortBy === 'dueDate' && (
            <div className="mt-8 space-y-6">
              {['Today', 'Tomorrow', 'Upcoming'].map((dateGroup) => {
                const groupTasks = tasks.filter(task => {
                  if (!task.dueDate) return dateGroup === 'Upcoming';
                  const dueDate = formatDueDate(task.dueDate);
                  if (dateGroup === 'Upcoming') {
                    return dueDate !== 'Today' && dueDate !== 'Tomorrow';
                  }
                  return dueDate === dateGroup;
                });
                
                if (groupTasks.length === 0) return null;
                
                return (
                  <div key={dateGroup}>
                    <h3 className="text-md font-medium mb-3">{dateGroup}</h3>
                    <div className="space-y-3">
                      {groupTasks.map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onStatusChange={() => handleToggleStatus(task.id)}
                          onViewDetails={() => handleViewTask(task)}
                          onEdit={() => handleEditTask(task)}
                          onDelete={() => handleDeleteTask(task.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters, or create a new task.
          </p>
          <Button className="mt-4" onClick={onAddTaskClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
