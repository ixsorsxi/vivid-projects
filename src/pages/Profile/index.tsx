
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { useAuth } from '@/context/auth';
import { Avatar } from '@/components/ui/avatar.custom';

const Profile = () => {
  const { user } = useAuth();

  return (
    <PageContainer title="Your Profile" subtitle="Manage your account settings">
      <div className="max-w-3xl mx-auto">
        <div className="bg-background border rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar
              name={user?.name || 'User'}
              src={user?.avatar_url || undefined}
              size="xl"
            />
            <div>
              <h2 className="text-2xl font-bold">{user?.name || 'Welcome!'}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              {user?.role && (
                <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {user.role}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
