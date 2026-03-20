import { PAYMENT_METHODS } from '@/data/catalog';
import { SelectionCard } from '@/components/simulator/SelectionCard';
import { SimulatorData } from '@/types/simulator';
import { Banknote, CreditCard } from 'lucide-react';

interface Props { data: SimulatorData; onUpdate: (u: Partial<SimulatorData>) => void; }

const iconMap = { Banknote, CreditCard };

export function StepPayment({ data, onUpdate }: Props) {
  return (
    <div className="space-y-4 step-enter">
      <div>
        <h2 className="text-xl font-bold text-foreground">Forma de pagamento</h2>
        <p className="mt-1 text-sm text-muted-foreground">Como prefere pagar a diferença?</p>
      </div>
      <div className="space-y-2.5">
        {PAYMENT_METHODS.map(pm => {
          const Icon = iconMap[pm.icon];
          return (
            <SelectionCard key={pm.id} selected={data.paymentMethod === pm.id} onClick={() => onUpdate({ paymentMethod: pm.id })}>
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-brand-blue-glow" />
                <span className="text-sm font-semibold text-foreground">{pm.label}</span>
              </div>
            </SelectionCard>
          );
        })}
      </div>
    </div>
  );
}
