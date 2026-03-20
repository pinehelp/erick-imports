import { SimulatorData, QuoteResult } from '@/types/simulator';
import { TRADE_IN_MODELS, SALE_MODELS } from '@/data/catalog';

// ─── Configurable pricing rules (future admin panel) ───
const BATTERY_DEDUCTIONS: Record<string, number> = {
  '90-100': 0,
  '80-89': 0.05,
  '70-79': 0.12,
  '60-69': 0.20,
  '50-59': 0.30,
  'below-50': 0.40,
};

const CONDITION_DEDUCTIONS: Record<string, number> = {
  excellent: 0,
  very_good: 0.05,
  good: 0.10,
  fair: 0.20,
};

const DEFECT_DEDUCTIONS: Record<string, number> = {
  faceIdWorks: 0.15,       // deducted if NOT working
  deepScratches: 0.05,
  crackedScreen: 0.25,
  scratchedScreen: 0.03,
  crackedBack: 0.12,
  dentedSides: 0.05,
  camerasWorking: 0.18,    // deducted if NOT working
  previousRepair: 0.08,
  hasBox: -0.03,           // negative = bonus
  hasInvoice: -0.03,
};

function getBatteryDeductionRate(health: number): number {
  if (health >= 90) return BATTERY_DEDUCTIONS['90-100'];
  if (health >= 80) return BATTERY_DEDUCTIONS['80-89'];
  if (health >= 70) return BATTERY_DEDUCTIONS['70-79'];
  if (health >= 60) return BATTERY_DEDUCTIONS['60-69'];
  if (health >= 50) return BATTERY_DEDUCTIONS['50-59'];
  return BATTERY_DEDUCTIONS['below-50'];
}

export function calculateQuote(data: SimulatorData): QuoteResult | null {
  const tradeModel = TRADE_IN_MODELS.find(m => m.id === data.currentModel);
  const saleModel = SALE_MODELS.find(m => m.id === data.desiredModel);

  if (!tradeModel || !saleModel || !data.currentStorage || !data.desiredStorage || !data.desiredCondition || !data.condition) {
    return null;
  }

  const storageOpt = tradeModel.storage.find(s => s.gb === data.currentStorage);
  if (!storageOpt) return null;

  const baseValue = storageOpt.tradeInValue;

  // Battery deduction
  const batteryRate = getBatteryDeductionRate(data.batteryHealth);
  const batteryDeduction = Math.round(baseValue * batteryRate);

  // Condition deduction
  const conditionRate = CONDITION_DEDUCTIONS[data.condition] ?? 0;
  const conditionDeduction = Math.round(baseValue * conditionRate);

  // Defects deduction
  let defectsTotal = 0;
  let boxBonus = 0;
  let invoiceBonus = 0;

  const defects = data.defects;
  // Face ID: deduct if NOT working
  if (defects.faceIdWorks === false) defectsTotal += DEFECT_DEDUCTIONS.faceIdWorks;
  // Cameras: deduct if NOT working
  if (defects.camerasWorking === false) defectsTotal += DEFECT_DEDUCTIONS.camerasWorking;
  // Negative defects (having them is bad)
  if (defects.deepScratches === true) defectsTotal += DEFECT_DEDUCTIONS.deepScratches;
  if (defects.crackedScreen === true) defectsTotal += DEFECT_DEDUCTIONS.crackedScreen;
  if (defects.scratchedScreen === true) defectsTotal += DEFECT_DEDUCTIONS.scratchedScreen;
  if (defects.crackedBack === true) defectsTotal += DEFECT_DEDUCTIONS.crackedBack;
  if (defects.dentedSides === true) defectsTotal += DEFECT_DEDUCTIONS.dentedSides;
  if (defects.previousRepair === true) defectsTotal += DEFECT_DEDUCTIONS.previousRepair;
  // Bonuses
  if (defects.hasBox === true) boxBonus = Math.round(baseValue * Math.abs(DEFECT_DEDUCTIONS.hasBox));
  if (defects.hasInvoice === true) invoiceBonus = Math.round(baseValue * Math.abs(DEFECT_DEDUCTIONS.hasInvoice));

  const defectsDeduction = Math.round(baseValue * defectsTotal);

  const finalTradeInValue = Math.max(0, baseValue - batteryDeduction - conditionDeduction - defectsDeduction + boxBonus + invoiceBonus);

  // Desired phone price
  const saleStorage = saleModel.storage.find(s => s.gb === data.desiredStorage);
  if (!saleStorage) return null;

  const desiredPhonePrice = data.desiredCondition === 'sealed' ? saleStorage.sealedPrice : saleStorage.usedPrice;
  const difference = desiredPhonePrice - finalTradeInValue;

  return {
    currentPhoneBaseValue: baseValue,
    batteryDeduction,
    conditionDeduction,
    defectsDeduction,
    boxBonus,
    invoiceBonus,
    finalTradeInValue,
    desiredPhonePrice,
    difference: Math.max(0, difference),
  };
}
