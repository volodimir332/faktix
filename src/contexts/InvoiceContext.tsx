"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InvoiceData } from '@/lib/invoice-utils';
import { 
  createInvoice, 
  getUserInvoices, 
  getInvoiceById,
  updateInvoice, 
  deleteInvoice, 
  subscribeToInvoices
} from '@/lib/firestore-service';
import { useAuth } from '@/hooks/useAuth';

interface InvoiceContextType {
  invoices: InvoiceData[];
  isLoading: boolean;
  error: string | null;
  addInvoice: (invoiceData: Omit<InvoiceData, 'id'>) => Promise<{ success: boolean; id?: string; error?: unknown }>;
  updateInvoice: (id: string, invoiceData: Partial<InvoiceData>) => Promise<{ success: boolean; error?: unknown }>;
  updateInvoiceStatus: (id: string, status: 'draft' | 'sent' | 'paid' | 'overdue') => Promise<{ success: boolean; error?: unknown }>;
  deleteInvoice: (id: string) => Promise<{ success: boolean; error?: unknown }>;
  getInvoiceById: (id: string) => Promise<InvoiceData | null>;
  refreshInvoices: () => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

interface InvoiceProviderProps {
  children: ReactNode;
}

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Завантаження фактур при авторизації
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔐 InvoiceContext: User authenticated, loading invoices...');
      loadInvoices();
      setupRealtimeSubscription();
    } else {
      console.log('🔐 InvoiceContext: User not authenticated, clearing invoices');
      setInvoices([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📖 Loading invoices from Firestore...');
      
      const invoicesData = await getUserInvoices();
      setInvoices(invoicesData);
      console.log('✅ Invoices loaded successfully:', invoicesData.length, 'invoices');
    } catch (err) {
      console.error('❌ Error loading invoices:', err);
      setError('Помилка завантаження фактур');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!isAuthenticated || !user) return;

    console.log('👂 Setting up real-time subscription for invoices...');
    
    const unsubscribe = subscribeToInvoices((updatedInvoices) => {
      console.log('📡 Real-time invoices update:', updatedInvoices.length, 'invoices');
      setInvoices(updatedInvoices);
    });

    // Очищення підписки при розмонтуванні
    return () => {
      console.log('🔌 Cleaning up invoices subscription...');
      unsubscribe();
    };
  };

  const addInvoice = async (invoiceData: Omit<InvoiceData, 'id'>) => {
    try {
      console.log('➕ Adding new invoice...');
      setError(null);
      
      const result = await createInvoice(invoiceData);
      
      if (result.success) {
        console.log('✅ Invoice added successfully with ID:', result.id);
        // Оновлення відбудеться автоматично через real-time підписку
      } else {
        console.error('❌ Failed to add invoice:', result.error);
        setError('Помилка додавання фактури');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error adding invoice:', err);
      setError('Помилка додавання фактури');
      return { success: false, error: err };
    }
  };

  const updateInvoiceHandler = async (id: string, invoiceData: Partial<InvoiceData>) => {
    try {
      console.log('🔄 Updating invoice:', id);
      setError(null);
      
      const result = await updateInvoice(id, invoiceData);
      
      if (result.success) {
        console.log('✅ Invoice updated successfully');
        // Оновлення відбудеться автоматично через real-time підписку
      } else {
        console.error('❌ Failed to update invoice:', result.error);
        setError('Помилка оновлення фактури');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error updating invoice:', err);
      setError('Помилка оновлення фактури');
      return { success: false, error: err };
    }
  };

  const deleteInvoiceHandler = async (id: string) => {
    try {
      console.log('🗑️ Deleting invoice:', id);
      setError(null);
      
      const result = await deleteInvoice(id);
      
      if (result.success) {
        console.log('✅ Invoice deleted successfully');
        // Оновлення відбудеться автоматично через real-time підписку
      } else {
        console.error('❌ Failed to delete invoice:', result.error);
        setError('Помилка видалення фактури');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error deleting invoice:', err);
      setError('Помилка видалення фактури');
      return { success: false, error: err };
    }
  };

  const getInvoiceByIdHandler = async (id: string): Promise<InvoiceData | null> => {
    try {
      console.log('📖 Getting invoice by ID:', id);
      return await getInvoiceById(id);
    } catch (err) {
      console.error('❌ Error getting invoice by ID:', err);
      setError('Помилка отримання фактури');
      return null;
    }
  };

  const refreshInvoices = async () => {
    console.log('🔄 Manually refreshing invoices...');
    await loadInvoices();
  };

  const updateInvoiceStatusHandler = async (id: string, status: 'draft' | 'sent' | 'paid' | 'overdue') => {
    try {
      console.log('🔄 Updating invoice status:', id, 'to', status);
      setError(null);
      
      const result = await updateInvoice(id, { status });
      
      if (result.success) {
        console.log('✅ Invoice status updated successfully');
        // Оновлення відбудеться автоматично через real-time підписку
      } else {
        console.error('❌ Failed to update invoice status:', result.error);
        setError('Помилка оновлення статусу фактури');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error updating invoice status:', err);
      setError('Помилка оновлення статусу фактури');
      return { success: false, error: err };
    }
  };

  // ⚡ ОПТИМІЗАЦІЯ: Мемоізація value щоб запобігти зайвим ре-рендерам
  const value: InvoiceContextType = React.useMemo(() => ({
    invoices,
    isLoading,
    error,
    addInvoice,
    updateInvoice: updateInvoiceHandler,
    updateInvoiceStatus: updateInvoiceStatusHandler,
    deleteInvoice: deleteInvoiceHandler,
    getInvoiceById: getInvoiceByIdHandler,
    refreshInvoices
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [invoices, isLoading, error]);

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
}; 