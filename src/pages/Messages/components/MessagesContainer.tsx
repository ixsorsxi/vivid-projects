
import React from 'react';
import ConversationPanel from './ConversationPanel';
import ChatPanel from './ChatPanel';
import DialogContainer from './DialogContainer';
import { useMessaging } from '../hooks/useMessaging';
import { filterUsers } from '../utils/userUtils';

const MessagesContainer = () => {
  const {
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
  } = useMessaging();

  // Get filtered users using the utility function
  const filteredUsers = filterUsers(userSearchQuery);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ConversationPanel 
        conversations={filteredConversations}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        onNewChat={() => setSearchDialogOpen(true)}
        searchQuery={conversationSearchQuery}
        onSearchQueryChange={setConversationSearchQuery}
      />
      
      <ChatPanel 
        selectedConversationData={selectedConversationData}
        messages={currentMessages}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onDeleteConversation={() => setDeleteDialogOpen(true)}
      />

      <DialogContainer 
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        searchDialogOpen={searchDialogOpen}
        setSearchDialogOpen={setSearchDialogOpen}
        userSearchQuery={userSearchQuery}
        setUserSearchQuery={setUserSearchQuery}
        filteredUsers={filteredUsers}
        selectedConversationName={selectedConversationData?.name || ''}
        onAddUser={handleAddUser}
        onDeleteConversation={handleDeleteConversation}
      />
    </div>
  );
};

export default MessagesContainer;
