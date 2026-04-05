import { formatStorage } from '@/data/catalog';
import { SelectionCard } from '@/components/simulator/SelectionCard';
import { SimulatorData, SaleModel } from '@/types/simulator';
import { cn } from '@/lib/utils';

interface Props {
  data: SimulatorData;
  onUpdate: (u: Partial<SimulatorData>) => void;
  models: SaleModel[];
}

export function StepDesired({ data, onUpdate, models }: Props) {
  const selectedModel = models.find(m => m.id === data.desiredModel);

  return (
    <div className="space-y-5 step-enter">
      <div>
        <h2 className="text-xl font-bold text-foreground">Qual iPhone você deseja?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Escolha o modelo, armazenamento e condição</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Modelo</p>
        <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto pr-1">
          {models.map(m => (
            <SelectionCard key={m.id} selected={data.desiredModel === m.id}
              onClick={() => onUpdate({ desiredModel: m.id, desiredStorage: null })}>
              <span className="text-sm font-semibold text-foreground">{m.name}</span>
            </SelectionCard>
          ))}
        </div>
      </div>

      {selectedModel && (
        <div className="animate-fade-in">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Armazenamento</p>
          <div className="grid grid-cols-2 gap-2">
            {selectedModel.storage.map(s => (
              <SelectionCard key={s.gb} selected={data.desiredStorage === s.gb}
                onClick={() => onUpdate({ desiredStorage: s.gb })}>
                <span className="text-sm font-bold text-foreground">{formatStorage(s.gb)}</span>
              </SelectionCard>
            ))}
          </div>
        </div>
      )}

      {data.desiredStorage && (
        <div className="animate-fade-in">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Condição</p>
          <div className="grid grid-cols-2 gap-3">
            {(['sealed', 'used'] as const).map(c => (
              <button key={c} onClick={() => onUpdate({ desiredCondition: c })}
                className={cn(
                  'rounded-xl border p-4 text-center transition-all duration-200 active:scale-[0.97]',
                  data.desiredCondition === c
                    ? 'border-brand-orange bg-brand-orange/15 glow-orange-sm ring-1 ring-brand-orange/30'
                    : 'border-border bg-card hover:border-muted-foreground/30'
                )}>
                <span className="text-lg">{c === 'sealed' ? '📦' : '✅'}</span>
                <p className={cn("mt-1 text-sm font-semibold", data.desiredCondition === c ? "text-foreground" : "text-muted-foreground")}>
                  {c === 'sealed' ? 'Lacrado' : 'Usado'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
