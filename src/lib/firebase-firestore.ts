import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { ClientData } from '@/types';
import { InvoiceData } from '@/lib/invoice-utils';

// Типи для Firestore документів
export interface FirestoreClient extends Omit<ClientData, 'id'> {
  userId: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface FirestoreInvoice extends Omit<InvoiceData, 'id'> {
  userId: string;
  createdAt: unknown;
  updatedAt: unknown;
}

// Утиліти для клієнтів
export const clientsCollection = 'clients';

export const addClientToFirestore = async (userId: string, clientData: Omit<ClientData, 'id'>) => {
  try {
    const clientDoc: Omit<FirestoreClient, 'id'> = {
      ...clientData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, clientsCollection), clientDoc);
    return { success: true, id: docRef.id };
  } catch (error: unknown) {
    console.error('Помилка додавання клієнта:', error);
    return { success: false, error };
  }
};

export const getClientsFromFirestore = async (userId: string): Promise<ClientData[]> => {
  try {
    const q = query(
      collection(db, clientsCollection),
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
    
    return clients;
  } catch (error: unknown) {
    console.error('Помилка отримання клієнтів:', error);
    return [];
  }
};

export const updateClientInFirestore = async (clientId: string, clientData: Partial<ClientData>) => {
  try {
    const clientRef = doc(db, clientsCollection, clientId);
    await updateDoc(clientRef, {
      ...clientData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error: unknown) {
    console.error('Помилка оновлення клієнта:', error);
    return { success: false, error };
  }
};

export const deleteClientFromFirestore = async (clientId: string) => {
  try {
    await deleteDoc(doc(db, clientsCollection, clientId));
    return { success: true };
  } catch (error: unknown) {
    console.error('Помилка видалення клієнта:', error);
    return { success: false, error };
  }
};

// Утиліти для фактур
export const invoicesCollection = 'invoices';

export const addInvoiceToFirestore = async (userId: string, invoiceData: Omit<InvoiceData, 'id'>) => {
  try {
    const invoiceDoc: Omit<FirestoreInvoice, 'id'> = {
      ...invoiceData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, invoicesCollection), invoiceDoc);
    return { success: true, id: docRef.id };
  } catch (error: unknown) {
    console.error('Помилка додавання фактури:', error);
    return { success: false, error };
  }
};

export const getInvoicesFromFirestore = async (userId: string): Promise<InvoiceData[]> => {
  try {
    const q = query(
      collection(db, invoicesCollection),
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
    
    return invoices;
  } catch (error: unknown) {
    console.error('Помилка отримання фактур:', error);
    return [];
  }
};

export const updateInvoiceInFirestore = async (invoiceId: string, invoiceData: Partial<InvoiceData>) => {
  try {
    const invoiceRef = doc(db, invoicesCollection, invoiceId);
    await updateDoc(invoiceRef, {
      ...invoiceData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error: unknown) {
    console.error('Помилка оновлення фактури:', error);
    return { success: false, error };
  }
};

export const deleteInvoiceFromFirestore = async (invoiceId: string) => {
  try {
    await deleteDoc(doc(db, invoicesCollection, invoiceId));
    return { success: true };
  } catch (error: unknown) {
    console.error('Помилка видалення фактури:', error);
    return { success: false, error };
  }
};

// Підписка на зміни в реальному часі
export const subscribeToClients = (userId: string, callback: (clients: ClientData[]) => void) => {
  const q = query(
    collection(db, clientsCollection),
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
    callback(clients);
  });
};

export const subscribeToInvoices = (userId: string, callback: (invoices: InvoiceData[]) => void) => {
  const q = query(
    collection(db, invoicesCollection),
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
    callback(invoices);
  });
};

// Масові операції
export const batchUpdateClients = async (updates: Array<{ id: string; data: Partial<ClientData> }>) => {
  try {
    const batch = writeBatch(db);
    
    updates.forEach(({ id, data }) => {
      const clientRef = doc(db, clientsCollection, id);
      batch.update(clientRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    return { success: true };
  } catch (error: unknown) {
    console.error('Помилка масового оновлення клієнтів:', error);
    return { success: false, error };
  }
};
