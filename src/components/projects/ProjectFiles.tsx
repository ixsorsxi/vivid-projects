
import React, { useState } from 'react';
import { AlertCircle, FileUp, File, X, FileText, FileImage, FileAudio, FileVideo, Download, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url?: string; // For preview
}

const ProjectFiles: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    
    const newFiles: FileItem[] = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      // Create a temporary URL for preview
      const url = URL.createObjectURL(file);
      
      newFiles.push({
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        url
      });
    }
    
    setFiles([...files, ...newFiles]);
    
    toast({
      title: "Files uploaded",
      description: `Successfully uploaded ${newFiles.length} file${newFiles.length > 1 ? 's' : ''}.`,
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
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

  const openFilePreview = (file: FileItem) => {
    setSelectedFile(file);
    setPreviewOpen(true);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-5 w-5 mr-3 text-blue-500" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="h-5 w-5 mr-3 text-purple-500" />;
    if (fileType.startsWith('video/')) return <FileVideo className="h-5 w-5 mr-3 text-pink-500" />;
    if (fileType.startsWith('text/') || fileType.includes('document')) return <FileText className="h-5 w-5 mr-3 text-amber-500" />;
    return <File className="h-5 w-5 mr-3 text-primary" />;
  };

  const filteredFiles = activeTab === 'all' 
    ? files 
    : files.filter(file => {
        if (activeTab === 'documents') return file.type.includes('document') || file.type.includes('pdf') || file.type.startsWith('text/');
        if (activeTab === 'images') return file.type.startsWith('image/');
        if (activeTab === 'media') return file.type.startsWith('audio/') || file.type.startsWith('video/');
        return true;
      });

  const renderFilePreview = () => {
    if (!selectedFile) return null;
    
    if (selectedFile.type.startsWith('image/')) {
      return <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full max-h-[70vh] object-contain" />;
    }
    
    if (selectedFile.type.startsWith('video/')) {
      return (
        <video controls className="max-w-full max-h-[70vh]">
          <source src={selectedFile.url} type={selectedFile.type} />
          Your browser does not support video playback.
        </video>
      );
    }
    
    if (selectedFile.type.startsWith('audio/')) {
      return (
        <audio controls className="w-full mt-4">
          <source src={selectedFile.url} type={selectedFile.type} />
          Your browser does not support audio playback.
        </audio>
      );
    }
    
    // For other files like PDFs or documents
    return (
      <div className="text-center p-8">
        <File className="h-16 w-16 mx-auto mb-4 text-primary" />
        <p>Preview not available for this file type.</p>
        <Button className="mt-4" asChild>
          <a href={selectedFile.url} download={selectedFile.name} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" /> Download File
          </a>
        </Button>
      </div>
    );
  };

  if (files.length === 0) {
    return (
      <div 
        className={`glass-card p-6 rounded-xl flex items-center justify-center h-64 border-2 border-dashed ${isDragging ? 'border-primary bg-primary/5' : 'border-muted'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <FileUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-medium">No files yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop files here, or click the button below to upload.
          </p>
          <input 
            type="file" 
            multiple 
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)} 
          />
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Files
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Project Files</h2>
        <Button 
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="h-4 w-4 mr-2" />
          Upload More
        </Button>
        <input 
          type="file" 
          multiple 
          className="hidden" 
          ref={fileInputRef}
          onChange={(e) => handleFileUpload(e.target.files)} 
        />
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-4 mb-4 transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-center text-sm text-muted-foreground">
          Drag and drop files here to upload
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-3">
        {filteredFiles.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No files in this category</p>
        ) : (
          filteredFiles.map(file => (
            <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/30 transition-colors">
              <div className="flex items-center flex-1 min-w-0">
                {getFileIcon(file.type)}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => openFilePreview(file)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex justify-center">
            {renderFilePreview()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectFiles;
