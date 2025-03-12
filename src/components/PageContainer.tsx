
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import FadeIn from './animations/FadeIn';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const PageContainer = ({ children, title, subtitle }: PageContainerProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mb-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            
            {children}
          </FadeIn>
        </main>
      </div>
    </div>
  );
};

export default PageContainer;
