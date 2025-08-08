// ARES API для валідації чеських компаній
export interface AresCompanyData {
  ico: string;
  obchodniJmeno: string;
  dic?: string;
  adresa: {
    ulice: string;
    cisloOrientacni?: string;
    cisloEvidencni?: string;
    mesto: string;
    psc: string;
    okres: string;
    kraj: string;
  };
  pravniForma: string;
  datumVzniku: string;
  datumZaniku?: string;
  stavSubjektu: string;
  platceDPH: boolean;
  typZivnosti?: string; // Новий тип живності
}

// Новий інтерфейс для даних живності
export interface ZivnostData {
  typZivnosti: string;
  predmetPodnikani: string[];
  datumZapisu: string;
  datumZruseni?: string;
  stav: string;
}

export interface AresResponse {
  success: boolean;
  data?: AresCompanyData;
  error?: string;
}

/**
 * Validuje IČ (identifikační číslo) podle českého formátu
 */
export function validateICO(ico: string): boolean {
  // Odstranění mezer a pomlček
  const cleanIco = ico.replace(/[\s-]/g, '');
  
  // Musí mít 8 číslic
  if (!/^\d{8}$/.test(cleanIco)) {
    return false;
  }
  
  // Algoritmus kontrolního součtu
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += parseInt(cleanIco[i]) * (8 - i);
  }
  
  const remainder = sum % 11;
  const checkDigit = remainder < 2 ? remainder : 11 - remainder;
  
  return parseInt(cleanIco[7]) === checkDigit;
}

/**
 * Vyhledá informace o firmě v ARES databázi podle IČ
 */
export async function searchByICO(ico: string): Promise<AresResponse> {
  try {
    // Validace IČ
    if (!validateICO(ico)) {
      return {
        success: false,
        error: 'Neplatné IČ. Zkontrolujte prosím formát.'
      };
    }

    // ARES API endpoint
    const url = `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Firma s tímto IČ nebyla nalezena v databázi ARES.'
        };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Parsování ARES odpovědi
    const ekonomickySubjekt = data;
    
    if (!ekonomickySubjekt) {
      return {
        success: false,
        error: 'Neočekávaný formát odpovědi z ARES.'
      };
    }

    // Extrahovanie základních informací
    const obchodniJmeno = ekonomickySubjekt.obchodniJmeno || 
                         ekonomickySubjekt.nazevObchodniJmeno ||
                         'Název nenalezen';

    const adresa = ekonomickySubjekt.sidlo || ekonomickySubjekt.adresaPodnikani;
    
    const companyData: AresCompanyData = {
      ico: ekonomickySubjekt.ico,
      obchodniJmeno,
      dic: ekonomickySubjekt.dic,
      adresa: {
        ulice: adresa?.nazevUlice || '',
        cisloOrientacni: adresa?.cisloDomovni?.toString(),
        cisloEvidencni: adresa?.cisloOrientacni?.toString(),
        mesto: adresa?.nazevObce || '',
        psc: adresa?.psc || '',
        okres: adresa?.nazevOkresu || '',
        kraj: adresa?.nazevKraje || ''
      },
      pravniForma: ekonomickySubjekt.pravniForma?.nazev || 'Neuvedeno',
      datumVzniku: ekonomickySubjekt.datumVzniku || '',
      datumZaniku: ekonomickySubjekt.datumZaniku,
      stavSubjektu: ekonomickySubjekt.stavSubjektu || 'Neznámý',
      platceDPH: ekonomickySubjekt.platceDph || false
    };

    return {
      success: true,
      data: companyData
    };

  } catch (error) {
    console.error('ARES API Error:', error);
    return {
      success: false,
      error: 'Chyba při komunikaci s ARES databází. Zkuste to prosím znovu.'
    };
  }
}

/**
 * Vyhledá firmu podle názvu (fulltextové vyhledávání)
 */
export async function searchByName(name: string): Promise<AresResponse> {
  try {
    if (name.length < 3) {
      return {
        success: false,
        error: 'Název musí mít alespoň 3 znaky.'
      };
    }

    // ARES fulltextové vyhledávání
    const url = `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/vyhledat`;
    
    const searchParams = new URLSearchParams({
      obchodniJmeno: name,
      pocet: '10', // Max 10 výsledků
      start: '0'
    });

    const response = await fetch(`${url}?${searchParams}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.ekonomickeSubjekty || data.ekonomickeSubjekty.length === 0) {
      return {
        success: false,
        error: 'Nenalezeny žádné firmy s tímto názvem.'
      };
    }

    // Vratíme první nejrelevantnější výsledek
    const prvniVysledek = data.ekonomickeSubjekty[0];
    
    return await searchByICO(prvniVysledek.ico);

  } catch (error) {
    console.error('ARES Name Search Error:', error);
    return {
      success: false,
      error: 'Chyba při vyhledávání podle názvu. Zkuste to prosím znovu.'
    };
  }
}

