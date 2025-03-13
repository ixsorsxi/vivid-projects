
import { Message } from '../types';

export const generateResponseMessage = (senderName: string, timestamp: string): Message => {
  const responses = [
    "I'll get back to you on that soon!",
    "Thanks for the update.",
    "Let me check and get back to you.",
    "Sounds good!",
    "Got it, thanks!",
    "I appreciate your feedback.",
    "That's interesting, tell me more.",
    "Let's discuss this in our next meeting.",
    "Great progress!",
    "I've made a note of that."
  ];
  
  return {
    id: Date.now().toString(),
    sender: senderName,
    content: responses[Math.floor(Math.random() * responses.length)],
    timestamp,
    isMine: false,
  };
};

export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const createNewMessage = (content: string, isMine: boolean, sender: string): Message => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return {
    id: Date.now().toString(),
    sender,
    content,
    timestamp: currentTime,
    isMine,
  };
};
