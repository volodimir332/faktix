/**
 * Knowledge Base Types for AI Accountant
 * Czech Tax System - Official Sources
 */

export interface KBDocument {
  id: string;
  title: string;
  source: KBSource;
  url: string;
  content: string;
  metadata: KBMetadata;
  chunks?: KBChunk[];
  createdAt: Date;
  updatedAt: Date;
}

export interface KBChunk {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
  metadata: ChunkMetadata;
  position: number; // позиція в документі
  tokenCount: number;
}

export interface KBMetadata {
  category: KBCategory;
  language: 'cs' | 'uk' | 'en';
  tags: string[];
  validFrom?: Date;
  validUntil?: Date;
  lawNumber?: string; // номер закону для Sbírka zákonů
  year?: number;
  documentType: DocumentType;
}

export interface ChunkMetadata {
  title?: string;
  subtitle?: string;
  section?: string;
  relevantFor?: BusinessType[];
  keywords?: string[];
}

export type KBSource = 
  | 'financni_sprava'
  | 'cssz'
  | 'mfcr'
  | 'e_sbirka'
  | 'zakony_pro_lidi'
  | 'manual';

export type KBCategory =
  | 'dan_z_prijmu'          // Daň z příjmů
  | 'dph'                   // DPH
  | 'socialni_pojisteni'    // Sociální pojištění
  | 'zdravotni_pojisteni'   // Zdravotní pojištění
  | 'pausalni_dan'          // Paušální daň
  | 'ucetnictvi'            // Účetnictví
  | 'dane_obecne'           // Daně obecně
  | 'zakony'                // Zákony
  | 'formulare'             // Formuláře
  | 'terminy'               // Termíny
  | 'limity'                // Limity
  | 'other';

export type DocumentType =
  | 'law'          // Zákon
  | 'guideline'    // Pokyn
  | 'form'         // Formulář
  | 'article'      // Článek
  | 'manual'       // Manuál
  | 'faq'          // FAQ
  | 'other';

export type BusinessType =
  | 'osvc'         // OSVČ
  | 'sro'          // s.r.o.
  | 'remeslna'     // Řemeslná živnost
  | 'volna'        // Volná živnost
  | 'all';

/**
 * Query Interface for RAG
 */
export interface KBQuery {
  question: string;
  language?: 'cs' | 'uk';
  userContext?: UserContext;
  maxResults?: number;
  categories?: KBCategory[];
}

export interface UserContext {
  businessType: BusinessType;
  ico?: string;
  dic?: string;
  annualIncome?: number;
  isPausalni?: boolean;
  isVatPayer?: boolean;
}

export interface KBQueryResult {
  answer: string;
  sources: KBSourceReference[];
  confidence: number;
  chunks: KBChunk[];
  calculations?: Record<string, number>;
}

export interface KBSourceReference {
  title: string;
  url: string;
  source: KBSource;
  relevantText: string;
  category: KBCategory;
}

/**
 * Scraping Configuration
 */
export interface ScraperConfig {
  source: KBSource;
  baseUrl: string;
  paths: string[];
  selectors: ScraperSelectors;
  rateLimit: number; // requests per second
  retryAttempts: number;
}

export interface ScraperSelectors {
  title?: string;
  content?: string;
  exclude?: string[];
}

/**
 * ETL Pipeline Types
 */
export interface ETLJob {
  id: string;
  source: KBSource;
  status: 'pending' | 'running' | 'completed' | 'failed';
  documentsProcessed: number;
  chunksGenerated: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface ChunkingConfig {
  maxTokens: number;
  overlap: number;
  strategy: 'sentence' | 'paragraph' | 'semantic';
}

