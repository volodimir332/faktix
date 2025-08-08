// Tax Configuration for 2025
// Конфігурація податків на 2025 рік

export const TAX_CONFIG_2025 = {
  // Income Tax (Daň z příjmů)
  INCOME_TAX_RATE: 0.15, // 15%
  
  // Lump Sum Expenses (Paušální výdaje)
  LUMP_SUM_EXPENSE_RATE: 0.60, // 60%
  
  // Tax Discount (Daňová sleva na poplatníka)
  TAX_DISCOUNT_ANNUAL: 30840, // 30,840 Kč
  
  // Social Insurance (Sociální pojištění)
  SOCIAL_INSURANCE_RATE: 0.292, // 29.2%
  SOCIAL_INSURANCE_BASE_COEFFICIENT: 0.55, // 55%
  SOCIAL_INSURANCE_MIN_ANNUAL_BASE: 195930, // 195,930 Kč
  MIN_MONTHLY_SOCIAL_ADVANCE: 4759, // 4,759 Kč
  
  // Health Insurance (Zdravotní pojištění)
  HEALTH_INSURANCE_RATE: 0.135, // 13.5%
  HEALTH_INSURANCE_BASE_COEFFICIENT: 0.50, // 50%
  HEALTH_INSURANCE_MIN_ANNUAL_BASE: 279942, // 279,942 Kč
  MIN_MONTHLY_HEALTH_ADVANCE: 3143, // 3,143 Kč
  
  // VAT Registration Limit
  VAT_REGISTRATION_LIMIT: 2000000, // 2,000,000 Kč
  
  // Flat Tax Regime (Paušální daň)
  FLAT_TAX_REGIME: {
    LIMIT: 2000000, // 2,000,000 Kč
    BANDS: {
      FIRST: { limit: 1000000, monthly_payment: 7498 }, // До 1M Kč
      SECOND: { limit: 1500000, monthly_payment: 16745 }, // 1M - 1.5M Kč
      THIRD: { limit: 2000000, monthly_payment: 27139 } // 1.5M - 2M Kč
    }
  }
} as const;

// Flat expense rates by activity type
export const FLAT_EXPENSE_RATES = {
  'remeslna': 0.80, // Реміснича - 80%
  'zemedelska': 0.80, // Сільськогосподарська - 80%
  'volna': 0.60, // Вільна - 60%
  'ostatni': 0.40 // Інша - 40%
} as const;

// Helper functions for tax calculations
export const calculateTaxBase = (income: number, tradeType?: keyof typeof FLAT_EXPENSE_RATES): number => {
  const expenseRate = tradeType ? FLAT_EXPENSE_RATES[tradeType] : TAX_CONFIG_2025.LUMP_SUM_EXPENSE_RATE;
  const lumpSumExpenses = income * expenseRate;
  return income - lumpSumExpenses;
};

// ВИПРАВЛЕНА ЛОГІКА: Правильний розрахунок бази для соціального страхування
export const calculateSocialInsuranceBase = (taxBase: number): number => {
  const calculatedBase = taxBase * TAX_CONFIG_2025.SOCIAL_INSURANCE_BASE_COEFFICIENT;
  // КЛЮЧОВИЙ КРОК: Порівнюємо з мінімальною річною базою та беремо більше значення
  return Math.max(calculatedBase, TAX_CONFIG_2025.SOCIAL_INSURANCE_MIN_ANNUAL_BASE);
};

// ВИПРАВЛЕНА ЛОГІКА: Правильний розрахунок бази для медичного страхування
export const calculateHealthInsuranceBase = (taxBase: number): number => {
  const calculatedBase = taxBase * TAX_CONFIG_2025.HEALTH_INSURANCE_BASE_COEFFICIENT;
  // КЛЮЧОВИЙ КРОК: Порівнюємо з мінімальною річною базою та беремо більше значення
  return Math.max(calculatedBase, TAX_CONFIG_2025.HEALTH_INSURANCE_MIN_ANNUAL_BASE);
};

export const calculateIncomeTax = (taxBase: number): number => {
  const taxBeforeDiscount = taxBase * TAX_CONFIG_2025.INCOME_TAX_RATE;
  return Math.max(0, taxBeforeDiscount - TAX_CONFIG_2025.TAX_DISCOUNT_ANNUAL);
};

