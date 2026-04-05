import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAppSettings } from '@/hooks/useFirebaseData';
import { DEFECT_QUESTIONS } from '@/data/catalog';
import { Save, MessageCircle, Camera, FileText, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminSettings() {
  const { settings, loading, update, toggleQuestion, save, firebaseReady } = useAppSettings();

  const handleSave = async () => {
    try {
      await save();
      toast.success(firebaseReady ? 'Configurações salvas no Firebase!' : 'Configurações salvas localmente!');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar');
    }
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full h-10 rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
  const textareaCls = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none";

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
      <div className="max-w-2xl space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Configurações</h1>
            <p className="text-sm text-muted-foreground">Configurações gerais da operação</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors active:scale-[0.98]"
          >
            <Save className="h-3.5 w-3.5" /> Salvar
          </button>
        </div>

        {/* WhatsApp */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-foreground">WhatsApp e contato</h3>
          </div>
          <Field label="Número do WhatsApp (com DDI)">
            <input value={settings.whatsappNumber} onChange={e => update('whatsappNumber', e.target.value)} className={inputCls} placeholder="5511999999999" />
          </Field>
          <Field label="Texto do CTA principal">
            <input value={settings.ctaText} onChange={e => update('ctaText', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Mensagem padrão de contato">
            <textarea value={settings.defaultContactMessage} onChange={e => update('defaultContactMessage', e.target.value)} className={textareaCls} rows={3} />
          </Field>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Textos e disclaimers</h3>
          </div>
          <Field label="Texto do disclaimer da cotação">
            <textarea value={settings.disclaimerText} onChange={e => update('disclaimerText', e.target.value)} className={textareaCls} rows={3} />
          </Field>
        </div>

        {/* Photos */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-foreground">Upload de fotos</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Permitir upload de fotos</span>
            <ToggleSwitch checked={settings.photosEnabled} onChange={() => update('photosEnabled', !settings.photosEnabled)} />
          </div>
          <Field label="Limite de fotos">
            <input type="number" value={settings.photosLimit} onChange={e => update('photosLimit', parseInt(e.target.value) || 1)} className={inputCls} min={1} max={20} />
          </Field>
        </div>

        {/* Questions config */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Perguntas do simulador</h3>
          </div>
          <div className="space-y-2">
            {DEFECT_QUESTIONS.map(q => (
              <div key={q.key} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-foreground">{q.label}</span>
                <ToggleSwitch checked={settings.questionsConfig[q.key]} onChange={() => toggleQuestion(q.key)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// ─── Custom Toggle Switch Component ───
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        checked ? 'bg-primary' : 'bg-muted'
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}
