
import React, { useState } from 'react';
import { AlertCircle, FileUp, File, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
}

const ProjectFiles: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    
    const newFiles: FileItem[] = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      newFiles.push({
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date()
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
    setFiles(files.filter(file => file.id !== id));
    toast({
      title: "File removed",
      description: "The file has been removed from the project."
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
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
      
      <div className="space-y-3">
        {files.map(file => (
          <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center">
              <File className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectFiles;
