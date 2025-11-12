/**
 * Web Scraper for Czech Tax System Official Sources
 * Downloads and processes documents from government websites
 */

import { KBDocument, ScraperConfig, KBMetadata, DocumentType } from './types';
import { OFFICIAL_SOURCES, CATEGORY_KEYWORDS } from './constants';
import { chunkText } from './chunker';
import { generateEmbeddingsBatch } from './embeddings';
import { saveKBDocument, saveKBChunksBatch } from './firestore';

/**
 * Scrape a single URL
 */
async function scrapeUrl(url: string, config: ScraperConfig): Promise<string> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Simple HTML parsing (in production, use cheerio or similar)
    // For now, extract text content
    const text = extractTextFromHtml(html, config);
    
    return text;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    throw error;
  }
}

/**
 * Extract text from HTML
 * (Simplified version - in production use cheerio or puppeteer)
 */
function extractTextFromHtml(html: string, config: ScraperConfig): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

/**
 * Classify document category based on content
 */
function classifyCategory(content: string, url: string): KBMetadata['category'] {
  const lowerContent = content.toLowerCase();
  
  // Check URL first
  if (url.includes('dan-z-prijmu') || url.includes('income-tax')) {
    return 'dan_z_prijmu';
  }
  if (url.includes('dph') || url.includes('vat')) {
    return 'dph';
  }
  if (url.includes('socialni') || url.includes('cssz')) {
    return 'socialni_pojisteni';
  }
  if (url.includes('zdravotni')) {
    return 'zdravotni_pojisteni';
  }
  if (url.includes('pausalni')) {
    return 'pausalni_dan';
  }
  
  // Check content keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matchCount = keywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount >= 2) {
      return category as KBMetadata['category'];
    }
  }
  
  return 'other';
}

/**
 * Determine document type
 */
function determineDocumentType(url: string, content: string): DocumentType {
  if (url.includes('zakon') || url.includes('/sb/')) {
    return 'law';
  }
  if (url.includes('formular') || url.includes('tiskopis')) {
    return 'form';
  }
  if (url.includes('pokyn') || url.includes('guideline')) {
    return 'guideline';
  }
  if (url.includes('faq') || content.includes('Často kladené otázky')) {
    return 'faq';
  }
  if (url.includes('manual') || url.includes('prirucka')) {
    return 'manual';
  }
  
  return 'article';
}

/**
 * Scrape and process a source
 */
export async function scrapeSingleSource(
  sourceKey: string,
  onProgress?: (status: string) => void
): Promise<number> {
  const config = OFFICIAL_SOURCES[sourceKey];
  
  if (!config) {
    throw new Error(`Unknown source: ${sourceKey}`);
  }
  
  onProgress?.(`Starting scrape of ${sourceKey}...`);
  
  let documentsProcessed = 0;
  
  for (const path of config.paths) {
    const url = config.baseUrl + path;
    
    try {
      onProgress?.(`Scraping: ${url}`);
      
      // Rate limiting
      await new Promise(resolve => 
        setTimeout(resolve, 1000 / config.rateLimit)
      );
      
      // Scrape content
      const content = await scrapeUrl(url, config);
      
      if (content.length < 100) {
        console.warn(`Skipping ${url} - content too short`);
        continue;
      }
      
      // Create document
      const documentId = `${sourceKey}_${Date.now()}_${documentsProcessed}`;
      
      const metadata: KBMetadata = {
        category: classifyCategory(content, url),
        language: 'cs',
        tags: [],
        year: new Date().getFullYear(),
        documentType: determineDocumentType(url, content),
      };
      
      const document: KBDocument = {
        id: documentId,
        title: extractTitle(content) || path,
        source: config.source,
        url,
        content,
        metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Save document
      await saveKBDocument(document);
      
      onProgress?.(`Processing chunks for: ${document.title}`);
      
      // Create chunks
      const chunks = chunkText(content, documentId);
      
      // Generate embeddings
      const texts = chunks.map(c => c.content);
      const embeddings = await generateEmbeddingsBatch(texts);
      
      // Add embeddings to chunks
      chunks.forEach((chunk, i) => {
        chunk.embedding = embeddings[i].embedding;
      });
      
      // Save chunks
      await saveKBChunksBatch(chunks);
      
      onProgress?.(`✓ Processed: ${document.title} (${chunks.length} chunks)`);
      
      documentsProcessed++;
    } catch (error) {
      console.error(`Error processing ${url}:`, error);
      onProgress?.(`✗ Error: ${url}`);
    }
  }
  
  onProgress?.(`Completed ${sourceKey}: ${documentsProcessed} documents`);
  
  return documentsProcessed;
}

/**
 * Extract title from content
 */
function extractTitle(content: string): string {
  // Simple title extraction - get first meaningful line
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  
  for (const line of lines) {
    if (line.length > 10 && line.length < 200) {
      return line.trim();
    }
  }
  
  return 'Untitled Document';
}

/**
 * Scrape all sources
 */
export async function scrapeAllSources(
  onProgress?: (status: string) => void
): Promise<Record<string, number>> {
  const results: Record<string, number> = {};
  
  onProgress?.('Starting full KB scrape...');
  
  for (const sourceKey of Object.keys(OFFICIAL_SOURCES)) {
    try {
      const count = await scrapeSingleSource(sourceKey, onProgress);
      results[sourceKey] = count;
    } catch (error) {
      console.error(`Failed to scrape ${sourceKey}:`, error);
      results[sourceKey] = 0;
    }
  }
  
  onProgress?.('Scraping completed!');
  
  return results;
}


