
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto" id="message-container">
      <div className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "flex",
              message.isMine ? "justify-end" : "justify-start"
            )}
          >
            <div className="flex flex-col max-w-[70%]">
              <div className={cn(
                "rounded-lg p-3",
                message.isMine 
                  ? "bg-primary text-primary-foreground rounded-br-none" 
                  : "bg-muted rounded-bl-none"
              )}>
                {message.content}
              </div>
              <span className="text-xs text-muted-foreground mt-1 px-1">
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
