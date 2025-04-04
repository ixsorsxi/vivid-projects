
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const Layout = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="projectapp-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex flex-col w-full">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6 overflow-auto animate-in fade-in-50">
              <div className="container mx-auto max-w-7xl">
                <Outlet />
              </div>
            </main>
            <footer className="py-4 px-6 text-center text-sm text-muted-foreground bg-background/80">
              <p>© {new Date().getFullYear()} ProjectSync. All rights reserved.</p>
            </footer>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Toaster />
    </ThemeProvider>
  );
};

export default Layout;
