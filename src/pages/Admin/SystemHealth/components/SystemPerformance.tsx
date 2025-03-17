
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { SystemMetrics } from '../types';

interface SystemPerformanceProps {
  metrics: SystemMetrics;
}

const SystemPerformance: React.FC<SystemPerformanceProps> = ({ metrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          System Uptime & Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Uptime</p>
              <p className="text-xl font-bold">{metrics.uptime}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Active Users</p>
              <p className="text-xl font-bold">{metrics.activeUsers}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Response Time</p>
              <p className="text-xl font-bold">{metrics.responseTime} ms</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Server Load</p>
              <p className="text-xl font-bold">{metrics.serverLoad}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemPerformance;
