// Єдиний центр правил для чеської податкової системи 2025
// Single source of truth for Czech tax system 2025

export const CZECH_TAX_CONFIG_2025 = {
  // Загальні константи
  VAT_REGISTRATION_LIMIT: 2000000,
  PERSONAL_TAX_RATE: 0.15,
  CORPORATE_TAX_RATE: 0.21,
  TAXPAYER_DISCOUNT: 30840,

  // Правила для OSVČ (Підприємці)
  OSVC: {
    SOCIAL_RATE: 0.292,
    HEALTH_RATE: 0.135,
    SOCIAL_BASE_COEFFICIENT: 0.55,
    HEALTH_BASE_COEFFICIENT: 0.50,
    // --- ОБОВ'ЯЗКОВІ МІНІМАЛЬНІ БАЗИ (КЛЮЧОВИЙ ЕЛЕМЕНТ) ---
    MIN_YEARLY_SOCIAL_BASE: 195930,
    MIN_YEARLY_HEALTH_BASE: 279942,
    // --- ПАУШАЛЬНІ ВИТРАТИ ---
    FLAT_EXPENSE_RATES: {
      remeslna: 0.80,
      zemedelska: 0.80,
      volna: 0.60,
      ostatni: 0.40
    },
    // --- Щомісячні передоплати ---
    MIN_MONTHLY_SOCIAL_ADVANCE: 4759,
    MIN_MONTHLY_HEALTH_ADVANCE: 3143
  },

  // Правила для s.r.o. (Фірми)
  SRO: {
    // Для s.r.o. розрахунки податку на прибуток вимагають повної бухгалтерії
    // Тому тут тільки інформаційні константи
    INFO_MESSAGE: "Pro s.r.o. se daň počítá jako 21 % z čistého zisku (příjmy - skutečné náklady). Výpočet vyžaduje vedení účetnictví."
  }
} as const;

// Типи для типізації
export type UserType = 'OSVC' | 'SRO';
export type TradeType = keyof typeof CZECH_TAX_CONFIG_2025.OSVC.FLAT_EXPENSE_RATES;

// Інтерфейс профілю користувача
export interface UserProfile {
  userType: UserType;
  tradeType?: TradeType;
  isVATPayer: boolean;
  usesFlatTaxRegime?: boolean;
  typZivnosti?: string;
}

// Функція для отримання профілю користувача
export async function getUserProfile(): Promise<UserProfile> {
  // TODO: Підключення до бази даних
  // Зараз повертаємо тестовий профіль
  return {
    userType: 'OSVC',
    tradeType: 'volna',
    isVATPayer: false,
    usesFlatTaxRegime: false,
    typZivnosti: 'Nedefinováno'
  };
}

// Функція для отримання загального річного доходу
export async function getAnnualIncome(): Promise<number> {
  // TODO: Підключення до бази даних фактур
  // Зараз повертаємо тестовий дохід
  return 500000; // 500,000 Kč
}

// Helper functions for tax calculations
export const calculateTaxBase = (income: number, tradeType?: keyof typeof CZECH_TAX_CONFIG_2025.OSVC.FLAT_EXPENSE_RATES): number => {
  const expenseRate = tradeType ? CZECH_TAX_CONFIG_2025.OSVC.FLAT_EXPENSE_RATES[tradeType] : 0.60;
  const lumpSumExpenses = income * expenseRate;
  return income - lumpSumExpenses;
};

// ВИПРАВЛЕНА ЛОГІКА: Правильний розрахунок бази для соціального страхування
export const calculateSocialInsuranceBase = (taxBase: number): number => {
  // 1. Розрахуй базу з доходу
  const vypocitanaSocialniBaze = taxBase * 0.55;
  // 2. Порівняй з мінімальною і візьми більше значення
  return Math.max(vypocitanaSocialniBaze, 195930);
};

// ВИПРАВЛЕНА ЛОГІКА: Правильний розрахунок бази для медичного страхування
export const calculateHealthInsuranceBase = (taxBase: number): number => {
  // 1. Розрахуй базу з доходу
  const vypocitanaZdravotniBaze = taxBase * 0.50;
  // 2. Порівняй з мінімальною і візьми більше значення
  return Math.max(vypocitanaZdravotniBaze, 279942);
};

export const calculateIncomeTax = (taxBase: number): number => {
  const taxBeforeDiscount = taxBase * CZECH_TAX_CONFIG_2025.PERSONAL_TAX_RATE;
  return Math.max(0, taxBeforeDiscount - CZECH_TAX_CONFIG_2025.TAXPAYER_DISCOUNT);
};

// ВИПРАВЛЕНА ЛОГІКА: Правильний розрахунок соціального страхування
export const calculateSocialInsurance = (taxBase: number): number => {
  // 1. Розрахуй базу з доходу
  const vypocitanaSocialniBaze = taxBase * 0.55;
  // 2. Порівняй з мінімальною і візьми більше значення
  const finalniSocialniBaze = Math.max(vypocitanaSocialniBaze, 195930);
  // 3. Розрахуй внесок з фінальної бази
  return finalniSocialniBaze * 0.292;
};

// ВИПРАВЛЕНА ЛОГІКА: Правильний розрахунок медичного страхування
export const calculateHealthInsurance = (taxBase: number): number => {
  // 1. Розрахуй базу з доходу
  const vypocitanaZdravotniBaze = taxBase * 0.50;
  // 2. Порівняй з мінімальною і візьми більше значення
  const finalniZdravotniBaze = Math.max(vypocitanaZdravotniBaze, 279942);
  // 3. Розрахуй внесок з фінальної бази
  return finalniZdravotniBaze * 0.135;
}; 