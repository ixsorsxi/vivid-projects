
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
    
    // Adding visual feedback for drag operation
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('opacity-50');
      
      // Set timeout to remove class when drag ends or gets canceled
      setTimeout(() => {
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.classList.remove('opacity-50');
        }
      }, 0);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Adding visual feedback for drag over
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('bg-primary/5');
      
      // Set timeout to remove class
      setTimeout(() => {
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.classList.remove('bg-primary/5');
        }
      }, 100);
    }
  };

  const onDrop = (e: React.DragEvent, dropStatus: string) => {
    e.preventDefault();
    
    // Remove any visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('bg-primary/5');
    }
    
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