// ВИПРАВЛЕНА ЛОГІКА: Правильний розрахунок соціального страхування
export const calculateSocialInsurance = (taxBase: number): number => {
  const insuranceBase = calculateSocialInsuranceBase(taxBase);
  return insuranceBase * TAX_CONFIG_2025.SOCIAL_INSURANCE_RATE;
};

// ВИПРАВЛЕНА ЛОГІКА: Правильний розрахунок медичного страхування
export const calculateHealthInsurance = (taxBase: number): number => {
  const insuranceBase = calculateHealthInsuranceBase(taxBase);
  return insuranceBase * TAX_CONFIG_2025.HEALTH_INSURANCE_RATE;
};

export const calculateTotalTax = (income: number, tradeType?: keyof typeof FLAT_EXPENSE_RATES): {
  taxBase: number;
  incomeTax: number;
  socialInsurance: number;
  healthInsurance: number;
  total: number;
  socialUsesMinBase: boolean;
  healthUsesMinBase: boolean;
  effectiveTaxRate: number;
  socialInsuranceBase: number;
  healthInsuranceBase: number;
} => {
  const taxBase = calculateTaxBase(income, tradeType);
  const incomeTax = calculateIncomeTax(taxBase);
  
  // ВИПРАВЛЕНА ЛОГІКА: Правильний розрахунок соціального страхування
  const socialInsuranceBase = calculateSocialInsuranceBase(taxBase);
  const socialInsurance = socialInsuranceBase * TAX_CONFIG_2025.SOCIAL_INSURANCE_RATE;
  const socialUsesMinBase = socialInsuranceBase === TAX_CONFIG_2025.SOCIAL_INSURANCE_MIN_ANNUAL_BASE;
  
  // ВИПРАВЛЕНА ЛОГІКА: Правильний розрахунок медичного страхування
  const healthInsuranceBase = calculateHealthInsuranceBase(taxBase);
  const healthInsurance = healthInsuranceBase * TAX_CONFIG_2025.HEALTH_INSURANCE_RATE;
  const healthUsesMinBase = healthInsuranceBase === TAX_CONFIG_2025.HEALTH_INSURANCE_MIN_ANNUAL_BASE;
  
  const total = incomeTax + socialInsurance + healthInsurance;
  const effectiveTaxRate = (total / income) * 100;
  
  return {
    taxBase,
    incomeTax,
    socialInsurance,
    healthInsurance,
    total,
    socialUsesMinBase,
    healthUsesMinBase,
    effectiveTaxRate,
    socialInsuranceBase,
    healthInsuranceBase
  };
};

// Flat tax regime calculations
export const getFlatTaxBand = (income: number) => {
  if (income <= TAX_CONFIG_2025.FLAT_TAX_REGIME.BANDS.FIRST.limit) {
    return TAX_CONFIG_2025.FLAT_TAX_REGIME.BANDS.FIRST;
  } else if (income <= TAX_CONFIG_2025.FLAT_TAX_REGIME.BANDS.SECOND.limit) {
    return TAX_CONFIG_2025.FLAT_TAX_REGIME.BANDS.SECOND;
  } else if (income <= TAX_CONFIG_2025.FLAT_TAX_REGIME.BANDS.THIRD.limit) {
    return TAX_CONFIG_2025.FLAT_TAX_REGIME.BANDS.THIRD;
  }
  return null; // Over the limit
};

export const calculateFlatTaxMonthlyPayment = (income: number): number | null => {
  const band = getFlatTaxBand(income);
  return band ? band.monthly_payment : null;
};

