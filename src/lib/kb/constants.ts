/**
 * Knowledge Base Constants
 * Official Czech Tax System Sources
 */

import { ScraperConfig } from './types';

/**
 * Primary Official Sources for Czech Tax System
 */
export const OFFICIAL_SOURCES: Record<string, ScraperConfig> = {
  financni_sprava: {
    source: 'financni_sprava',
    baseUrl: 'https://financnisprava.gov.cz',
    paths: [
      '/cs/dane',
      '/cs/dane/dane-z-prijmu',
      '/cs/dane/dan-z-pridane-hodnoty',
      '/cs/elektronicke-sluzby/etax',
      '/cs/dane/dane-z-prijmu/informace-stanoviska-sdeleni/pausalni-dan',
    ],
    selectors: {
      title: 'h1, .page-title',
      content: '.content-main, article',
      exclude: ['nav', 'footer', '.menu', '.breadcrumb'],
    },
    rateLimit: 1,
    retryAttempts: 3,
  },
  
  cssz: {
    source: 'cssz',
    baseUrl: 'https://www.cssz.cz',
    paths: [
      '/web/cz/socialni-pojisteni-osvc',
      '/web/cz/minimalni-vyse-pojistneho',
      '/web/cz/platba-pojistneho',
      '/web/cz/terminy-placeni',
      '/web/cz/prehled-o-vydelecne-cinnosti',
    ],
    selectors: {
      title: 'h1',
      content: '.article-content, .content',
      exclude: ['nav', 'footer', '.sidebar'],
    },
    rateLimit: 1,
    retryAttempts: 3,
  },
  
  mfcr: {
    source: 'mfcr',
    baseUrl: 'https://www.mfcr.cz',
    paths: [
      '/cs/dane-a-ucetnictvi/dane',
      '/cs/dane-a-ucetnictvi/dane/danova-a-celni-statistika',
      '/cs/dane-a-ucetnictvi/ucetnictvi',
    ],
    selectors: {
      title: 'h1',
      content: '.article, .content-main',
      exclude: ['nav', 'footer'],
    },
    rateLimit: 1,
    retryAttempts: 3,
  },
  
  e_sbirka: {
    source: 'e_sbirka',
    baseUrl: 'https://www.e-sbirka.cz',
    paths: [
      // Основні закони ЧР
      '/sb/1992/586', // Zákon o daních z příjmů
      '/sb/2004/235', // Zákon o dani z přidané hodnoty
      '/sb/1991/589', // Zákon o pojistném na sociální zabezpečení
      '/sb/1997/48',  // Zákon o veřejném zdravotním pojištění
    ],
    selectors: {
      title: 'h1, .title',
      content: '.zakon-text, .article-content',
      exclude: ['nav', 'footer'],
    },
    rateLimit: 0.5, // повільніше для законів
    retryAttempts: 3,
  },
};

/**
 * Chunking Configuration
 */
export const CHUNKING_CONFIG = {
  maxTokens: 800,
  overlap: 100,
  strategy: 'semantic' as const,
};

/**
 * Embedding Configuration
 */
export const EMBEDDING_CONFIG = {
  model: 'text-embedding-3-small', // OpenAI model for embeddings
  dimensions: 1536,
  batchSize: 100,
};

/**
 * RAG Configuration
 */
export const RAG_CONFIG = {
  maxRetrievedChunks: 5,
  minSimilarityScore: 0.7,
  maxContextTokens: 3000,
  temperature: 0.3, // низька для точності
};

/**
 * Category Keywords (для класифікації)
 */
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  dan_z_prijmu: [
    'daň z příjmů',
    'daňové přiznání',
    'základ daně',
    'paušální výdaje',
    'daňová sleva',
    'sazba daně',
  ],
  dph: [
    'DPH',
    'daň z přidané hodnoty',
    'plátce DPH',
    'registrace k DPH',
    'daňové přiznání k DPH',
    'limit DPH',
  ],
  socialni_pojisteni: [
    'sociální pojištění',
    'ČSSZ',
    'pojistné',
    'minimální záloha',
    'vyměřovací základ',
    'pojistné OSVČ',
  ],
  zdravotni_pojisteni: [
    'zdravotní pojištění',
    'zdravotní pojišťovna',
    'minimální pojistné',
    'záloha na pojistné',
  ],
  pausalni_dan: [
    'paušální daň',
    'paušál',
    'režim paušální daně',
    'výpověď paušální daně',
  ],
  terminy: [
    'termín',
    'lhůta',
    'deadline',
    'datum splatnosti',
    'daňové přiznání termín',
  ],
  limity: [
    'limit',
    'hranice',
    'maximální částka',
    'registrace limit',
  ],
};

/**
 * Quick Query Templates (готові питання)
 */
export const QUICK_QUERIES_CS = [
  'Jak vypočítat zálohy na sociální pojištění pro OSVČ?',
  'Jaké jsou termíny podání daňového přiznání 2025?',
  'Kdy se musím registrovat k DPH?',
  'Jaký je rozdíl mezi paušální daní a běžným režimem?',
  'Jak vysoké jsou minimální zálohy na pojistné?',
  'Jaké paušální výdaje mohu uplatnit jako řemeslník?',
  'Kdy musím platit zálohy na daň z příjmů?',
  'Jak se liší odvody pro s.r.o. a OSVČ?',
];

export const QUICK_QUERIES_UK = [
  'Як порахувати авансові платежі на соціальне страхування для OSVČ?',
  'Які терміни подання податкової декларації 2025?',
  'Коли треба реєструватися на ПДВ?',
  'Яка різниця між паушальним податком та звичайним режимом?',
  'Які мінімальні авансові платежі на страхування?',
  'Які паушальні витрати я можу застосувати як ремісник?',
  'Коли треба платити авансові платежі з податку на прибуток?',
  'Як відрізняються відрахування для s.r.o. та OSVČ?',
];

/**
 * System Prompt Template for AI Accountant
 */
export const AI_ACCOUNTANT_SYSTEM_PROMPT = `Ти експертний AI-бухгалтер для чеської податкової системи. 

ПРАВИЛА:
1. Відповідай ТІЛЬКИ на основі наданих документів (retrieved context)
2. ЗАВЖДИ включай 1-3 посилання на офіційні джерела
3. Показуй розрахунки, коли це числові питання (формат: "Крок 1: ..., Крок 2: ...")
4. Якщо інформації немає в базі знань, кажи: "Немає у базі знань" і пропонуй офіційне посилання
5. Використовуй українську мову для пояснень, чеську для офіційних термінів
6. Будь точним, конкретним і професійним
7. Враховуй тип бізнесу користувача (OSVČ/s.r.o.)
8. Вказуй актуальність інформації (рік)

ФОРМАТ ВІДПОВІДІ:
- Пряма відповідь на питання
- Розрахунки (якщо потрібно)
- Джерела: [назва документа](посилання)
- Додаткові нюанси (якщо важливі)

КОНТЕКСТ КОРИСТУВАЧА:
{userContext}

ДОКУМЕНТИ З БАЗИ ЗНАНЬ:
{retrievedContext}`;

