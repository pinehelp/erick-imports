import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MOCK_SETTINGS } from '@/data/admin-mock';
import { AppSettings } from '@/types/admin';
import { DEFECT_QUESTIONS } from '@/data/catalog';
import { Save, MessageCircle, Camera, FileText, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings>(MOCK_SETTINGS);

  const update = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleQuestion = (key: string) => {
    setSettings(prev => ({
      ...prev,
      questionsConfig: { ...prev.questionsConfig, [key]: !prev.questionsConfig[key] },
    }));
  };

  const handleSave = () => {
    toast.success('Configurações salvas!');
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
  const textareaCls = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none";

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
            <button
              onClick={() => update('photosEnabled', !settings.photosEnabled)}
              className={`w-11 h-6 rounded-full transition-colors ${settings.photosEnabled ? 'bg-primary' : 'bg-muted'} relative`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.photosEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
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
              <div key={q.key} className="flex items-center justify-between py-1">
                <span className="text-sm text-foreground">{q.label}</span>
                <button
                  onClick={() => toggleQuestion(q.key)}
                  className={`w-11 h-6 rounded-full transition-colors ${settings.questionsConfig[q.key] ? 'bg-primary' : 'bg-muted'} relative`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.questionsConfig[q.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