/**
 * Formátuje IČ do standardního českého formátu (12 345 678)
 */
export function formatICO(ico: string): string {
  const clean = ico.replace(/[\s-]/g, '');
  if (clean.length === 8) {
    return `${clean.substring(0, 2)} ${clean.substring(2, 5)} ${clean.substring(5, 8)}`;
  }
  return ico;
}

/**
 * Formátuje DIČ do standardního českého formátu (CZ12345678)
 */
export function formatDIC(dic: string): string {
  if (!dic) return '';
  
  const clean = dic.replace(/[\s-]/g, '').toUpperCase();
  
  if (clean.startsWith('CZ') && clean.length === 10) {
    return `${clean.substring(0, 2)}${clean.substring(2, 4)} ${clean.substring(4, 7)} ${clean.substring(7, 10)}`;
  }
  
  return dic;
}

/**
 * Отримує тип живності з Živnostenský rejstřík
 */
export async function getZivnostType(ico: string): Promise<{ success: boolean; data?: ZivnostData; error?: string }> {
  try {
    console.log('🔍 Fetching živnost data for IČO:', ico);
    
    // Спробуємо кілька різних URL для rzp.cz
    const urls = [
      `https://www.rzp.cz/cgi-bin/aps_cacheWEB?VSS_SERV=ZVWSBJFND&VYPIS=1&ICO=${ico}`,
      `https://www.rzp.cz/cgi-bin/aps_cacheWEB?VSS_SERV=ZVWSBJFND&ICO=${ico}`,
      `https://www.rzp.cz/cgi-bin/aps_cacheWEB?VSS_SERV=ZVWSBJFND&VYPIS=1&ICO=${ico}&FORMAT=HTML`
    ];
    
    let html = '';
    let lastError = '';
    
    for (const url of urls) {
      try {
        console.log('📡 Trying URL:', url);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (compatible; FaktixBot/1.0)',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          lastError = `HTTP ${response.status}: ${response.statusText}`;
          continue;
        }

        html = await response.text();
        console.log('📄 HTML received, length:', html.length);
        
        // Перевіряємо, чи містить HTML корисні дані
        if (html.includes('Živnost') || html.includes('živnost') || html.includes('ICO')) {
          break;
        } else {
          lastError = 'HTML does not contain živnost data';
          continue;
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.warn('⚠️ Failed to fetch from URL:', url, lastError);
        continue;
      }
    }
    
    if (!html) {
      return {
        success: false,
        error: `Failed to fetch data from all URLs. Last error: ${lastError}`
      };
    }

    // Парсимо HTML для отримання даних живності
    const zivnostData = parseZivnostHTML(html);
    
    if (!zivnostData) {
      return {
        success: false,
        error: 'Živnost nebyla nalezena nebo je neaktivní. HTML response does not contain valid data.'
      };
    }

    console.log('✅ Successfully parsed živnost data:', zivnostData);
    return {
      success: true,
      data: zivnostData
    };

  } catch (error) {
    console.error('❌ Živnost API Error:', error);
    return {
      success: false,
      error: 'Chyba při komunikaci s Živnostenský rejstřík.'
    };
  }
}

/**
 * Парсить HTML відповідь з Živnostenský rejstřík
 */
