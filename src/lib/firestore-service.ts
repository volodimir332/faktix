import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { ClientData } from '@/types';
import { InvoiceData } from '@/lib/invoice-utils';

// Типи для Firestore документів
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  profile?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    ico?: string;
    dic?: string;
    typZivnosti?: string;
  };
}

export interface FirestoreClient extends Omit<ClientData, 'id'> {
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreInvoice extends Omit<InvoiceData, 'id'> {
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Константи для колекцій
export const COLLECTIONS = {
  USERS: 'users',
  CLIENTS: 'clients',
  INVOICES: 'invoices'
} as const;

// Утиліти для отримання поточного користувача
const getCurrentUserId = (): string => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Користувач не авторизований!');
  }
  return user.uid;
};

// ===== ФУНКЦІЇ ДЛЯ РОБОТИ З КОРИСТУВАЧАМИ =====

/**
 * Зберігає профіль користувача при реєстрації
 */
export const saveUserProfile = async (userId: string, userData: Partial<FirestoreUser>) => {
  try {
    console.log('💾 Saving user profile for:', userId);
    
    const userDoc: Partial<FirestoreUser> = {
      ...userData,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    };
    
    // Використовуємо setDoc з merge, щоб створити документ, якщо його ще немає
    await setDoc(doc(db, COLLECTIONS.USERS, userId), userDoc, { merge: true });
    console.log('✅ User profile saved successfully');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error saving user profile:', error);
    return { success: false, error };
  }
};

/**
 * Отримує профіль користувача
 */
export const getUserProfile = async (userId?: string): Promise<FirestoreUser | null> => {
  try {
    const targetUserId = userId || getCurrentUserId();
    console.log('📖 Getting user profile for:', targetUserId);
    
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, targetUserId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as FirestoreUser;
      console.log('✅ User profile retrieved successfully');
      return userData;
    } else {
      console.log('⚠️ User profile not found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    return null;
  }
};

/**
 * Оновлює профіль користувача
 */
export const updateUserProfile = async (profileData: Partial<FirestoreUser['profile']>) => {
  try {
    const userId = getCurrentUserId();
    console.log('🔄 Updating user profile for:', userId);
    
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      profile: profileData,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ User profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    return { success: false, error };
  }
};

// ===== ФУНКЦІЇ ДЛЯ РОБОТИ З КЛІЄНТАМИ =====

/**
 * Створює нового клієнта
 */
export const createClient = async (clientData: Omit<ClientData, 'id'>) => {
  try {
    const userId = getCurrentUserId();
    console.log('➕ Creating new client for user:', userId);
    
    const clientDoc: Omit<FirestoreClient, 'id'> = {
      ...clientData,
      userId,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.CLIENTS), clientDoc);
    console.log('✅ Client created successfully with ID:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error creating client:', error);
    return { success: false, error };
  }
};

/**
 * Отримує всіх клієнтів поточного користувача
 */
export const getUserClients = async (): Promise<ClientData[]> => {
  try {
    const userId = getCurrentUserId();
    console.log('📖 Getting clients for user:', userId);
    
    const q = query(
      collection(db, COLLECTIONS.CLIENTS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const clients: ClientData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreClient;
      clients.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        ico: data.ico,
        dic: data.dic,
        typZivnosti: data.typZivnosti
      });
    });
    
    console.log('✅ Retrieved', clients.length, 'clients');
    return clients;
  } catch (error) {
    console.error('❌ Error getting clients:', error);
    return [];
  }
};

/**
 * Оновлює клієнта
 */
export const updateClient = async (clientId: string, clientData: Partial<ClientData>) => {
  try {
    console.log('🔄 Updating client:', clientId);
    
    await updateDoc(doc(db, COLLECTIONS.CLIENTS, clientId), {
      ...clientData,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Client updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating client:', error);
    return { success: false, error };
  }
};

/**
 * Видаляє клієнта
 */
export const deleteClient = async (clientId: string) => {
  try {
    console.log('🗑️ Deleting client:', clientId);
    
    await deleteDoc(doc(db, COLLECTIONS.CLIENTS, clientId));
    
    console.log('✅ Client deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting client:', error);
    return { success: false, error };
  }
};

// ===== ФУНКЦІЇ ДЛЯ РОБОТИ З ФАКТУРАМИ =====

/**
 * Створює нову фактуру
 */
export const createInvoice = async (invoiceData: Omit<InvoiceData, 'id'>) => {
  try {
    const userId = getCurrentUserId();
    console.log('➕ Creating new invoice for user:', userId);
    
    const invoiceDoc: Omit<FirestoreInvoice, 'id'> = {
      ...invoiceData,
      userId,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.INVOICES), invoiceDoc);
    console.log('✅ Invoice created successfully with ID:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error creating invoice:', error);
    return { success: false, error };
  }
};

/**
 * Отримує всі фактури поточного користувача
 */
export const getUserInvoices = async (): Promise<InvoiceData[]> => {
  try {
    const userId = getCurrentUserId();
    console.log('📖 Getting invoices for user:', userId);
    
    const q = query(
      collection(db, COLLECTIONS.INVOICES),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const invoices: InvoiceData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreInvoice;
      invoices.push({
        id: doc.id,
        invoiceNumber: data.invoiceNumber,
        date: data.date,
        dueDate: data.dueDate,
        customer: data.customer,
        items: data.items,
        total: data.total,
        status: data.status
      });
    });
    
    console.log('✅ Retrieved', invoices.length, 'invoices');
    return invoices;
  } catch (error) {
    console.error('❌ Error getting invoices:', error);
    return [];
  }
};

