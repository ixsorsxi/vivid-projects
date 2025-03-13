
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Avatar from '@/components/ui/avatar';
import { 
  MoreHorizontal, 
  Paperclip, 
  Send, 
  Star, 
  Video,
  Trash2
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Conversation, Message } from '../types';
import MessageList from './MessageList';

interface ChatAreaProps {
  conversation: Conversation;
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onDeleteConversation: () => void;
}

const ChatArea = ({ 
  conversation, 
  messages, 
  newMessage, 
  onNewMessageChange, 
  onSendMessage,
  onDeleteConversation
}: ChatAreaProps) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <>
      {/* Chat header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar 
            name={conversation.name} 
            size="md" 
            status={conversation.online ? 'online' : 'offline'} 
          />
          <div>
            <h3 className="font-medium">{conversation.name}</h3>
            <p className="text-xs text-muted-foreground">
              {conversation.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Star className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onDeleteConversation}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Message list */}
      <MessageList messages={messages} />
      
      {/* Chat input */}
      <div className="p-4 border-t">
        <div className="flex items-start gap-2">
          <Button variant="ghost" size="icon" className="mt-2">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea 
            className="flex-1 min-h-[60px] resize-none"
            placeholder="Type a message..." 
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            size="icon" 
            className="mt-2"
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatArea;
