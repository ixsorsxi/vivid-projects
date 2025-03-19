
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileList from './components/FileList';
import FolderView from './components/FolderView';
import FileUpload from './components/FileUpload';

interface ProjectFilesProps {
  projectId: string;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = React.useState('list');

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Project Files</h2>
        <FileUpload projectId={projectId} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <FileList projectId={projectId} />
        </TabsContent>
        
        <TabsContent value="folders">
          <FolderView projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectFiles;
