'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InvoiceData, InvoiceItem, generateInvoiceNumber, generateInvoiceId, calculateDueDate, formatDate, calculateTotal } from '@/lib/invoice-utils';
import { useAuth } from '@/hooks/useAuth';
import {
  addInvoiceToFirestore,
  getInvoicesFromFirestore,
  updateInvoiceInFirestore,
  deleteInvoiceFromFirestore,
  subscribeToInvoices
} from '@/lib/firebase-firestore';

interface InvoiceContextType {
  invoices: InvoiceData[];
  addInvoice: (invoice: Omit<InvoiceData, 'id' | 'invoiceNumber'>) => Promise<{ success: boolean; id?: string; error?: unknown }>;
  updateInvoice: (id: string, invoice: Partial<InvoiceData>) => Promise<{ success: boolean; error?: unknown }>;
  updateInvoiceStatus: (id: string, status: 'draft' | 'sent' | 'paid' | 'overdue') => Promise<{ success: boolean; error?: unknown }>;
  deleteInvoice: (id: string) => Promise<{ success: boolean; error?: unknown }>;
  getInvoiceById: (id: string) => InvoiceData | undefined;
  getInvoiceByNumber: (invoiceNumber: string) => InvoiceData | undefined;
  generateNewInvoiceNumber: () => string;
  isLoading: boolean;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Завантажуємо фактури з Firebase при зміні користувача
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setInvoices([]);
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    
    // Підписуємося на зміни в реальному часі
    const unsubscribe = subscribeToInvoices(user.uid, (updatedInvoices) => {
      setInvoices(updatedInvoices);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [user, isAuthenticated]);

  const generateNewInvoiceNumber = (): string => {
    return generateInvoiceNumber(invoices);
  };

  const addInvoice = async (invoiceData: Omit<InvoiceData, 'id' | 'invoiceNumber'>) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const newInvoice: Omit<InvoiceData, 'id'> = {
      ...invoiceData,
      invoiceNumber: generateNewInvoiceNumber(),
    };

    const result = await addInvoiceToFirestore(user.uid, newInvoice);
    if (result.success) {
      console.log('✅ Нова фактура створена та збережена в Firebase:', newInvoice);
    }
    return result;
  };

  const updateInvoice = async (id: string, invoice: Partial<InvoiceData>) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await updateInvoiceInFirestore(id, invoice);
    if (result.success) {
      console.log('✅ Фактура оновлена в Firebase:', { id, ...invoice });
    }
    return result;
  };

  const updateInvoiceStatus = async (id: string, status: 'draft' | 'sent' | 'paid' | 'overdue') => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await updateInvoiceInFirestore(id, { status });
    if (result.success) {
      console.log(`✅ Статус фактури ${id} змінено на: ${status}`);
    }
    return result;
  };

  const deleteInvoice = async (id: string) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await deleteInvoiceFromFirestore(id);
    if (result.success) {
      console.log('✅ Фактура видалена з Firebase:', id);
    }
    return result;
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(inv => inv.id === id);
  };

  const getInvoiceByNumber = (invoiceNumber: string) => {
    return invoices.find(inv => inv.invoiceNumber === invoiceNumber);
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      addInvoice,
      updateInvoice,
      updateInvoiceStatus,
      deleteInvoice,
      getInvoiceById,
      getInvoiceByNumber,
      generateNewInvoiceNumber,
      isLoading: !isLoaded
    }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
} 