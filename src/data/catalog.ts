import { TradeInModel, SaleModel, ColorOption } from '@/types/simulator';

// ─── Color Palettes ───
const C_11: ColorOption[] = [
  { id: 'black', name: 'Preto', hex: '#1D1D1F' },
  { id: 'white', name: 'Branco', hex: '#F5F5F7' },
  { id: 'green', name: 'Verde', hex: '#AEE1CD' },
  { id: 'yellow', name: 'Amarelo', hex: '#FFE681' },
  { id: 'purple', name: 'Roxo', hex: '#D1CDDB' },
  { id: 'red', name: 'Vermelho (PRODUCT)RED', hex: '#BA0C2F' },
];
const C_11P: ColorOption[] = [
  { id: 'space-gray', name: 'Cinza Espacial', hex: '#535150' },
  { id: 'silver', name: 'Prateado', hex: '#EBEBE3' },
  { id: 'gold', name: 'Dourado', hex: '#FAD7BD' },
  { id: 'midnight-green', name: 'Verde Meia-Noite', hex: '#4E5851' },
];
const C_12: ColorOption[] = [
  { id: 'black', name: 'Preto', hex: '#1D1D1F' },
  { id: 'white', name: 'Branco', hex: '#F5F5F7' },
  { id: 'blue', name: 'Azul', hex: '#023B63' },
  { id: 'green', name: 'Verde', hex: '#D8ECD5' },
  { id: 'red', name: 'Vermelho (PRODUCT)RED', hex: '#BA0C2F' },
];
const C_12P: ColorOption[] = [
  { id: 'graphite', name: 'Grafite', hex: '#54524F' },
  { id: 'gold', name: 'Dourado', hex: '#FAE7CF' },
  { id: 'silver', name: 'Prateado', hex: '#E3E4DF' },
  { id: 'pacific-blue', name: 'Azul Pacífico', hex: '#2D4E5C' },
];
const C_13: ColorOption[] = [
  { id: 'pink', name: 'Rosa', hex: '#FADDD7' },
  { id: 'blue', name: 'Azul', hex: '#276787' },
  { id: 'midnight', name: 'Meia-Noite', hex: '#232A31' },
  { id: 'starlight', name: 'Estelar', hex: '#FAF6F2' },
  { id: 'green', name: 'Verde', hex: '#394C38' },
  { id: 'red', name: 'Vermelho (PRODUCT)RED', hex: '#BA0C2F' },
];
const C_13P: ColorOption[] = [
  { id: 'graphite', name: 'Grafite', hex: '#54524F' },
  { id: 'gold', name: 'Dourado', hex: '#FAE7CF' },
  { id: 'silver', name: 'Prateado', hex: '#E3E4DF' },
  { id: 'sierra-blue', name: 'Azul Sierra', hex: '#A7C1D9' },
  { id: 'alpine-green', name: 'Verde Alpino', hex: '#576856' },
];
const C_14: ColorOption[] = [
  { id: 'blue', name: 'Azul', hex: '#A0B4C8' },
  { id: 'purple', name: 'Roxo', hex: '#E5DDEA' },
  { id: 'midnight', name: 'Meia-Noite', hex: '#232A31' },
  { id: 'starlight', name: 'Estelar', hex: '#FAF6F2' },
  { id: 'red', name: 'Vermelho (PRODUCT)RED', hex: '#BA0C2F' },
  { id: 'yellow', name: 'Amarelo', hex: '#F9E479' },
];
const C_14P: ColorOption[] = [
  { id: 'space-black', name: 'Preto Espacial', hex: '#403E3C' },
  { id: 'silver', name: 'Prateado', hex: '#E3E4DF' },
  { id: 'gold', name: 'Dourado', hex: '#FAE7CF' },
  { id: 'deep-purple', name: 'Roxo Profundo', hex: '#594F63' },
];
const C_15: ColorOption[] = [
  { id: 'black', name: 'Preto', hex: '#3B3B3D' },
  { id: 'blue', name: 'Azul', hex: '#D4E4F1' },
  { id: 'green', name: 'Verde', hex: '#D0DEC5' },
  { id: 'yellow', name: 'Amarelo', hex: '#F3E5BE' },
  { id: 'pink', name: 'Rosa', hex: '#F4D2D0' },
];
const C_15P: ColorOption[] = [
  { id: 'natural', name: 'Titânio Natural', hex: '#C2BCAF' },
  { id: 'blue', name: 'Titânio Azul', hex: '#3E4950' },
  { id: 'white', name: 'Titânio Branco', hex: '#E3E4DF' },
  { id: 'black', name: 'Titânio Preto', hex: '#3B3B3D' },
];
const C_16: ColorOption[] = [
  { id: 'black', name: 'Preto', hex: '#3B3B3D' },
  { id: 'white', name: 'Branco', hex: '#F5F5F7' },
  { id: 'pink', name: 'Rosa', hex: '#F7C8D4' },
  { id: 'teal', name: 'Azul-petróleo', hex: '#7BB5B8' },
  { id: 'ultramarine', name: 'Ultramarino', hex: '#637BCA' },
];
const C_16P: ColorOption[] = [
  { id: 'natural', name: 'Titânio Natural', hex: '#C2BCAF' },
  { id: 'black', name: 'Titânio Preto', hex: '#3B3B3D' },
  { id: 'white', name: 'Titânio Branco', hex: '#E3E4DF' },
  { id: 'desert', name: 'Titânio Deserto', hex: '#C4A882' },
];

