
import React from 'react';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import { Message, Conversation } from '../types';

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
  return (
    <>
      <ChatHeader 
        conversation={conversation} 
        onDelete={onDeleteConversation} 
      />
      
      <MessageList messages={messages} />
      
      <ChatInput 
        value={newMessage}
        onChange={onNewMessageChange}
        onSend={onSendMessage}
      />
    </>
  );
};

export default ChatArea;
