import { AdminLayout } from '@/components/admin/AdminLayout';
import { MetricCard } from '@/components/admin/MetricCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { MOCK_METRICS, MOCK_LEADS, MOCK_LEADS_PER_DAY, MOCK_FUNNEL_DATA, MOCK_SOURCE_DATA, MOCK_DEVICE_DATA } from '@/data/admin-mock';
import { TRADE_IN_MODELS, SALE_MODELS, formatCurrency } from '@/data/catalog';
import {
  Users, FileCheck, TrendingUp, TrendingDown, UserPlus, MessageCircle, CheckCircle2, XCircle,
  BarChart3, Activity,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const FUNNEL_COLORS = ['#DF8E35', '#D4762C', '#EAA957', '#29539E', '#58A0E5', '#DF8E35', '#D4762C', '#EAA957', '#29539E', '#58A0E5'];

export default function AdminDashboard() {
  const m = MOCK_METRICS;
  const navigate = useNavigate();
  const recentLeads = MOCK_LEADS.filter(l => l.name).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Visão geral da operação</p>
        </div>

        {/* Main metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Sessões iniciadas" value={m.totalSessions} icon={Activity} accentColor="default" />
          <MetricCard label="Leads identificados" value={m.totalLeads} icon={Users} accentColor="blue" />
          <MetricCard label="Cotações concluídas" value={m.totalQuotes} icon={FileCheck} accentColor="orange" />
          <MetricCard label="Abandonos" value={m.totalAbandoned} icon={TrendingDown} accentColor="red" />
        </div>

        {/* Rates + today */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Taxa de conversão" value={`${m.conversionRate}%`} icon={TrendingUp} accentColor="green" />
          <MetricCard label="Leads hoje" value={m.leadsToday} icon={UserPlus} accentColor="orange" />
          <MetricCard label="Em contato" value={m.leadsInContact} icon={MessageCircle} accentColor="blue" />
          <MetricCard label="Convertidos" value={m.leadsConverted} icon={CheckCircle2} accentColor="green" />
        </div>

        {/* Charts row */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Leads per day */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Leads por dia</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_LEADS_PER_DAY}>
                  <XAxis dataKey="date" tick={{ fill: '#9E9DA1', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9E9DA1', fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip
                    contentStyle={{ background: '#14181F', border: '1px solid #29539E33', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#F1F3F4' }}
                  />
                  <Bar dataKey="leads" fill="#DF8E35" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="quotes" fill="#58A0E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><span className="h-2 w-2 rounded-sm bg-primary" /> Leads</span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><span className="h-2 w-2 rounded-sm bg-accent" /> Cotações</span>
            </div>
          </div>

          {/* Funnel */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Funil por etapa</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_FUNNEL_DATA} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#9E9DA1', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="step" type="category" tick={{ fill: '#9E9DA1', fontSize: 10 }} axisLine={false} tickLine={false} width={72} />
                  <Tooltip
                    contentStyle={{ background: '#14181F', border: '1px solid #29539E33', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#F1F3F4' }}
                    formatter={(val: number, _: string, entry: any) => [`${val} (${entry.payload.rate}%)`, 'Sessões']}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {MOCK_FUNNEL_DATA.map((_, i) => (
                      <Cell key={i} fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]} fillOpacity={1 - i * 0.07} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sources + Devices */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Origens de tráfego</h3>
            <div className="space-y-2">
              {MOCK_SOURCE_DATA.map(s => (
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

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Aparelhos mais simulados</h3>
            <div className="space-y-2">
              {MOCK_DEVICE_DATA.map(d => (
                <div key={d.model} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 shrink-0">{d.model}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(d.count / MOCK_DEVICE_DATA[0].count) * 100}%` }} />
                  </div>
                  <span className="text-xs text-foreground tabular-nums w-8 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent leads */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Últimos leads</h3>
            <button
              onClick={() => navigate('/admin/leads')}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Ver todos →
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentLeads.map(lead => {
              const tradeModel = TRADE_IN_MODELS.find(m => m.id === lead.currentModel);
              const saleModel = SALE_MODELS.find(m => m.id === lead.desiredModel);
              return (
                <button
                  key={lead.sessionId}
                  onClick={() => navigate(`/admin/leads/${lead.sessionId}`)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {tradeModel?.name || '—'} → {saleModel?.name || '—'}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                  {lead.quote && (
                    <span className="text-xs font-semibold text-primary tabular-nums hidden sm:block">
                      {formatCurrency(lead.quote.difference)}
                    </span>
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
