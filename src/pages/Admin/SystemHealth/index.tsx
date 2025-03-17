
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Activity, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast-wrapper';
import SystemMetricsGrid from './components/SystemMetricsGrid';
import SystemPerformance from './components/SystemPerformance';
import SystemIssues from './components/SystemIssues';
import DatabaseMetrics from './components/DatabaseMetrics';
import { useSystemHealth } from './hooks/useSystemHealth';

const SystemHealth = () => {
  const { metrics, loading, refreshMetrics } = useSystemHealth();

  return (
    <AdminLayout title="System Health" currentTab="system-health">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">System Metrics</h2>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshMetrics} 
          disabled={loading}
          className="flex items-center"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          {loading ? 'Refreshing...' : 'Refresh Metrics'}
        </Button>
      </div>

      <SystemMetricsGrid metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SystemPerformance metrics={metrics} />
        <SystemIssues issues={metrics.issues} />
      </div>

      <DatabaseMetrics />
    </AdminLayout>
  );
};

export default SystemHealth;
