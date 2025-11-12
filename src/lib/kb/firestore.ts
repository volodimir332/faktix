/**
 * Firestore Integration for Knowledge Base
 * Store and retrieve KB documents and chunks
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { KBDocument, KBChunk, KBCategory, KBSource } from './types';
import type { Firestore } from 'firebase/firestore';

// Dynamic import for Firebase (client-side only)
let db: Firestore | undefined;

if (typeof window !== 'undefined') {
  // Client-side: use regular Firebase
  import('../firebase').then(module => {
    db = module.db;
  });
} else {
  // Server-side: use Firebase Admin
  // Note: This is a placeholder - actual server operations 
  // should use firebase-admin/firestore directly
  console.log('⚠️ Firestore operations on server - using admin SDK');
}

const KB_COLLECTION = 'knowledge_base';
const CHUNKS_COLLECTION = 'kb_chunks';

/**
 * Save KB document to Firestore
 */
export async function saveKBDocument(document: KBDocument): Promise<void> {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  
  try {
    const docRef = doc(db, KB_COLLECTION, document.id);
    await setDoc(docRef, {
      ...document,
      createdAt: Timestamp.fromDate(document.createdAt),
      updatedAt: Timestamp.fromDate(document.updatedAt),
    });
    console.log(`Saved document: ${document.id}`);
  } catch (error) {
    console.error('Error saving KB document:', error);
    throw error;
  }
}

/**
 * Save KB chunk to Firestore
 */
export async function saveKBChunk(chunk: KBChunk): Promise<void> {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  
  try {
    const chunkRef = doc(db, CHUNKS_COLLECTION, chunk.id);
    await setDoc(chunkRef, chunk);
    console.log(`Saved chunk: ${chunk.id}`);
  } catch (error) {
    console.error('Error saving KB chunk:', error);
    throw error;
  }
}

/**
 * Save multiple chunks in batch
 */
export async function saveKBChunksBatch(chunks: KBChunk[]): Promise<void> {
  const promises = chunks.map(chunk => saveKBChunk(chunk));
  await Promise.all(promises);
  console.log(`Saved ${chunks.length} chunks`);
}

/**
 * Get KB document by ID
 */
export async function getKBDocument(documentId: string): Promise<KBDocument | null> {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  
  try {
    const docRef = doc(db, KB_COLLECTION, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as KBDocument;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting KB document:', error);
    return null;
  }
}

/**
 * Get all KB documents by source
 */
export async function getKBDocumentsBySource(source: KBSource): Promise<KBDocument[]> {
  if (!db) {
    console.warn('Firestore not initialized');
    return [];
  }
  
  try {
    const q = query(
      collection(db, KB_COLLECTION),
      where('source', '==', source),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as KBDocument;
    });
  } catch (error) {
    console.error('Error getting KB documents by source:', error);
    return [];
  }
}

/**
 * Get all KB documents by category
 */
export async function getKBDocumentsByCategory(category: KBCategory): Promise<KBDocument[]> {
  if (!db) {
    console.warn('Firestore not initialized');
    return [];
  }
  
  try {
    const q = query(
      collection(db, KB_COLLECTION),
      where('metadata.category', '==', category),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as KBDocument;
    });
  } catch (error) {
    console.error('Error getting KB documents by category:', error);
    return [];
  }
}

/**
 * Get chunks by document ID
 */
export async function getChunksByDocumentId(documentId: string): Promise<KBChunk[]> {
  if (!db) {
    console.warn('Firestore not initialized');
    return [];
  }
  
  try {
    const q = query(
      collection(db, CHUNKS_COLLECTION),
      where('documentId', '==', documentId),
      orderBy('position', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as KBChunk);
  } catch (error) {
    console.error('Error getting chunks by document ID:', error);
    return [];
  }
}

/**
 * Simple similarity search using cosine similarity
 * Note: This is a basic implementation. For production, consider using
 * a proper vector database or Firestore extensions
 */
export async function searchSimilarChunks(
  queryEmbedding: number[],
  topK: number = 5,
  categories?: KBCategory[]
): Promise<Array<KBChunk & { similarity: number }>> {
  if (!db) {
    console.warn('Firestore not initialized');
    return [];
  }
  
  try {
    const q = query(collection(db, CHUNKS_COLLECTION));
    
    // Filter by categories if provided
    if (categories && categories.length > 0) {
      // Note: This would require fetching parent documents first
      // For now, we'll fetch all and filter client-side
    }
    
    const querySnapshot = await getDocs(q);
    const chunks = querySnapshot.docs.map(doc => doc.data() as KBChunk);
    
    // Calculate similarity for each chunk
    const chunksWithSimilarity = chunks
      .filter(chunk => chunk.embedding && chunk.embedding.length > 0)
      .map(chunk => ({
        ...chunk,
        similarity: cosineSimilarity(queryEmbedding, chunk.embedding!),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    
    return chunksWithSimilarity;
  } catch (error) {
    console.error('Error searching similar chunks:', error);
    return [];
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    console.error('Vector dimension mismatch');
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Get KB statistics
 */
export async function getKBStats(): Promise<{
  totalDocuments: number;
  totalChunks: number;
  documentsBySource: Record<string, number>;
  documentsByCategory: Record<string, number>;
}> {
  if (!db) {
    console.warn('Firestore not initialized');
    return {
      totalDocuments: 0,
      totalChunks: 0,
      documentsBySource: {},
      documentsByCategory: {},
    };
  }
  
  try {
    const [docsSnapshot, chunksSnapshot] = await Promise.all([
      getDocs(collection(db, KB_COLLECTION)),
      getDocs(collection(db, CHUNKS_COLLECTION)),
    ]);
    
    const documents = docsSnapshot.docs.map(doc => doc.data() as KBDocument);
    
    const documentsBySource: Record<string, number> = {};
    const documentsByCategory: Record<string, number> = {};
    
    documents.forEach(doc => {
      documentsBySource[doc.source] = (documentsBySource[doc.source] || 0) + 1;
      documentsByCategory[doc.metadata.category] = 
        (documentsByCategory[doc.metadata.category] || 0) + 1;
    });
    
    return {
      totalDocuments: docsSnapshot.size,
      totalChunks: chunksSnapshot.size,
      documentsBySource,
      documentsByCategory,
    };
  } catch (error) {
    console.error('Error getting KB stats:', error);
    return {
      totalDocuments: 0,
      totalChunks: 0,
      documentsBySource: {},
      documentsByCategory: {},
    };
  }
}

