import { UserProfile, TaxCalculationResult } from './user-profile-analyzer';
import { CZECH_TAX_CONFIG_2025 } from './tax_config_2025';

// Універсальна функція розрахунку податків
export function calculateTaxes(userProfile: UserProfile, income: number): TaxCalculationResult {
  switch (userProfile.userType) {
    case 'OSVC':
      return calculateOSVCTaxes(userProfile, income);
    
    case 'SRO':
    case 'AS':
    case 'VOS':
    case 'KS':
    case 'DRUZSTVO':
      return calculateCompanyTaxes(userProfile);
    
    default:
      return {
        incomeTax: "Neznámý typ podnikání",
        social: "Neznámý typ podnikání",
        health: "Neznámý typ podnikání",
        total: "Neznámý typ podnikání"
      };
  }
}

// Розрахунок податків для OSVČ
function calculateOSVCTaxes(userProfile: UserProfile, income: number): TaxCalculationResult {
  // Визначаємо відсоток паушальних витрат залежно від типу живності
  let expenseRate = 0.60; // За замовчуванням 60%
  
  switch (userProfile.tradeType) {
    case 'remeslna':
      expenseRate = 0.80; // 80% для ремесленної живності
      break;
    case 'zemedelska':
      expenseRate = 0.80; // 80% для сільськогосподарської живності
      break;
    case 'volna':
      expenseRate = 0.60; // 60% для вільної живності
      break;
    case 'ostatni':
      expenseRate = 0.40; // 40% для інших видів живності
      break;
  }

  // Розрахунок податкової бази
  const taxBase = income * (1 - expenseRate);
  
  // Розрахунок податку з доходів (прогресивна шкала)
  let incomeTax = 0;
  const taxBeforeDiscount = taxBase * CZECH_TAX_CONFIG_2025.PERSONAL_TAX_RATE;
  incomeTax = Math.max(0, taxBeforeDiscount - CZECH_TAX_CONFIG_2025.TAXPAYER_DISCOUNT);

  // Розрахунок соціального страхування
  const calculatedSocialBase = taxBase * 0.55;
  const finalSocialBase = Math.max(calculatedSocialBase, CZECH_TAX_CONFIG_2025.OSVC.MIN_YEARLY_SOCIAL_BASE);
  const socialInsurance = finalSocialBase * CZECH_TAX_CONFIG_2025.OSVC.SOCIAL_RATE;

  // Розрахунок медичного страхування
  const calculatedHealthBase = taxBase * 0.50;
  const finalHealthBase = Math.max(calculatedHealthBase, CZECH_TAX_CONFIG_2025.OSVC.MIN_YEARLY_HEALTH_BASE);
  const healthInsurance = finalHealthBase * CZECH_TAX_CONFIG_2025.OSVC.HEALTH_RATE;

  const total = incomeTax + socialInsurance + healthInsurance;

  return {
    incomeTax: Math.round(incomeTax),
    social: Math.round(socialInsurance),
    health: Math.round(healthInsurance),
    total: Math.round(total),
    monthlyPayments: {
      social: Math.round(socialInsurance / 12),
      health: Math.round(healthInsurance / 12)
    }
  };
}

// Розрахунок податків для компаній
function calculateCompanyTaxes(userProfile: UserProfile): TaxCalculationResult {
  return {
    incomeTax: "Vyžaduje účetnictví",
    social: "Platí se ze mezd",
    health: "Platí se ze mezd",
    total: "Nelze odhadnout"
  };
}

// Функція для отримання поради на основі типу бізнесу
export function getBusinessAdvice(userProfile: UserProfile): string {
  switch (userProfile.userType) {
    case 'OSVC':
      return "FaktiX AI vám pomůže sledovat vaše příjmy a automaticky vypočítá daňové povinnosti. Všechny výpočty jsou v souladu s aktuální legislativou.";
    
    case 'SRO':
    case 'AS':
    case 'VOS':
    case 'KS':
    case 'DRUZSTVO':
      return "Pro přesný výpočet daní vaší firmy se obraťte na svého účetního. FaktiX AI vám pomůže sledovat vaše příjmy a vytvářet profesionální faktury.";
    
    default:
      return "Pro správné nastavení vašeho podnikání doporučujeme konzultaci s daňovým poradcem.";
  }
}

// Функція для отримання назви типу бізнесу для відображення
export function getBusinessTypeDisplayName(userProfile: UserProfile): string {
  switch (userProfile.userType) {
    case 'OSVC':
      switch (userProfile.tradeType) {
        case 'remeslna':
          return 'Živnost - Řemeslná';
        case 'zemedelska':
          return 'Živnost - Zemědělská';
        case 'volna':
          return 'Živnost - Volná';
        case 'ostatni':
          return 'Živnost - Ostatní';
        default:
          return 'Živnostník (OSVČ)';
      }
    
    case 'SRO':
      return 'Firma (s.r.o.)';
    case 'AS':
      return 'Firma (a.s.)';
    case 'VOS':
      return 'Firma (v.o.s.)';
    case 'KS':
      return 'Firma (k.s.)';
    case 'DRUZSTVO':
      return 'Družstvo';
    
    default:
      return 'Neznámý typ';
  }
} 