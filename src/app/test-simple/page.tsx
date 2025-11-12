"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function TestSimple() {
  const [result, setResult] = useState<string>('');

  const testServer = () => {
    setResult('✅ Сервер працює! Next.js завантажується правильно.');
  };

  const testLocalStorage = () => {
    try {
      localStorage.setItem('test', 'working');
      const testValue = localStorage.getItem('test');
      localStorage.removeItem('test');
      setResult(`✅ localStorage працює! Тестоване значення: ${testValue}`);
    } catch (error) {
      setResult(`❌ localStorage не працює: ${error}`);
    }
  };

  const testFetch = async () => {
    try {
      const response = await fetch('/api/test');
      setResult(`✅ Fetch працює! Статус: ${response.status}`);
    } catch (error) {
      setResult(`❌ Fetch не працює: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Простий тест сервера</h1>
        
        <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">✅ Сервер працює!</h2>
          <p>Якщо ви бачите цю сторінку, Next.js сервер працює правильно.</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={testServer}
            className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
          >
            Тестувати сервер
          </button>
          
          <button
            onClick={testLocalStorage}
            className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium"
          >
            Тестувати localStorage
          </button>
          
          <button
            onClick={testFetch}
            className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium"
          >
            Тестувати Fetch
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Результат:</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">{result || 'Натисніть кнопки для тестування'}</pre>
          </div>
        </div>

        <div className="mt-8 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Наступні кроки:</h3>
          <ul className="space-y-2 text-sm">
            <li>• Якщо всі тести працюють, проблема в Firebase</li>
            <li>• Якщо тести не працюють, проблема в сервері</li>
            <li>• Перейдіть на головну сторінку: <Link href="/" className="text-blue-400 hover:underline">Головна</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
} 