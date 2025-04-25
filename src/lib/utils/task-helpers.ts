
import { Task } from '@/lib/data/types';
import { demoProjects } from '@/lib/data/demoProjects';

/**
 * Gets the project name for a task
 */
export const getProjectNameForTask = (task: Task): string => {
  const project = demoProjects.find(p => p.id === task.project_id);
  return project ? project.name : 'No project';
};

/**
 * Ensures a task has assignees property properly initialized
 */
export const ensureTaskHasAssignees = (task: Task): Task => {
  if (!task.assignees) {
    return {
      ...task,
      assignees: []
    };
  }
  return task;
};

/**
 * Converts a Task to the TaskCard props format
 */
export const convertTaskToCardProps = (task: Task) => {
  const projectName = getProjectNameForTask(task);
  
  return {
    ...task,
    project: projectName,
    assignees: task.assignees || [],
    // Make sure these optional properties are present
    subtasks: task.subtasks || [],
    dependencies: task.dependencies || [],
    dueDate: task.due_date || task.dueDate
  };
};

/**
 * Format due date for tasks
 */
export const formatTaskDueDate = (dateString?: string): string => {
  if (!dateString) return 'No due date';
  
  const date = new Date(dateString);
  const today = new Date();
  
  // Check if it's today
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return 'Today';
  }
  
  // Check if it's tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  ) {
    return 'Tomorrow';
  }
  
  // Check if it's yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }
  
  // For other dates, format as Month Day
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};
