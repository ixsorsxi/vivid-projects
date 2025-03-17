
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';

const RecoveryTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card className="border border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">System Recovery</CardTitle>
          <CardDescription>Restore system from previous backups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
            <div className="text-center">
              <RotateCcw className="h-12 w-12 text-primary mx-auto mb-2 opacity-60" />
              <p className="text-muted-foreground">System recovery interface would appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecoveryTab;
