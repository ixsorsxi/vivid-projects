
import React, { useState } from 'react';
import { FileUp, FolderPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  onFileUpload: (files: FileItem[]) => void;
  onFolderCreate: (folder: FolderItem) => void;
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
  folderId?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  createdDate: Date;
  parentId?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  onFolderCreate,
  isDragging,
  setIsDragging
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);

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
        url,
        folderId: currentFolderId
      });
    }
    
    onFileUpload(newFiles);
    
    toast({
      title: "Files uploaded",
      description: `Successfully uploaded ${newFiles.length} file${newFiles.length > 1 ? 's' : ''}.`,
    });
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      createdDate: new Date(),
      parentId: currentFolderId
    };

    onFolderCreate(newFolder);
    setNewFolderName('');
    setIsNewFolderOpen(false);

    toast({
      title: "Folder created",
      description: `Successfully created folder "${newFolderName}".`
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
      <div className="flex gap-2">
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
          Upload Files
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setIsNewFolderOpen(true)}
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