// Test function to verify Math.max logic
export const testInsuranceCalculations = (income: number, tradeType?: keyof typeof FLAT_EXPENSE_RATES) => {
  const taxBase = calculateTaxBase(income, tradeType);
  
  // КРОК 1: Розрахуй базу з доходу
  const vypocitanaSocialniBaze = taxBase * TAX_CONFIG_2025.SOCIAL_INSURANCE_BASE_COEFFICIENT;
  const vypocitanaZdravotniBaze = taxBase * TAX_CONFIG_2025.HEALTH_INSURANCE_BASE_COEFFICIENT;
  
  // КРОК 2: Встанови "підлогу" - порівняй з мінімальною і візьми БІЛЬШЕ значення
  const finalniSocialniBaze = Math.max(vypocitanaSocialniBaze, TAX_CONFIG_2025.SOCIAL_INSURANCE_MIN_ANNUAL_BASE);
  const finalniZdravotniBaze = Math.max(vypocitanaZdravotniBaze, TAX_CONFIG_2025.HEALTH_INSURANCE_MIN_ANNUAL_BASE);
  
  // КРОК 3: Розрахуй річний внесок з фінальної, правильної бази
  const rocniSocialniPojisteni = finalniSocialniBaze * TAX_CONFIG_2025.SOCIAL_INSURANCE_RATE;
  const rocniZdravotniPojisteni = finalniZdravotniBaze * TAX_CONFIG_2025.HEALTH_INSURANCE_RATE;
  
  return {
    income,
    taxBase,
    vypocitanaSocialniBaze,
    vypocitanaZdravotniBaze,
    finalniSocialniBaze,
    finalniZdravotniBaze,
    rocniSocialniPojisteni,
    rocniZdravotniPojisteni,
    usesMinSocialBase: finalniSocialniBaze === TAX_CONFIG_2025.SOCIAL_INSURANCE_MIN_ANNUAL_BASE,
    usesMinHealthBase: finalniZdravotniBaze === TAX_CONFIG_2025.HEALTH_INSURANCE_MIN_ANNUAL_BASE
  };
};

// ДОДАТКОВА ПЕРЕВІРКА: Явна демонстрація Math.max логіки
export const verifyMathMaxLogic = (income: number, tradeType?: keyof typeof FLAT_EXPENSE_RATES) => {
  const taxBase = calculateTaxBase(income, tradeType);
  
  // СОЦІАЛЬНЕ СТРАХУВАННЯ - ЯВНА ПЕРЕВІРКА
  const vypocitanaSocialniBaze = taxBase * TAX_CONFIG_2025.SOCIAL_INSURANCE_BASE_COEFFICIENT;
  // ОБОВ'ЯЗКОВИЙ КРОК: Math.max для соціального страхування
  const finalniSocialniBaze = Math.max(vypocitanaSocialniBaze, TAX_CONFIG_2025.SOCIAL_INSURANCE_MIN_ANNUAL_BASE);
  const rocniSocialniPojisteni = finalniSocialniBaze * TAX_CONFIG_2025.SOCIAL_INSURANCE_RATE;
  
  // МЕДИЧНЕ СТРАХУВАННЯ - ЯВНА ПЕРЕВІРКА
  const vypocitanaZdravotniBaze = taxBase * TAX_CONFIG_2025.HEALTH_INSURANCE_BASE_COEFFICIENT;
  // ОБОВ'ЯЗКОВИЙ КРОК: Math.max для медичного страхування
  const finalniZdravotniBaze = Math.max(vypocitanaZdravotniBaze, TAX_CONFIG_2025.HEALTH_INSURANCE_MIN_ANNUAL_BASE);
  const rocniZdravotniPojisteni = finalniZdravotniBaze * TAX_CONFIG_2025.HEALTH_INSURANCE_RATE;
  
  return {
    // Вхідні дані
    income,
    taxBase,
    
    // Соціальне страхування - детальний розрахунок
    socialInsurance: {
      vypocitanaBaze: vypocitanaSocialniBaze,
      minimalnaBaze: TAX_CONFIG_2025.SOCIAL_INSURANCE_MIN_ANNUAL_BASE,
      finalniBaze: finalniSocialniBaze,
      rocniPojisteni: rocniSocialniPojisteni,
      usesMinBase: finalniSocialniBaze === TAX_CONFIG_2025.SOCIAL_INSURANCE_MIN_ANNUAL_BASE
    },
    
    // Медичне страхування - детальний розрахунок
    healthInsurance: {
      vypocitanaBaze: vypocitanaZdravotniBaze,
      minimalnaBaze: TAX_CONFIG_2025.HEALTH_INSURANCE_MIN_ANNUAL_BASE,
      finalniBaze: finalniZdravotniBaze,
      rocniPojisteni: rocniZdravotniPojisteni,
      usesMinBase: finalniZdravotniBaze === TAX_CONFIG_2025.HEALTH_INSURANCE_MIN_ANNUAL_BASE
    },
    
    // Загальна сума
    totalInsurance: rocniSocialniPojisteni + rocniZdravotniPojisteni
  };
};

// VAT calculations
export const calculateVATAmount = (totalAmount: number): number => {
  return totalAmount * 0.21; // 21% VAT rate
};

export const calculateAmountWithoutVAT = (totalAmount: number): number => {
  return totalAmount / 1.21; // Remove VAT
}; 