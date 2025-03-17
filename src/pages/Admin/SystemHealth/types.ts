
export interface SystemIssue {
  id: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  activeUsers: number;
  responseTime: number;
  serverLoad: number;
  issues: SystemIssue[];
}
