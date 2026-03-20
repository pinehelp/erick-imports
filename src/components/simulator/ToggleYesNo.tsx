import { cn } from '@/lib/utils';

interface ToggleYesNoProps {
  label: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
}

export function ToggleYesNo({ label, value, onChange }: ToggleYesNoProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
      <span className="text-sm text-foreground flex-1">{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            'h-9 w-16 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-[0.95]',
            value === true
              ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/40'
              : 'bg-muted text-muted-foreground border border-transparent hover:bg-muted/80'
          )}
        >
          Sim
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            'h-9 w-16 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-[0.95]',
            value === false
              ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/40'
              : 'bg-muted text-muted-foreground border border-transparent hover:bg-muted/80'
          )}
        >
          Não
        </button>
      </div>
    </div>
  );
}
