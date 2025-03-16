
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <PageContainer title="Profile">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="bg-card rounded-lg border p-6 mb-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Name</h2>
              <p className="text-lg">{user?.name || 'User'}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Email</h2>
              <p className="text-lg">{user?.email || 'user@example.com'}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Role</h2>
              <p className="text-lg">{user?.role || 'User'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
