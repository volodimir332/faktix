import { CZECH_TAX_CONFIG_2025, UserProfile } from './tax_config_2025';

// Калькулятор податків для OSVČ з бездоганною логікою
export function TaxCalculatorOSVC(income: number, userProfile: UserProfile) {
  const config = CZECH_TAX_CONFIG_2025;
  
  // Визначаємо відсоток паушальних витрат на основі типу живності
  let expenseRate = 0.60; // За замовчуванням 60%
  
  // Перевіряємо тип живності з профілю
  if (userProfile.typZivnosti) {
    if (userProfile.typZivnosti.includes('80%')) {
      expenseRate = 0.80; // Реміснича живність
    } else if (userProfile.typZivnosti.includes('60%')) {
      expenseRate = 0.60; // Вільна/регульована живність
    } else if (userProfile.typZivnosti.includes('40%')) {
      expenseRate = 0.40; // Інші види живності
    }
  } else {
    // Fallback на старий спосіб визначення
    expenseRate = config.OSVC.FLAT_EXPENSE_RATES[userProfile.tradeType || 'volna'];
  }

  // 1. Податкова база (Základ daně)
  const danovyZaklad = income - (income * expenseRate);

  // 2. Податок на доходи (Daň z příjmů)
  const incomeTaxBeforeDiscount = danovyZaklad * config.PERSONAL_TAX_RATE;
  const finalIncomeTax = Math.max(0, incomeTaxBeforeDiscount - config.TAXPAYER_DISCOUNT);

  // --- РОЗРАХУНОК СОЦІАЛЬНОГО СТРАХУВАННЯ ---
  // 1. Розрахуй базу з доходу
  const vypocitanaSocialniBaze = danovyZaklad * 0.55;
  // 2. Порівняй з мінімальною і візьми більше значення
  const finalniSocialniBaze = Math.max(vypocitanaSocialniBaze, 195930);
  // 3. Розрахуй внесок з фінальної бази
  const rocniSocialniPojisteni = finalniSocialniBaze * 0.292;

  // --- РОЗРАХУНОК МЕДИЧНОГО СТРАХУВАННЯ ---
  // 1. Розрахуй базу з доходу
  const vypocitanaZdravotniBaze = danovyZaklad * 0.50;
  // 2. Порівняй з мінімальною і візьми більше значення
  const finalniZdravotniBaze = Math.max(vypocitanaZdravotniBaze, 279942);
  // 3. Розрахуй внесок з фінальної бази
  const rocniZdravotniPojisteni = finalniZdravotniBaze * 0.135;

  // 5. Загальна сума
  const totalPayable = finalIncomeTax + rocniSocialniPojisteni + rocniZdravotniPojisteni;

  // 6. Повернення результату з детальною інформацією
  return {
    // Вхідні дані
    income,
    taxBase: danovyZaklad,
    expenseRate,
    typZivnosti: userProfile.typZivnosti || 'Nedefinováno',
    
    // Розрахунки податків
    incomeTax: finalIncomeTax,
    socialInsurance: rocniSocialniPojisteni,
    healthInsurance: rocniZdravotniPojisteni,
    total: totalPayable,
    
    // Детальна інформація для відображення
    details: {
      // Податок на доходи
      incomeTaxBeforeDiscount,
      taxDiscount: config.TAXPAYER_DISCOUNT,
      
      // Соціальне страхування
      calculatedSocialBase: vypocitanaSocialniBaze,
      finalSocialBase: finalniSocialniBaze,
      socialUsesMinBase: finalniSocialniBaze === 195930,
      
      // Медичне страхування
      calculatedHealthBase: vypocitanaZdravotniBaze,
      finalHealthBase: finalniZdravotniBaze,
      healthUsesMinBase: finalniZdravotniBaze === 279942,
      
      // Ефективна податкова ставка
      effectiveTaxRate: (totalPayable / income) * 100
    }
  };
}

// Функція для розрахунку щомісячних передоплат
export function calculateMonthlyAdvances(userProfile: UserProfile) {
  const config = CZECH_TAX_CONFIG_2025;
  
  return {
    socialAdvance: config.OSVC.MIN_MONTHLY_SOCIAL_ADVANCE,
    healthAdvance: config.OSVC.MIN_MONTHLY_HEALTH_ADVANCE,
    totalMonthly: config.OSVC.MIN_MONTHLY_SOCIAL_ADVANCE + config.OSVC.MIN_MONTHLY_HEALTH_ADVANCE
  };
}

// Функція для відстеження лімітів
export function calculateLimits(income: number) {
  const config = CZECH_TAX_CONFIG_2025;
  
  return {
    vatLimit: {
      limit: config.VAT_REGISTRATION_LIMIT,
      current: income,
      progress: (income / config.VAT_REGISTRATION_LIMIT) * 100,
      remaining: Math.max(0, config.VAT_REGISTRATION_LIMIT - income)
    }
  };
}

// ТЕСТОВА ФУНКЦІЯ: Перевірка правильності розрахунків
export function testCorrectCalculations(income: number, tradeType: string = 'volna') {
  const expenseRate = tradeType === 'volna' ? 0.60 : 0.80;
  const danovyZaklad = income - (income * expenseRate);
  
  // Податок на доходи
  const incomeTaxBeforeDiscount = danovyZaklad * 0.15;
  const finalIncomeTax = Math.max(0, incomeTaxBeforeDiscount - 30840);
  
  // Соціальне страхування
  const vypocitanaSocialniBaze = danovyZaklad * 0.55;
  const finalniSocialniBaze = Math.max(vypocitanaSocialniBaze, 195930);
  const rocniSocialniPojisteni = finalniSocialniBaze * 0.292;
  
  // Медичне страхування
  const vypocitanaZdravotniBaze = danovyZaklad * 0.50;
  const finalniZdravotniBaze = Math.max(vypocitanaZdravotniBaze, 279942);
  const rocniZdravotniPojisteni = finalniZdravotniBaze * 0.135;
  
  const total = finalIncomeTax + rocniSocialniPojisteni + rocniZdravotniPojisteni;
  
  return {
    income,
    danovyZaklad,
    expenseRate,
    incomeTax: finalIncomeTax,
    socialInsurance: rocniSocialniPojisteni,
    healthInsurance: rocniZdravotniPojisteni,
    total,
    details: {
      vypocitanaSocialniBaze,
      finalniSocialniBaze,
      vypocitanaZdravotniBaze,
      finalniZdravotniBaze
    }
  };
} 