
import React from 'react';
import { Folder, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { FolderItem } from './FileUpload';

interface FolderViewProps {
  folders: FolderItem[];
  currentFolderId: string | undefined;
  onFolderClick: (folderId: string) => void;
  onNavigateUp: () => void;
}

export const FolderView: React.FC<FolderViewProps> = ({
  folders,
  currentFolderId,
  onFolderClick,
  onNavigateUp
}) => {
  // Get folders in the current directory
  const currentFolders = folders.filter(folder => folder.parentId === currentFolderId);
  
  // Get the current folder object
  const currentFolder = currentFolderId ? folders.find(folder => folder.id === currentFolderId) : undefined;

  if (currentFolders.length === 0 && !currentFolderId) {
    return null;
  }

  return (
    <div className="mb-6">
      {currentFolderId && (
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onNavigateUp}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to {currentFolder?.parentId ? 'Parent Folder' : 'All Files'}
          </Button>
          <span className="ml-2 text-sm text-muted-foreground">
            Current folder: <span className="font-medium text-foreground">{currentFolder?.name}</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {currentFolders.map(folder => (
          <button
            key={folder.id}
            className="flex items-center p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-left"
            onClick={() => onFolderClick(folder.id)}
          >
            <Folder className="h-5 w-5 mr-3 text-amber-500" />
            <div className="truncate">
              <p className="font-medium">{folder.name}</p>
              <p className="text-xs text-muted-foreground">
                Created {folder.createdDate.toLocaleDateString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