function parseZivnostHTML(html: string): ZivnostData | null {
  try {
    console.log('🔍 Parsing HTML for živnost data...');
    
    // Перевіряємо, чи містить HTML дані про живність
    if (!html.includes('Živnost') && !html.includes('živnost') && !html.includes('ICO')) {
      console.warn('⚠️ HTML does not contain expected keywords');
      return null;
    }
    
    // Шукаємо тип живності - покращений пошук з більш точними патернами
    let typZivnosti = 'Neuvedeno';
    const typPatterns = [
      /Typ živnosti:\s*([^<\n\r]+)/i,
      /Živnost:\s*([^<\n\r]+)/i,
      /Druh živnosti:\s*([^<\n\r]+)/i,
      /<td[^>]*>Typ živnosti<\/td>\s*<td[^>]*>([^<]+)<\/td>/i,
      /<td[^>]*>Živnost<\/td>\s*<td[^>]*>([^<]+)<\/td>/i
    ];
    
    for (const pattern of typPatterns) {
      const match = html.match(pattern);
      if (match) {
        typZivnosti = match[1].trim();
        console.log('✅ Found typ živnosti:', typZivnosti);
        break;
      }
    }
    
    // Шукаємо предмет підприємства - покращений пошук
    const predmetPatterns = [
      /Předmět podnikání:\s*([^<\n\r]+)/i,
      /Obory činnosti:\s*([^<\n\r]+)/i,
      /Činnost:\s*([^<\n\r]+)/i,
      /<td[^>]*>Předmět podnikání<\/td>\s*<td[^>]*>([^<]+)<\/td>/i,
      /<td[^>]*>Činnost<\/td>\s*<td[^>]*>([^<]+)<\/td>/i
    ];
    
    let predmetPodnikani: string[] = [];
    for (const pattern of predmetPatterns) {
      const match = html.match(pattern);
      if (match) {
        predmetPodnikani = [match[1].trim()];
        console.log('✅ Found předmět podnikání:', predmetPodnikani[0]);
        break;
      }
    }
    
    // Шукаємо дату запису
    const datumPatterns = [
      /Datum zápisu:\s*(\d{1,2}\.\d{1,2}\.\d{4})/i,
      /Zapsáno dne:\s*(\d{1,2}\.\d{1,2}\.\d{4})/i,
      /Datum vzniku:\s*(\d{1,2}\.\d{1,2}\.\d{4})/i,
      /<td[^>]*>Datum zápisu<\/td>\s*<td[^>]*>(\d{1,2}\.\d{1,2}\.\d{4})<\/td>/i
    ];
    
    let datumZapisu = '';
    for (const pattern of datumPatterns) {
      const match = html.match(pattern);
      if (match) {
        datumZapisu = match[1];
        console.log('✅ Found datum zápisu:', datumZapisu);
        break;
      }
    }
    
    // Шукаємо стан
    const stavPatterns = [
      /Stav:\s*([^<\n\r]+)/i,
      /Status:\s*([^<\n\r]+)/i,
      /Aktivní:\s*([^<\n\r]+)/i,
      /<td[^>]*>Stav<\/td>\s*<td[^>]*>([^<]+)<\/td>/i
    ];
    
    let stav = 'Neuvedeno';
    for (const pattern of stavPatterns) {
      const match = html.match(pattern);
      if (match) {
        stav = match[1].trim();
        console.log('✅ Found stav:', stav);
        break;
      }
    }
    
    // Перевіряємо, чи знайшли хоча б базові дані
    if (typZivnosti === 'Neuvedeno' && predmetPodnikani.length === 0) {
      console.warn('⚠️ No valid živnost data found in HTML');
      return null;
    }
    
    const result = {
      typZivnosti,
      predmetPodnikani,
      datumZapisu,
      stav
    };
    
    console.log('✅ Parsed živnost data:', result);
    return result;
    
  } catch (error) {
    console.error('❌ HTML parsing error:', error);
    return null;
  }
}

/**
 * Визначає тип живності на основі даних з реєстру згідно з пріоритетами
 */
export function determineZivnostType(zivnostData: ZivnostData): string {
  const predmetText = zivnostData.predmetPodnikani.join(' ').toLowerCase();
  const typText = zivnostData.typZivnosti.toLowerCase();
  
  // Правило 1 (Найвищий пріоритет): Реміснича живність (80%)
  if (typText.includes('řemeslná') || typText.includes('remeslna') || 
      typText.includes('řemeslné') || typText.includes('remeslne') ||
      predmetText.includes('řemeslná') || predmetText.includes('remeslna') ||
      predmetText.includes('řemeslné') || predmetText.includes('remeslne') ||
      predmetText.includes('řemeslo') || predmetText.includes('remeslo')) {
    return 'Řemeslnická živnost (80%)';
  }
  
  // Правило 2 (Середній пріоритет): Вільна або регульована живність (60%)
  if (typText.includes('volná') || typText.includes('vázaná') || 
      typText.includes('volna') || typText.includes('vazana') ||
      typText.includes('volné') || typText.includes('vázané') ||
      predmetText.includes('výroba') || predmetText.includes('obchod') || 
      predmetText.includes('služby') || predmetText.includes('sluzby') ||
      predmetText.includes('prodej') || predmetText.includes('prodej') ||
      predmetText.includes('poradenství') || predmetText.includes('poradenstvi')) {
    return 'Volná / Vázaná živnost (60%)';
  }
  
  // Правило 3 (Резервний варіант): Якщо не знайдено жодного типу
  return 'Nedefinováno';
}