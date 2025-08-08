'use client';

import { useState } from 'react';
import { searchByICO as searchCompanyByICO, AresCompanyData } from '@/lib/ares-api';

export default function TestAresPage() {
  const [ico, setIco] = useState('03915131');
  const [result, setResult] = useState<AresCompanyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing IČO:', ico);
      const response = await searchCompanyByICO(ico);
      console.log('Test result:', response);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setResult(null);
        setError(response.error || 'Company not found');
      }
    } catch (err) {
      console.error('Test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Ares API</h1>
        
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
              {loading ? 'Testing...' : 'Test API'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-600 p-4 rounded-lg mb-6">
            <h3 className="text-red-400 font-semibold mb-2">Error:</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-green-400 font-semibold mb-4">Result:</h3>
            <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-blue-400 font-semibold mb-4">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Enter an IČO number (e.g., 03915131)</li>
            <li>Click &quot;Test API&quot; button</li>
            <li>Check the result below</li>
            <li>Open browser console (F12) to see detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 