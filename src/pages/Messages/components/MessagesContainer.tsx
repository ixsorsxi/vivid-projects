
import React from 'react';
import { Card } from '@/components/ui/card';
import { systemUsers } from '../data';
import ConversationList from './ConversationList';
import ChatArea from './ChatArea';
import SearchUserDialog from './SearchUserDialog';
import DeleteConversationDialog from './DeleteConversationDialog';
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
      <Card className="md:col-span-1 border rounded-lg overflow-hidden">
        <ConversationList 
          conversations={filteredConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          onNewChat={() => setSearchDialogOpen(true)}
          searchQuery={conversationSearchQuery}
          onSearchQueryChange={setConversationSearchQuery}
        />
      </Card>
      
      <Card className="md:col-span-2 border rounded-lg flex flex-col h-[calc(100vh-220px)]">
        {selectedConversationData ? (
          <ChatArea 
            conversation={selectedConversationData}
            messages={currentMessages}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            onDeleteConversation={() => setDeleteDialogOpen(true)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </Card>

      <SearchUserDialog 
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        filteredUsers={filteredUsers}
        searchQuery={userSearchQuery}
        onSearchQueryChange={setUserSearchQuery}
        onAddUser={handleAddUser}
      />

      <DeleteConversationDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        conversationName={selectedConversationData?.name || ''}
        onConfirmDelete={handleDeleteConversation}
      />
    </div>
  );
};

export default MessagesContainer;
