'use client';

import { useState } from 'react';
import { getZivnostType, determineZivnostType, ZivnostData } from '@/lib/ares-api';

export default function TestZivnostPage() {
  const [ico, setIco] = useState('03915131');
  const [result, setResult] = useState<ZivnostData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [determinedType, setDeterminedType] = useState<string>('');
  const [rawHtml, setRawHtml] = useState<string>('');

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setDeterminedType('');
    setRawHtml('');

    try {
      console.log('🧪 Testing Živnost for IČO:', ico);
      const response = await getZivnostType(ico);
      console.log('📊 Živnost result:', response);
      
      if (response.success && response.data) {
        setResult(response.data);
        const type = determineZivnostType(response.data);
        setDeterminedType(type);
        console.log('🎯 Determined type:', type);
      } else {
        setResult(null);
        setError(response.error || 'Živnost not found');
        console.error('❌ Error:', response.error);
      }
    } catch (err) {
      console.error('❌ Test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestWithRawData = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setDeterminedType('');

    try {
      // Прямий запит до RZP для отримання HTML
      const url = `https://www.rzp.cz/cgi-bin/aps_cacheWEB?VSS_SERV=ZVWSBJFND&VYPIS=1&ICO=${ico}`;
      const response = await fetch(url);
      const html = await response.text();
      setRawHtml(html);
      
      console.log('📄 Raw HTML received, length:', html.length);
      
      // Тестуємо парсинг
      const zivnostResult = await getZivnostType(ico);
      if (zivnostResult.success && zivnostResult.data) {
        setResult(zivnostResult.data);
        const type = determineZivnostType(zivnostResult.data);
        setDeterminedType(type);
      } else {
        setError(zivnostResult.error || 'Failed to parse HTML');
      }
    } catch (err) {
      console.error('❌ Raw data test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Test Živnost API</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={ico}
              onChange={(e) => setIco(e.target.value)}
              placeholder="Enter IČO"
              className="flex-1 bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
            />
            <button
              onClick={handleTest}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium"
            >
              {loading ? 'Testing...' : 'Test Živnost'}
            </button>
            <button
              onClick={handleTestWithRawData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium"
            >
              {loading ? 'Testing...' : 'Test Raw HTML'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-600 p-4 rounded-lg mb-6">
            <h3 className="text-red-400 font-semibold mb-2">❌ Error:</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h3 className="text-green-400 font-semibold mb-4">✅ Živnost Data:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Typ živnosti:</strong> 
                <div className="text-green-300 mt-1">{result.typZivnosti}</div>
              </div>
              <div>
                <strong>Předmět podnikání:</strong>
                <div className="text-green-300 mt-1">{result.predmetPodnikani.join(', ')}</div>
              </div>
              <div>
                <strong>Datum zápisu:</strong>
                <div className="text-green-300 mt-1">{result.datumZapisu}</div>
              </div>
              <div>
                <strong>Stav:</strong>
                <div className="text-green-300 mt-1">{result.stav}</div>
              </div>
            </div>
          </div>
        )}

        {determinedType && (
          <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg mb-6">
            <h3 className="text-blue-400 font-semibold mb-2">🎯 Determined Type:</h3>
            <p className="text-blue-300 text-lg font-bold">{determinedType}</p>
            <div className="mt-2 text-sm text-blue-200">
              {determinedType.includes('80%') && '✅ Highest priority - Řemeslnická živnost'}
              {determinedType.includes('60%') && '✅ Medium priority - Volná/Vázaná živnost'}
              {determinedType.includes('Nedefinováno') && '⚠️ Fallback - No specific type found'}
            </div>
          </div>
        )}

        {rawHtml && (
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h3 className="text-yellow-400 font-semibold mb-4">📄 Raw HTML Response:</h3>
            <div className="bg-gray-900 p-4 rounded text-xs overflow-auto max-h-96">
              <pre className="text-gray-300">{rawHtml}</pre>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-blue-400 font-semibold mb-4">📋 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Enter an IČO number (e.g., 03915131)</li>
            <li>Click &quot;Test Živnost&quot; for normal API test</li>
            <li>Click &quot;Test Raw HTML&quot; to see the actual HTML response</li>
            <li>Check the browser console (F12) for detailed logs</li>
            <li>Verify the determined type follows the priority rules</li>
          </ol>
          
          <div className="mt-4 p-4 bg-blue-900/20 rounded">
            <h4 className="text-blue-300 font-semibold mb-2">🎯 Priority Rules:</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li><strong>1st Priority (80%):</strong> Řemeslnická živnost</li>
              <li><strong>2nd Priority (60%):</strong> Volná / Vázaná živnost</li>
              <li><strong>Fallback:</strong> Nedefinováno</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
