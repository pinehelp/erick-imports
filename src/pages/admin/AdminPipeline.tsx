import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { MOCK_LEADS, MOCK_FUNNEL_DATA } from '@/data/admin-mock';
import { LEAD_STATUS_OPTIONS, LeadStatus } from '@/types/admin';
import { TRADE_IN_MODELS, SALE_MODELS, formatCurrency } from '@/data/catalog';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

export default function AdminPipeline() {
  const navigate = useNavigate();
  const grouped = LEAD_STATUS_OPTIONS.map(opt => ({
    ...opt,
    leads: MOCK_LEADS.filter(l => l.status === opt.value),
  }));

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-xl font-bold text-foreground">Pipeline</h1>
          <p className="text-sm text-muted-foreground">Funil de conversão e pipeline comercial</p>
        </div>

        {/* Funnel chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Funil por etapa do simulador</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_FUNNEL_DATA}>
                <XAxis dataKey="step" tick={{ fill: '#9E9DA1', fontSize: 10 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={50} />
                <YAxis tick={{ fill: '#9E9DA1', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip
                  contentStyle={{ background: '#14181F', border: '1px solid #29539E33', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#F1F3F4' }}
                  formatter={(val: number, _: string, entry: any) => [`${val} sessões (${entry.payload.rate}%)`, '']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {MOCK_FUNNEL_DATA.map((entry, i) => (
                    <Cell key={i} fill={i < 5 ? '#DF8E35' : '#58A0E5'} fillOpacity={1 - i * 0.06} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Funnel stats */}
          <div className="grid grid-cols-5 gap-2 mt-4">
            {MOCK_FUNNEL_DATA.filter((_, i) => i % 2 === 0).map(item => (
              <div key={item.step} className="text-center">
                <p className="text-lg font-bold text-foreground tabular-nums">{item.rate}%</p>
                <p className="text-[10px] text-muted-foreground">{item.step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline columns */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Pipeline comercial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {grouped.map(group => (
              <div key={group.value} className="rounded-xl border border-border bg-card/50">
                <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('h-2 w-2 rounded-full', group.color)} />
                    <span className="text-xs font-semibold text-foreground">{group.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">{group.leads.length}</span>
                </div>
                <div className="p-2 space-y-1.5 max-h-80 overflow-y-auto">
                  {group.leads.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground text-center py-4">Nenhum lead</p>
                  ) : (
                    group.leads.map(lead => {
                      const tradeModel = TRADE_IN_MODELS.find(m => m.id === lead.currentModel);
                      return (
                        <button
                          key={lead.sessionId}
                          onClick={() => navigate(`/admin/leads/${lead.sessionId}`)}
                          className="w-full text-left rounded-lg bg-card border border-border p-2.5 hover:border-primary/20 transition-colors"
                        >
                          <p className="text-xs font-medium text-foreground truncate">{lead.name || 'Anônimo'}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{tradeModel?.name || '—'}</p>
                          {lead.quote && (
                            <p className="text-[10px] text-primary font-semibold mt-1">{formatCurrency(lead.quote.difference)}</p>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
