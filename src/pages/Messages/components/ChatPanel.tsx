
import React from 'react';
import { Card } from '@/components/ui/card';
import ChatArea from './ChatArea';
import { Conversation, Message } from '../types';

interface ChatPanelProps {
  selectedConversationData: Conversation | undefined;
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onDeleteConversation: () => void;
}

const ChatPanel = ({
  selectedConversationData,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onDeleteConversation
}: ChatPanelProps) => {
  return (
    <Card className="md:col-span-2 border rounded-lg flex flex-col h-[calc(100vh-220px)]">
      {selectedConversationData ? (
        <ChatArea 
          conversation={selectedConversationData}
          messages={messages}
          newMessage={newMessage}
          onNewMessageChange={onNewMessageChange}
          onSendMessage={onSendMessage}
          onDeleteConversation={onDeleteConversation}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium">Select a conversation</h3>
            <p className="text-muted-foreground">Choose a contact to start messaging</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ChatPanel;
