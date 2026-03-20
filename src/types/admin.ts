// ─── Admin Types ───

export type AppRole = 'admin' | 'manager' | 'viewer';
export type LeadStatus = 'novo' | 'em_contato' | 'aguardando_retorno' | 'convertido' | 'perdido' | 'abandonado';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: AppRole;
  active: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface AdminLead {
  sessionId: string;
  name: string;
  phone: string;
  status: LeadStatus;
  currentModel: string | null;
  currentStorage: number | null;
  currentColor: string | null;
  batteryHealth: number;
  condition: string | null;
  defects: Record<string, boolean | null>;
  photos: string[];
  desiredModel: string | null;
  desiredStorage: number | null;
  desiredCondition: 'sealed' | 'used' | null;
  paymentMethod: string | null;
  currentStep: number;
  lastCompletedStep: number;
  completed: boolean;
  quote: AdminQuote | null;
  utm: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };
  referrer: string;
  landingPage: string;
  startedAt: string;
  lastInteraction: string;
  notes: LeadNote[];
  statusHistory: StatusChange[];
}

export interface AdminQuote {
  currentPhoneBaseValue: number;
  batteryDeduction: number;
  conditionDeduction: number;
  defectsDeduction: number;
  boxBonus: number;
  invoiceBonus: number;
  finalTradeInValue: number;
  desiredPhonePrice: number;
  difference: number;
}

export interface LeadNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface StatusChange {
  id: string;
  from: LeadStatus;
  to: LeadStatus;
  author: string;
  createdAt: string;
}

export interface PricingRule {
  id: string;
  category: 'battery' | 'condition' | 'defect' | 'bonus' | 'payment';
  key: string;
  label: string;
  value: number; // percentage as decimal
  description: string;
}

export interface AppSettings {
  whatsappNumber: string;
  ctaText: string;
  defaultContactMessage: string;
  disclaimerText: string;
  photosEnabled: boolean;
  photosLimit: number;
  questionsConfig: Record<string, boolean>;
}

export interface DashboardMetrics {
  totalSessions: number;
  totalLeads: number;
  totalQuotes: number;
  totalAbandoned: number;
  conversionRate: number;
  abandonRate: number;
  leadsToday: number;
  leadsInContact: number;
  leadsConverted: number;
  leadsLost: number;
}

export const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'novo', label: 'Novo', color: 'bg-blue-500' },
  { value: 'em_contato', label: 'Em Contato', color: 'bg-amber-500' },
  { value: 'aguardando_retorno', label: 'Aguardando Retorno', color: 'bg-purple-500' },
  { value: 'convertido', label: 'Convertido', color: 'bg-emerald-500' },
  { value: 'perdido', label: 'Perdido', color: 'bg-red-500' },
  { value: 'abandonado', label: 'Abandonado', color: 'bg-zinc-500' },
];

export const STEP_LABELS_ADMIN = [
  'Modelo atual',
  'Armazenamento',
  'Cor',
  'Bateria',
  'Estado geral',
  'Defeitos',
  'Fotos',
  'Aparelho desejado',
  'Pagamento',
  'Dados de contato',
];
