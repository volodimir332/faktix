import { searchByICO } from './ares-api';

export interface UserProfile {
  userType: 'OSVC' | 'SRO' | 'AS' | 'VOS' | 'KS' | 'DRUZSTVO' | 'UNKNOWN';
  tradeType?: 'volna' | 'remeslna' | 'zemedelska' | 'ostatni';
  tradeName?: string;
  companyName?: string;
  ico: string;
  isVATPayer: boolean;
  dic?: string;
  typZivnosti?: string; // Новий тип живності
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface TaxCalculationResult {
  incomeTax: string | number;
  social: string | number;
  health: string | number;
  total: string | number;
  monthlyPayments?: {
    social: number;
    health: number;
  };
}

// Функція для автоматичної ідентифікації користувача за IČO
export async function getUserProfile(ico: string): Promise<UserProfile | null> {
  try {
    const response = await searchByICO(ico);
    
    if (!response.success || !response.data) {
      return null;
    }

    const companyData = response.data;
    const companyName = companyData.obchodniJmeno.toLowerCase();
    
    // Визначаємо тип бізнесу на основі назви
    let userType: UserProfile['userType'] = 'UNKNOWN';
    let tradeType: UserProfile['tradeType'] | undefined;
    let tradeName: string | undefined;
    let companyNameDisplay: string | undefined;

    if (companyName.includes('s.r.o.') || companyName.includes('spol. s r.o.')) {
      userType = 'SRO';
      companyNameDisplay = companyData.obchodniJmeno;
    } else if (companyName.includes('a.s.') || companyName.includes('akciová společnost')) {
      userType = 'AS';
      companyNameDisplay = companyData.obchodniJmeno;
    } else if (companyName.includes('v.o.s.') || companyName.includes('veřejná obchodní společnost')) {
      userType = 'VOS';
      companyNameDisplay = companyData.obchodniJmeno;
    } else if (companyName.includes('k.s.') || companyName.includes('komanditní společnost')) {
      userType = 'KS';
      companyNameDisplay = companyData.obchodniJmeno;
    } else if (companyName.includes('družstvo') || companyName.includes('cooperative')) {
      userType = 'DRUZSTVO';
      companyNameDisplay = companyData.obchodniJmeno;
    } else {
      // Якщо не компанія, то це OSVČ
      userType = 'OSVC';
      tradeName = companyData.obchodniJmeno;
      
      // Визначаємо тип живності на основі назви
      if (companyName.includes('řemeslo') || companyName.includes('craft') || 
          companyName.includes('truhlář') || companyName.includes('klempíř') ||
          companyName.includes('elektrikář') || companyName.includes('instalatér')) {
        tradeType = 'remeslna';
      } else if (companyName.includes('zeměděl') || companyName.includes('farm')) {
        tradeType = 'zemedelska';
      } else if (companyName.includes('volná') || companyName.includes('free')) {
        tradeType = 'volna';
      } else {
        tradeType = 'ostatni';
      }
    }

    // Визначаємо чи є платником ДПГ
    const isVATPayer = !!companyData.dic;

    return {
      userType,
      tradeType,
      tradeName,
      companyName: companyNameDisplay,
      ico: companyData.ico,
      isVATPayer,
      dic: companyData.dic,
      address: {
        street: companyData.adresa.ulice,
        city: companyData.adresa.mesto,
        postalCode: companyData.adresa.psc,
        country: 'Česká republika'
      }
    };
  } catch (error) {
    console.error('Chyba při získávání profilu uživatele:', error);
    return null;
  }
}

// Функція для отримання профілю з localStorage
export function getUserProfileFromStorage(): UserProfile | null {
  try {
    const saved = localStorage.getItem('userProfileData');
    if (saved) {
      const profileData = JSON.parse(saved);
      
      // Визначаємо тип на основі даних з профілю
      const businessType = profileData.company?.businessType || '';
      const companyName = profileData.company?.name || '';
      const ico = profileData.company?.registrationNumber || '';
      
      let userType: UserProfile['userType'] = 'UNKNOWN';
      let tradeType: UserProfile['tradeType'] | undefined;
      let tradeName: string | undefined;
      let companyNameDisplay: string | undefined;

      // Покращена логіка визначення типу бізнесу
      if (businessType.includes('s.r.o.') || businessType.includes('Společnost s ručením omezeným')) {
        userType = 'SRO';
        companyNameDisplay = companyName;
      } else if (businessType.includes('a.s.') || businessType.includes('Akciová společnost')) {
        userType = 'AS';
        companyNameDisplay = companyName;
      } else if (businessType.includes('v.o.s.') || businessType.includes('Veřejná obchodní společnost')) {
        userType = 'VOS';
        companyNameDisplay = companyName;
      } else if (businessType.includes('k.s.') || businessType.includes('Komanditní společnost')) {
        userType = 'KS';
        companyNameDisplay = companyName;
      } else if (businessType.includes('Družstvo')) {
        userType = 'DRUZSTVO';
        companyNameDisplay = companyName;
      } else if (businessType.includes('Živnostník') || businessType.includes('OSVČ') || 
                 businessType.includes('Podnikatel') || businessType.includes('živnost') ||
                 businessType.includes('Řemeslná živnost') || businessType.includes('Svobodné povolání')) {
        userType = 'OSVC';
        tradeName = companyName;
        
        // Визначаємо тип живності
        if (businessType.includes('Řemeslná živnost') || businessType.includes('řemeslná')) {
          tradeType = 'remeslna';
        } else if (businessType.includes('zemědělská') || businessType.includes('Zemědělská')) {
          tradeType = 'zemedelska';
        } else if (businessType.includes('volná') || businessType.includes('Volná')) {
          tradeType = 'volna';
        } else {
          tradeType = 'ostatni';
        }
      }

      // Додаткове логування для діагностики
      console.log('Profile data from localStorage:', profileData);
      console.log('Business type:', businessType);
      console.log('Determined user type:', userType);

      return {
        userType,
        tradeType,
        tradeName,
        companyName: companyNameDisplay,
        ico,
        isVATPayer: !!profileData.company?.vatNumber,
        dic: profileData.company?.vatNumber,
        typZivnosti: profileData.company?.typZivnosti, // Додаємо тип живності
        address: {
          street: profileData.company?.address || '',
          city: profileData.company?.city || '',
          postalCode: profileData.company?.postalCode || '',
          country: profileData.company?.country || 'Česká republika'
        }
      };
    }
  } catch (error) {
    console.error('Chyba při načítání profilu z localStorage:', error);
  }
  return null;
} 