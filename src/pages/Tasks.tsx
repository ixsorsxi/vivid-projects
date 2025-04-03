
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';

const Tasks = () => {
  return (
    <PageContainer 
      title="Tasks" 
      subtitle="Manage and track your tasks across all projects"
      actions={
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      }
    >
      <Card>
        <CardHeader className="pb-3">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="text-lg font-medium">Tasks coming soon</h3>
            <p className="text-sm mt-1">This feature is currently under development.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default Tasks;
