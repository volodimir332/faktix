/**
 * Text Chunking for Knowledge Base
 * Splits documents into optimal chunks for embeddings
 */

import { KBChunk, ChunkingConfig } from './types';
import { CHUNKING_CONFIG } from './constants';

/**
 * Simple token counter (approximation)
 * Real implementation would use tiktoken or similar
 */
function countTokens(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters for Czech text
  return Math.ceil(text.length / 4);
}

/**
 * Split text by sentences
 */
function splitIntoSentences(text: string): string[] {
  // Czech sentence splitting - improved regex
  return text
    .split(/(?<=[.!?])\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])/g)
    .filter(s => s.trim().length > 0);
}

/**
 * Split text by paragraphs
 */
function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 0);
}

/**
 * Create chunks with overlap
 */
export function chunkText(
  text: string,
  documentId: string,
  config: ChunkingConfig = CHUNKING_CONFIG
): KBChunk[] {
  const chunks: KBChunk[] = [];
  
  // Очистити текст
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  if (config.strategy === 'paragraph') {
    const paragraphs = splitIntoParagraphs(cleanText);
    return chunkByParagraphs(paragraphs, documentId, config);
  }
  
  if (config.strategy === 'sentence') {
    const sentences = splitIntoSentences(cleanText);
    return chunkBySentences(sentences, documentId, config);
  }
  
  // Default: semantic chunking (by paragraphs with sentence awareness)
  return chunkSemantic(cleanText, documentId, config);
}

/**
 * Chunk by paragraphs
 */
function chunkByParagraphs(
  paragraphs: string[],
  documentId: string,
  config: ChunkingConfig
): KBChunk[] {
  const chunks: KBChunk[] = [];
  let currentChunk = '';
  let position = 0;

  for (const paragraph of paragraphs) {
    const paragraphTokens = countTokens(paragraph);
    const currentTokens = countTokens(currentChunk);

    if (currentTokens + paragraphTokens > config.maxTokens && currentChunk) {
      // Зберегти поточний chunk
      chunks.push({
        id: `${documentId}_chunk_${position}`,
        documentId,
        content: currentChunk.trim(),
        position,
        tokenCount: currentTokens,
        metadata: {},
      });
      
      position++;
      
      // Overlap: включити частину попереднього chunk
      if (config.overlap > 0) {
        const sentences = splitIntoSentences(currentChunk);
        const overlapSentences = sentences.slice(-2); // останні 2 речення
        currentChunk = overlapSentences.join(' ') + ' ' + paragraph;
      } else {
        currentChunk = paragraph;
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }

  // Додати останній chunk
  if (currentChunk.trim()) {
    chunks.push({
      id: `${documentId}_chunk_${position}`,
      documentId,
      content: currentChunk.trim(),
      position,
      tokenCount: countTokens(currentChunk),
      metadata: {},
    });
  }

  return chunks;
}

/**
 * Chunk by sentences
 */
function chunkBySentences(
  sentences: string[],
  documentId: string,
  config: ChunkingConfig
): KBChunk[] {
  const chunks: KBChunk[] = [];
  let currentChunk: string[] = [];
  let currentTokens = 0;
  let position = 0;

  for (const sentence of sentences) {
    const sentenceTokens = countTokens(sentence);

    if (currentTokens + sentenceTokens > config.maxTokens && currentChunk.length > 0) {
      // Зберегти поточний chunk
      chunks.push({
        id: `${documentId}_chunk_${position}`,
        documentId,
        content: currentChunk.join(' '),
        position,
        tokenCount: currentTokens,
        metadata: {},
      });
      
      position++;
      
      // Overlap: включити останні речення
      if (config.overlap > 0) {
        const overlapCount = Math.ceil(config.overlap / 100);
        currentChunk = currentChunk.slice(-overlapCount);
        currentTokens = currentChunk.reduce((sum, s) => sum + countTokens(s), 0);
      } else {
        currentChunk = [];
        currentTokens = 0;
      }
    }

    currentChunk.push(sentence);
    currentTokens += sentenceTokens;
  }

  // Додати останній chunk
  if (currentChunk.length > 0) {
    chunks.push({
      id: `${documentId}_chunk_${position}`,
      documentId,
      content: currentChunk.join(' '),
      position,
      tokenCount: currentTokens,
      metadata: {},
    });
  }

  return chunks;
}

/**
 * Semantic chunking (advanced)
 * Combines paragraph and sentence awareness
 */
function chunkSemantic(
  text: string,
  documentId: string,
  config: ChunkingConfig
): KBChunk[] {
  const paragraphs = splitIntoParagraphs(text);
  return chunkByParagraphs(paragraphs, documentId, config);
}

/**
 * Extract keywords from chunk (simple TF approach)
 */
export function extractKeywords(text: string, topN: number = 5): string[] {
  // Простий підхід: найчастіші слова (виключаючи stop words)
  const stopWords = new Set([
    'a', 'i', 'o', 'v', 'na', 'je', 'to', 'se', 'z', 'za', 'do', 'od', 's',
    'k', 'u', 'po', 'pro', 'jako', 'však', 'nebo', 'který', 'která', 'které',
    'jeho', 'její', 'jejich', 'byl', 'byla', 'bylo', 'byly', 'být',
    'та', 'в', 'і', 'на', 'з', 'у', 'до', 'від', 'за', 'по', 'що', 'який',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\wáčďéěíňóřšťúůýžа-яїієґ\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));

  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([word]) => word);
}

