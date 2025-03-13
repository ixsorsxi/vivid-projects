
import React from 'react';
import { Card } from '@/components/ui/card';
import ConversationList from './ConversationList';
import { Conversation } from '../types';

interface ConversationPanelProps {
  conversations: Conversation[];
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const ConversationPanel = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onNewChat,
  searchQuery,
  onSearchQueryChange
}: ConversationPanelProps) => {
  return (
    <Card className="md:col-span-1 border rounded-lg overflow-hidden">
      <ConversationList 
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={onSelectConversation}
        onNewChat={onNewChat}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
      />
    </Card>
  );
};

export default ConversationPanel;
