import { AdminLayout } from '@/components/admin/AdminLayout';
import { MetricCard } from '@/components/admin/MetricCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { useFirebaseLeads } from '@/hooks/useFirebaseLeads';
import { useCatalog } from '@/hooks/useFirebaseData';
import { formatCurrency } from '@/data/catalog';
import {
  Users, FileCheck, TrendingUp, TrendingDown, UserPlus, MessageCircle, CheckCircle2, Activity, Loader2,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { STEP_LABELS } from '@/types/simulator';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { allLeads, loading: leadsLoading } = useFirebaseLeads();
  const { tradeInModels, saleModels, loading: catalogLoading } = useCatalog();

  const metrics = useMemo(() => {
    const total = allLeads.length;
    const completed = allLeads.filter(l => l.completed);
    const withName = allLeads.filter(l => l.name);
    const today = new Date().toDateString();
    const leadsToday = allLeads.filter(l => new Date(l.startedAt).toDateString() === today).length;

    return {
      totalSessions: total,
      totalLeads: withName.length,
      totalQuotes: completed.length,
      totalAbandoned: allLeads.filter(l => !l.completed).length,
      conversionRate: total > 0 ? Math.round((completed.length / total) * 1000) / 10 : 0,
      leadsToday,
      leadsInContact: allLeads.filter(l => l.status === 'em_contato').length,
      leadsConverted: allLeads.filter(l => l.status === 'convertido').length,
    };
  }, [allLeads]);

  const funnelData = useMemo(() => {
    const total = allLeads.length || 1;
    return STEP_LABELS.map((step, i) => {
      const count = allLeads.filter(l => l.lastCompletedStep >= i).length;
      return { step, count, rate: Math.round((count / total) * 100) };
    });
  }, [allLeads]);

  const sourceData = useMemo(() => {
    const sources: Record<string, number> = {};
    allLeads.forEach(l => {
      const src = l.utm?.utm_source || 'Direto';
      sources[src] = (sources[src] || 0) + 1;
    });
    return Object.entries(sources)
      .map(([source, count]) => ({ source, count, pct: Math.round((count / (allLeads.length || 1)) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [allLeads]);

  const deviceData = useMemo(() => {
    const devices: Record<string, number> = {};
    allLeads.forEach(l => {
      if (l.currentModel) {
        const model = tradeInModels.find(m => m.id === l.currentModel);
        const name = model?.name || l.currentModel;
        devices[name] = (devices[name] || 0) + 1;
      }
    });
    return Object.entries(devices)
      .map(([model, count]) => ({ model, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [allLeads, tradeInModels]);

  const recentLeads = useMemo(() =>
    allLeads.filter(l => l.name).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, 5),
    [allLeads]
  );

  const loading = leadsLoading || catalogLoading;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const m = metrics;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Visão geral da operação</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Sessões iniciadas" value={m.totalSessions} icon={Activity} accentColor="default" />
          <MetricCard label="Leads identificados" value={m.totalLeads} icon={Users} accentColor="blue" />
          <MetricCard label="Cotações concluídas" value={m.totalQuotes} icon={FileCheck} accentColor="orange" />
          <MetricCard label="Abandonos" value={m.totalAbandoned} icon={TrendingDown} accentColor="red" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Taxa de conversão" value={`${m.conversionRate}%`} icon={TrendingUp} accentColor="green" />
          <MetricCard label="Leads hoje" value={m.leadsToday} icon={UserPlus} accentColor="orange" />
          <MetricCard label="Em contato" value={m.leadsInContact} icon={MessageCircle} accentColor="blue" />
          <MetricCard label="Convertidos" value={m.leadsConverted} icon={CheckCircle2} accentColor="green" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Funnel */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Funil por etapa</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#9E9DA1', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="step" type="category" tick={{ fill: '#9E9DA1', fontSize: 10 }} axisLine={false} tickLine={false} width={72} />
                  <Tooltip
                    contentStyle={{ background: '#14181F', border: '1px solid #29539E33', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#F1F3F4' }}
                    formatter={(val: number, _: string, entry: any) => [`${val} (${entry.payload.rate}%)`, 'Sessões']}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {funnelData.map((_, i) => (
                      <Cell key={i} fill={i < 5 ? '#DF8E35' : '#58A0E5'} fillOpacity={1 - i * 0.07} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sources */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Origens de tráfego</h3>
            <div className="space-y-2">
              {sourceData.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem dados ainda</p>
              ) : sourceData.map(s => (
                <div key={s.source} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 shrink-0">{s.source}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="text-xs text-foreground tabular-nums w-8 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Devices */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Aparelhos mais simulados</h3>
          <div className="space-y-2">
            {deviceData.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sem dados ainda</p>
            ) : deviceData.map(d => (
              <div key={d.model} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-32 shrink-0">{d.model}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(d.count / (deviceData[0]?.count || 1)) * 100}%` }} />
                </div>
                <span className="text-xs text-foreground tabular-nums w-8 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent leads */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Últimos leads</h3>
            <button onClick={() => navigate('/admin/leads')} className="text-xs text-primary hover:text-primary/80 transition-colors">Ver todos →</button>
          </div>
          <div className="divide-y divide-border">
            {recentLeads.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">Nenhum lead ainda</p>
            ) : recentLeads.map(lead => {
              const tradeModel = tradeInModels.find(m => m.id === lead.currentModel);
              const saleModel = saleModels.find(m => m.id === lead.desiredModel);
              return (
                <button
                  key={lead.sessionId}
                  onClick={() => navigate(`/admin/leads/${lead.sessionId}`)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{tradeModel?.name || '—'} → {saleModel?.name || '—'}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                  {lead.quote && (
                    <span className="text-xs font-semibold text-primary tabular-nums hidden sm:block">{formatCurrency(lead.quote.difference)}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
