
import { useState, useEffect } from 'react';
import { SystemMetrics } from '../types';
import { toast } from '@/components/ui/toast-wrapper';

export const useSystemHealth = () => {
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

  return { metrics, loading, refreshMetrics };
};
