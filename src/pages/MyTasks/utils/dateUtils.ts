
export const formatDueDate = (date: string) => {
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
