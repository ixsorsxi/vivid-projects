
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface TaskFilterTabsProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

// Define an array of tab options to make the component more maintainable
const TAB_OPTIONS = [
  { value: 'all', label: 'All Tasks' },
  { value: 'to-do', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'in-review', label: 'In Review' },
  { value: 'completed', label: 'Completed' }
];

const TaskFilterTabs: React.FC<TaskFilterTabsProps> = ({ activeTab, onTabChange }) => {
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <TabsList className="grid grid-cols-5 md:w-fit">
      {TAB_OPTIONS.map(tab => (
        <TabsTrigger 
          key={tab.value}
          value={tab.value} 
          onClick={() => handleTabChange(tab.value)}
          className={cn(
            "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
            "whitespace-nowrap text-xs sm:text-sm"
          )}
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TaskFilterTabs;
