
import { Conversation, Message, SystemUser } from './types';

// Mock system users for the search functionality
export const systemUsers: SystemUser[] = [
  { id: '101', name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'Designer', online: true },
  { id: '102', name: 'Thomas Lee', email: 'thomas.lee@example.com', role: 'Developer', online: false },
  { id: '103', name: 'Amanda Garcia', email: 'amanda.garcia@example.com', role: 'Product Manager', online: true },
  { id: '104', name: 'David Kim', email: 'david.kim@example.com', role: 'Marketing', online: true },
  { id: '105', name: 'Lisa Chen', email: 'lisa.chen@example.com', role: 'Client', online: false },
  { id: '106', name: 'James Taylor', email: 'james.taylor@example.com', role: 'CEO', online: true },
];

// Initial conversation data
export const initialConversations: Conversation[] = [
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

// Message data organized by conversation ID
export const initialMessagesByConversation: Record<string, Message[]> = {
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
};