// ─── Trade-In Models (iPhone 11+) ───
export const TRADE_IN_MODELS: TradeInModel[] = [
  { id: 'iphone-11', name: 'iPhone 11', generation: 11, colors: C_11, storage: [
    { gb: 64, tradeInValue: 1100 }, { gb: 128, tradeInValue: 1300 }, { gb: 256, tradeInValue: 1500 },
  ]},
  { id: 'iphone-11-pro', name: 'iPhone 11 Pro', generation: 11, colors: C_11P, storage: [
    { gb: 64, tradeInValue: 1400 }, { gb: 256, tradeInValue: 1700 }, { gb: 512, tradeInValue: 1900 },
  ]},
  { id: 'iphone-11-pro-max', name: 'iPhone 11 Pro Max', generation: 11, colors: C_11P, storage: [
    { gb: 64, tradeInValue: 1600 }, { gb: 256, tradeInValue: 1900 }, { gb: 512, tradeInValue: 2100 },
  ]},
  { id: 'iphone-12-mini', name: 'iPhone 12 mini', generation: 12, colors: C_12, storage: [
    { gb: 64, tradeInValue: 1200 }, { gb: 128, tradeInValue: 1400 }, { gb: 256, tradeInValue: 1600 },
  ]},
  { id: 'iphone-12', name: 'iPhone 12', generation: 12, colors: C_12, storage: [
    { gb: 64, tradeInValue: 1500 }, { gb: 128, tradeInValue: 1700 }, { gb: 256, tradeInValue: 1900 },
  ]},
  { id: 'iphone-12-pro', name: 'iPhone 12 Pro', generation: 12, colors: C_12P, storage: [
    { gb: 128, tradeInValue: 2000 }, { gb: 256, tradeInValue: 2200 }, { gb: 512, tradeInValue: 2500 },
  ]},
  { id: 'iphone-12-pro-max', name: 'iPhone 12 Pro Max', generation: 12, colors: C_12P, storage: [
    { gb: 128, tradeInValue: 2200 }, { gb: 256, tradeInValue: 2500 }, { gb: 512, tradeInValue: 2800 },
  ]},
  { id: 'iphone-13-mini', name: 'iPhone 13 mini', generation: 13, colors: C_13, storage: [
    { gb: 128, tradeInValue: 1800 }, { gb: 256, tradeInValue: 2100 }, { gb: 512, tradeInValue: 2400 },
  ]},
  { id: 'iphone-13', name: 'iPhone 13', generation: 13, colors: C_13, storage: [
    { gb: 128, tradeInValue: 2200 }, { gb: 256, tradeInValue: 2500 }, { gb: 512, tradeInValue: 2800 },
  ]},
  { id: 'iphone-13-pro', name: 'iPhone 13 Pro', generation: 13, colors: C_13P, storage: [
    { gb: 128, tradeInValue: 2800 }, { gb: 256, tradeInValue: 3100 }, { gb: 512, tradeInValue: 3400 }, { gb: 1024, tradeInValue: 3700 },
  ]},
  { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max', generation: 13, colors: C_13P, storage: [
    { gb: 128, tradeInValue: 3000 }, { gb: 256, tradeInValue: 3400 }, { gb: 512, tradeInValue: 3700 }, { gb: 1024, tradeInValue: 4000 },
  ]},
  { id: 'iphone-14', name: 'iPhone 14', generation: 14, colors: C_14, storage: [
    { gb: 128, tradeInValue: 3000 }, { gb: 256, tradeInValue: 3300 }, { gb: 512, tradeInValue: 3600 },
  ]},
  { id: 'iphone-14-plus', name: 'iPhone 14 Plus', generation: 14, colors: C_14, storage: [
    { gb: 128, tradeInValue: 3200 }, { gb: 256, tradeInValue: 3500 }, { gb: 512, tradeInValue: 3900 },
  ]},
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', generation: 14, colors: C_14P, storage: [
    { gb: 128, tradeInValue: 3500 }, { gb: 256, tradeInValue: 3900 }, { gb: 512, tradeInValue: 4300 }, { gb: 1024, tradeInValue: 4700 },
  ]},
  { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', generation: 14, colors: C_14P, storage: [
    { gb: 128, tradeInValue: 3800 }, { gb: 256, tradeInValue: 4200 }, { gb: 512, tradeInValue: 4700 }, { gb: 1024, tradeInValue: 5100 },
  ]},
  { id: 'iphone-15', name: 'iPhone 15', generation: 15, colors: C_15, storage: [
    { gb: 128, tradeInValue: 3800 }, { gb: 256, tradeInValue: 4200 }, { gb: 512, tradeInValue: 4600 },
  ]},
  { id: 'iphone-15-plus', name: 'iPhone 15 Plus', generation: 15, colors: C_15, storage: [
    { gb: 128, tradeInValue: 4100 }, { gb: 256, tradeInValue: 4500 }, { gb: 512, tradeInValue: 5000 },
  ]},
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', generation: 15, colors: C_15P, storage: [
    { gb: 128, tradeInValue: 4500 }, { gb: 256, tradeInValue: 5000 }, { gb: 512, tradeInValue: 5500 }, { gb: 1024, tradeInValue: 6000 },
  ]},
  { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', generation: 15, colors: C_15P, storage: [
    { gb: 256, tradeInValue: 5500 }, { gb: 512, tradeInValue: 6000 }, { gb: 1024, tradeInValue: 6800 },
  ]},
  { id: 'iphone-16', name: 'iPhone 16', generation: 16, colors: C_16, storage: [
    { gb: 128, tradeInValue: 5000 }, { gb: 256, tradeInValue: 5500 }, { gb: 512, tradeInValue: 6000 },
  ]},
  { id: 'iphone-16-plus', name: 'iPhone 16 Plus', generation: 16, colors: C_16, storage: [
    { gb: 128, tradeInValue: 5400 }, { gb: 256, tradeInValue: 5900 }, { gb: 512, tradeInValue: 6500 },
  ]},
  { id: 'iphone-16-pro', name: 'iPhone 16 Pro', generation: 16, colors: C_16P, storage: [
    { gb: 128, tradeInValue: 6000 }, { gb: 256, tradeInValue: 6500 }, { gb: 512, tradeInValue: 7200 }, { gb: 1024, tradeInValue: 7800 },
  ]},
  { id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', generation: 16, colors: C_16P, storage: [
    { gb: 256, tradeInValue: 7000 }, { gb: 512, tradeInValue: 7800 }, { gb: 1024, tradeInValue: 8500 },
  ]},
];

