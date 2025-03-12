
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/AdminLayout';
import { Search, Download, Clock, RefreshCcw } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ipAddress: string;
  details: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

const mockLogs: LogEntry[] = [
  { id: '1', timestamp: '2023-10-20 09:15:32', user: 'admin@example.com', action: 'User Login', ipAddress: '192.168.1.1', details: 'Successful login', type: 'success' },
  { id: '2', timestamp: '2023-10-20 10:22:15', user: 'john@example.com', action: 'Project Created', ipAddress: '192.168.1.5', details: 'Created project "Website Redesign"', type: 'info' },
  { id: '3', timestamp: '2023-10-20 11:05:40', user: 'admin@example.com', action: 'User Created', ipAddress: '192.168.1.1', details: 'Created user "sarah@example.com"', type: 'info' },
  { id: '4', timestamp: '2023-10-20 13:30:11', user: 'mike@example.com', action: 'Failed Login', ipAddress: '192.168.1.8', details: 'Invalid credentials', type: 'error' },
  { id: '5', timestamp: '2023-10-20 14:45:20', user: 'sarah@example.com', action: 'Task Updated', ipAddress: '192.168.1.12', details: 'Updated task "Design Homepage"', type: 'info' },
  { id: '6', timestamp: '2023-10-20 15:20:43', user: 'admin@example.com', action: 'Settings Changed', ipAddress: '192.168.1.1', details: 'Updated system settings', type: 'warning' },
  { id: '7', timestamp: '2023-10-20 16:10:05', user: 'john@example.com', action: 'Document Uploaded', ipAddress: '192.168.1.5', details: 'Uploaded "Project Requirements.pdf"', type: 'info' },
  { id: '8', timestamp: '2023-10-20 17:05:30', user: 'admin@example.com', action: 'Backup Created', ipAddress: '192.168.1.1', details: 'Manual backup initiated', type: 'success' },
];

const AuditLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [logType, setLogType] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (logType === 'all') return matchesSearch;
    return log.type === logType && matchesSearch;
  });

  const refreshLogs = () => {
    // In a real app, this would fetch new logs from the server
    setLogs([...mockLogs]);
  };

  const exportLogs = () => {
    // In a real app, this would generate a CSV or PDF of the logs
    alert('Logs exported successfully');
  };

  return (
    <AdminLayout title="Audit Logs" currentTab="audit-logs">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[300px]"
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <Select value={logType} onValueChange={setLogType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="info">Information</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="success">Success</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={refreshLogs}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            System Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-sm">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">User</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">IP Address</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="border-t border-border">
                      <td className="py-3 px-4">{log.timestamp}</td>
                      <td className="py-3 px-4">{log.user}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.type === 'info' ? 'bg-blue-100 text-blue-800' :
                          log.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          log.type === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">{log.ipAddress}</td>
                      <td className="py-3 px-4">{log.details}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No logs found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AuditLogs;
