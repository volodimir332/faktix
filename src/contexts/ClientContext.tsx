"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ClientData } from '@/types';
import { 
  createClient, 
  getUserClients, 
  updateClient, 
  deleteClient, 
  subscribeToClients,
  batchUpdateClients,
  batchDeleteClients
} from '@/lib/firestore-service';
import { useAuth } from '@/hooks/useAuth';

interface ClientContextType {
  clients: ClientData[];
  isLoading: boolean;
  error: string | null;
  addClient: (clientData: Omit<ClientData, 'id'>) => Promise<{ success: boolean; id?: string; error?: unknown }>;
  updateClient: (id: string, clientData: Partial<ClientData>) => Promise<{ success: boolean; error?: unknown }>;
  deleteClient: (id: string) => Promise<{ success: boolean; error?: unknown }>;
  refreshClients: () => Promise<void>;
  batchUpdateClients: (updates: Array<{ id: string; data: Partial<ClientData> }>) => Promise<{ success: boolean; error?: unknown }>;
  batchDeleteClients: (clientIds: string[]) => Promise<{ success: boolean; error?: unknown }>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Завантаження клієнтів при авторизації
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔐 ClientContext: User authenticated, loading clients...');
      loadClients();
      setupRealtimeSubscription();
    } else {
      console.log('🔐 ClientContext: User not authenticated, clearing clients');
      setClients([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📖 Loading clients from Firestore...');
      
      const clientsData = await getUserClients();
      setClients(clientsData);
      console.log('✅ Clients loaded successfully:', clientsData.length, 'clients');
    } catch (err) {
      console.error('❌ Error loading clients:', err);
      setError('Помилка завантаження клієнтів');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!isAuthenticated || !user) return;

    console.log('👂 Setting up real-time subscription for clients...');
    
    const unsubscribe = subscribeToClients((updatedClients) => {
      console.log('📡 Real-time clients update:', updatedClients.length, 'clients');
      setClients(updatedClients);
    });

    // Очищення підписки при розмонтуванні
    return () => {
      console.log('🔌 Cleaning up clients subscription...');
      unsubscribe();
    };
  };

  const addClient = async (clientData: Omit<ClientData, 'id'>) => {
    try {
      console.log('➕ Adding new client...');
      setError(null);
      
      const result = await createClient(clientData);
      
      if (result.success) {
        console.log('✅ Client added successfully with ID:', result.id);
        // Оновлення відбудеться автоматично через real-time підписку
      } else {
        console.error('❌ Failed to add client:', result.error);
        setError('Помилка додавання клієнта');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error adding client:', err);
      setError('Помилка додавання клієнта');
      return { success: false, error: err };
    }
  };

  const updateClientHandler = async (id: string, clientData: Partial<ClientData>) => {
    try {
      console.log('🔄 Updating client:', id);
      setError(null);
      
      const result = await updateClient(id, clientData);
      
      if (result.success) {
        console.log('✅ Client updated successfully');
        // Оновлення відбудеться автоматично через real-time підписку
      } else {
        console.error('❌ Failed to update client:', result.error);
        setError('Помилка оновлення клієнта');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error updating client:', err);
      setError('Помилка оновлення клієнта');
      return { success: false, error: err };
    }
  };

  const deleteClientHandler = async (id: string) => {
    try {
      console.log('🗑️ Deleting client:', id);
      setError(null);
      
      const result = await deleteClient(id);
      
      if (result.success) {
        console.log('✅ Client deleted successfully');
        // Оновлення відбудеться автоматично через real-time підписку
      } else {
        console.error('❌ Failed to delete client:', result.error);
        setError('Помилка видалення клієнта');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error deleting client:', err);
      setError('Помилка видалення клієнта');
      return { success: false, error: err };
    }
  };

  const refreshClients = async () => {
    console.log('🔄 Manually refreshing clients...');
    await loadClients();
  };

  const batchUpdateClientsHandler = async (updates: Array<{ id: string; data: Partial<ClientData> }>) => {
    try {
      console.log('🔄 Batch updating clients...');
      setError(null);
      
      const result = await batchUpdateClients(updates);
      
      if (result.success) {
        console.log('✅ Batch update completed successfully');
        // Оновлення відбудеться автоматично через real-time підписку
      } else {
        console.error('❌ Failed to batch update clients:', result.error);
        setError('Помилка масового оновлення клієнтів');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error in batch update:', err);
      setError('Помилка масового оновлення клієнтів');
      return { success: false, error: err };
    }
  };

  const batchDeleteClientsHandler = async (clientIds: string[]) => {
    try {
      console.log('🗑️ Batch deleting clients...');
      setError(null);
      
      const result = await batchDeleteClients(clientIds);
      
      if (result.success) {
        console.log('✅ Batch delete completed successfully');
        // Оновлення відбудеться автоматично через real-time підписку
      } else {
        console.error('❌ Failed to batch delete clients:', result.error);
        setError('Помилка масового видалення клієнтів');
      }
      
      return result;
    } catch (err) {
      console.error('❌ Error in batch delete:', err);
      setError('Помилка масового видалення клієнтів');
      return { success: false, error: err };
    }
  };

  // ⚡ ОПТИМІЗАЦІЯ: Мемоізація value щоб запобігти зайвим ре-рендерам
  const value: ClientContextType = React.useMemo(() => ({
    clients,
    isLoading,
    error,
    addClient,
    updateClient: updateClientHandler,
    deleteClient: deleteClientHandler,
    refreshClients,
    batchUpdateClients: batchUpdateClientsHandler,
    batchDeleteClients: batchDeleteClientsHandler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [clients, isLoading, error]);

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
}; 