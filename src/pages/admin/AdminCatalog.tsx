import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { formatCurrency, formatStorage } from '@/data/catalog';
import { useCatalog, TradeInModelDoc, SaleModelDoc } from '@/hooks/useFirebaseData';
import { TradeInModel, SaleModel, ColorOption, StorageOption, SaleStorageOption } from '@/types/simulator';
import { Package, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Tab = 'trade-in' | 'sale';

interface TradeInFormData {
  id: string;
  name: string;
  generation: number;
  active: boolean;
  storage: StorageOption[];
  colors: ColorOption[];
}

interface SaleFormData {
  id: string;
  name: string;
  generation: number;
  active: boolean;
  storage: SaleStorageOption[];
}

const defaultTradeInForm: TradeInFormData = {
  id: '', name: '', generation: 16, active: true,
  storage: [{ gb: 128, tradeInValue: 3000 }],
  colors: [{ id: 'black', name: 'Preto', hex: '#1D1D1F' }],
};

const defaultSaleForm: SaleFormData = {
  id: '', name: '', generation: 16, active: true,
  storage: [{ gb: 128, sealedPrice: 5000, usedPrice: 4000 }],
};

export default function AdminCatalog() {
  const [tab, setTab] = useState<Tab>('trade-in');
  const catalog = useCatalog();
  const [editingTradeIn, setEditingTradeIn] = useState<{ docId: string | null; data: TradeInFormData } | null>(null);
  const [editingSale, setEditingSale] = useState<{ docId: string | null; data: SaleFormData } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ docId: string; type: 'trade-in' | 'sale'; name: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // ─── Trade-In CRUD ───
  const openNewTradeIn = () => setEditingTradeIn({ docId: null, data: { ...defaultTradeInForm, id: `iphone-${Date.now()}` } });
  const openEditTradeIn = (model: TradeInModelDoc) => setEditingTradeIn({
    docId: model.docId,
    data: { id: model.id, name: model.name, generation: model.generation, active: model.active, storage: [...model.storage], colors: [...model.colors] },
  });

  const saveTradeIn = async () => {
    if (!editingTradeIn) return;
    const { docId, data } = editingTradeIn;
    if (!data.name.trim()) { toast.error('Nome obrigatório'); return; }
    setSaving(true);
    try {
      const model: TradeInModel & { active: boolean } = {
        id: data.id, name: data.name, generation: data.generation, active: data.active,
        storage: data.storage, colors: data.colors,
      };
      if (docId) {
        await catalog.updateTradeIn(docId, model);
      } else {
        await catalog.addTradeIn(model);
      }
      setEditingTradeIn(null);
      toast.success(docId ? 'Aparelho atualizado!' : 'Aparelho adicionado!');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar');
    }
    setSaving(false);
  };

  // ─── Sale CRUD ───
  const openNewSale = () => setEditingSale({ docId: null, data: { ...defaultSaleForm, id: `iphone-${Date.now()}` } });
  const openEditSale = (model: SaleModelDoc) => setEditingSale({
    docId: model.docId,
    data: { id: model.id, name: model.name, generation: model.generation, active: model.active, storage: [...model.storage] },
  });

  const saveSale = async () => {
    if (!editingSale) return;
    const { docId, data } = editingSale;
    if (!data.name.trim()) { toast.error('Nome obrigatório'); return; }
    setSaving(true);
    try {
      const model: SaleModel & { active: boolean } = {
        id: data.id, name: data.name, generation: data.generation, active: data.active,
        storage: data.storage,
      };
      if (docId) {
        await catalog.updateSale(docId, model);
      } else {
        await catalog.addSale(model);
      }
      setEditingSale(null);
      toast.success(docId ? 'Aparelho atualizado!' : 'Aparelho adicionado!');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      if (confirmDelete.type === 'trade-in') {
        await catalog.removeTradeIn(confirmDelete.docId);
      } else {
        await catalog.removeSale(confirmDelete.docId);
      }
      toast.success('Aparelho removido!');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao remover');
    }
    setConfirmDelete(null);
    setSaving(false);
  };

  const handleToggle = async (docId: string, type: 'trade-in' | 'sale', currentActive: boolean) => {
    try {
      if (type === 'trade-in') {
        await catalog.toggleTradeIn(docId, !currentActive);
      } else {
        await catalog.toggleSale(docId, !currentActive);
      }
      toast.success(currentActive ? 'Aparelho desativado' : 'Aparelho ativado');
    } catch (e: any) {
      toast.error(e.message || 'Erro');
    }
  };

  const inputCls = "w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

  if (catalog.loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Catálogo</h1>
            <p className="text-sm text-muted-foreground">Gerencie aparelhos aceitos e desejados</p>
          </div>
          <button
            onClick={() => tab === 'trade-in' ? openNewTradeIn() : openNewSale()}
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab('trade-in')}
            className={cn('px-4 py-2 rounded-md text-xs font-semibold transition-all', tab === 'trade-in' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
          >
            Aparelhos aceitos ({catalog.tradeInModels.length})
          </button>
          <button
            onClick={() => setTab('sale')}
            className={cn('px-4 py-2 rounded-md text-xs font-semibold transition-all', tab === 'sale' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
          >
            Aparelhos desejados ({catalog.saleModels.length})
          </button>
        </div>

        {/* TRADE-IN LIST */}
        {tab === 'trade-in' && (
          <div className="space-y-2">
            {catalog.tradeInModels.map(model => (
              <div key={model.docId} className={cn("rounded-xl border bg-card p-4 transition-opacity", model.active ? 'border-border' : 'border-border/50 opacity-60')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{model.name}</span>
                    <button
                      onClick={() => handleToggle(model.docId, 'trade-in', model.active)}
                      className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium cursor-pointer transition-colors',
                        model.active ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      )}
                    >
                      {model.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditTradeIn(model)} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setConfirmDelete({ docId: model.docId, type: 'trade-in', name: model.name })} className="p-1.5 rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
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
        )}

        {/* SALE LIST */}
        {tab === 'sale' && (
          <div className="space-y-2">
            {catalog.saleModels.map(model => (
              <div key={model.docId} className={cn("rounded-xl border bg-card p-4 transition-opacity", model.active ? 'border-border' : 'border-border/50 opacity-60')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">{model.name}</span>
                    <button
                      onClick={() => handleToggle(model.docId, 'sale', model.active)}
                      className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium cursor-pointer transition-colors',
                        model.active ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      )}
                    >
                      {model.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditSale(model)} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setConfirmDelete({ docId: model.docId, type: 'sale', name: model.name })} className="p-1.5 rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
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

      {/* ─── EDIT TRADE-IN MODAL ─── */}
      {editingTradeIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEditingTradeIn(null)} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{editingTradeIn.docId ? 'Editar' : 'Novo'} aparelho aceito</h2>
              <button onClick={() => setEditingTradeIn(null)} className="p-1 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Nome do modelo</label>
                <input value={editingTradeIn.data.name} onChange={e => setEditingTradeIn(prev => prev ? { ...prev, data: { ...prev.data, name: e.target.value } } : null)} className={inputCls} placeholder="iPhone 16 Pro" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">ID (slug)</label>
                  <input value={editingTradeIn.data.id} onChange={e => setEditingTradeIn(prev => prev ? { ...prev, data: { ...prev.data, id: e.target.value } } : null)} className={inputCls} placeholder="iphone-16-pro" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Geração</label>
                  <input type="number" value={editingTradeIn.data.generation} onChange={e => setEditingTradeIn(prev => prev ? { ...prev, data: { ...prev.data, generation: parseInt(e.target.value) || 11 } } : null)} className={inputCls} />
                </div>
              </div>

              {/* Storage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground">Armazenamento e valores</label>
                  <button onClick={() => setEditingTradeIn(prev => prev ? { ...prev, data: { ...prev.data, storage: [...prev.data.storage, { gb: 128, tradeInValue: 0 }] } } : null)}
                    className="text-[10px] text-primary hover:text-primary/80">+ Adicionar</button>
                </div>
                {editingTradeIn.data.storage.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="number" value={s.gb} onChange={e => {
                      const newStorage = [...editingTradeIn.data.storage];
                      newStorage[i] = { ...newStorage[i], gb: parseInt(e.target.value) || 0 };
                      setEditingTradeIn(prev => prev ? { ...prev, data: { ...prev.data, storage: newStorage } } : null);
                    }} className={cn(inputCls, "w-24")} placeholder="GB" />
                    <input type="number" value={s.tradeInValue} onChange={e => {
                      const newStorage = [...editingTradeIn.data.storage];
                      newStorage[i] = { ...newStorage[i], tradeInValue: parseInt(e.target.value) || 0 };
                      setEditingTradeIn(prev => prev ? { ...prev, data: { ...prev.data, storage: newStorage } } : null);
                    }} className={cn(inputCls, "flex-1")} placeholder="Valor (R$)" />
                    {editingTradeIn.data.storage.length > 1 && (
                      <button onClick={() => {
                        const newStorage = editingTradeIn.data.storage.filter((_, idx) => idx !== i);
                        setEditingTradeIn(prev => prev ? { ...prev, data: { ...prev.data, storage: newStorage } } : null);
                      }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><X className="h-4 w-4" /></button>
                    )}
                  </div>
                ))}
              </div>

              {/* Colors */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground">Cores</label>
                  <button onClick={() => setEditingTradeIn(prev => prev ? { ...prev, data: { ...prev.data, colors: [...prev.data.colors, { id: `color-${Date.now()}`, name: '', hex: '#000000' }] } } : null)}
                    className="text-[10px] text-primary hover:text-primary/80">+ Adicionar</button>
                </div>
                {editingTradeIn.data.colors.map((c, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <input type="color" value={c.hex} onChange={e => {
                      const newColors = [...editingTradeIn.data.colors];
                      newColors[i] = { ...newColors[i], hex: e.target.value };
                      setEditingTradeIn(prev => prev ? { ...prev, data: { ...prev.data, colors: newColors } } : null);
                    }} className="h-10 w-10 rounded-lg border border-border cursor-pointer" />
                    <input value={c.name} onChange={e => {
                      const newColors = [...editingTradeIn.data.colors];
                      newColors[i] = { ...newColors[i], name: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, '-') };
                      setEditingTradeIn(prev => prev ? { ...prev, data: { ...prev.data, colors: newColors } } : null);
                    }} className={cn(inputCls, "flex-1")} placeholder="Nome da cor" />
                    {editingTradeIn.data.colors.length > 1 && (
                      <button onClick={() => {
                        const newColors = editingTradeIn.data.colors.filter((_, idx) => idx !== i);
                        setEditingTradeIn(prev => prev ? { ...prev, data: { ...prev.data, colors: newColors } } : null);
                      }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><X className="h-4 w-4" /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingTradeIn(null)} className="flex-1 h-10 rounded-lg border border-border text-sm text-foreground hover:bg-muted/50 transition-colors">Cancelar</button>
              <button onClick={saveTradeIn} disabled={saving} className="flex-1 h-10 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT SALE MODAL ─── */}
      {editingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEditingSale(null)} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{editingSale.docId ? 'Editar' : 'Novo'} aparelho desejado</h2>
              <button onClick={() => setEditingSale(null)} className="p-1 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Nome do modelo</label>
                <input value={editingSale.data.name} onChange={e => setEditingSale(prev => prev ? { ...prev, data: { ...prev.data, name: e.target.value } } : null)} className={inputCls} placeholder="iPhone 16 Pro Max" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">ID (slug)</label>
                  <input value={editingSale.data.id} onChange={e => setEditingSale(prev => prev ? { ...prev, data: { ...prev.data, id: e.target.value } } : null)} className={inputCls} placeholder="iphone-16-pro-max" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Geração</label>
                  <input type="number" value={editingSale.data.generation} onChange={e => setEditingSale(prev => prev ? { ...prev, data: { ...prev.data, generation: parseInt(e.target.value) || 14 } } : null)} className={inputCls} />
                </div>
              </div>

              {/* Storage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground">Armazenamento e preços</label>
                  <button onClick={() => setEditingSale(prev => prev ? { ...prev, data: { ...prev.data, storage: [...prev.data.storage, { gb: 128, sealedPrice: 0, usedPrice: 0 }] } } : null)}
                    className="text-[10px] text-primary hover:text-primary/80">+ Adicionar</button>
                </div>
                {editingSale.data.storage.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="number" value={s.gb} onChange={e => {
                      const ns = [...editingSale.data.storage];
                      ns[i] = { ...ns[i], gb: parseInt(e.target.value) || 0 };
                      setEditingSale(prev => prev ? { ...prev, data: { ...prev.data, storage: ns } } : null);
                    }} className={cn(inputCls, "w-20")} placeholder="GB" />
                    <input type="number" value={s.sealedPrice} onChange={e => {
                      const ns = [...editingSale.data.storage];
                      ns[i] = { ...ns[i], sealedPrice: parseInt(e.target.value) || 0 };
                      setEditingSale(prev => prev ? { ...prev, data: { ...prev.data, storage: ns } } : null);
                    }} className={cn(inputCls, "flex-1")} placeholder="Lacrado (R$)" />
                    <input type="number" value={s.usedPrice} onChange={e => {
                      const ns = [...editingSale.data.storage];
                      ns[i] = { ...ns[i], usedPrice: parseInt(e.target.value) || 0 };
                      setEditingSale(prev => prev ? { ...prev, data: { ...prev.data, storage: ns } } : null);
                    }} className={cn(inputCls, "flex-1")} placeholder="Usado (R$)" />
                    {editingSale.data.storage.length > 1 && (
                      <button onClick={() => {
                        const ns = editingSale.data.storage.filter((_, idx) => idx !== i);
                        setEditingSale(prev => prev ? { ...prev, data: { ...prev.data, storage: ns } } : null);
                      }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><X className="h-4 w-4" /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingSale(null)} className="flex-1 h-10 rounded-lg border border-border text-sm text-foreground hover:bg-muted/50 transition-colors">Cancelar</button>
              <button onClick={saveSale} disabled={saving} className="flex-1 h-10 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CONFIRM DELETE ─── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Confirmar exclusão</h2>
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja remover <strong className="text-foreground">{confirmDelete.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-10 rounded-lg border border-border text-sm text-foreground hover:bg-muted/50 transition-colors">Cancelar</button>
              <button onClick={handleDelete} disabled={saving} className="flex-1 h-10 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
