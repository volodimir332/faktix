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
    registrationNumber: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    website: string;
    businessType: string;
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
  const missingFields: string[] = [];
  
  // Перевіряємо особисті дані
  if (!profileData.personal.firstName?.trim()) missingFields.push('Jméno');
  if (!profileData.personal.lastName?.trim()) missingFields.push('Příjmení');
  if (!profileData.personal.email?.trim()) missingFields.push('Email');
  if (!profileData.personal.phone?.trim()) missingFields.push('Telefon');
  if (!profileData.personal.address?.trim()) missingFields.push('Adresa');
  if (!profileData.personal.city?.trim()) missingFields.push('Město');
  if (!profileData.personal.postalCode?.trim()) missingFields.push('PSČ');
  
  // Перевіряємо дані компанії
  if (!profileData.company.name?.trim()) missingFields.push('Název firmy');
  if (!profileData.company.vatNumber?.trim()) missingFields.push('DIČ');
  if (!profileData.company.registrationNumber?.trim()) missingFields.push('IČ');
  if (!profileData.company.address?.trim()) missingFields.push('Adresa firmy');
  if (!profileData.company.city?.trim()) missingFields.push('Město firmy');
  if (!profileData.company.postalCode?.trim()) missingFields.push('PSČ firmy');
  if (!profileData.company.businessType?.trim()) missingFields.push('Typ podnikání');
  
  // Перевіряємо банківські дані
  if (!profileData.banking.accountNumber?.trim()) missingFields.push('Číslo účtu');
  if (!profileData.banking.bankName?.trim()) missingFields.push('Název banky');
  if (!profileData.banking.iban?.trim()) missingFields.push('IBAN');
  
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
    const saved = localStorage.getItem('userProfileData');
    if (saved) {
      return JSON.parse(saved);
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