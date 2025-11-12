/**
 * Manual Knowledge Base Seeding
 * Pre-populated critical tax information for immediate use
 */

import { KBDocument, KBChunk } from './types';

/**
 * Core Czech tax documents - manually curated
 * These are added immediately without scraping
 */
export const MANUAL_KB_DOCUMENTS: Partial<KBDocument>[] = [
  // 1. OSVČ - Sociální pojištění 2025
  {
    title: 'Sociální pojištění OSVČ 2025 - základní informace',
    source: 'manual',
    url: 'https://www.cssz.cz/web/cz/socialni-pojisteni-osvc',
    content: `
Sociální pojištění OSVČ v roce 2025

Sazba pojistného: 29,2 % z vyměřovacího základu

Vyměřovací základ:
- Minimální roční vyměřovací základ: 195 930 Kč (50 % průměrné mzdy)
- Maximální roční vyměřovací základ: není stanoven
- Pro OSVČ jako hlavní činnost: 50 % příjmů po odpočtu výdajů (min. 50 % průměrné mzdy)
- Pro OSVČ jako vedlejší činnost: osvobození od pojistného

Minimální měsíční záloha: 4 759 Kč (od ledna 2025)

Termíny placení záloh:
- Od 1. do 20. dne kalendářního měsíce
- Za prosinec do 20. ledna následujícího roku

Přehled o příjmech a výdajích:
- Podává se do 1. února následujícího roku na OSSZ
- Obsahuje skutečné příjmy a výdaje za uplynulý rok
- Na základě přehledu se určí vyměřovací základ a dopočte případný doplatek
    `,
    metadata: {
      category: 'socialni_pojisteni',
      language: 'cs',
      tags: ['OSVČ', 'zálohy', 'minimální základ', '2025'],
      year: 2025,
      documentType: 'manual',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // 2. Zdravotní pojištění 2025
  {
    title: 'Zdravotní pojištění OSVČ 2025',
    source: 'manual',
    url: 'https://www.cssz.cz/web/cz/zdravotni-pojisteni',
    content: `
Zdravotní pojištění OSVČ v roce 2025

Sazba pojistného: 13,5 % z vyměřovacího základu

Vyměřovací základ:
- Minimální roční vyměřovací základ: 279 942 Kč
- Pro OSVČ: 50 % příjmů po odpočtu výdajů (min. minimální základ)
- Maximální vyměřovací základ: 2 394 840 Kč (72násobek průměrné mzdy)

Minimální měsíční záloha: 3 143 Kč (od ledna 2025)

Termíny placení záloh:
- Od 1. do 8. dne následujícího měsíce (např. za leden platím do 8. února)

Přehled o příjmech:
- Podává se do konce ledna následujícího roku zdravotní pojišťovně
- Na základě přehledu se doplatí nebo vrátí rozdíl
    `,
    metadata: {
      category: 'zdravotni_pojisteni',
      language: 'cs',
      tags: ['OSVČ', 'zdravotní', 'zálohy', '2025'],
      year: 2025,
      documentType: 'manual',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // 3. Daň z příjmů - termíny
  {
    title: 'Termíny podání daňového přiznání 2025',
    source: 'manual',
    url: 'https://financnisprava.gov.cz',
    content: `
Termíny pro podání daňového přiznání k dani z příjmů

Za rok 2024 (podávané v roce 2025):
- 1. dubna 2025 - pro fyzické osoby bez daňového poradce
- 1. července 2025 - pro fyzické osoby zastoupené daňovým poradcem
- 1. července 2025 - pro právnické osoby (s.r.o.)

Zálohy na daň z příjmů:
- 15. června - první záloha
- 15. září - druhá záloha  
- 15. prosince - třetí záloha

Zálohy platí OSVČ s předpokládanou daní nad 30 000 Kč.

Sazba daně:
- 15 % pro fyzické osoby (základní sazba)
- 23 % pro příjmy nad 48násobek průměrné mzdy
- 21 % pro právnické osoby (s.r.o.)

Základní sleva na poplatníka: 30 840 Kč ročně
    `,
    metadata: {
      category: 'dan_z_prijmu',
      language: 'cs',
      tags: ['termíny', 'přiznání', 'zálohy', '2025'],
      year: 2025,
      documentType: 'manual',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // 4. Paušální daň 2025
  {
    title: 'Paušální daň pro OSVČ 2025',
    source: 'manual',
    url: 'https://financnisprava.gov.cz/cs/dane/dane-z-prijmu/informace-stanoviska-sdeleni/pausalni-dan',
    content: `
Paušální daň v roce 2025

Tři pásma podle výše příjmů:

1. První pásmo (do 1 000 000 Kč):
   - Měsíční platba: 7 498 Kč
   - Zahrnuje: daň z příjmů, sociální pojištění, zdravotní pojištění

2. Druhé pásmo (1 000 000 - 1 500 000 Kč):
   - Měsíční platba: 16 745 Kč
   - Zahrnuje: daň z příjmů, sociální pojištění, zdravotní pojištění

3. Třetí pásmo (1 500 000 - 2 000 000 Kč):
   - Měsíční platba: 27 139 Kč
   - Zahrnuje: daň z příjmů, sociální pojištění, zdravotní pojištění

Podmínky:
- Maximální roční příjem: 2 000 000 Kč
- Nelze být plátcem DPH
- Nelze zaměstnávat zaměstnance
- Příjmy pouze ze živnosti nebo z jiné samostatné výdělečné činnosti

Výhody:
- Jednoduchá administrativa
- Pevná měsíční částka
- Není potřeba vést účetnictví

Nevýhody:
- Pevná částka bez ohledu na skutečný příjem
- Limit 2 000 000 Kč
- Nelze uplatnit skutečné výdaje
    `,
    metadata: {
      category: 'pausalni_dan',
      language: 'cs',
      tags: ['paušální daň', 'OSVČ', 'pásma', '2025'],
      year: 2025,
      documentType: 'manual',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // 5. DPH registrace
  {
    title: 'Registrace k DPH - limity a termíny',
    source: 'manual',
    url: 'https://financnisprava.gov.cz/cs/dane/dan-z-pridane-hodnoty',
    content: `
Registrace k DPH v České republice

Povinná registrace:
- Při překročení obratu 2 000 000 Kč za 12 po sobě jdoucích měsíců
- Registrační povinnost vzniká prvním dnem druhého měsíce po překročení
- Příklad: Překročení v březnu → registrace od 1. května

Dobrovolná registrace:
- Možná kdykoliv, bez ohledu na výši obratu
- Výhodné při nákupu drahého majetku nebo při prodeji do EU

Sazby DPH 2025:
- Základní sazba: 21 %
- První snížená sazba: 12 %
- Druhá snížená sazba: 0 %

Termíny podání přiznání:
- Měsíční plátce: do 25. dne následujícího měsíce
- Čtvrtletní plátce: do 25. dne měsíce následujícího po skončení čtvrtletí
- Roční plátce: do 25. ledna následujícího roku

Daňové přiznání k DPH se podává výhradně elektronicky.
    `,
    metadata: {
      category: 'dph',
      language: 'cs',
      tags: ['DPH', 'registrace', 'limit', 'sazby', '2025'],
      year: 2025,
      documentType: 'manual',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // 6. Paušální výdaje
  {
    title: 'Paušální výdaje pro OSVČ 2025',
    source: 'manual',
    url: 'https://financnisprava.gov.cz',
    content: `
Paušální výdaje podle druhu činnosti

1. Řemeslná živnost: 80 %
   - Příklady: zedník, elektrikář, instalatér, truhlář, automechanik

2. Zemědělská výroba: 80 %
   - Příklady: pěstování rostlin, chov hospodářských zvířat

3. Obchodní činnost: 60 %
   - Příklady: maloobchod, velkoobchod, zprostředkování

4. Ostatní samostatná výdělečná činnost: 60 %
   - Příklady: spisovatelé, umělci, sportovci

5. Volné živnosti: 40 %
   - Příklady: poradenství, programátoři, překladatelé, grafici

Maximální limit paušálních výdajů: 2 000 000 Kč

Kombinace:
- Pokud má OSVČ více druhů činností, uplatňuje paušální výdaje podle převažující činnosti
- Nebo lze uplatnit skutečné výdaje

Výhody paušálních výdajů:
- Není potřeba prokazovat výdaje účtenkami
- Jednoduchá evidence
- Snížení administrativy
    `,
    metadata: {
      category: 'dan_z_prijmu',
      language: 'cs',
      tags: ['paušální výdaje', 'OSVČ', 'procenta', '2025'],
      year: 2025,
      documentType: 'manual',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Get manual documents ready for Firestore
 */
export function getManualDocuments(): KBDocument[] {
  return MANUAL_KB_DOCUMENTS.map((doc, index) => ({
    id: `manual_${index + 1}`,
    title: doc.title || 'Untitled',
    source: 'manual',
    url: doc.url || '#',
    content: doc.content || '',
    metadata: doc.metadata || {
      category: 'other',
      language: 'cs',
      tags: [],
      year: 2025,
      documentType: 'manual',
    },
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  }));
}


