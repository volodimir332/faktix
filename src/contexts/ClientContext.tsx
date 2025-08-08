'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ClientData } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import {
  addClientToFirestore,
  getClientsFromFirestore,
  updateClientInFirestore,
  deleteClientFromFirestore,
  subscribeToClients
} from '@/lib/firebase-firestore';

interface ClientContextType {
  clients: ClientData[];
  addClient: (client: Omit<ClientData, 'id'>) => Promise<{ success: boolean; id?: string; error?: unknown }>;
  updateClient: (id: string, client: Partial<ClientData>) => Promise<{ success: boolean; error?: unknown }>;
  deleteClient: (id: string) => Promise<{ success: boolean; error?: unknown }>;
  getClientById: (id: string) => ClientData | undefined;
  getClientByName: (name: string) => ClientData | undefined;
  isLoading: boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Завантажуємо клієнтів з Firebase при зміні користувача
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setClients([]);
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    
    // Підписуємося на зміни в реальному часі
    const unsubscribe = subscribeToClients(user.uid, (updatedClients) => {
      setClients(updatedClients);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [user, isAuthenticated]);

  const addClient = async (client: Omit<ClientData, 'id'>) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await addClientToFirestore(user.uid, client);
    if (result.success) {
      console.log('✅ Нова фірма додана та збережена в Firebase:', client);
    }
    return result;
  };

  const updateClient = async (id: string, client: Partial<ClientData>) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await updateClientInFirestore(id, client);
    if (result.success) {
      console.log('✅ Фірма оновлена в Firebase:', { id, ...client });
    }
    return result;
  };

  const deleteClient = async (id: string) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await deleteClientFromFirestore(id);
    if (result.success) {
      console.log('✅ Фірма видалена з Firebase:', id);
    }
    return result;
  };

  const getClientById = (id: string) => {
    return clients.find(c => c.id === id);
  };

  const getClientByName = (name: string) => {
    return clients.find(c => c.name === name);
  };

  return (
    <ClientContext.Provider value={{
      clients,
      addClient,
      updateClient,
      deleteClient,
      getClientById,
      getClientByName,
      isLoading: !isLoaded
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
} 