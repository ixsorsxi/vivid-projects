
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '../types';
import { initialMessagesByConversation } from '../data';
import { generateResponseMessage, formatTimestamp } from '../utils/messageUtils';

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
    
    // Create a new message
    const currentTime = formatTimestamp(new Date());
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
    updateConversationWithMessage(selectedConversation, newMessage.trim(), currentTime);
    
    // Clear the input
    setNewMessage('');
    
    // Simulate an automated response after a delay
    simulateResponse(selectedConversation, senderName, updatedMessages);
  };

  const simulateResponse = (
    conversationId: string, 
    senderName: string, 
    currentMessages: Record<string, Message[]>
  ) => {
    setTimeout(() => {
      const responseTime = new Date();
      responseTime.setMinutes(responseTime.getMinutes() + 1);
      const responseTimeString = formatTimestamp(responseTime);
      
      const autoResponse = generateResponseMessage(senderName, responseTimeString);
      
      const updatedWithResponse = {
        ...currentMessages,
        [conversationId]: [...currentMessages[conversationId], autoResponse],
      };
      
      setMessagesByConversation(updatedWithResponse);
      
      // Update conversation with latest message
      updateConversationWithMessage(conversationId, autoResponse.content, responseTimeString);
      
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
    messagesByConversation,
    setMessagesByConversation,
    handleSendMessage,
    initializeMessagesForConversation
  };
};
