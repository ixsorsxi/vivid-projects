
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TaskFilterTabsProps {
  activeTab: string;
}

const TaskFilterTabs: React.FC<TaskFilterTabsProps> = ({ activeTab }) => {
  return (
    <TabsList>
      <TabsTrigger value="all">
        All Tasks
      </TabsTrigger>
      <TabsTrigger value="to-do">
        To Do
      </TabsTrigger>
      <TabsTrigger value="in-progress">
        In Progress
      </TabsTrigger>
      <TabsTrigger value="in-review">
        In Review
      </TabsTrigger>
      <TabsTrigger value="completed">
        Completed
      </TabsTrigger>
    </TabsList>
  );
};

export default TaskFilterTabs;
