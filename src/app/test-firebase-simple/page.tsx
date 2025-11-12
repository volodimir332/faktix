"use client";

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function TestFirebaseSimple() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('TestPassword123!');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testRegistration = async () => {
    setResult('');
    setIsLoading(true);
    
    try {
      console.log('🔍 Firebase Auth object:', auth);
      console.log('🔍 Firebase config:', auth?.app?.options);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      setResult(`✅ Успішно! Користувач створений: ${userCredential.user.uid}`);
      
      // Видаляємо тестового користувача
      await userCredential.user.delete();
      setResult(prev => prev + '\n✅ Тестовий користувач видалений');
      
    } catch (error: unknown) {
      console.error('❌ Помилка реєстрації:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult(`❌ Помилка: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Простий тест Firebase</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Тестова реєстрація</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
              />
            </div>
            
            <button
              onClick={testRegistration}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? 'Тестуємо...' : 'Тестувати реєстрацію'}
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Результат:</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">{result || 'Натисніть кнопку для тестування'}</pre>
          </div>
        </div>

        <div className="mt-8 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Якщо тест не працює:</h3>
          <ul className="space-y-2 text-sm">
            <li>• Перевірте Firebase Console: https://console.firebase.google.com/</li>
            <li>• Переконайтеся, що проект faktix-8d2cc активний</li>
            <li>• Перевірте, чи увімкнено Email/Password Authentication</li>
            <li>• Перевірте підключення до інтернету</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
