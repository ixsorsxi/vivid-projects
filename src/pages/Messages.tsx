
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Messages = () => {
  return (
    <PageContainer 
      title="Messages" 
      subtitle="Team communications and project discussions"
    >
      <Card>
        <CardHeader>
          <CardTitle>Team Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="text-lg font-medium">Messages coming soon</h3>
            <p className="text-sm mt-1">This feature is currently under development.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default Messages;
