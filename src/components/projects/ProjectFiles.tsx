
import React, { useState } from 'react';
import { FileUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload, type FileItem } from './components/FileUpload';
import { FilePreview } from './components/FilePreview';
import { FileList } from './components/FileList';

const ProjectFiles: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const handleFileUpload = (newFiles: FileItem[]) => {
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find(file => file.id === id);
    if (fileToRemove?.url) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setFiles(files.filter(file => file.id !== id));
    toast({
      title: "File removed",
      description: "The file has been removed from the project."
    });
  };

  if (files.length === 0) {
    return (
      <div 
        className={`glass-card p-6 rounded-xl flex items-center justify-center h-64 border-2 border-dashed ${isDragging ? 'border-primary bg-primary/5' : 'border-muted'}`}
      >
        <FileUpload
          onFileUpload={handleFileUpload}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Project Files</h2>
        <FileUpload
          onFileUpload={handleFileUpload}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      </div>
      
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
        activeTab={activeTab}
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
