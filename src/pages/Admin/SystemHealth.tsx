import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AdminLayout from '@/components/AdminLayout';
import { Activity, Server, Database, Cpu, HardDrive, AlertTriangle, Clock, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast-wrapper';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  activeUsers: number;
  responseTime: number;
  serverLoad: number;
  issues: SystemIssue[];
}

interface SystemIssue {
  id: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
}

const SystemHealth = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 38,
    uptime: '23 days, 4 hours, 12 minutes',
    activeUsers: 24,
    responseTime: 125,
    serverLoad: 0.72,
    issues: [
      { id: '1', severity: 'medium', message: 'High CPU usage detected', timestamp: '2023-10-20 13:45:22' },
      { id: '2', severity: 'low', message: 'Disk space below 70% free', timestamp: '2023-10-20 10:12:05' },
    ]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate metrics changing over time
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.min(100, Math.max(10, prev.cpu + Math.floor(Math.random() * 10) - 5)),
        memory: Math.min(100, Math.max(20, prev.memory + Math.floor(Math.random() * 6) - 3)),
        serverLoad: parseFloat((prev.serverLoad + (Math.random() * 0.2 - 0.1)).toFixed(2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshMetrics = () => {
    setLoading(true);
    // Simulate API call to refresh metrics
    setTimeout(() => {
      setMetrics({
        ...metrics,
        cpu: Math.floor(Math.random() * 70) + 10,
        memory: Math.floor(Math.random() * 60) + 20,
        disk: Math.floor(Math.random() * 40) + 30,
        responseTime: Math.floor(Math.random() * 200) + 50,
        serverLoad: parseFloat((Math.random() * 1.5).toFixed(2)),
      });
      setLoading(false);
      toast("Metrics refreshed", {
        description: "System health metrics have been updated.",
      });
    }, 1500);
  };

  const getProgressColor = (value: number) => {
    if (value < 50) return 'bg-green-500';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Cpu className="h-4 w-4 mr-2" />
              CPU Usage
            </CardTitle>
            <CardDescription>Current processor utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metrics.cpu}%</span>
                <span className={`text-xs rounded-full px-2 py-1 ${
                  metrics.cpu < 50 ? 'bg-green-100 text-green-800' :
                  metrics.cpu < 80 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {metrics.cpu < 50 ? 'Normal' : metrics.cpu < 80 ? 'Moderate' : 'High'}
                </span>
              </div>
              <Progress value={metrics.cpu} className={getProgressColor(metrics.cpu)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Server className="h-4 w-4 mr-2" />
              Memory Usage
            </CardTitle>
            <CardDescription>RAM utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metrics.memory}%</span>
                <span className={`text-xs rounded-full px-2 py-1 ${
                  metrics.memory < 50 ? 'bg-green-100 text-green-800' :
                  metrics.memory < 80 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {metrics.memory < 50 ? 'Normal' : metrics.memory < 80 ? 'Moderate' : 'High'}
                </span>
              </div>
              <Progress value={metrics.memory} className={getProgressColor(metrics.memory)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              Disk Usage
            </CardTitle>
            <CardDescription>Storage utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metrics.disk}%</span>
                <span className={`text-xs rounded-full px-2 py-1 ${
                  metrics.disk < 50 ? 'bg-green-100 text-green-800' :
                  metrics.disk < 80 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {metrics.disk < 50 ? 'Normal' : metrics.disk < 80 ? 'Moderate' : 'High'}
                </span>
              </div>
              <Progress value={metrics.disk} className={getProgressColor(metrics.disk)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              System Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.issues.length > 0 ? (
              <div className="space-y-4">
                {metrics.issues.map((issue) => (
                  <div key={issue.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted">
                    <div className={`h-2 w-2 mt-2 rounded-full ${
                      issue.severity === 'high' ? 'bg-red-500' : 
                      issue.severity === 'medium' ? 'bg-yellow-500' : 
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs rounded-full px-2 py-0.5 ${
                          issue.severity === 'high' ? 'bg-red-100 text-red-800' : 
                          issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">{issue.timestamp}</span>
                      </div>
                      <p className="mt-1">{issue.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No system issues detected
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
    </AdminLayout>
  );
};

export default SystemHealth;
