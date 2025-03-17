
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cpu, Server, HardDrive } from 'lucide-react';
import { SystemMetrics } from '../types';
import MetricCard from './MetricCard';

interface SystemMetricsGridProps {
  metrics: SystemMetrics;
}

const SystemMetricsGrid: React.FC<SystemMetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <MetricCard 
        title="CPU Usage"
        description="Current processor utilization"
        value={metrics.cpu}
        icon={Cpu}
        label={metrics.cpu < 50 ? 'Normal' : metrics.cpu < 80 ? 'Moderate' : 'High'}
      />
      
      <MetricCard 
        title="Memory Usage"
        description="RAM utilization"
        value={metrics.memory}
        icon={Server}
        label={metrics.memory < 50 ? 'Normal' : metrics.memory < 80 ? 'Moderate' : 'High'}
      />
      
      <MetricCard 
        title="Disk Usage"
        description="Storage utilization"
        value={metrics.disk}
        icon={HardDrive}
        label={metrics.disk < 50 ? 'Normal' : metrics.disk < 80 ? 'Moderate' : 'High'}
      />
    </div>
  );
};

export default SystemMetricsGrid;
