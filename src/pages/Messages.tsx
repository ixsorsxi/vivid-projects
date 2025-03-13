
import React, { useState } from 'react';
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
  Video,
  UserPlus,
  Trash2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

// Mock system users for the search functionality
const systemUsers = [
  { id: '101', name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'Designer', online: true },
  { id: '102', name: 'Thomas Lee', email: 'thomas.lee@example.com', role: 'Developer', online: false },
  { id: '103', name: 'Amanda Garcia', email: 'amanda.garcia@example.com', role: 'Product Manager', online: true },
  { id: '104', name: 'David Kim', email: 'david.kim@example.com', role: 'Marketing', online: true },
  { id: '105', name: 'Lisa Chen', email: 'lisa.chen@example.com', role: 'Client', online: false },
  { id: '106', name: 'James Taylor', email: 'james.taylor@example.com', role: 'CEO', online: true },
];

const Messages = () => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [conversationSearchQuery, setConversationSearchQuery] = useState('');
  
  // Initial conversation data
  const [conversations, setConversations] = useState([
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
  ]);
  
  // Message data organized by conversation ID
  const [messagesByConversation, setMessagesByConversation] = useState({
    '1': [
      { id: '1', sender: 'John Doe', content: "Hey, how's the website redesign going?", timestamp: '10:30 AM', isMine: false },
      { id: '2', sender: 'You', content: 'Making good progress! Just finishing up the homepage mockups.', timestamp: '10:32 AM', isMine: true },
      { id: '3', sender: 'John Doe', content: "Great! Can you share the latest design files when you're done?", timestamp: '10:35 AM', isMine: false },
      { id: '4', sender: 'You', content: "Sure, I'll send them over by end of day. Do you want to schedule a quick review call?", timestamp: '10:40 AM', isMine: true },
      { id: '5', sender: 'John Doe', content: 'That would be helpful. How about tomorrow at 2 PM?', timestamp: '10:45 AM', isMine: false },
      { id: '6', sender: 'You', content: "Works for me. I'll send a calendar invite.", timestamp: '10:47 AM', isMine: true },
    ],
    '2': [
      { id: '1', sender: 'Jane Smith', content: "Hi there! I just got out of the client meeting.", timestamp: '11:15 AM', isMine: false },
      { id: '2', sender: 'You', content: 'How did it go? Were they happy with our proposal?', timestamp: '11:20 AM', isMine: true },
      { id: '3', sender: 'Jane Smith', content: 'The client approved the proposal!', timestamp: '11:30 AM', isMine: false },
    ],
    '3': [
      { id: '1', sender: 'Robert Johnson', content: "Do we have a team meeting scheduled this week?", timestamp: 'Yesterday', isMine: false },
      { id: '2', sender: 'You', content: "Yes, it's on Thursday at 10 AM.", timestamp: 'Yesterday', isMine: true },
      { id: '3', sender: 'Robert Johnson', content: "When is the next team meeting?", timestamp: 'Yesterday', isMine: false },
    ],
    '4': [
      { id: '1', sender: 'Emily Davis', content: "I've been working on the marketing campaign report.", timestamp: 'Yesterday', isMine: false },
      { id: '2', sender: 'You', content: 'Great! When do you think it will be ready?', timestamp: 'Yesterday', isMine: true },
      { id: '3', sender: 'Emily Davis', content: 'I finished the report for the marketing campaign', timestamp: 'Yesterday', isMine: false },
    ],
    '5': [
      { id: '1', sender: 'Michael Brown', content: "I'd like to discuss the new feature we talked about.", timestamp: 'Monday', isMine: false },
      { id: '2', sender: 'You', content: 'Sure, what aspects do you want to cover?', timestamp: 'Monday', isMine: true },
      { id: '3', sender: 'Michael Brown', content: 'Let me know when you have time to discuss the new feature', timestamp: 'Monday', isMine: false },
    ],
  });

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(convo => 
    convo.name.toLowerCase().includes(conversationSearchQuery.toLowerCase()) || 
    convo.lastMessage.toLowerCase().includes(conversationSearchQuery.toLowerCase())
  );

  // Filter system users based on search query
  const filteredUsers = systemUsers.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Get the selected conversation details
  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  
  // Get messages for the selected conversation
  const currentMessages = messagesByConversation[selectedConversation] || [];

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Create a new message
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessageObj = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage.trim(),
      timestamp: currentTime,
      isMine: true,
    };
    
    // Update the messages
    const updatedMessages = {
      ...messagesByConversation,
      [selectedConversation]: [...currentMessages, newMessageObj],
    };
    setMessagesByConversation(updatedMessages);
    
    // Update the conversation list with the new message
    const updatedConversations = conversations.map(convo => {
      if (convo.id === selectedConversation) {
        return {
          ...convo,
          lastMessage: newMessage.trim(),
          timestamp: currentTime,
        };
      }
      return convo;
    });
    setConversations(updatedConversations);
    
    // Clear the input
    setNewMessage('');
    
    // Simulate an automated response after a delay
    setTimeout(() => {
      const responseTime = new Date();
      responseTime.setMinutes(responseTime.getMinutes() + 1);
      const responseTimeString = responseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const responses = [
        "I'll get back to you on that soon!",
        "Thanks for the update.",
        "Let me check and get back to you.",
        "Sounds good!",
        "Got it, thanks!",
      ];
      
      const autoResponse = {
        id: Date.now().toString(),
        sender: selectedConversationData?.name || 'User',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: responseTimeString,
        isMine: false,
      };
      
      const updatedWithResponse = {
        ...updatedMessages,
        [selectedConversation]: [...updatedMessages[selectedConversation], autoResponse],
      };
      
      setMessagesByConversation(updatedWithResponse);
      
      // Update conversation with latest message
      const respondedConversations = updatedConversations.map(convo => {
        if (convo.id === selectedConversation) {
          return {
            ...convo,
            lastMessage: autoResponse.content,
            timestamp: responseTimeString,
          };
        }
        return convo;
      });
      
      setConversations(respondedConversations);
      
      toast({
        title: "New message received",
        description: `${selectedConversationData?.name}: ${autoResponse.content}`,
      });
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mark conversation as read when selected
  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    
    // Mark as read if it was unread
    setConversations(conversations.map(convo => {
      if (convo.id === id && convo.unread) {
        return { ...convo, unread: false };
      }
      return convo;
    }));
  };

  // Add new user to chat with
  const handleAddUser = (user: typeof systemUsers[0]) => {
    // Check if conversation with this user already exists
    const existingConversation = conversations.find(
      convo => convo.name.toLowerCase() === user.name.toLowerCase()
    );

    if (existingConversation) {
      setSelectedConversation(existingConversation.id);
      setSearchDialogOpen(false);
      toast({
        title: "Existing conversation",
        description: `You already have a conversation with ${user.name}`,
      });
      return;
    }

    // Create new conversation
    const newConvoId = (Date.now()).toString();
    const newConversation = {
      id: newConvoId,
      name: user.name,
      lastMessage: "Start chatting...",
      timestamp: "Just now",
      unread: false,
      online: user.online
    };

    // Add conversation to list
    setConversations([newConversation, ...conversations]);
    
    // Initialize empty message list for this conversation
    setMessagesByConversation({
      ...messagesByConversation,
      [newConvoId]: []
    });

    // Select the new conversation
    setSelectedConversation(newConvoId);
    setSearchDialogOpen(false);
    setUserSearchQuery('');

    toast({
      title: "New conversation created",
      description: `You can now chat with ${user.name}`,
    });
  };

  // Delete conversation
  const handleDeleteConversation = () => {
    if (!selectedConversation) return;

    // Remove conversation from the list
    setConversations(conversations.filter(convo => convo.id !== selectedConversation));
    
    // Remove messages for this conversation
    const updatedMessages = { ...messagesByConversation };
    delete updatedMessages[selectedConversation];
    setMessagesByConversation(updatedMessages);
    
    // Select first conversation or null
    setSelectedConversation(conversations.length > 1 ? conversations[0].id === selectedConversation ? conversations[1].id : conversations[0].id : '');
    
    setDeleteDialogOpen(false);
    
    toast({
      title: "Conversation deleted",
      description: "The conversation has been deleted successfully",
    });
  };
  
  return (
    <PageContainer 
      title="Messages" 
      subtitle="Chat with team members and clients"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Conversations</h3>
              <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Find Someone to Chat With</DialogTitle>
                    <DialogDescription>
                      Search for team members or clients to start a conversation.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2 py-4">
                    <Command className="rounded-lg border shadow-md">
                      <CommandInput 
                        placeholder="Search users..." 
                        value={userSearchQuery}
                        onValueChange={setUserSearchQuery}
                      />
                      <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup heading="Users">
                          {filteredUsers.map(user => (
                            <CommandItem
                              key={user.id}
                              value={user.name}
                              onSelect={() => handleAddUser(user)}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar 
                                  name={user.name} 
                                  size="sm" 
                                  status={user.online ? 'online' : 'offline'} 
                                />
                                <div className="flex flex-col">
                                  <span>{user.name}</span>
                                  <span className="text-xs text-muted-foreground">{user.role}</span>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setSearchDialogOpen(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                className="pl-9" 
                placeholder="Search conversations..." 
                value={conversationSearchQuery}
                onChange={(e) => setConversationSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="divide-y max-h-[calc(100vh-330px)] overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div 
                  key={conversation.id} 
                  className={cn(
                    "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                    conversation.id === selectedConversation ? 'bg-muted/80' : ''
                  )}
                  onClick={() => handleSelectConversation(conversation.id)}
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
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="md:col-span-2 border rounded-lg flex flex-col h-[calc(100vh-220px)]">
          {selectedConversationData ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar 
                    name={selectedConversationData.name} 
                    size="md" 
                    status={selectedConversationData.online ? 'online' : 'offline'} 
                  />
                  <div>
                    <h3 className="font-medium">{selectedConversationData.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversationData.online ? 'Online' : 'Offline'}
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
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {/* Delete Conversation Dialog */}
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Conversation</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this conversation with {selectedConversationData.name}? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setDeleteDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleDeleteConversation}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Chat messages */}
              <div className="flex-1 p-4 overflow-y-auto" id="message-container">
                <div className="space-y-4">
                  {currentMessages.map((message) => (
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
                <div className="flex items-start gap-2">
                  <Button variant="ghost" size="icon" className="mt-2">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea 
                    className="flex-1 min-h-[60px] resize-none"
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button 
                    size="icon" 
                    className="mt-2"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default Messages;