// ─── Sale Models ───
export const SALE_MODELS: SaleModel[] = [
  { id: 'iphone-14', name: 'iPhone 14', generation: 14, storage: [
    { gb: 128, sealedPrice: 4500, usedPrice: 3800 }, { gb: 256, sealedPrice: 5200, usedPrice: 4400 },
  ]},
  { id: 'iphone-14-plus', name: 'iPhone 14 Plus', generation: 14, storage: [
    { gb: 128, sealedPrice: 5200, usedPrice: 4400 }, { gb: 256, sealedPrice: 5900, usedPrice: 5000 },
  ]},
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', generation: 14, storage: [
    { gb: 128, sealedPrice: 5800, usedPrice: 4900 }, { gb: 256, sealedPrice: 6500, usedPrice: 5500 }, { gb: 512, sealedPrice: 7500, usedPrice: 6300 },
  ]},
  { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', generation: 14, storage: [
    { gb: 128, sealedPrice: 6500, usedPrice: 5500 }, { gb: 256, sealedPrice: 7200, usedPrice: 6100 }, { gb: 512, sealedPrice: 8200, usedPrice: 6900 },
  ]},
  { id: 'iphone-15', name: 'iPhone 15', generation: 15, storage: [
    { gb: 128, sealedPrice: 5500, usedPrice: 4700 }, { gb: 256, sealedPrice: 6200, usedPrice: 5300 }, { gb: 512, sealedPrice: 7200, usedPrice: 6100 },
  ]},
  { id: 'iphone-15-plus', name: 'iPhone 15 Plus', generation: 15, storage: [
    { gb: 128, sealedPrice: 6200, usedPrice: 5300 }, { gb: 256, sealedPrice: 6900, usedPrice: 5900 }, { gb: 512, sealedPrice: 7900, usedPrice: 6700 },
  ]},
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', generation: 15, storage: [
    { gb: 128, sealedPrice: 7200, usedPrice: 6100 }, { gb: 256, sealedPrice: 7900, usedPrice: 6700 }, { gb: 512, sealedPrice: 9000, usedPrice: 7600 }, { gb: 1024, sealedPrice: 10000, usedPrice: 8500 },
  ]},
  { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', generation: 15, storage: [
    { gb: 256, sealedPrice: 9200, usedPrice: 7800 }, { gb: 512, sealedPrice: 10500, usedPrice: 8900 }, { gb: 1024, sealedPrice: 11800, usedPrice: 10000 },
  ]},
  { id: 'iphone-16', name: 'iPhone 16', generation: 16, storage: [
    { gb: 128, sealedPrice: 7000, usedPrice: 6000 }, { gb: 256, sealedPrice: 7800, usedPrice: 6600 }, { gb: 512, sealedPrice: 8800, usedPrice: 7500 },
  ]},
  { id: 'iphone-16-plus', name: 'iPhone 16 Plus', generation: 16, storage: [
    { gb: 128, sealedPrice: 7800, usedPrice: 6600 }, { gb: 256, sealedPrice: 8600, usedPrice: 7300 }, { gb: 512, sealedPrice: 9800, usedPrice: 8300 },
  ]},
  { id: 'iphone-16-pro', name: 'iPhone 16 Pro', generation: 16, storage: [
    { gb: 128, sealedPrice: 9000, usedPrice: 7700 }, { gb: 256, sealedPrice: 9800, usedPrice: 8300 }, { gb: 512, sealedPrice: 11000, usedPrice: 9400 }, { gb: 1024, sealedPrice: 12500, usedPrice: 10600 },
  ]},
  { id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', generation: 16, storage: [
    { gb: 256, sealedPrice: 11000, usedPrice: 9400 }, { gb: 512, sealedPrice: 12500, usedPrice: 10600 }, { gb: 1024, sealedPrice: 14000, usedPrice: 11900 },
  ]},
];

