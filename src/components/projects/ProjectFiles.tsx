
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ProjectFiles: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-xl flex items-center justify-center h-64">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <h3 className="font-medium">No files yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Upload project documents, designs, and other files here.
        </p>
        <Button variant="outline" className="mt-4">Upload Files</Button>
      </div>
    </div>
  );
};

export default ProjectFiles;
