"use client";

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';

// Firebase конфігурація для тестування
const firebaseConfig = {
  apiKey: "AIzaSyBxf55ui7ZwGAFRJg_14BBefWAHLCZ9sMw",
  authDomain: "faktix-8d2cc.firebaseapp.com",
  projectId: "faktix-8d2cc",
  storageBucket: "faktix-8d2cc.firebasestorage.app",
  messagingSenderId: "685408432041",
  appId: "1:685408432041:web:bbbc88c0a5e97bd3ab1eb8",
  measurementId: "G-NLPRJCP9C6"
};

export default function TestFirebaseFix() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('TestPassword123!');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runChecks = async () => {
    setResult('');
    setIsLoading(true);
    
    try {
      // Перевірка Firebase конфігурації
      const configCheck = {
        hasApiKey: !!firebaseConfig.apiKey,
        hasAuthDomain: !!firebaseConfig.authDomain,
        hasProjectId: !!firebaseConfig.projectId,
        hasAppId: !!firebaseConfig.appId,
        apiKeyLength: firebaseConfig.apiKey?.length,
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId
      };
      
      setResult(prev => prev + '🔧 Firebase Config Check:\n' + JSON.stringify(configCheck, null, 2) + '\n\n');
      
      // Перевірка auth об'єкта
      const authCheck = {
        hasAuth: !!auth,
        authApp: auth?.app?.name,
        currentUser: auth?.currentUser ? 'exists' : 'null'
      };
      
      setResult(prev => prev + '🔐 Auth Object Check:\n' + JSON.stringify(authCheck, null, 2) + '\n\n');
      
      // Спроба створення тестового користувача
      setResult(prev => prev + '🧪 Testing user creation...\n');
      
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';
      
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      setResult(prev => prev + `✅ Test user created: ${userCredential.user.uid}\n`);
      
      // Видалення тестового користувача
      await deleteUser(userCredential.user);
      setResult(prev => prev + '✅ Test user deleted\n');
      
      setResult(prev => prev + '\n🎉 All tests passed! Firebase is working correctly.');
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult(prev => prev + `❌ Error: ${errorMessage}\n`);
      
      if (error instanceof Error) {
        setResult(prev => prev + `Error details: ${JSON.stringify({
          name: error.name,
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 3)
        }, null, 2)}\n`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Виправлений тест Firebase</h1>
        
        <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">✅ Виправлена конфігурація</h2>
          <p>Ця сторінка використовує покращену Firebase конфігурацію з додатковими перевірками.</p>
        </div>
        
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
              onClick={runChecks}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? 'Тестуємо...' : 'Тестувати виправлену реєстрацію'}
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Результат:</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">{result || 'Натисніть кнопку для тестування'}</pre>
          </div>
        </div>

        <div className="mt-8 bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Якщо тест працює:</h3>
          <p>Перейдіть на головну сторінку реєстрації і спробуйте зареєструватися знову!</p>
          <a 
            href="/registrace" 
            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
          >
            🌐 Перейти до реєстрації
          </a>
        </div>
      </div>
    </div>
  );
}
