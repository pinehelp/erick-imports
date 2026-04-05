import { cn } from '@/lib/utils';

interface ToggleYesNoProps {
  label: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
}

export function ToggleYesNo({ label, value, onChange }: ToggleYesNoProps) {
  return (
    <div className={cn(
      "flex items-center justify-between gap-4 rounded-xl border-2 p-4 transition-all duration-200",
      value !== null ? "border-brand-orange/30 bg-brand-orange/5" : "border-border bg-card"
    )}>
      <span className="text-sm text-foreground flex-1">{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            'h-9 w-16 rounded-lg text-xs font-bold transition-all duration-200 active:scale-[0.95]',
            value === true
              ? 'bg-brand-orange text-white shadow-[0_0_12px_hsla(31,73%,54%,0.4)]'
              : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80 hover:text-foreground'
          )}
        >
          Sim
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            'h-9 w-16 rounded-lg text-xs font-bold transition-all duration-200 active:scale-[0.95]',
            value === false
              ? 'bg-brand-orange text-white shadow-[0_0_12px_hsla(31,73%,54%,0.4)]'
              : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80 hover:text-foreground'
          )}
        >
          Não
        </button>
      </div>
    </div>
  );
}
