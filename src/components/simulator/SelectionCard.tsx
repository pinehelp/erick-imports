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
        'relative w-full rounded-xl border p-4 text-left transition-all duration-200',
        'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected
          ? 'border-brand-orange/50 bg-brand-orange/10 glow-orange-sm'
          : 'border-border bg-card hover:border-brand-orange/25 hover:bg-card/80',
        disabled && 'opacity-40 pointer-events-none',
        className
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-brand-orange animate-scale-in" />
      )}
      {children}
    </button>
  );
}
