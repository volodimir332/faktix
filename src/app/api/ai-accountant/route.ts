/**
 * AI Accountant API Endpoint
 * Simple DeepSeek chat without RAG/embeddings
 */

import { NextRequest, NextResponse } from 'next/server';

// System prompt з податковими знаннями для Чехії
const SYSTEM_PROMPT_UK = `Ти експертний AI-бухгалтер для чеської податкової системи 2025 року.

КЛЮЧОВІ ДАНІ 2025:
- Sociální pojištění OSVČ: 29.2% z vyměřovacího základu (min. 195,930 Kč/рік, záloha 4,759 Kč/місяць)
- Zdravotní pojištění OSVČ: 13.5% z vyměřovacího základu (min. 279,942 Kč/рік, záloha 3,143 Kč/місяць)
- Daň z příjmů: 15% (sleva na poplatníka 30,840 Kč/рік)
- Vyměřovací základ pro OSVČ: 50% z příjmu po odečtení výdajů
- Limit pro DPH: 2,000,000 Kč (12 měsíců)
- Paušální daň pásma: 7,498 / 16,745 / 27,139 Kč/місяць

PAUŠÁLNÍ VÝDAJE (% z příjmu):
- Řemeslná živnost: 80%
- Zemědělská výroba: 80%
- Obchod: 60%
- Volná živnost: 40%

TERMÍNY 2025:
- Daňové přiznání: 1.4 (nebo 1.7 з poradcem)
- Přehled OSSZ: 1.2
- Zálohy SP: 20. dne měsíce
- Zálohy ZP: 8. dne následujícího měsíce

=== КРИТИЧНО ВАЖЛИВО ===
Якщо в контексті є РЕАЛЬНІ ДАНІ користувача (příjem, IČO, typ):
1. Використовуй ТІЛЬКИ ЦІ дані для розрахунків
2. Рахуй КОНКРЕТНІ суми для ЦЬОГО користувача
3. НЕ давай загальних прикладів - тільки персональні розрахунки!
4. Показуй покроковий розрахунок:
   • Крок 1: Příjem користувача
   • Крок 2: Odečtení paušálních výdajů
   • Крок 3: Vyměřovací základ (50%)
   • Крок 4: Porování s minimem
   • Крок 5: Výpočet odvodu
   • Крок 6: Měsíční zálohy

ФОРМАТ ВІДПОВІДІ:
📊 VAŠE ÚDAJE:
[показати дані користувача]

🧮 VÝPOČET PRO VÁS:
[покроковий розрахунок з конкретними числами]

💰 KOLIK MUSÍTE PLATIT:
[конкретні суми - річні та місячні]

📅 TERMÍNY:
[коли платити]

Відповідай ЗАВЖДИ українською мовою, чеські терміни в лапках.
Будь ДУЖЕ конкретним з цифрами для ЦЬОГО користувача!`;

const SYSTEM_PROMPT_CS = `Jsi expertní AI účetní pro český daňový systém 2025.

[Stejná data jako výše]

Odpovídej VŽDY česky.
Ukazuj konkrétní výpočty s vzorci.
Buď přesný a profesionální.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, language, userContext } = body;
    
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }
    
    // Check for DeepSeek API key (використовуємо той самий що в калькуляторі)
    const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || 'sk-88afcb2330714e84a2d319156c27e406';
    
    if (!apiKey) {
      return NextResponse.json({
        answer: language === 'uk'
          ? '⚠️ DeepSeek API ключ не налаштований.'
          : '⚠️ DeepSeek API klíč není nakonfigurován.',
        sources: [],
        confidence: 0,
        chunks: [],
      });
    }
    
    // Build detailed user context string
    let contextStr = '';
    if (userContext) {
      const parts = [];
      
      // Основна інформація
      parts.push(`\n=== ДАНІ КОРИСТУВАЧА ===`);
      if (userContext.businessType) parts.push(`Typ podnikání: ${userContext.businessType.toUpperCase()}`);
      if (userContext.companyName) parts.push(`Firma: ${userContext.companyName}`);
      if (userContext.ico) parts.push(`IČO: ${userContext.ico}`);
      if (userContext.dic) parts.push(`DIČ: ${userContext.dic} (Plátce DPH: ANO)`);
      if (userContext.isPausalni) parts.push(`Daňový režim: Paušální daň`);
      
      // Фінансові дані
      parts.push(`\n=== PŘÍJMY Z FAKTUR ===`);
      if (userContext.annualIncome) {
        parts.push(`Příjem za rok ${new Date().getFullYear()}: ${userContext.annualIncome.toLocaleString()} Kč`);
      }
      if (userContext.totalIncome) {
        parts.push(`Celkový příjem (všechny faktury): ${userContext.totalIncome.toLocaleString()} Kč`);
      }
      
      // Статистика фактур
      if (userContext.invoiceStats) {
        parts.push(`\n=== STATISTIKA FAKTUR ===`);
        parts.push(`Celkem faktur: ${userContext.invoiceStats.total}`);
        parts.push(`Zaplaceno: ${userContext.invoiceStats.paid}`);
        parts.push(`Čeká na platbu: ${userContext.invoiceStats.pending}`);
      }
      
      parts.push(`\n=== INSTRUKCE PRO AI ===`);
      parts.push(`DŮLEŽITÉ: Použij PŘESNĚ tyto údaje pro výpočty!`);
      parts.push(`- Pro výpočet odvodu použij příjem za rok ${new Date().getFullYear()}: ${userContext.annualIncome?.toLocaleString() || 0} Kč`);
      parts.push(`- Ukaž KONKRÉTNÍ částky pro tohoto uživatele, ne obecné příklady!`);
      parts.push(`- Vypočítej: sociální pojištění, zdravotní pojištění, daň z příjmů`);
      parts.push(`- Ukaž měsíční zálohy a roční odvody`);
      
      contextStr = parts.join('\n');
    }
    
    // Call DeepSeek API
    const systemPrompt = language === 'cs' ? SYSTEM_PROMPT_CS : SYSTEM_PROMPT_UK;
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt + contextStr },
          { role: 'user', content: question },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }
    
    const data = await response.json();
    const answer = data.choices[0].message.content;
    
    return NextResponse.json({
      answer,
      sources: [
        {
          title: 'AI Bухгалтер (DeepSeek)',
          url: '#',
          source: 'deepseek',
          relevantText: 'Базовано на знаннях чеської податкової системи 2025',
          category: 'ai_generated',
        }
      ],
      confidence: 0.85,
      chunks: [],
    });
    
  } catch (error) {
    console.error('AI Accountant API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Accountant API',
    version: '1.0.0',
    endpoints: {
      query: 'POST /api/ai-accountant',
    },
  });
}