/**
 * Отримує конкретну фактуру за ID
 */
export const getInvoiceById = async (invoiceId: string): Promise<InvoiceData | null> => {
  try {
    console.log('📖 Getting invoice by ID:', invoiceId);
    
    const invoiceDoc = await getDoc(doc(db, COLLECTIONS.INVOICES, invoiceId));
    
    if (invoiceDoc.exists()) {
      const data = invoiceDoc.data() as FirestoreInvoice;
      const invoice: InvoiceData = {
        id: invoiceDoc.id,
        invoiceNumber: data.invoiceNumber,
        date: data.date,
        dueDate: data.dueDate,
        customer: data.customer,
        items: data.items,
        total: data.total,
        status: data.status
      };
      
      console.log('✅ Invoice retrieved successfully');
      return invoice;
    } else {
      console.log('⚠️ Invoice not found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting invoice:', error);
    return null;
  }
};

/**
 * Оновлює фактуру
 */
export const updateInvoice = async (invoiceId: string, invoiceData: Partial<InvoiceData>) => {
  try {
    console.log('🔄 Updating invoice:', invoiceId);
    
    await updateDoc(doc(db, COLLECTIONS.INVOICES, invoiceId), {
      ...invoiceData,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Invoice updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating invoice:', error);
    return { success: false, error };
  }
};

/**
 * Видаляє фактуру
 */
export const deleteInvoice = async (invoiceId: string) => {
  try {
    console.log('🗑️ Deleting invoice:', invoiceId);
    
    await deleteDoc(doc(db, COLLECTIONS.INVOICES, invoiceId));
    
    console.log('✅ Invoice deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting invoice:', error);
    return { success: false, error };
  }
};

// ===== ПІДПИСКИ НА ЗМІНИ В РЕАЛЬНОМУ ЧАСІ =====

/**
 * Підписується на зміни клієнтів в реальному часі
 */
export const subscribeToClients = (callback: (clients: ClientData[]) => void) => {
  const userId = getCurrentUserId();
  console.log('👂 Subscribing to clients for user:', userId);
  
  const q = query(
    collection(db, COLLECTIONS.CLIENTS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const clients: ClientData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreClient;
      clients.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        ico: data.ico,
        dic: data.dic,
        typZivnosti: data.typZivnosti
      });
    });
    
    console.log('📡 Clients updated:', clients.length, 'clients');
    callback(clients);
  });
};

/**
 * Підписується на зміни фактур в реальному часі
 */
export const subscribeToInvoices = (callback: (invoices: InvoiceData[]) => void) => {
  const userId = getCurrentUserId();
  console.log('👂 Subscribing to invoices for user:', userId);
  
  const q = query(
    collection(db, COLLECTIONS.INVOICES),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const invoices: InvoiceData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreInvoice;
      invoices.push({
        id: doc.id,
        invoiceNumber: data.invoiceNumber,
        date: data.date,
        dueDate: data.dueDate,
        customer: data.customer,
        items: data.items,
        total: data.total,
        status: data.status
      });
    });
    
    console.log('📡 Invoices updated:', invoices.length, 'invoices');
    callback(invoices);
  });
};

// ===== МАСОВІ ОПЕРАЦІЇ =====

/**
 * Масове оновлення клієнтів
 */
export const batchUpdateClients = async (updates: Array<{ id: string; data: Partial<ClientData> }>) => {
  try {
    console.log('🔄 Batch updating', updates.length, 'clients');
    
    const batch = writeBatch(db);
    
    updates.forEach(({ id, data }) => {
      const clientRef = doc(db, COLLECTIONS.CLIENTS, id);
      batch.update(clientRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log('✅ Batch update completed successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error in batch update:', error);
    return { success: false, error };
  }
};

/**
 * Масове видалення клієнтів
 */
export const batchDeleteClients = async (clientIds: string[]) => {
  try {
    console.log('🗑️ Batch deleting', clientIds.length, 'clients');
    
    const batch = writeBatch(db);
    
    clientIds.forEach((id) => {
      const clientRef = doc(db, COLLECTIONS.CLIENTS, id);
      batch.delete(clientRef);
    });
    
    await batch.commit();
    console.log('✅ Batch delete completed successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error in batch delete:', error);
    return { success: false, error };
  }
};

// ===== ЕКСПОРТ ВСІХ ФУНКЦІЙ =====

export default {
  // User functions
  saveUserProfile,
  getUserProfile,
  updateUserProfile,
  
  // Client functions
  createClient,
  getUserClients,
  updateClient,
  deleteClient,
  
  // Invoice functions
  createInvoice,
  getUserInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  
  // Real-time subscriptions
  subscribeToClients,
  subscribeToInvoices,
  
  // Batch operations
  batchUpdateClients,
  batchDeleteClients
};



