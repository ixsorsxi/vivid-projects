
import React from 'react';

interface TaskDragContextProps {
  onDragStart: (e: React.DragEvent, taskId: string, currentStatus: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropStatus: string) => void;
}

const useTaskDragHandlers = (onUpdateTaskStatus?: (taskId: string, newStatus: string) => void): TaskDragContextProps => {
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
    
    if (currentStatus !== dropStatus && onUpdateTaskStatus) {
      onUpdateTaskStatus(taskId, dropStatus === 'not-started' ? 'to-do' : dropStatus);
    }
  };

  return {
    onDragStart,
    onDragOver,
    onDrop
  };
};

export default useTaskDragHandlers;
