import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { EmptyState } from '@/components/admin/EmptyState';
import { useFirebaseLeads } from '@/hooks/useFirebaseLeads';
import { useCatalog } from '@/hooks/useFirebaseData';
import { LEAD_STATUS_OPTIONS, LeadStatus, STEP_LABELS_ADMIN } from '@/types/admin';
import { formatCurrency } from '@/data/catalog';
import { Search, Users, MessageCircle, Copy, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminLeads() {
  const navigate = useNavigate();
  const {
    leads, loading,
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    completionFilter, setCompletionFilter,
    conditionFilter, setConditionFilter,
    updateLeadStatus,
  } = useFirebaseLeads();
  const { tradeInModels, saleModels } = useCatalog();

  const [quickStatusOpen, setQuickStatusOpen] = useState<string | null>(null);

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast.success('Telefone copiado!');
  };

  const openWhatsApp = (phone: string, name: string) => {
    const msg = encodeURIComponent(`Olá ${name}! Vi sua simulação de upgrade no nosso site. Posso te ajudar?`);
    window.open(`https://wa.me/55${phone}?text=${msg}`, '_blank');
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
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
      <div className="space-y-4 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Leads</h1>
            <p className="text-sm text-muted-foreground">{leads.length} resultado(s)</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou telefone..."
              className="w-full h-9 rounded-lg border border-border bg-card pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as LeadStatus | 'all')}
            className="h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">Todos os status</option>
            {LEAD_STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={completionFilter}
            onChange={e => setCompletionFilter(e.target.value as 'all' | 'complete' | 'incomplete')}
            className="h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">Todos</option>
            <option value="complete">Completos</option>
            <option value="incomplete">Incompletos</option>
          </select>
          <select
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value as 'all' | 'sealed' | 'used')}
            className="h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">Lacrado/Usado</option>
            <option value="sealed">Lacrado</option>
            <option value="used">Usado</option>
          </select>
        </div>

        {/* List */}
        {leads.length === 0 ? (
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="Nenhum lead encontrado"
            description="Ajuste os filtros ou aguarde novos leads."
          />
        ) : (
          <div className="space-y-2">
            {leads.map(lead => {
              const tradeModel = tradeInModels.find(m => m.id === lead.currentModel);
              const saleModel = saleModels.find(m => m.id === lead.desiredModel);
              const isPartial = !lead.completed;

              return (
                <div
                  key={lead.sessionId}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/admin/leads/${lead.sessionId}`)}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{lead.name || 'Lead anônimo'}</p>
                        <StatusBadge status={lead.status} />
                        {isPartial && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">
                            Parcial · Etapa {lead.lastCompletedStep + 1}/{10}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {tradeModel?.name || '—'} → {saleModel?.name || '—'}
                        {lead.desiredCondition && (
                          <span className="ml-1">({lead.desiredCondition === 'sealed' ? 'Lacrado' : 'Usado'})</span>
                        )}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                        <span>{formatDate(lead.startedAt)}</span>
                        {lead.utm?.utm_source && <span className="text-accent">{lead.utm.utm_source}</span>}
                        {lead.quote && (
                          <span className="text-primary font-semibold">{formatCurrency(lead.quote.difference)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {lead.phone && (
                        <>
                          <button onClick={() => copyPhone(lead.phone)} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors" title="Copiar telefone">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => openWhatsApp(lead.phone, lead.name)} className="p-1.5 rounded-md text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="WhatsApp">
                            <MessageCircle className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      <div className="relative">
                        <button
                          onClick={() => setQuickStatusOpen(quickStatusOpen === lead.sessionId ? null : lead.sessionId)}
                          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                          title="Mudar status"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        {quickStatusOpen === lead.sessionId && (
                          <div className="absolute right-0 top-8 z-10 w-44 rounded-lg border border-border bg-card shadow-xl py-1">
                            {LEAD_STATUS_OPTIONS.map(opt => (
                              <button
                                key={opt.value}
                                onClick={async () => {
                                  await updateLeadStatus(lead.sessionId, opt.value);
                                  setQuickStatusOpen(null);
                                  toast.success(`Status alterado para ${opt.label}`);
                                }}
                                className={cn(
                                  'w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 transition-colors',
                                  lead.status === opt.value ? 'text-primary' : 'text-foreground'
                                )}
                              >
                                <span className={cn('h-2 w-2 rounded-full', opt.color)} />
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
