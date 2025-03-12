
import React from 'react';
import { Button } from "@/components/ui/button";

const ProjectSettings: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Project Settings</h2>
      <p className="text-muted-foreground mb-6">
        Manage project configuration, permissions, and other settings.
      </p>
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Project Visibility</h3>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="rounded-full">Private</Button>
            <Button variant="ghost" size="sm" className="rounded-full">Public</Button>
          </div>
        </div>
        
        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Notification Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Email notifications</span>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Task reminders</span>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-red-500 dark:text-red-400">Danger Zone</h3>
          <Button variant="destructive" size="sm">Delete Project</Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
