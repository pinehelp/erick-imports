export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface StorageOption {
  gb: number;
  tradeInValue: number;
}

export interface SaleStorageOption {
  gb: number;
  sealedPrice: number;
  usedPrice: number;
}

export interface TradeInModel {
  id: string;
  name: string;
  generation: number;
  storage: StorageOption[];
  colors: ColorOption[];
}

export interface SaleModel {
  id: string;
  name: string;
  generation: number;
  storage: SaleStorageOption[];
}

export interface DefectsData {
  faceIdWorks: boolean | null;
  deepScratches: boolean | null;
  crackedScreen: boolean | null;
  scratchedScreen: boolean | null;
  crackedBack: boolean | null;
  dentedSides: boolean | null;
  camerasWorking: boolean | null;
  previousRepair: boolean | null;
  hasBox: boolean | null;
  hasInvoice: boolean | null;
}

export interface SimulatorData {
  currentModel: string | null;
  currentStorage: number | null;
  currentColor: string | null;
  batteryHealth: number;
  condition: string | null;
  defects: DefectsData;
  photos: string[];
  desiredModel: string | null;
  desiredStorage: number | null;
  desiredCondition: 'sealed' | 'used' | null;
  paymentMethod: string | null;
  name: string;
  phone: string;
}

export interface QuoteResult {
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

export interface LeadSession {
  sessionId: string;
  startedAt: string;
  lastInteraction: string;
  currentStep: number;
  lastCompletedStep: number;
  completed: boolean;
  data: SimulatorData;
  quote: QuoteResult | null;
  utm: UtmParams;
  referrer: string;
  landingPage: string;
}

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export const DEFAULT_DEFECTS: DefectsData = {
  faceIdWorks: null,
  deepScratches: null,
  crackedScreen: null,
  scratchedScreen: null,
  crackedBack: null,
  dentedSides: null,
  camerasWorking: null,
  previousRepair: null,
  hasBox: null,
  hasInvoice: null,
};

export const DEFAULT_SIMULATOR_DATA: SimulatorData = {
  currentModel: null,
  currentStorage: null,
  currentColor: null,
  batteryHealth: 85,
  condition: null,
  defects: { ...DEFAULT_DEFECTS },
  photos: [],
  desiredModel: null,
  desiredStorage: null,
  desiredCondition: null,
  paymentMethod: null,
  name: '',
  phone: '',
};

export const STEP_LABELS = [
  'Modelo atual',
  'Armazenamento',
  'Cor',
  'Bateria',
  'Estado geral',
  'Condição',
  'Fotos',
  'Aparelho desejado',
  'Pagamento',
  'Seus dados',
];

export const TOTAL_STEPS = 10;
