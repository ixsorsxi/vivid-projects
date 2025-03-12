
import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  glow?: boolean;
  dot?: boolean;
  dotColor?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-muted text-muted-foreground hover:bg-muted/80',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'bg-transparent border border-border text-foreground hover:bg-muted/20',
  success: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20',
  danger: 'bg-rose-500/15 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-1.5 py-0.5 rounded',
  md: 'text-xs px-2.5 py-0.5 rounded-md',
  lg: 'text-sm px-3 py-1 rounded-md',
};

const glowClasses: Record<BadgeVariant, string> = {
  default: '',
  primary: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]',
  secondary: '',
  outline: '',
  success: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]',
  warning: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]',
  danger: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]',
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  glow = false,
  dot = false,
  dotColor,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        glow && glowClasses[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'mr-1.5 h-1.5 w-1.5 rounded-full',
            dotColor || (variant === 'outline' ? 'bg-current' : '')
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
