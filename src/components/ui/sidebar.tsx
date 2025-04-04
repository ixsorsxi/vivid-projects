
import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState<boolean>(defaultCollapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export function Sidebar({ className, children }: SidebarProps) {
  const { collapsed } = useSidebar();
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col overflow-y-auto bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed && "w-16",
        className
      )}
    >
      {children}
    </aside>
  );
}

Sidebar.displayName = "Sidebar";

interface SidebarHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarHeader({ className, children }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center border-b border-sidebar-border px-4 py-3",
        className
      )}
    >
      {children}
    </div>
  );
}

SidebarHeader.displayName = "SidebarHeader";

interface SidebarContentProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarContent({ className, children }: SidebarContentProps) {
  return <div className={cn("flex-1 overflow-auto py-4", className)}>{children}</div>;
}

SidebarContent.displayName = "SidebarContent";

interface SidebarFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarFooter({ className, children }: SidebarFooterProps) {
  return (
    <div
      className={cn(
        "border-t border-sidebar-border p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

SidebarFooter.displayName = "SidebarFooter";

interface SidebarInsetProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarInset({ className, children }: SidebarInsetProps) {
  const { collapsed } = useSidebar();
  return (
    <div
      className={cn(
        "ml-64 transition-all duration-300 ease-in-out",
        collapsed && "ml-16",
        className
      )}
    >
      {children}
    </div>
  );
}

SidebarInset.displayName = "SidebarInset";

interface SidebarTriggerProps {
  className?: string;
}

export function SidebarTrigger({ className }: SidebarTriggerProps) {
  const { collapsed, setCollapsed } = useSidebar();
  return (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "h-4 w-4 transition-all",
          collapsed && "rotate-180"
        )}
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
        <path d="m16 15-3-3 3-3" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

SidebarTrigger.displayName = "SidebarTrigger";

interface SidebarGroupProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarGroup({ className, children }: SidebarGroupProps) {
  return <div className={cn("px-3 py-2", className)}>{children}</div>;
}

SidebarGroup.displayName = "SidebarGroup";

interface SidebarGroupLabelProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarGroupLabel({
  className,
  children,
}: SidebarGroupLabelProps) {
  const { collapsed } = useSidebar();
  return (
    <h3
      className={cn(
        "mb-2 px-2 text-xs font-medium text-sidebar-foreground/60 transition-opacity",
        collapsed && "opacity-0",
        className
      )}
    >
      {children}
    </h3>
  );
}

SidebarGroupLabel.displayName = "SidebarGroupLabel";

interface SidebarGroupContentProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarGroupContent({
  className,
  children,
}: SidebarGroupContentProps) {
  return <div className={cn("space-y-1", className)}>{children}</div>;
}

SidebarGroupContent.displayName = "SidebarGroupContent";

interface SidebarMenuProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarMenu({ className, children }: SidebarMenuProps) {
  return <ul className={cn("space-y-1", className)}>{children}</ul>;
}

SidebarMenu.displayName = "SidebarMenu";

interface SidebarMenuItemProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarMenuItem({ className, children }: SidebarMenuItemProps) {
  return <li className={cn(className)}>{children}</li>;
}

SidebarMenuItem.displayName = "SidebarMenuItem";

interface SidebarMenuButtonProps {
  className?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

export function SidebarMenuButton({
  className,
  asChild = false,
  children,
  ...props
}: SidebarMenuButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { collapsed } = useSidebar();
  const Component = asChild ? React.cloneElement(
    React.Children.only(children as React.ReactElement),
    {
      className: cn(
        "flex items-center gap-3 h-10 rounded-md px-3 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "h-9 w-9 justify-center px-0",
        className
      ),
      ...props,
    }
  ) : (
    <button
      className={cn(
        "flex items-center gap-3 h-10 rounded-md px-3 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "h-9 w-9 justify-center px-0",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
  
  return Component;
}

SidebarMenuButton.displayName = "SidebarMenuButton";
