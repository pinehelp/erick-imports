import { SimulatorData } from '@/types/simulator';
import { User, Phone } from 'lucide-react';

interface Props { data: SimulatorData; onUpdate: (u: Partial<SimulatorData>) => void; }

export function StepContact({ data, onUpdate }: Props) {
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  return (
    <div className="space-y-5 step-enter">
      <div>
        <h2 className="text-xl font-bold text-foreground">Seus dados</h2>
        <p className="mt-1 text-sm text-muted-foreground">Para enviar sua cotação personalizada</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <User className="h-4 w-4 text-brand-orange" /> Nome
          </label>
          <input
            type="text"
            value={data.name}
            onChange={e => onUpdate({ name: e.target.value })}
            placeholder="Seu nome"
            maxLength={100}
            className="w-full h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-brand-orange/50 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <Phone className="h-4 w-4 text-brand-orange" /> WhatsApp
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={e => onUpdate({ phone: formatPhone(e.target.value) })}
            placeholder="(11) 99999-9999"
            className="w-full h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-brand-orange/50 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Seus dados são utilizados apenas para enviar a cotação.
      </p>
    </div>
  );
}