// ─── Condition options ───
export const CONDITIONS = [
  { id: 'excellent', label: 'Excelente', description: 'Sem marcas visíveis, aparência de novo', emoji: '✨' },
  { id: 'very_good', label: 'Muito Bom', description: 'Pouquíssimas marcas de uso, quase perfeito', emoji: '👍' },
  { id: 'good', label: 'Bom', description: 'Marcas leves de uso, funcionamento perfeito', emoji: '👌' },
  { id: 'fair', label: 'Regular', description: 'Marcas visíveis de uso, funciona normalmente', emoji: '🔧' },
];

// ─── Payment options ───
export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Dinheiro / Pix', icon: 'Banknote' as const },
  { id: 'debit', label: 'Cartão de Débito', icon: 'CreditCard' as const },
  { id: 'credit', label: 'Cartão de Crédito', icon: 'CreditCard' as const },
];

// ─── Defect questions ───
export const DEFECT_QUESTIONS: { key: string; label: string; invertValue?: boolean }[] = [
  { key: 'faceIdWorks', label: 'Face ID funciona?', invertValue: true },
  { key: 'deepScratches', label: 'Possui arranhões profundos?' },
  { key: 'crackedScreen', label: 'Tela trincada?' },
  { key: 'scratchedScreen', label: 'Tela com riscos?' },
  { key: 'crackedBack', label: 'Traseira trincada?' },
  { key: 'dentedSides', label: 'Laterais amassadas?' },
  { key: 'camerasWorking', label: 'Câmeras funcionando perfeitamente?', invertValue: true },
  { key: 'previousRepair', label: 'Já foi aberto ou passou por manutenção?' },
  { key: 'hasBox', label: 'Possui caixa?' },
  { key: 'hasInvoice', label: 'Possui nota fiscal?' },
];

export function formatStorage(gb: number): string {
  return gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
