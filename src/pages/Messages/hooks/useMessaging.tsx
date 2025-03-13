
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';
import { useDialogs } from './useDialogs';
import { SystemUser } from '../types';

export const useMessaging = () => {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    conversationSearchQuery,
    setConversationSearchQuery,
    filteredConversations,
    selectedConversationData,
    handleSelectConversation,
    handleAddUser: addUser,
    handleDeleteConversation,
    updateConversationWithMessage
  } = useConversations();

  const {
    newMessage,
    setNewMessage,
    currentMessages,
    handleSendMessage: sendMessage,
    initializeMessagesForConversation
  } = useMessages(selectedConversation, updateConversationWithMessage);

  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    searchDialogOpen,
    setSearchDialogOpen,
    userSearchQuery,
    setUserSearchQuery
  } = useDialogs();

  // Enhanced handlers that coordinate between the hooks
  const handleSendMessage = () => {
    if (selectedConversationData) {
      sendMessage(selectedConversationData.name);
    }
  };

  const handleAddUser = (user: SystemUser) => {
    const newConversationId = addUser(user);
    
    // Initialize empty message list for this conversation
    if (newConversationId && newConversationId !== selectedConversation) {
      initializeMessagesForConversation(newConversationId);
    }
    
    setSearchDialogOpen(false);
    setUserSearchQuery('');
  };

  return {
    newMessage,
    setNewMessage,
    selectedConversation,
    deleteDialogOpen,
    setDeleteDialogOpen,
    searchDialogOpen,
    setSearchDialogOpen,
    userSearchQuery,
    setUserSearchQuery,
    conversationSearchQuery,
    setConversationSearchQuery,
    filteredConversations,
    selectedConversationData,
    currentMessages,
    handleSendMessage,
    handleSelectConversation,
    handleAddUser,
    handleDeleteConversation
  };
};
