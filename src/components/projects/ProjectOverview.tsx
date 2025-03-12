
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ProjectOverview: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
      <p className="text-muted-foreground">
        This page is currently under development. In a real application, it would show 
        project metrics, recent activity, upcoming deadlines, and other relevant information.
      </p>
      
      <div className="mt-6 p-5 border border-dashed rounded-lg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-medium">More data coming soon</h3>
          <p className="text-sm text-muted-foreground mt-1">
            This project is being set up. Check back later for updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
