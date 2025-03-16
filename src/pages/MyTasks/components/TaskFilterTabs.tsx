
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TaskFilterTabsProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

const TaskFilterTabs: React.FC<TaskFilterTabsProps> = ({ activeTab, onTabChange }) => {
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <TabsList>
      <TabsTrigger 
        value="all" 
        onClick={() => handleTabChange('all')}
      >
        All Tasks
      </TabsTrigger>
      <TabsTrigger 
        value="to-do"
        onClick={() => handleTabChange('to-do')}
      >
        To Do
      </TabsTrigger>
      <TabsTrigger 
        value="in-progress"
        onClick={() => handleTabChange('in-progress')}
      >
        In Progress
      </TabsTrigger>
      <TabsTrigger 
        value="in-review"
        onClick={() => handleTabChange('in-review')}
      >
        In Review
      </TabsTrigger>
      <TabsTrigger 
        value="completed"
        onClick={() => handleTabChange('completed')}
      >
        Completed
      </TabsTrigger>
    </TabsList>
  );
};

export default TaskFilterTabs;
