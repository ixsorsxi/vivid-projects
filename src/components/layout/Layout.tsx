
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="container mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ProjectSync. All rights reserved.</p>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
