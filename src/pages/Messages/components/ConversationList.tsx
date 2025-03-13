
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/ui/avatar';
import { UserPlus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation,
  onNewChat,
  searchQuery,
  onSearchQueryChange
}: ConversationListProps) => {
  return (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Conversations</h3>
          <Button size="sm" variant="outline" onClick={onNewChat}>
            <UserPlus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            className="pl-9" 
            placeholder="Search conversations..." 
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="divide-y max-h-[calc(100vh-330px)] overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <ConversationItem 
              key={conversation.id}
              conversation={conversation}
              isSelected={conversation.id === selectedConversation}
              onClick={() => onSelectConversation(conversation.id)}
            />
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        )}
      </div>
    </>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, isSelected, onClick }: ConversationItemProps) => {
  return (
    <div 
      className={cn(
        "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
        isSelected ? 'bg-muted/80' : ''
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Avatar 
          name={conversation.name} 
          size="md" 
          status={conversation.online ? 'online' : 'offline'} 
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate">{conversation.name}</h3>
            <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
        </div>
        {conversation.unread && (
          <div className="h-2 w-2 rounded-full bg-primary"></div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
