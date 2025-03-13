
import React from 'react';
import { systemUsers } from '../data';
import ConversationPanel from './ConversationPanel';
import ChatPanel from './ChatPanel';
import DialogContainer from './DialogContainer';
import { useMessaging } from '../hooks/useMessaging';

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

  // Filter system users based on search query
  const filteredUsers = systemUsers.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

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
