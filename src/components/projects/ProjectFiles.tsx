
import React, { useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload, type FileItem, type FolderItem } from './components/FileUpload';
import { FilePreview } from './components/FilePreview';
import { FileList } from './components/FileList';
import { FolderView } from './components/FolderView';

const ProjectFiles: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleFileUpload = (newFiles: FileItem[]) => {
    setFiles([...files, ...newFiles]);
  };

  const handleCreateFolder = (newFolder: FolderItem) => {
    setFolders([...folders, newFolder]);
  };

  const removeFile = (id: string, type: 'file' | 'folder') => {
    if (type === 'file') {
      const fileToRemove = files.find(file => file.id === id);
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      setFiles(files.filter(file => file.id !== id));
      toast({
        title: "File removed",
        description: "The file has been removed from the project."
      });
    } else {
      // Check if folder has files
      const hasFiles = files.some(file => file.folderId === id);
      // Check if folder has subfolders
      const hasSubfolders = folders.some(folder => folder.parentId === id);
      
      if (hasFiles || hasSubfolders) {
        toast({
          title: "Cannot delete folder",
          description: "This folder contains files or subfolders. Remove them first.",
          variant: "destructive"
        });
        return;
      }
      
      setFolders(folders.filter(folder => folder.id !== id));
      toast({
        title: "Folder removed",
        description: "The folder has been removed from the project."
      });
    }
  };

  const navigateToFolder = (folderId: string | undefined) => {
    setCurrentFolderId(folderId);
  };

  const navigateUp = () => {
    if (!currentFolderId) return;
    
    const currentFolder = folders.find(f => f.id === currentFolderId);
    if (!currentFolder) return;
    
    setCurrentFolderId(currentFolder.parentId);
  };

  const hasContent = files.length > 0 || folders.length > 0;

  if (!hasContent) {
    return (
      <div 
        className={`glass-card p-6 rounded-xl flex items-center justify-center h-64 border-2 border-dashed ${isDragging ? 'border-primary bg-primary/5' : 'border-muted'}`}
      >
        <FileUpload
          onFileUpload={handleFileUpload}
          onFolderCreate={handleCreateFolder}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Project Files</h2>
          {currentFolderId && (
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <FolderOpen className="h-4 w-4 mr-1" />
              <span>{folders.find(f => f.id === currentFolderId)?.name || "Unknown Folder"}</span>
            </div>
          )}
        </div>
        <FileUpload
          onFileUpload={handleFileUpload}
          onFolderCreate={handleCreateFolder}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      </div>
      
      <FolderView 
        folders={folders}
        currentFolderId={currentFolderId}
        onFolderClick={navigateToFolder}
        onNavigateUp={navigateUp}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <FileList
        files={files}
        folders={folders}
        activeTab={activeTab}
        currentFolderId={currentFolderId}
        onFolderNavigate={navigateToFolder}
        onPreview={(file) => {
          setSelectedFile(file);
          setPreviewOpen(true);
        }}
        onRemove={removeFile}
      />
      
      <FilePreview
        file={selectedFile}
        isOpen={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
};

export default ProjectFiles;
