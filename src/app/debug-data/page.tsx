'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Sidebar from '@/components/Sidebar';
import { RefreshCw, Database, AlertCircle } from 'lucide-react';

interface DebugData {
  invoices?: unknown[];
  clients?: unknown[];
  localStorage?: Record<string, unknown>;
  user?: {
    uid: string;
    email: string | null;
    displayName?: string | null;
  };
  firestore?: {
    invoices?: unknown[];
    clients?: unknown[];
  };
}

export default function DebugDataPage() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DebugData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkFirestoreData = async () => {
    if (!user) {
      setError('Користувач не авторизований');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Перевірка даних для користувача:', user.uid);

      // Перевірка фактур
      const invoicesRef = collection(db, 'invoices');
      const invoicesQuery = query(invoicesRef, where('userId', '==', user.uid));
      const invoicesSnapshot = await getDocs(invoicesQuery);
      
      const invoices = invoicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Перевірка клієнтів
      const clientsRef = collection(db, 'clients');
      const clientsQuery = query(clientsRef, where('userId', '==', user.uid));
      const clientsSnapshot = await getDocs(clientsQuery);
      
      const clients = clientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Перевірка localStorage
      const localStorageData: Record<string, unknown> = {};
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            try {
              const value = localStorage.getItem(key);
              localStorageData[key] = value ? JSON.parse(value) : value;
            } catch {
              localStorageData[key] = localStorage.getItem(key);
            }
          }
        }
      }

      setData({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || null
        } as { uid: string; email: string | null; displayName: string | null },
        firestore: {
          invoices: invoices,
          clients: clients
        },
        localStorage: localStorageData
      });

      console.log('✅ Дані завантажено:', {
        invoices: invoices.length,
        clients: clients.length
      });

    } catch (err: unknown) {
      const error = err as Error;
      console.error('❌ Помилка завантаження даних:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      checkFirestoreData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      
      <div className="ml-16 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">🔍 Діагностика даних</h1>
              <p className="text-gray-400">Перевірка Firestore та LocalStorage</p>
            </div>
            
            <button
              onClick={checkFirestoreData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-money hover:bg-money-light text-black rounded-lg font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Оновити
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* User Info */}
          {data && (
            <div className="space-y-6">
              {/* User */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  👤 Користувач
                </h2>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">UID:</span> <span className="text-money">{data?.user?.uid || 'N/A'}</span></p>
                  <p><span className="text-gray-400">Email:</span> {data?.user?.email || 'N/A'}</p>
                  <p><span className="text-gray-400">{"Ім'я:"}</span> {data?.user?.displayName || "Не вказано"}</p>
                </div>
              </div>

              {/* Firestore Data */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Database className="w-6 h-6" />
                  Firestore (хмарна база даних)
                </h2>
                
                <div className="space-y-4">
                  {/* Invoices */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">📄 Фактури: {data?.firestore?.invoices?.length || 0}</h3>
                    {(data?.firestore?.invoices?.length || 0) === 0 ? (
                      <p className="text-gray-400 text-sm">❌ Фактур не знайдено в Firestore для цього користувача</p>
                    ) : (
                      <div className="space-y-2">
                        {(data?.firestore?.invoices as Array<{id: string; invoiceNumber?: string; customer?: string; total?: number}> || []).map((invoice) => (
                          <div key={invoice.id} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{invoice.invoiceNumber || invoice.id}</p>
                                <p className="text-sm text-gray-400">{invoice.customer || 'Без клієнта'}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-money">{invoice.total || 0} Kč</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Clients */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">👥 Клієнти: {data?.firestore?.clients?.length || 0}</h3>
                    {(data?.firestore?.clients?.length || 0) === 0 ? (
                      <p className="text-gray-400 text-sm">❌ Клієнтів не знайдено в Firestore для цього користувача</p>
                    ) : (
                      <div className="space-y-2">
                        {(data?.firestore?.clients as Array<{id: string; name?: string; email?: string; ic?: string}> || []).map((client) => (
                          <div key={client.id} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-gray-400">IČ: {client.ic || 'Не вказано'}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* LocalStorage */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">💾 LocalStorage (браузер)</h2>
                <div className="bg-gray-800 rounded-lg p-4 overflow-auto max-h-96">
                  <pre className="text-xs text-gray-300">
                    {JSON.stringify(data.localStorage, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

