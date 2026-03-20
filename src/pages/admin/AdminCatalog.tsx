import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { TRADE_IN_MODELS, SALE_MODELS, formatCurrency, formatStorage } from '@/data/catalog';
import { Package, Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'trade-in' | 'sale';

export default function AdminCatalog() {
  const [tab, setTab] = useState<Tab>('trade-in');

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Catálogo</h1>
            <p className="text-sm text-muted-foreground">Gerencie aparelhos aceitos e desejados</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab('trade-in')}
            className={cn('px-4 py-2 rounded-md text-xs font-semibold transition-all', tab === 'trade-in' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
          >
            Aparelhos aceitos ({TRADE_IN_MODELS.length})
          </button>
          <button
            onClick={() => setTab('sale')}
            className={cn('px-4 py-2 rounded-md text-xs font-semibold transition-all', tab === 'sale' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
          >
            Aparelhos desejados ({SALE_MODELS.length})
          </button>
        </div>

        {tab === 'trade-in' ? (
          <div className="space-y-2">
            {TRADE_IN_MODELS.map(model => (
              <div key={model.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{model.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">Ativo</span>
                  </div>
                  <button className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {model.storage.map(s => (
                    <span key={s.gb} className="text-[11px] px-2 py-1 rounded-md bg-muted text-muted-foreground">
                      {formatStorage(s.gb)} — {formatCurrency(s.tradeInValue)}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {model.colors.map(c => (
                    <span key={c.id} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {SALE_MODELS.map(model => (
              <div key={model.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">{model.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">Ativo</span>
                  </div>
                  <button className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {model.storage.map(s => (
                    <div key={s.gb} className="text-[11px] px-2 py-1 rounded-md bg-muted text-muted-foreground">
                      <span>{formatStorage(s.gb)}</span>
                      <span className="ml-2 text-primary">Lacrado: {formatCurrency(s.sealedPrice)}</span>
                      <span className="ml-2 text-accent">Usado: {formatCurrency(s.usedPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
