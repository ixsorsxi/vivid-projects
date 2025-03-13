
import React from 'react';
import PageContainer from '@/components/PageContainer';
import MessagesContainer from './components/MessagesContainer';

const Messages = () => {
  return (
    <PageContainer 
      title="Messages" 
      subtitle="Chat with team members and clients"
    >
      <MessagesContainer />
    </PageContainer>
  );
};

export default Messages;
