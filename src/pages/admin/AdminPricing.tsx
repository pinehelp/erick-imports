import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MOCK_PRICING_RULES } from '@/data/admin-mock';
import { PricingRule } from '@/types/admin';
import { DollarSign, Battery, Shield, AlertTriangle, Package, CreditCard, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES = [
  { key: 'battery', label: 'Bateria', icon: Battery },
  { key: 'condition', label: 'Estado geral', icon: Shield },
  { key: 'defect', label: 'Defeitos', icon: AlertTriangle },
  { key: 'bonus', label: 'Bônus', icon: Package },
  { key: 'payment', label: 'Pagamento', icon: CreditCard },
] as const;

export default function AdminPricing() {
  const [rules, setRules] = useState<PricingRule[]>(MOCK_PRICING_RULES);
  const [activeCategory, setActiveCategory] = useState<string>('battery');

  const categoryRules = rules.filter(r => r.category === activeCategory);

  const updateRule = (id: string, value: number) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, value } : r));
  };

  const handleSave = () => {
    // TODO: save to Firestore
    toast.success('Regras de preço salvas!');
  };

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Precificação</h1>
            <p className="text-sm text-muted-foreground">Regras de depreciação e bônus</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors active:scale-[0.98]"
          >
            <Save className="h-3.5 w-3.5" /> Salvar
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 flex-wrap bg-muted/50 rounded-lg p-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all',
                activeCategory === cat.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <cat.icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rules */}
        <div className="space-y-2">
          {categoryRules.map(rule => (
            <div key={rule.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{rule.label}</p>
                <p className="text-xs text-muted-foreground">{rule.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="number"
                  value={Math.round(rule.value * 100)}
                  onChange={e => updateRule(rule.id, parseFloat(e.target.value) / 100)}
                  className="w-20 h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40"
                  step={1}
                  min={0}
                  max={100}
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
