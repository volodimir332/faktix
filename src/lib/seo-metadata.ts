/**
 * SEO-оптимізовані метатеги для всіх сторінок
 * 
 * Ключові слова для просування:
 * - фактури (faktury)
 * - калькуляції (kalkulace)
 * - рахунки (účty)
 * - фактурування (fakturace)
 * - бухгалтерія (účetnictví)
 * - OSVČ
 * - s.r.o.
 * - живностник (živnostník)
 */

import { Metadata } from 'next'

const BASE_URL = 'https://faktix.cz'
const SITE_NAME = 'Faktix'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

// Головна сторінка
export const homeMetadata: Metadata = {
  title: 'Faktix - Fakturace za 30 sekund | Online systém pro OSVČ a s.r.o.',
  description: 'Vytvořte fakturu online za méně než minutu! Profesionální fakturační systém pro živnostníky, OSVČ a s.r.o. ✓ Zdarma ✓ Kalkulace daní ✓ Paušální daň ✓ Analytiky',
  keywords: [
    // Top ČESKÉ klíčová slova (nejvyšší objem vyhledávání)
    'faktury online', 'vystavit fakturu', 'fakturace zdarma', 'vystavení faktury', 'faktury online zdarma',
    'faktury OSVČ', 'faktury s.r.o.', 'faktury živnostník', 'faktura OSVČ vzor', 'online fakturace bez registrace',
    'fakturační systém', 'fakturační program', 'fakturační software', 'nejlepší fakturační systém',
    
    // Kalkulace ČESKY
    'kalkulace daní', 'kalkulace daní OSVČ', 'kalkulačka daní', 'výpočet daní OSVČ', 'daňová kalkulačka',
    'paušální daň', 'paušální daň kalkulačka', 'paušální daň 2025', 'kalkulace paušální daně',
    'kalkulace ceny', 'cenová kalkulace', 'výpočet ceny', 'kalkulace nákladů',
    
    // Účetnictví ČESKY
    'účetnictví online', 'živnostenské faktury', 'faktury čeština', 'faktury pdf', 'faktury ČR',
    'sociální pojištění OSVČ', 'zdravotní pojištění OSVČ', 'daňové přiznání OSVČ',
    
    // Long-tail ČESKY
    'jak vystavit fakturu', 'jak dělat faktury', 'vytvořit fakturu online', 'faktury pro živnostníky',
    'nabídky a faktury', 'proforma faktura', 'dodací list a faktura', 'CRM pro OSVČ',
    
    // УКРАЇНСЬКІ ключові слова
    'рахунки онлайн', 'виписати рахунок', 'безкоштовні рахунки', 'рахунки для ФОП',
    'калькулятор податків', 'бухгалтерія онлайн', 'створити рахунок', 'рахунки українською'
  ],
  authors: [{ name: 'Faktix Team' }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    alternateLocale: ['uk_UA', 'en_US'],
    url: BASE_URL,
    siteName: SITE_NAME,
    title: 'Faktix - Nejrychlejší fakturace pro OSVČ a firmy',
    description: 'Vytvořte profesionální fakturu za 30 sekund. Zdarma. Bez registrace. S automatickými daňovými kalkulacemi.',
    images: [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Faktix - Moderní fakturační systém',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faktix - Fakturace za 30 sekund',
    description: 'Profesionální faktury pro OSVČ a s.r.o. Zdarma. Kalkulace daní. Paušální daň.',
    images: [DEFAULT_IMAGE],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'cs-CZ': BASE_URL,
      'uk-UA': `${BASE_URL}?lang=uk`,
      'en-US': `${BASE_URL}?lang=en`,
    },
  },
}

// Stránka faktur
export const invoicesMetadata: Metadata = {
  title: 'Faktury Online - Vytvořte fakturu za 30 sekund | Faktix',
  description: 'Rychlé vystavení faktur online pro OSVČ a s.r.o. ✓ Automatické číslování ✓ PDF export ✓ Správa klientů ✓ Historie faktur ✓ Zdarma',
  keywords: [
    'vystavit fakturu',
    'faktury online',
    'vytvořit fakturu zdarma',
    'faktury OSVČ',
    'faktury s.r.o.',
    'faktury živnostník',
    'faktury pdf',
    'fakturační program',
    'online faktury',
    'nová faktura'
  ],
  openGraph: {
    title: 'Vytvořte fakturu online za 30 sekund - Faktix',
    description: 'Profesionální faktury s automatickým číslováním a PDF exportem',
    url: `${BASE_URL}/faktury`,
  },
  alternates: {
    canonical: `${BASE_URL}/faktury`,
  },
}

