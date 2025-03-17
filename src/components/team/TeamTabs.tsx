
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TeamTabsProps {
  children: React.ReactNode;
}

const TeamTabs: React.FC<TeamTabsProps> = ({ children }) => {
  return (
    <Tabs defaultValue="all" className="mb-6">
      <TabsList>
        <TabsTrigger value="all">All Members</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="inactive">Inactive</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default TeamTabs;
