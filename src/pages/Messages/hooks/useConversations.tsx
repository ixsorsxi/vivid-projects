
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Conversation, SystemUser } from '../types';
import { initialConversations } from '../data';

export const useConversations = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [conversationSearchQuery, setConversationSearchQuery] = useState('');
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(convo => 
    convo.name.toLowerCase().includes(conversationSearchQuery.toLowerCase()) || 
    convo.lastMessage.toLowerCase().includes(conversationSearchQuery.toLowerCase())
  );

  // Get the selected conversation details
  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

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
      toast({
        title: "Existing conversation",
        description: `You already have a conversation with ${user.name}`,
      });
      return existingConversation.id;
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
    
    // Select the new conversation
    setSelectedConversation(newConvoId);

    toast({
      title: "New conversation created",
      description: `You can now chat with ${user.name}`,
    });
    
    return newConvoId;
  };

  // Delete conversation
  const handleDeleteConversation = () => {
    if (!selectedConversation) return;

    // Remove conversation from the list
    setConversations(conversations.filter(convo => convo.id !== selectedConversation));
    
    // Select first conversation or null
    setSelectedConversation(conversations.length > 1 ? 
      conversations[0].id === selectedConversation ? conversations[1].id : conversations[0].id 
      : '');
    
    toast({
      title: "Conversation deleted",
      description: "The conversation has been deleted successfully",
    });
  };

  // Update conversation with new message
  const updateConversationWithMessage = (
    conversationId: string, 
    messageContent: string, 
    timestamp: string
  ) => {
    setConversations(prevConversations => 
      prevConversations.map(convo => {
        if (convo.id === conversationId) {
          return {
            ...convo,
            lastMessage: messageContent,
            timestamp,
          };
        }
        return convo;
      })
    );
  };

  return {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    conversationSearchQuery,
    setConversationSearchQuery,
    filteredConversations,
    selectedConversationData,
    handleSelectConversation,
    handleAddUser,
    handleDeleteConversation,
    updateConversationWithMessage
  };
};
