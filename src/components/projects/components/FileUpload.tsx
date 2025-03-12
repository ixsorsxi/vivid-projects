
import React from 'react';
import { FileUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFileUpload: (files: FileItem[]) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  isDragging,
  setIsDragging
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    
    const newFiles: FileItem[] = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
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
    
    onFileUpload(newFiles);
    
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

  return (
    <>
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
      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e.target.files)} 
      />
      <Button 
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <FileUp className="h-4 w-4 mr-2" />
        Upload More
      </Button>
    </>
  );
};
