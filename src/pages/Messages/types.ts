
export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  online: boolean;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isMine: boolean;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  online: boolean;
}
