
import { Message } from '../types';

export const generateResponseMessage = (senderName: string, timestamp: string): Message => {
  const responses = [
    "I'll get back to you on that soon!",
    "Thanks for the update.",
    "Let me check and get back to you.",
    "Sounds good!",
    "Got it, thanks!",
  ];
  
  return {
    id: Date.now().toString(),
    sender: senderName,
    content: responses[Math.floor(Math.random() * responses.length)],
    timestamp,
    isMine: false,
  };
};
