import { TRADE_IN_MODELS } from '@/data/catalog';
import { SimulatorData } from '@/types/simulator';
import { cn } from '@/lib/utils';

interface Props { data: SimulatorData; onUpdate: (u: Partial<SimulatorData>) => void; }

export function StepColor({ data, onUpdate }: Props) {
  const model = TRADE_IN_MODELS.find(m => m.id === data.currentModel);
  if (!model) return null;

  return (
    <div className="space-y-4 step-enter">
      <div>
        <h2 className="text-xl font-bold text-foreground">Cor do {model.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Selecione a cor do seu aparelho</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {model.colors.map(c => (
          <button
            key={c.id}
            onClick={() => onUpdate({ currentColor: c.id })}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-4 transition-all duration-200 active:scale-[0.97]',
              data.currentColor === c.id
                ? 'border-brand-orange/50 bg-brand-orange/10 glow-orange-sm'
                : 'border-border bg-card hover:border-brand-orange/25'
            )}
          >
            <div className="h-7 w-7 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: c.hex }} />
            <span className="text-xs font-medium text-foreground">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
