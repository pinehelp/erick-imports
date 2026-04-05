import { cn } from '@/lib/utils';

interface SelectionCardProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function SelectionCard({ selected, onClick, children, className, disabled }: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative w-full rounded-xl border-2 p-4 text-left transition-all duration-200',
        'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected
          ? 'border-brand-orange bg-brand-orange/15 glow-orange-sm ring-1 ring-brand-orange/30'
          : 'border-border bg-card hover:border-muted-foreground/30 hover:bg-card/80',
        disabled && 'opacity-40 pointer-events-none',
        className
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-brand-orange animate-scale-in shadow-[0_0_8px_hsla(31,73%,54%,0.6)]" />
      )}
      {children}
    </button>
  );
}
