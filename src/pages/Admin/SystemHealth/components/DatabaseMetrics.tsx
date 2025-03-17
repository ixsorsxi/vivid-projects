
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

const DatabaseMetrics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Database Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Connection Pool</p>
            <div className="flex items-end space-x-2">
              <p className="text-xl font-bold">24/50</p>
              <p className="text-sm text-muted-foreground">connections</p>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Query Performance</p>
            <div className="flex items-end space-x-2">
              <p className="text-xl font-bold">95 ms</p>
              <p className="text-sm text-muted-foreground">avg</p>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Active Transactions</p>
            <div className="flex items-end space-x-2">
              <p className="text-xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">current</p>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Cache Hit Ratio</p>
            <div className="flex items-end space-x-2">
              <p className="text-xl font-bold">89.7%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseMetrics;
