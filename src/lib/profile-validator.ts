export interface ProfileData {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  company: {
    name: string;
    vatNumber: string;
    registrationNumber?: string;
    ico?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    website: string;
    businessType: string;
    typZivnosti?: string;
  };
  banking: {
    accountNumber: string;
    bankName: string;
    iban: string;
    swift: string;
    currency: string;
  };
}

export interface ProfileValidationResult {
  isValid: boolean;
  missingFields: string[];
  message: string;
}

// Функція для перевірки заповнення профілю
export function validateProfile(profileData: ProfileData): ProfileValidationResult {
  // Захищене обрізання: гарантуємо роботу з рядком навіть якщо значення undefined/number
  const trimOrEmpty = (value: unknown): string => {
    return String(value ?? '').trim();
  };

  const missingFields: string[] = [];
  
  // Перевіряємо особисті дані
  if (!trimOrEmpty(profileData.personal.firstName)) missingFields.push('Jméno');
  if (!trimOrEmpty(profileData.personal.lastName)) missingFields.push('Příjmení');
  if (!trimOrEmpty(profileData.personal.email)) missingFields.push('Email');
  if (!trimOrEmpty(profileData.personal.phone)) missingFields.push('Telefon');
  if (!trimOrEmpty(profileData.personal.address)) missingFields.push('Adresa');
  if (!trimOrEmpty(profileData.personal.city)) missingFields.push('Město');
  if (!trimOrEmpty(profileData.personal.postalCode)) missingFields.push('PSČ');
  
  // Перевіряємо дані компанії
  if (!trimOrEmpty(profileData.company.name)) missingFields.push('Název firmy');
  // DIČ (VAT) не є обов'язковим для živnostník/OSVČ та неплатників DPH
  // Вимагаємо DIČ лише для firemních subjektů (např. s.r.o., a.s.)
  const businessTypeValue = trimOrEmpty(profileData.company.businessType).toLowerCase();
  const isZivnostnik =
    businessTypeValue.includes('živnost') ||
    businessTypeValue.includes('zivnost') ||
    businessTypeValue.includes('osvč') ||
    businessTypeValue.includes('osvc') ||
    businessTypeValue.includes('fyzická') ||
    businessTypeValue.includes('fyzicka');
  const isCompanySubject = !isZivnostnik; // anything else považujeme za firmu

  if (isCompanySubject && !trimOrEmpty(profileData.company.vatNumber)) {
    missingFields.push('DIČ');
  }
  // Перевіряємо IČ (може бути як registrationNumber, так і ico)
  if (!trimOrEmpty(profileData.company.registrationNumber) && !trimOrEmpty(profileData.company.ico)) {
    missingFields.push('IČ');
  }
  if (!trimOrEmpty(profileData.company.address)) missingFields.push('Adresa firmy');
  if (!trimOrEmpty(profileData.company.city)) missingFields.push('Město firmy');
  if (!trimOrEmpty(profileData.company.postalCode)) missingFields.push('PSČ firmy');
  if (!trimOrEmpty(profileData.company.businessType)) missingFields.push('Typ podnikání');
  // typZivnosti не є обов'язковим полем, оскільки може бути "Nedefinováno"
  
  // Перевіряємо банківські дані
  if (!trimOrEmpty(profileData.banking.accountNumber)) missingFields.push('Číslo účtu');
  if (!trimOrEmpty(profileData.banking.bankName)) missingFields.push('Název banky');
  if (!trimOrEmpty(profileData.banking.iban)) missingFields.push('IBAN');
  
  const isValid = missingFields.length === 0;
  
  let message = '';
  if (!isValid) {
    message = `Pro vytvoření faktury je nutné vyplnit následující údaje v profilu: ${missingFields.join(', ')}. Prosím, dokončete vyplnění profilu v sekci "Můj profil".`;
  }
  
  return {
    isValid,
    missingFields,
    message
  };
}

// Функція для завантаження профілю з localStorage
export function loadProfileFromStorage(): ProfileData | null {
  try {
    // Спробуємо завантажити з правильного ключа
    const saved = localStorage.getItem('faktix-profile');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Fallback для старого ключа
    const oldSaved = localStorage.getItem('userProfileData');
    if (oldSaved) {
      return JSON.parse(oldSaved);
    }
  } catch (error) {
    console.error('Chyba při načítání profilu:', error);
  }
  return null;
}

// Функція для перевірки профілю з localStorage
export function checkProfileFromStorage(): ProfileValidationResult {
  const profileData = loadProfileFromStorage();
  if (!profileData) {
    return {
      isValid: false,
      missingFields: ['Všechny údaje'],
      message: 'Pro vytvoření faktury je nutné vyplnit všechny údaje v profilu. Prosím, přejděte do sekce "Můj profil" a vyplňte všechny požadované údaje.'
    };
  }
  
  return validateProfile(profileData);
} 