
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import FadeIn from './animations/FadeIn';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const PageContainer = ({ children, title, subtitle }: PageContainerProps) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-full">
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
