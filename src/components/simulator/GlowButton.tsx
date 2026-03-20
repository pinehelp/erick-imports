import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'lg' | 'sm';
  glow?: boolean;
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = 'primary', size = 'default', glow = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',
          'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          // Variants
          variant === 'primary' && 'bg-gradient-to-r from-brand-orange-strong via-brand-orange to-brand-orange-glow text-primary-foreground',
          variant === 'primary' && !disabled && 'hover:brightness-110',
          variant === 'secondary' && 'bg-card border border-border text-foreground hover:border-brand-blue-glow/30 hover:bg-card/80',
          variant === 'ghost' && 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30',
          // Sizes
          size === 'default' && 'h-12 px-6 text-sm',
          size === 'lg' && 'h-14 px-8 text-base',
          size === 'sm' && 'h-10 px-4 text-sm',
          // Glow
          glow && variant === 'primary' && 'animate-glow-pulse',
          // Disabled
          disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
GlowButton.displayName = 'GlowButton';
