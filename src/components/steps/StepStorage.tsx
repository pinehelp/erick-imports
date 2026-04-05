import { formatStorage } from '@/data/catalog';
import { SelectionCard } from '@/components/simulator/SelectionCard';
import { SimulatorData, TradeInModel } from '@/types/simulator';

interface Props {
  data: SimulatorData;
  onUpdate: (u: Partial<SimulatorData>) => void;
  models: TradeInModel[];
}

export function StepStorage({ data, onUpdate, models }: Props) {
  const model = models.find(m => m.id === data.currentModel);
  if (!model) return null;

  return (
    <div className="space-y-4 step-enter">
      <div>
        <h2 className="text-xl font-bold text-foreground">Armazenamento do {model.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Qual a capacidade do seu aparelho?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {model.storage.map(s => (
          <SelectionCard key={s.gb} selected={data.currentStorage === s.gb} onClick={() => onUpdate({ currentStorage: s.gb })}>
            <span className="text-sm font-bold text-foreground">{formatStorage(s.gb)}</span>
          </SelectionCard>
        ))}
      </div>
    </div>
  );
}
