
import React from 'react';
import { AlertCircle } from 'lucide-react';

const NoActivityDisplay: React.FC = () => {
  return (
    <div className="mt-6 p-5 border border-dashed rounded-lg flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <h3 className="font-medium">No recent activity</h3>
        <p className="text-sm text-muted-foreground mt-1">
          This project doesn't have any recorded activity yet.
        </p>
      </div>
    </div>
  );
};

export default NoActivityDisplay;
