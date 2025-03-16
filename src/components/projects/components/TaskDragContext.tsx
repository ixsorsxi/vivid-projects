
import React, { useState } from 'react';

interface TaskDragContextProps {
  onDragStart: (e: React.DragEvent, taskId: string, currentStatus: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropStatus: string) => void;
  isDragging: boolean;
}

const useTaskDragHandlers = (onUpdateTaskStatus?: (taskId: string, newStatus: string) => void): TaskDragContextProps => {
  const [isDragging, setIsDragging] = useState(false);
  
  const onDragStart = (e: React.DragEvent, taskId: string, currentStatus: string) => {
    setIsDragging(true);
    
    // Add improved drag data payload
    e.dataTransfer.setData('application/json', JSON.stringify({
      taskId,
      currentStatus,
      timestamp: Date.now()
    }));
    
    // Set basic text for accessibility
    e.dataTransfer.setData('text/plain', `Task ${taskId}`);
    
    // Set a ghost image for better visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      // Apply visual feedback for dragged element
      e.currentTarget.classList.add('opacity-50', 'scale-105', 'shadow-lg', 'transition-transform');
      
      // Add dragging state to document for global styling control
      document.body.classList.add('dragging-active');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Add enhanced visual feedback for drag target
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('bg-primary/10', 'border-primary', 'transition-colors');
    }
  };

  const onDragLeave = (e: React.DragEvent) => {
    // Remove visual feedback when dragging leaves the element
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('bg-primary/10', 'border-primary');
    }
  };

  const onDrop = (e: React.DragEvent, dropStatus: string) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Cleanup visual effects
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('bg-primary/10', 'border-primary');
    }
    
    document.body.classList.remove('dragging-active');
    
    // Process drop with error handling
    try {
      const jsonData = e.dataTransfer.getData('application/json');
      if (!jsonData) return;
      
      const { taskId, currentStatus } = JSON.parse(jsonData);
      
      if (currentStatus !== dropStatus && onUpdateTaskStatus) {
        // Add optimistic UI update if implemented
        onUpdateTaskStatus(taskId, dropStatus === 'not-started' ? 'to-do' : dropStatus);
      }
    } catch (error) {
      console.error('Error processing drop event:', error);
    }
  };

  const onDragEnd = () => {
    setIsDragging(false);
    
    // Cleanup any remaining drag effects
    document.body.classList.remove('dragging-active');
    
    // Find and cleanup any elements that might still have drag classes
    document.querySelectorAll('.opacity-50, .scale-105, .shadow-lg').forEach(element => {
      if (element instanceof HTMLElement) {
        element.classList.remove('opacity-50', 'scale-105', 'shadow-lg');
      }
    });
  };

  return {
    onDragStart,
    onDragOver,
    onDrop,
    isDragging,
    onDragLeave,
    onDragEnd
  };
};

export default useTaskDragHandlers;
