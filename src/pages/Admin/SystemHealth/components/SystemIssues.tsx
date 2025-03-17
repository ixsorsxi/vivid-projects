
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { SystemIssue } from '../types';

interface SystemIssuesProps {
  issues: SystemIssue[];
}

const SystemIssues: React.FC<SystemIssuesProps> = ({ issues }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          System Issues
        </CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length > 0 ? (
          <div className="space-y-4">
            {issues.map((issue) => (
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
  );
};

export default SystemIssues;
