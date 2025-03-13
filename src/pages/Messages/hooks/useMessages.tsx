
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '../types';
import { initialMessagesByConversation } from '../data';
import { formatTimestamp, generateResponseMessage, createUserMessage } from '../utils/messageUtils';

export const useMessages = (
  selectedConversation: string,
  updateConversationWithMessage: (conversationId: string, messageContent: string, timestamp: string) => void
) => {
  const { toast } = useToast();
  const [messagesByConversation, setMessagesByConversation] = useState(initialMessagesByConversation);
  const [newMessage, setNewMessage] = useState('');
  
  // Get messages for the selected conversation
  const currentMessages = messagesByConversation[selectedConversation] || [];

  // Handle sending a new message
  const handleSendMessage = (senderName: string) => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Create and add the new message
    const currentTime = formatTimestamp(new Date());
    const userMessageObj = createUserMessage(newMessage, currentTime);
    
    // Update messages state
    const updatedMessages = addMessageToConversation(
      messagesByConversation,
      selectedConversation,
      userMessageObj
    );
    
    // Update the conversation list with the new message
    updateConversationWithMessage(selectedConversation, newMessage.trim(), currentTime);
    
    // Clear the input
    setNewMessage('');
    
    // Simulate an automated response
    simulateResponseMessage(selectedConversation, senderName, updatedMessages);
  };
  
  // Adds a message to a conversation
  const addMessageToConversation = (
    allMessages: Record<string, Message[]>,
    conversationId: string,
    message: Message
  ): Record<string, Message[]> => {
    const conversationMessages = allMessages[conversationId] || [];
    const updatedMessages = {
      ...allMessages,
      [conversationId]: [...conversationMessages, message],
    };
    
    setMessagesByConversation(updatedMessages);
    return updatedMessages;
  };

  // Simulates an automated response
  const simulateResponseMessage = (
    conversationId: string, 
    senderName: string, 
    currentMessages: Record<string, Message[]>
  ) => {
    setTimeout(() => {
      // Create a response timestamp a minute later
      const responseTime = new Date();
      responseTime.setMinutes(responseTime.getMinutes() + 1);
      const responseTimeString = formatTimestamp(responseTime);
      
      // Generate the response message
      const autoResponse = generateResponseMessage(senderName, responseTimeString);
      
      // Add the response to the conversation
      const updatedWithResponse = addMessageToConversation(
        currentMessages,
        conversationId,
        autoResponse
      );
      
      // Update conversation with latest message
      updateConversationWithMessage(conversationId, autoResponse.content, responseTimeString);
      
      // Show notification toast
      toast({
        title: "New message received",
        description: `${senderName}: ${autoResponse.content}`,
      });
    }, 2000);
  };

  // Initialize empty message list for a new conversation
  const initializeMessagesForConversation = (conversationId: string) => {
    setMessagesByConversation(prev => ({
      ...prev,
      [conversationId]: []
    }));
  };

  return {
    newMessage,
    setNewMessage,
    currentMessages,
    handleSendMessage,
    initializeMessagesForConversation
  };
};
