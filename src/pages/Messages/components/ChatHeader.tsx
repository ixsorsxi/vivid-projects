
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Conversation } from '../types';

interface ChatHeaderProps {
  conversation: Conversation;
  onDelete: () => void;
}

const ChatHeader = ({ conversation, onDelete }: ChatHeaderProps) => {
  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {conversation.name.charAt(0).toUpperCase()}
          </div>
          {conversation.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
          )}
        </div>
        <div>
          <h3 className="font-medium">{conversation.name}</h3>
          <p className="text-xs text-muted-foreground">
            {conversation.online ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            Delete Conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;
