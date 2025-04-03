
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Reports = () => {
  return (
    <PageContainer 
      title="Reports" 
      subtitle="View analytics and reports for your projects"
    >
      <Card>
        <CardHeader>
          <CardTitle>Reports Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="text-lg font-medium">Reports coming soon</h3>
            <p className="text-sm mt-1">This feature is currently under development.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default Reports;
