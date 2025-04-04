
import React from 'react';
import { Avatar } from '@/components/ui/avatar.custom';
import { cva } from 'class-variance-authority';

interface TeamMemberAvatarProps {
  name: string;
  url?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'busy' | 'offline';
  className?: string;
  showStatusIndicator?: boolean;
}

const avatarSizeVariants = cva("", {
  variants: {
    size: {
      xs: "h-6 w-6",
      sm: "h-8 w-8", 
      md: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

const statusIndicatorVariants = cva("absolute bottom-0 right-0 rounded-full ring-2 ring-background", {
  variants: {
    status: {
      online: "bg-emerald-500",
      busy: "bg-rose-500",
      away: "bg-amber-500",
      offline: "bg-slate-300 dark:bg-slate-500"
    },
    size: {
      xs: "h-1.5 w-1.5",
      sm: "h-2 w-2", 
      md: "h-2.5 w-2.5",
      lg: "h-3 w-3",
      xl: "h-4 w-4"
    }
  },
  defaultVariants: {
    status: "offline",
    size: "md"
  }
});

const TeamMemberAvatar: React.FC<TeamMemberAvatarProps> = ({ 
  name, 
  url, 
  size = 'md',
  status,
  className,
  showStatusIndicator = false
}) => {
  return (
    <div className="relative inline-block">
      <Avatar 
        name={name} 
        className={avatarSizeVariants({ size, className })}
        src={url}
        size={size}
        showStatus={false}
      />
      {showStatusIndicator && status && (
        <span className={statusIndicatorVariants({ status, size })} />
      )}
    </div>
  );
};

export default TeamMemberAvatar;
