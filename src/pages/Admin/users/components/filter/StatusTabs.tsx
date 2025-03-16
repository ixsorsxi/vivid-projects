
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCheck, UserX } from 'lucide-react';
import { UserData } from '../../hooks/useUserManagement';

interface StatusTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  users: UserData[];
}

const StatusTabs: React.FC<StatusTabsProps> = ({ selectedTab, setSelectedTab, users }) => {
  const activeCount = users.filter(user => user.status === 'active').length;
  const inactiveCount = users.filter(user => user.status === 'inactive').length;

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="w-full grid grid-cols-3 bg-muted/50 p-1">
        <TabsTrigger 
          value="all" 
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          <Users className="h-4 w-4" />
          <span>All Users</span>
          <span className="ml-1 rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs">
            {users.length}
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="active"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          <UserCheck className="h-4 w-4" />
          <span>Active</span>
          <span className="ml-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 text-xs">
            {activeCount}
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="inactive"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          <UserX className="h-4 w-4" />
          <span>Inactive</span>
          <span className="ml-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 text-xs">
            {inactiveCount}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default StatusTabs;