// Stránka kalkulací
export const calculationsMetadata: Metadata = {
  title: 'Kalkulace daní a pojištění pro OSVČ 2025 | Paušální daň | Faktix',
  description: 'Online kalkulačka daní pro OSVČ a živnostníky v ČR. ✓ Paušální daň ✓ Standardní režim ✓ Sociální pojištění ✓ Zdravotní pojištění ✓ Aktuální sazby 2025',
  keywords: [
    'kalkulace daní OSVČ',
    'paušální daň kalkulačka',
    'kalkulačka daní živnostník',
    'výpočet daní OSVČ 2025',
    'sociální pojištění OSVČ',
    'zdravotní pojištění OSVČ',
    'daňová kalkulačka',
    'kalkulace paušální daně',
    'měsíční platby OSVČ',
    'daňové přiznání OSVČ'
  ],
  openGraph: {
    title: 'Kalkulace daní a pojištění OSVČ 2025 - Faktix',
    description: 'Přesná kalkulačka daní pro OSVČ. Paušální daň i standardní režim.',
    url: `${BASE_URL}/kalkulace`,
  },
  alternates: {
    canonical: `${BASE_URL}/kalkulace`,
  },
}

// Stránka analytik
export const analyticsMetadata: Metadata = {
  title: 'Analýza financí pro OSVČ a s.r.o. | Daňové reporty | Faktix',
  description: 'Pokročilá finanční analýza pro živnostníky. ✓ Přehled příjmů ✓ Daňové reporty ✓ Limity DPH ✓ Měsíční platby ✓ Predikce daní',
  keywords: [
    'finanční analýza OSVČ',
    'reporty pro živnostníky',
    'daňové reporty',
    'analýza příjmů',
    'přehled financí OSVČ',
    'reporting pro OSVČ',
    'statistiky faktur',
    'business intelligence OSVČ'
  ],
  openGraph: {
    title: 'Finanční analýzy a reporty pro OSVČ - Faktix',
    description: 'Detailní přehled vašich financí, daní a plateb',
    url: `${BASE_URL}/analytiky`,
  },
  alternates: {
    canonical: `${BASE_URL}/analytiky`,
  },
}

// Stránka klientů
export const clientsMetadata: Metadata = {
  title: 'Správa klientů a kontaktů pro firmy | CRM systém | Faktix',
  description: 'Jednoduché CRM pro správu klientů a obchodních kontaktů. ✓ Historie faktur ✓ Kontaktní údaje ✓ Poznámky ✓ Export dat',
  keywords: [
    'správa klientů',
    'CRM pro OSVČ',
    'databáze klientů',
    'kontakty firmy',
    'zákaznická databáze',
    'CRM systém zdarma',
    'správa kontaktů'
  ],
  openGraph: {
    title: 'CRM a správa klientů - Faktix',
    description: 'Mějte přehled o všech svých klientech a fakturách',
    url: `${BASE_URL}/klienti`,
  },
  alternates: {
    canonical: `${BASE_URL}/klienti`,
  },
}

// Stránka ceníku
export const pricingMetadata: Metadata = {
  title: 'Ceník fakturačního systému | Od 0 Kč | Faktix',
  description: 'Transparentní ceny fakturačního systému pro OSVČ a s.r.o. ✓ Bezplatný Starter plán ✓ Bez skrytých poplatků ✓ Zrušit kdykoliv ✓ Od 229 Kč/měsíc',
  keywords: [
    'ceník fakturace',
    'cena fakturačního systému',
    'faktury zdarma',
    'fakturace cena',
    'kolik stojí faktury',
    'bezplatná fakturace',
    'pricing faktury'
  ],
  openGraph: {
    title: 'Ceník - Od 0 Kč měsíčně - Faktix',
    description: 'Začněte zdarma. Placené plány od 229 Kč/měsíc.',
    url: `${BASE_URL}/pricing`,
  },
  alternates: {
    canonical: `${BASE_URL}/pricing`,
  },
}

// Stránka registrace
export const registerMetadata: Metadata = {
  title: 'Registrace zdarma | Začněte fakturovat za 2 minuty | Faktix',
  description: 'Vytvořte si účet zdarma a začněte fakturovat. ✓ Žádná kreditní karta ✓ Bez závazků ✓ Aktivace okamžitá ✓ První měsíc zdarma',
  keywords: [
    'registrace faktury',
    'vytvořit účet',
    'faktury zdarma',
    'začít fakturovat',
    'registrace OSVČ',
    'fakturační účet'
  ],
  openGraph: {
    title: 'Registrace zdarma - Faktix',
    description: 'Začněte fakturovat za 2 minuty. Žádná kreditní karta.',
    url: `${BASE_URL}/registrace`,
  },
  alternates: {
    canonical: `${BASE_URL}/registrace`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Helper funkce pro generování OG obrázků
export function generateOGImageUrl(title: string, description?: string): string {
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
  })
  return `${BASE_URL}/api/og?${params.toString()}`
}

