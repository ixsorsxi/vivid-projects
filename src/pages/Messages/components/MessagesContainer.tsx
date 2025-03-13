
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ConversationList from './ConversationList';
import ChatArea from './ChatArea';
import SearchUserDialog from './SearchUserDialog';
import DeleteConversationDialog from './DeleteConversationDialog';
import { generateResponseMessage } from '../utils/messageUtils';
import { Conversation, Message, SystemUser } from '../types';
import { initialConversations, initialMessagesByConversation, systemUsers } from '../data';

const MessagesContainer = () => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [conversationSearchQuery, setConversationSearchQuery] = useState('');
  
  // State for conversations and messages
  const [conversations, setConversations] = useState(initialConversations);
  const [messagesByConversation, setMessagesByConversation] = useState(initialMessagesByConversation);

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
    const newMessageObj: Message = {
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
      
      const autoResponse = generateResponseMessage(
        selectedConversationData?.name || 'User', 
        responseTimeString
      );
      
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
  const handleAddUser = (user: SystemUser) => {
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
    const newConversation: Conversation = {
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
    setSelectedConversation(conversations.length > 1 ? 
      conversations[0].id === selectedConversation ? conversations[1].id : conversations[0].id 
      : '');
    
    setDeleteDialogOpen(false);
    
    toast({
      title: "Conversation deleted",
      description: "The conversation has been deleted successfully",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 border rounded-lg overflow-hidden">
        <ConversationList 
          conversations={filteredConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          onNewChat={() => setSearchDialogOpen(true)}
          searchQuery={conversationSearchQuery}
          onSearchQueryChange={setConversationSearchQuery}
        />
      </Card>
      
      <Card className="md:col-span-2 border rounded-lg flex flex-col h-[calc(100vh-220px)]">
        {selectedConversationData ? (
          <ChatArea 
            conversation={selectedConversationData}
            messages={currentMessages}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            onDeleteConversation={() => setDeleteDialogOpen(true)}
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

      <SearchUserDialog 
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        filteredUsers={filteredUsers}
        searchQuery={userSearchQuery}
        onSearchQueryChange={setUserSearchQuery}
        onAddUser={handleAddUser}
      />

      <DeleteConversationDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        conversationName={selectedConversationData?.name || ''}
        onConfirmDelete={handleDeleteConversation}
      />
    </div>
  );
};

export default MessagesContainer;
