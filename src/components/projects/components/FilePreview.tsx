
import React from 'react';
import { File, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FileItem } from './FileUpload';

interface FilePreviewProps {
  file: FileItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  isOpen,
  onOpenChange,
}) => {
  if (!file) return null;

  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return <img src={file.url} alt={file.name} className="max-w-full max-h-[70vh] object-contain" />;
    }
    
    if (file.type.startsWith('video/')) {
      return (
        <video controls className="max-w-full max-h-[70vh]">
          <source src={file.url} type={file.type} />
          Your browser does not support video playback.
        </video>
      );
    }
    
    if (file.type.startsWith('audio/')) {
      return (
        <audio controls className="w-full mt-4">
          <source src={file.url} type={file.type} />
          Your browser does not support audio playback.
        </audio>
      );
    }
    
    return (
      <div className="text-center p-8">
        <File className="h-16 w-16 mx-auto mb-4 text-primary" />
        <p>Preview not available for this file type.</p>
        <Button className="mt-4" asChild>
          <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" /> Download File
          </a>
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
