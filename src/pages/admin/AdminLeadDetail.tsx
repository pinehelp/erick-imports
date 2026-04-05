import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { useFirebaseLeads } from '@/hooks/useFirebaseLeads';
import { useCatalog } from '@/hooks/useFirebaseData';
import { LEAD_STATUS_OPTIONS, STEP_LABELS_ADMIN } from '@/types/admin';
import { CONDITIONS, PAYMENT_METHODS, DEFECT_QUESTIONS, formatCurrency, formatStorage } from '@/data/catalog';
import {
  ArrowLeft, Phone, MessageCircle, Copy, Clock, MapPin, Smartphone, Battery, Shield,
  CheckCircle2, XCircle, Send, ChevronDown, User, Image,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminLeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLead, updateLeadStatus, addNote } = useFirebaseLeads();
  const { tradeInModels, saleModels } = useCatalog();
  const lead = getLead(id || '');
  const [noteText, setNoteText] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);

  if (!lead) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-foreground font-semibold">Lead não encontrado</p>
          <button onClick={() => navigate('/admin/leads')} className="text-sm text-primary mt-2">← Voltar</button>
        </div>
      </AdminLayout>
    );
  }

  const tradeModel = tradeInModels.find(m => m.id === lead.currentModel);
  const saleModel = saleModels.find(m => m.id === lead.desiredModel);
  const condition = CONDITIONS.find(c => c.id === lead.condition);
  const payment = PAYMENT_METHODS.find(p => p.id === lead.paymentMethod);
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await addNote(lead.sessionId, noteText.trim());
    setNoteText('');
    toast.success('Observação adicionada');
  };

  const copyPhone = () => { navigator.clipboard.writeText(lead.phone); toast.success('Copiado!'); };
  const openWhatsApp = () => {
    const msg = encodeURIComponent(`Olá ${lead.name}! Vi sua simulação de upgrade. Posso te ajudar?`);
    window.open(`https://wa.me/55${lead.phone}?text=${msg}`, '_blank');
  };

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) => (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  );

  const BoolRow = ({ label, value }: { label: string; value: boolean | null }) => (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {value === null ? (
        <span className="text-xs text-muted-foreground">—</span>
      ) : value ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      ) : (
        <XCircle className="h-4 w-4 text-red-400" />
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-5 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/leads')} className="p-2 rounded-lg text-muted-foreground hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-foreground">{lead.name || 'Lead anônimo'}</h1>
              <StatusBadge status={lead.status} size="md" />
              {!lead.completed && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">
                  Parcial · Etapa {lead.lastCompletedStep + 1}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">ID: {lead.sessionId}</p>
          </div>
        </div>

        {/* Action bar */}
        {lead.phone && (
          <div className="flex flex-wrap gap-2">
            <button onClick={openWhatsApp} className="flex items-center gap-2 h-9 px-4 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors active:scale-[0.98]">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </button>
            <button onClick={copyPhone} className="flex items-center gap-2 h-9 px-4 rounded-lg bg-muted text-foreground text-xs font-medium hover:bg-muted/70 transition-colors active:scale-[0.98]">
              <Copy className="h-3.5 w-3.5" /> {lead.phone}
            </button>
            <div className="relative">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors active:scale-[0.98]"
              >
                Alterar status <ChevronDown className="h-3 w-3" />
              </button>
              {statusOpen && (
                <div className="absolute left-0 top-10 z-10 w-48 rounded-lg border border-border bg-card shadow-xl py-1">
                  {LEAD_STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={async () => { await updateLeadStatus(lead.sessionId, opt.value); setStatusOpen(false); toast.success(`Status: ${opt.label}`); }}
                      className={cn('w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50', lead.status === opt.value ? 'text-primary' : 'text-foreground')}
                    >
                      <span className={cn('h-2 w-2 rounded-full', opt.color)} /> {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Dados pessoais</h3>
              <InfoRow label="Nome" value={lead.name || '—'} icon={User} />
              <InfoRow label="Telefone" value={lead.phone || '—'} icon={Phone} />
              <InfoRow label="Origem" value={lead.utm?.utm_source || 'Direto'} icon={MapPin} />
              <InfoRow label="Campanha" value={lead.utm?.utm_campaign || '—'} />
              <InfoRow label="Início" value={formatDate(lead.startedAt)} icon={Clock} />
              <InfoRow label="Última interação" value={formatDate(lead.lastInteraction)} />
              <InfoRow label="Etapa final" value={`${lead.lastCompletedStep + 1}/10 — ${STEP_LABELS_ADMIN[lead.lastCompletedStep] || '—'}`} />
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Aparelho atual</h3>
              <InfoRow label="Modelo" value={tradeModel?.name || '—'} icon={Smartphone} />
              <InfoRow label="Armazenamento" value={lead.currentStorage ? formatStorage(lead.currentStorage) : '—'} />
              <InfoRow label="Cor" value={lead.currentColor || '—'} />
              <InfoRow label="Bateria" value={`${lead.batteryHealth}%`} icon={Battery} />
              <InfoRow label="Estado geral" value={condition?.label || '—'} icon={Shield} />
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Condição detalhada</h3>
              {DEFECT_QUESTIONS.map(q => (
                <BoolRow key={q.key} label={q.label} value={lead.defects[q.key] as boolean | null} />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Aparelho desejado</h3>
              <InfoRow label="Modelo" value={saleModel?.name || '—'} icon={Smartphone} />
              <InfoRow label="Armazenamento" value={lead.desiredStorage ? formatStorage(lead.desiredStorage) : '—'} />
              <InfoRow label="Condição" value={lead.desiredCondition === 'sealed' ? 'Lacrado' : lead.desiredCondition === 'used' ? 'Usado' : '—'} />
              <InfoRow label="Pagamento" value={payment?.label || '—'} />
            </div>

            {lead.quote && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Cotação (interno)</h3>
                <InfoRow label="Valor base" value={formatCurrency(lead.quote.currentPhoneBaseValue)} />
                <InfoRow label="Dep. bateria" value={`-${formatCurrency(lead.quote.batteryDeduction)}`} />
                <InfoRow label="Dep. estado" value={`-${formatCurrency(lead.quote.conditionDeduction)}`} />
                <InfoRow label="Dep. defeitos" value={`-${formatCurrency(lead.quote.defectsDeduction)}`} />
                <InfoRow label="Bônus caixa" value={`+${formatCurrency(lead.quote.boxBonus)}`} />
                <InfoRow label="Bônus NF" value={`+${formatCurrency(lead.quote.invoiceBonus)}`} />
                <div className="border-t border-primary/20 mt-2 pt-2">
                  <InfoRow label="Trade-in final" value={formatCurrency(lead.quote.finalTradeInValue)} />
                  <InfoRow label="Aparelho desejado" value={formatCurrency(lead.quote.desiredPhonePrice)} />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-[10px] text-muted-foreground">Diferença a pagar</p>
                  <p className="text-2xl font-bold text-primary tabular-nums">{formatCurrency(lead.quote.difference)}</p>
                </div>
              </div>
            )}

            {lead.photos && lead.photos.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1"><Image className="h-3 w-3" /> Fotos ({lead.photos.length})</h3>
                <div className="grid grid-cols-3 gap-2">
                  {lead.photos.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-colors">
                      <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Observações</h3>
              {(!lead.notes || lead.notes.length === 0) && <p className="text-xs text-muted-foreground">Nenhuma observação ainda.</p>}
              <div className="space-y-2 mb-3">
                {lead.notes?.map(note => (
                  <div key={note.id} className="rounded-lg bg-muted/50 p-2.5">
                    <p className="text-xs text-foreground">{note.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{note.author} · {formatDate(note.createdAt)}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Adicionar observação..."
                  className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                />
                <button
                  onClick={handleAddNote}
                  className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors active:scale-95"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {lead.statusHistory && lead.statusHistory.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Histórico</h3>
                <div className="space-y-2">
                  {lead.statusHistory.map(sh => (
                    <div key={sh.id} className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">{formatDate(sh.createdAt)}</span>
                      <span className="text-foreground">{sh.author}</span>
                      <span className="text-muted-foreground">→</span>
                      <StatusBadge status={sh.to} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
