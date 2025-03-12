
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ArrowRight,
  MoreHorizontal, 
  Paperclip, 
  Search, 
  Send, 
  Star, 
  Video 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const Messages = () => {
  const conversations = [
    { 
      id: '1', 
      name: 'John Doe', 
      lastMessage: 'Can you share the latest design files?', 
      timestamp: '2:45 PM', 
      unread: true,
      online: true 
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      lastMessage: 'The client approved the proposal!', 
      timestamp: '11:30 AM', 
      unread: false,
      online: true 
    },
    { 
      id: '3', 
      name: 'Robert Johnson', 
      lastMessage: 'When is the next team meeting?', 
      timestamp: 'Yesterday', 
      unread: false,
      online: false 
    },
    { 
      id: '4', 
      name: 'Emily Davis', 
      lastMessage: 'I finished the report for the marketing campaign', 
      timestamp: 'Yesterday', 
      unread: false,
      online: true 
    },
    { 
      id: '5', 
      name: 'Michael Brown', 
      lastMessage: 'Let me know when you have time to discuss the new feature', 
      timestamp: 'Monday', 
      unread: false,
      online: false 
    },
  ];
  
  const messages = [
    { id: '1', sender: 'John Doe', content: 'Hey, how's the website redesign going?', timestamp: '10:30 AM', isMine: false },
    { id: '2', sender: 'You', content: 'Making good progress! Just finishing up the homepage mockups.', timestamp: '10:32 AM', isMine: true },
    { id: '3', sender: 'John Doe', content: 'Great! Can you share the latest design files when you're done?', timestamp: '10:35 AM', isMine: false },
    { id: '4', sender: 'You', content: 'Sure, I'll send them over by end of day. Do you want to schedule a quick review call?', timestamp: '10:40 AM', isMine: true },
    { id: '5', sender: 'John Doe', content: 'That would be helpful. How about tomorrow at 2 PM?', timestamp: '10:45 AM', isMine: false },
    { id: '6', sender: 'You', content: 'Works for me. I'll send a calendar invite.', timestamp: '10:47 AM', isMine: true },
  ];
  
  return (
    <PageContainer 
      title="Messages" 
      subtitle="Chat with team members and clients"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                className="pl-9" 
                placeholder="Search messages..." 
              />
            </div>
          </div>
          
          <div className="divide-y max-h-[calc(100vh-280px)] overflow-y-auto">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id} 
                className={cn(
                  "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                  conversation.id === '1' ? 'bg-muted/80' : ''
                )}
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
            ))}
          </div>
        </Card>
        
        <Card className="md:col-span-2 border rounded-lg flex flex-col h-[calc(100vh-220px)]">
          {/* Chat header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar 
                name="John Doe" 
                size="md" 
                status="online" 
              />
              <div>
                <h3 className="font-medium">John Doe</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto">
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
          
          {/* Chat input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input 
                className="flex-1" 
                placeholder="Type a message..." 
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Messages;
