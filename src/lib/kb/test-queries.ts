/**
 * Test Queries for AI Accountant
 * Comprehensive set of questions to verify KB quality
 */

export interface TestQuery {
  id: string;
  question_cs: string;
  question_uk: string;
  category: string;
  expectedKeywords: string[];
  minConfidence: number;
}

export const TEST_QUERIES: TestQuery[] = [
  // Sociální pojištění
  {
    id: 'test_001',
    question_cs: 'Jak vypočítat zálohy na sociální pojištění pro OSVČ s ročním příjmem 600 000 Kč?',
    question_uk: 'Як порахувати авансові платежі на соціальне страхування для OSVČ з річним доходом 600 000 Kč?',
    category: 'socialni_pojisteni',
    expectedKeywords: ['29.2%', 'vyměřovací základ', 'minimální záloha', '50%', 'ČSSZ'],
    minConfidence: 0.8,
  },
  
  // Zdravotní pojištění
  {
    id: 'test_002',
    question_cs: 'Jaká je minimální měsíční záloha na zdravotní pojištění v roce 2025?',
    question_uk: 'Який мінімальний місячний авансовий платіж на медичне страхування у 2025 році?',
    category: 'zdravotni_pojisteni',
    expectedKeywords: ['3 143 Kč', '13.5%', 'minimální základ'],
    minConfidence: 0.85,
  },
  
  // Daň z příjmů
  {
    id: 'test_003',
    question_cs: 'Jaké jsou termíny podání daňového přiznání k dani z příjmů za rok 2024?',
    question_uk: 'Які терміни подання податкової декларації з податку на прибуток за 2024 рік?',
    category: 'dan_z_prijmu',
    expectedKeywords: ['1. dubna', 'daňový poradce', '1. července'],
    minConfidence: 0.9,
  },
  
  // Paušální výdaje
  {
    id: 'test_004',
    question_cs: 'Jaké paušální výdaje mohu uplatnit jako řemeslník OSVČ?',
    question_uk: 'Які паушальні витрати я можу застосувати як ремісник OSVČ?',
    category: 'dan_z_prijmu',
    expectedKeywords: ['80%', 'řemeslná živnost', 'paušální výdaje'],
    minConfidence: 0.85,
  },
  
  // DPH registrace
  {
    id: 'test_005',
    question_cs: 'Kdy se musím povinně registrovat k DPH?',
    question_uk: 'Коли я маю обов\'язково зареєструватися на ПДВ?',
    category: 'dph',
    expectedKeywords: ['2 000 000 Kč', '12 po sobě jdoucích měsíců', 'limit'],
    minConfidence: 0.9,
  },
  
  // Paušální daň - základy
  {
    id: 'test_006',
    question_cs: 'Co je to paušální daň a kdo ji může využít?',
    question_uk: 'Що таке паушальний податок і хто може його використовувати?',
    category: 'pausalni_dan',
    expectedKeywords: ['OSVČ', 'limit 2 000 000 Kč', 'zálohy', 'sociální', 'zdravotní'],
    minConfidence: 0.85,
  },
  
  // Paušální daň - částky
  {
    id: 'test_007',
    question_cs: 'Jaké jsou částky paušální daně pro příjmy do 1 milionu korun?',
    question_uk: 'Які суми паушального податку для доходів до 1 мільйона крон?',
    category: 'pausalni_dan',
    expectedKeywords: ['7 498 Kč', 'první pásmo', 'měsíční'],
    minConfidence: 0.85,
  },
  
  // Termíny - DPH
  {
    id: 'test_008',
    question_cs: 'Do kdy musím podat daňové přiznání k DPH za prosinec 2024?',
    question_uk: 'До коли треба подати податкову декларацію з ПДВ за грудень 2024?',
    category: 'terminy',
    expectedKeywords: ['25. ledna', '25. měsíce', 'následující měsíc'],
    minConfidence: 0.85,
  },
  
  // s.r.o. vs OSVČ
  {
    id: 'test_009',
    question_cs: 'Jaký je rozdíl v odvodech mezi OSVČ a jednatellem s.r.o.?',
    question_uk: 'Яка різниця у відрахуваннях між OSVČ та директором s.r.o.?',
    category: 'dane_obecne',
    expectedKeywords: ['zaměstnanec', 'pojistné za zaměstnavatele', 'daň z příjmů', '21%'],
    minConfidence: 0.75,
  },
  
  // Daňová sleva
  {
    id: 'test_010',
    question_cs: 'Jaká je základní daňová sleva na poplatníka v roce 2025?',
    question_uk: 'Яка базова податкова знижка на платника у 2025 році?',
    category: 'dan_z_prijmu',
    expectedKeywords: ['30 840 Kč', 'sleva na poplatníka', 'ročně'],
    minConfidence: 0.9,
  },
  
  // Minimální základ
  {
    id: 'test_011',
    question_cs: 'Jaký je minimální vyměřovací základ pro sociální pojištění OSVČ?',
    question_uk: 'Який мінімальний оцінювальний базис для соціального страхування OSVČ?',
    category: 'socialni_pojisteni',
    expectedKeywords: ['195 930 Kč', 'minimální základ', 'ročně', '50%'],
    minConfidence: 0.85,
  },
  
  // Přehled OSSZ
  {
    id: 'test_012',
    question_cs: 'Do kdy musím podat přehled o příjmech na OSSZ?',
    question_uk: 'До коли треба подати звіт про доходи до ČSSZ?',
    category: 'terminy',
    expectedKeywords: ['1. února', 'přehled', 'následujícího roku'],
    minConfidence: 0.8,
  },
  
  // Limit pro paušální daň
  {
    id: 'test_013',
    question_cs: 'Co se stane když překročím limit 2 000 000 Kč v paušální dani?',
    question_uk: 'Що станеться, якщо я перевищу ліміт 2 000 000 Kč у паушальному податку?',
    category: 'pausalni_dan',
    expectedKeywords: ['výpověď', 'přejít na běžný režim', 'konec zdaňovacího období'],
    minConfidence: 0.75,
  },
  
  // Penále
  {
    id: 'test_014',
    question_cs: 'Jaké penále hrozí za pozdní podání daňového přiznání?',
    question_uk: 'Які штрафи загрожують за запізніле подання податкової декларації?',
    category: 'dane_obecne',
    expectedKeywords: ['pokuta', '0.05%', 'každý den', 'maximálně'],
    minConfidence: 0.7,
  },
  
  // Slevy na děti
  {
    id: 'test_015',
    question_cs: 'Jaká je daňová sleva na vyživované dítě v roce 2025?',
    question_uk: 'Яка податкова знижка на утриманого дитину у 2025 році?',
    category: 'dan_z_prijmu',
    expectedKeywords: ['15 204 Kč', 'první dítě', 'daňový bonus', 'vyživované'],
    minConfidence: 0.85,
  },
  
  // Zálohy termíny
  {
    id: 'test_016',
    question_cs: 'Kdy se platí zálohy na daň z příjmů během roku?',
    question_uk: 'Коли платяться авансові платежі з податку на прибуток протягом року?',
    category: 'terminy',
    expectedKeywords: ['15. června', '15. září', '15. prosince', 'zálohy'],
    minConfidence: 0.8,
  },
  
  // Osvobození
  {
    id: 'test_017',
    question_cs: 'Kdy jsem osvobozený od placení záloh na sociální pojištění?',
    question_uk: 'Коли я звільнений від сплати авансових платежів на соціальне страхування?',
    category: 'socialni_pojisteni',
    expectedKeywords: ['vedlejší činnost', 'hlavní činnost zaměstnanec', 'důchod'],
    minConfidence: 0.75,
  },
  
  // Cestovné
  {
    id: 'test_018',
    question_cs: 'Mohu si jako OSVČ uplatnit cestovné do daňových výdajů?',
    question_uk: 'Чи можу я як OSVČ застосувати витрати на проїзд до податкових витрат?',
    category: 'dan_z_prijmu',
    expectedKeywords: ['skutečné výdaje', 'doložit', 'služební cesta'],
    minConfidence: 0.7,
  },
];

/**
 * Run test query and evaluate response
 */
export interface TestResult {
  testId: string;
  passed: boolean;
  confidence: number;
  foundKeywords: string[];
  missingKeywords: string[];
  responseTime: number;
  error?: string;
}

export function evaluateTestResponse(
  test: TestQuery,
  response: {
    answer: string;
    confidence: number;
  }
): TestResult {
  const lowerAnswer = response.answer.toLowerCase();
  
  const foundKeywords = test.expectedKeywords.filter(keyword =>
    lowerAnswer.includes(keyword.toLowerCase())
  );
  
  const missingKeywords = test.expectedKeywords.filter(keyword =>
    !lowerAnswer.includes(keyword.toLowerCase())
  );
  
  const keywordScore = foundKeywords.length / test.expectedKeywords.length;
  const passed = 
    response.confidence >= test.minConfidence && 
    keywordScore >= 0.5; // At least 50% keywords found
  
  return {
    testId: test.id,
    passed,
    confidence: response.confidence,
    foundKeywords,
    missingKeywords,
    responseTime: 0, // Will be filled by test runner
  };
}


