
import { Message } from '../types';
import { formatTimestamp, generateResponseMessage } from './messageUtils';
import { toast } from '@/components/ui/toast-wrapper';

// Function to create a new message object
export const createNewUserMessage = (content: string): Message => {
  const currentTime = formatTimestamp(new Date());
  return {
    id: Date.now().toString(),
    sender: 'You',
    content: content.trim(),
    timestamp: currentTime,
    isMine: true,
  };
};

// Function to handle automated response simulation
export const simulateResponse = (
  conversationId: string,
  senderName: string,
  currentMessages: Record<string, Message[]>,
  setMessagesByConversation: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>,
  updateConversationWithMessage: (conversationId: string, messageContent: string, timestamp: string) => void
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
    
    toast("New message received", {
      description: `${senderName}: ${autoResponse.content}`,
    });
  }, 2000);
};
