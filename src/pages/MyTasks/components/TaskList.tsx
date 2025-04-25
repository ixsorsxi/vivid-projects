import React from 'react';
import { Plus, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/dashboard/TaskCard';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/data';
import { motion } from 'framer-motion';
import { convertTaskToCardProps } from '@/lib/utils/task-helpers';

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
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
            <motion.div 
              className="space-y-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {tasks.map((task) => (
                <motion.div key={task.id} variants={item}>
                  <TaskCard 
                    task={convertTaskToCardProps(task)} 
                    onStatusChange={() => handleToggleStatus(task.id)}
                    onViewDetails={() => handleViewTask(task)}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Task groups by due date */}
          {sortBy === 'dueDate' && (
            <div className="mt-6 space-y-8">
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
                  <div key={dateGroup} className="space-y-4">
                    <div className="flex items-center">
                      {dateGroup === 'Today' && <Clock className="h-4 w-4 mr-2 text-blue-400" />}
                      {dateGroup === 'Tomorrow' && <Calendar className="h-4 w-4 mr-2 text-purple-400" />}
                      {dateGroup === 'Upcoming' && <Calendar className="h-4 w-4 mr-2 text-indigo-400" />}
                      <h3 className="text-md font-medium">{dateGroup}</h3>
                      <Badge variant="outline" className="ml-2">{groupTasks.length}</Badge>
                    </div>
                    <motion.div 
                      className="space-y-3"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {groupTasks.map(task => (
                        <motion.div key={task.id} variants={item}>
                          <TaskCard 
                            task={convertTaskToCardProps(task)} 
                            onStatusChange={() => handleToggleStatus(task.id)}
                            onViewDetails={() => handleViewTask(task)}
                            onEdit={() => handleEditTask(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed border-muted">
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters, or create a new task to get started.
            </p>
            <Button onClick={onAddTaskClick} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
