/**
 * Firestore Client-Side Operations
 * Safe to use in browser/client components
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
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { KBDocument, KBChunk, KBCategory, KBSource } from './types';

const KB_COLLECTION = 'knowledge_base';
const CHUNKS_COLLECTION = 'kb_chunks';

/**
 * Save KB document (client-side)
 */
export async function saveKBDocumentClient(document: KBDocument): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on client-side');
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
 * Get KB stats (client-side)
 */
export async function getKBStatsClient(): Promise<{
  totalDocuments: number;
  totalChunks: number;
}> {
  if (typeof window === 'undefined') {
    return { totalDocuments: 0, totalChunks: 0 };
  }
  
  try {
    const [docsSnapshot, chunksSnapshot] = await Promise.all([
      getDocs(collection(db, KB_COLLECTION)),
      getDocs(collection(db, CHUNKS_COLLECTION)),
    ]);
    
    return {
      totalDocuments: docsSnapshot.size,
      totalChunks: chunksSnapshot.size,
    };
  } catch (error) {
    console.error('Error getting KB stats:', error);
    return { totalDocuments: 0, totalChunks: 0 };
  }
}

