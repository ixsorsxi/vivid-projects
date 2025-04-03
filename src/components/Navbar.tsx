
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '@/components/Sidebar';
import { ModeToggle } from '@/components/ModeToggle';
import { UserNav } from '@/components/UserNav';
import Logo from '@/components/Logo';
import NotificationsPopover from '@/components/notifications/NotificationsPopover';

interface NavbarProps {
  showMobileSidebar?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showMobileSidebar = true }) => {
  const [open, setOpen] = useState(false);

  const mobileMenuButton = showMobileSidebar ? (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  ) : null;

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        {mobileMenuButton}
        
        <div className="flex items-center ml-auto">
          <NotificationsPopover />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
