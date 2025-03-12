
import React from 'react';
import { File, FileText, FileImage, FileAudio, FileVideo, Eye, X, FolderOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { FileItem, FolderItem } from './FileUpload';

interface FileListProps {
  files: FileItem[];
  folders: FolderItem[];
  activeTab: string;
  currentFolderId: string | undefined;
  onFolderNavigate: (folderId: string | undefined) => void;
  onPreview: (file: FileItem) => void;
  onRemove: (id: string, type: 'file' | 'folder') => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  folders,
  activeTab,
  currentFolderId,
  onFolderNavigate,
  onPreview,
  onRemove,
}) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-5 w-5 mr-3 text-blue-500" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="h-5 w-5 mr-3 text-purple-500" />;
    if (fileType.startsWith('video/')) return <FileVideo className="h-5 w-5 mr-3 text-pink-500" />;
    if (fileType.startsWith('text/') || fileType.includes('document')) return <FileText className="h-5 w-5 mr-3 text-amber-500" />;
    return <File className="h-5 w-5 mr-3 text-primary" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const filterFilesByType = (files: FileItem[]) => {
    // First filter by folder
    const folderFiles = files.filter(file => file.folderId === currentFolderId);
    
    // Then filter by file type based on active tab
    if (activeTab === 'all') return folderFiles;
    
    return folderFiles.filter(file => {
      if (activeTab === 'documents') return file.type.includes('document') || file.type.includes('pdf') || file.type.startsWith('text/');
      if (activeTab === 'images') return file.type.startsWith('image/');
      if (activeTab === 'media') return file.type.startsWith('audio/') || file.type.startsWith('video/');
      return true;
    });
  };

  const filteredFiles = filterFilesByType(files);
  const currentFolders = folders.filter(folder => folder.parentId === currentFolderId);
  
  const isEmptyFolder = filteredFiles.length === 0 && currentFolders.length === 0;

  // We're looking at subfolders
  if (isEmptyFolder && currentFolderId) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">This folder is empty</p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-2"
          onClick={() => onFolderNavigate(undefined)}
        >
          Back to root
        </Button>
      </div>
    );
  }

  // We're at the root level and there are no files in the current tab
  if (isEmptyFolder) {
    return <p className="text-center text-muted-foreground py-4">No files in this category</p>;
  }

  return (
    <div className="space-y-3">
      {/* Show folders first */}
      {currentFolders.map(folder => (
        <div key={folder.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/30 transition-colors">
          <button 
            className="flex items-center flex-1 min-w-0 text-left"
            onClick={() => onFolderNavigate(folder.id)}
          >
            <FolderOpen className="h-5 w-5 mr-3 text-amber-500" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{folder.name}</p>
              <p className="text-xs text-muted-foreground">
                Created {folder.createdDate.toLocaleDateString()}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemove(folder.id, 'folder')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Then show files */}
      {filteredFiles.map(file => (
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
            <Button variant="ghost" size="sm" onClick={() => onPreview(file)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onRemove(file.id, 'file')}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
