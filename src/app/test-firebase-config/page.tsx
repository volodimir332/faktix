"use client";

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function TestFirebaseConfig() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFirebaseConfig = async () => {
    setIsLoading(true);
    setTestResults([]);

    try {
      // Тест 1: Перевірка auth об'єкта
      addResult('🔍 Testing Firebase Auth object...');
      if (!auth) {
        addResult('❌ Auth object is null or undefined');
        return;
      }
      addResult('✅ Auth object exists');

      // Тест 2: Перевірка auth конфігурації
      addResult('🔍 Testing Auth configuration...');
      if (!auth.app) {
        addResult('❌ Auth app is null or undefined');
        return;
      }
      addResult(`✅ Auth app name: ${auth.app.name}`);

      // Тест 3: Перевірка app конфігурації
      addResult('🔍 Testing App configuration...');
      const appOptions = auth.app.options;
      addResult(`✅ Project ID: ${appOptions.projectId}`);
      addResult(`✅ Auth Domain: ${appOptions.authDomain}`);
      addResult(`✅ API Key length: ${appOptions.apiKey?.length || 0}`);

      // Тест 4: Спроба створення тестового користувача
      addResult('🔍 Testing user creation...');
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        addResult(`✅ Test user created: ${userCredential.user.uid}`);
        
        // Видаляємо тестового користувача
        await userCredential.user.delete();
        addResult('✅ Test user deleted');
      } catch (error: unknown) {
        const firebaseError = error as { code?: string; message?: string };
        addResult(`❌ User creation failed: ${firebaseError.code} - ${firebaseError.message}`);
        
        // Якщо користувач вже існує, спробуємо увійти
        if (firebaseError.code === 'auth/email-already-in-use') {
          addResult('🔄 Trying to sign in with existing user...');
          try {
            const signInResult = await signInWithEmailAndPassword(auth, testEmail, testPassword);
            addResult(`✅ Sign in successful: ${signInResult.user.uid}`);
          } catch (signInError: unknown) {
            const signInFirebaseError = signInError as { code?: string; message?: string };
            addResult(`❌ Sign in failed: ${signInFirebaseError.code} - ${signInFirebaseError.message}`);
          }
        }
      }

      addResult('🎉 Firebase configuration test completed!');

    } catch (error: unknown) {
      const generalError = error as { message?: string };
      addResult(`❌ Test failed: ${generalError.message || 'Unknown error'}`);
      console.error('Test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Configuration Test</h1>
        
        <div className="mb-8">
          <button
            onClick={testFirebaseConfig}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium"
          >
            {isLoading ? 'Testing...' : 'Run Firebase Test'}
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-400">No test results yet. Click the button above to run the test.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Troubleshooting Tips:</h3>
          <ul className="space-y-2 text-sm">
            <li>• Перевірте, чи увімкнено Email/Password в Firebase Console</li>
            <li>• Переконайтеся, що проект активний в Firebase Console</li>
            <li>• Перевірте, чи правильно скопійована конфігурація</li>
            <li>• Спробуйте створити новий проект Firebase</li>
            <li>• Перевірте підключення до інтернету</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
