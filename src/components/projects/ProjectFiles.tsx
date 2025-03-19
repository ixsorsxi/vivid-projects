
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileList } from './components/FileList';
import { FolderView } from './components/FolderView';
import { FileUpload } from './components/FileUpload';

interface ProjectFilesProps {
  projectId: string;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);

  const handleFileUpload = (newFiles: any[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFolderCreate = (newFolder: any) => {
    setFolders(prev => [...prev, newFolder]);
  };

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleNavigateUp = () => {
    if (currentFolderId) {
      const currentFolder = folders.find(folder => folder.id === currentFolderId);
      setCurrentFolderId(currentFolder?.parentId);
    }
  };

  const handleRemoveItem = (id: string, type: 'file' | 'folder') => {
    if (type === 'file') {
      setFiles(prev => prev.filter(file => file.id !== id));
    } else {
      // Remove folder and its children recursively
      const folderIdsToRemove = new Set<string>();
      
      // Helper function to collect all child folder IDs
      const collectChildFolders = (folderId: string) => {
        folderIdsToRemove.add(folderId);
        folders
          .filter(f => f.parentId === folderId)
          .forEach(child => collectChildFolders(child.id));
      };
      
      collectChildFolders(id);
      
      // Remove all folders in the set
      setFolders(prev => prev.filter(folder => !folderIdsToRemove.has(folder.id)));
      
      // Remove all files in the removed folders
      setFiles(prev => prev.filter(file => !file.folderId || !folderIdsToRemove.has(file.folderId)));
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Project Files</h2>
        <FileUpload 
          onFileUpload={handleFileUpload}
          onFolderCreate={handleFolderCreate}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <FileList 
            files={files}
            folders={folders}
            activeTab="all"
            currentFolderId={currentFolderId}
            onFolderNavigate={setCurrentFolderId}
            onPreview={(file) => console.log('Preview file:', file)}
            onRemove={handleRemoveItem}
          />
        </TabsContent>
        
        <TabsContent value="folders">
          <FolderView
            folders={folders}
            currentFolderId={currentFolderId}
            onFolderClick={handleFolderClick}
            onNavigateUp={handleNavigateUp}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectFiles;
