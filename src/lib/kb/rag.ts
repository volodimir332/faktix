/**
 * RAG (Retrieval Augmented Generation) System
 * For AI Accountant with DeepSeek/OpenAI
 */

import { KBQuery, KBQueryResult, UserContext, KBSource, KBCategory } from './types';
import { generateEmbedding } from './embeddings';
import { searchSimilarChunks } from './firestore';
import { AI_ACCOUNTANT_SYSTEM_PROMPT, RAG_CONFIG } from './constants';

/**
 * Process user query with RAG
 */
export async function processQuery(query: KBQuery): Promise<KBQueryResult> {
  try {
    // 1. Generate embedding for user question
    const { embedding: queryEmbedding } = await generateEmbedding(query.question);
    
    // 2. Retrieve similar chunks from KB
    const similarChunks = await searchSimilarChunks(
      queryEmbedding,
      RAG_CONFIG.maxRetrievedChunks,
      query.categories
    );
    
    // Filter by minimum similarity score
    const relevantChunks = similarChunks.filter(
      chunk => chunk.similarity >= RAG_CONFIG.minSimilarityScore
    );
    
    if (relevantChunks.length === 0) {
      return {
        answer: query.language === 'uk' 
          ? 'Вибачте, не знайшов відповідної інформації в базі знань. Спробуйте переформулювати питання або зверніться до офіційних джерел: https://financnisprava.gov.cz'
          : 'Omlouváme se, nenašel jsem relevantní informace v databázi znalostí. Zkuste přeformulovat otázku nebo se obraťte na oficiální zdroje: https://financnisprava.gov.cz',
        sources: [],
        confidence: 0,
        chunks: [],
      };
    }
    
    // 3. Build context from retrieved chunks
    const context = buildContext(relevantChunks.map(c => c.content));
    
    // 4. Build user context string
    const userContextStr = buildUserContext(query.userContext);
    
    // 5. Generate answer using AI
    const answer = await generateAnswer(
      query.question,
      context,
      userContextStr,
      query.language || 'uk'
    );
    
    // 6. Extract sources
    const sources = extractSources(relevantChunks);
    
    // 7. Calculate confidence based on similarity scores
    const confidence = calculateConfidence(relevantChunks.map(c => c.similarity));
    
    return {
      answer,
      sources,
      confidence,
      chunks: relevantChunks.map(({ similarity, ...chunk }) => chunk),
    };
  } catch (error) {
    console.error('Error processing query:', error);
    throw error;
  }
}

/**
 * Build context string from chunks
 */
function buildContext(chunks: string[]): string {
  return chunks
    .map((chunk, i) => `[Документ ${i + 1}]\n${chunk}`)
    .join('\n\n---\n\n');
}

/**
 * Build user context string
 */
function buildUserContext(userContext?: UserContext): string {
  if (!userContext) return 'Користувач: тип бізнесу невідомий';
  
  const parts: string[] = [];
  
  parts.push(`Тип бізнесу: ${userContext.businessType.toUpperCase()}`);
  
  if (userContext.ico) parts.push(`IČO: ${userContext.ico}`);
  if (userContext.dic) parts.push(`DIČ: ${userContext.dic} (плátce DPH)`);
  if (userContext.annualIncome) {
    parts.push(`Річний дохід: ${userContext.annualIncome.toLocaleString()} Kč`);
  }
  if (userContext.isPausalni) parts.push('Режим: Paušální daň');
  
  return parts.join(' | ');
}

/**
 * Generate answer using AI (DeepSeek or OpenAI)
 */
async function generateAnswer(
  question: string,
  context: string,
  userContext: string,
  language: 'cs' | 'uk'
): Promise<string> {
  // Try DeepSeek first, fallback to OpenAI
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!deepseekKey && !openaiKey) {
    throw new Error('No AI API key found (DEEPSEEK_API_KEY or OPENAI_API_KEY)');
  }
  
  const systemPrompt = AI_ACCOUNTANT_SYSTEM_PROMPT
    .replace('{userContext}', userContext)
    .replace('{retrievedContext}', context);
  
  const languageInstruction = language === 'uk'
    ? '\nВідповідай українською мовою, використовуючи чеські терміни де потрібно.'
    : '\nOdpovídej česky.';
  
  try {
    // Try DeepSeek
    if (deepseekKey) {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt + languageInstruction },
            { role: 'user', content: question },
          ],
          temperature: RAG_CONFIG.temperature,
          max_tokens: 1000,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      }
    }
    
    // Fallback to OpenAI
    if (openaiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt + languageInstruction },
            { role: 'user', content: question },
          ],
          temperature: RAG_CONFIG.temperature,
          max_tokens: 1000,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    }
    
    throw new Error('No AI service available');
  } catch (error) {
    console.error('Error generating answer:', error);
    throw error;
  }
}

/**
 * Extract sources from chunks
 */
function extractSources(chunks: Array<{ documentId: string; content: string }>): Array<{ 
  title: string; 
  url: string; 
  source: KBSource; 
  relevantText: string; 
  category: KBCategory;
}> {
  // In real implementation, fetch document metadata
  // For now, return simplified sources
  return chunks.map((chunk, i) => ({
    title: `Dokument ${i + 1}`,
    url: '#',
    source: 'financni_sprava' as KBSource,
    relevantText: chunk.content.slice(0, 200) + '...',
    category: 'dane_obecne' as KBCategory,
  }));
}

/**
 * Calculate confidence score
 */
function calculateConfidence(similarities: number[]): number {
  if (similarities.length === 0) return 0;
  
  // Average of top similarities
  const avgSimilarity = similarities.reduce((sum, s) => sum + s, 0) / similarities.length;
  
  // Confidence: 0-1 scale
  return Math.min(avgSimilarity * 1.2, 1);
}

