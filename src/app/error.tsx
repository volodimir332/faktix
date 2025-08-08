'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl p-8 max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-4">
          Щось пішло не так!
        </h2>
        <p className="text-gray-300 mb-6">
          Сталася неочікувана помилка. Спробуйте оновити сторінку або повернутися назад.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Спробувати знову
          </button>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Назад
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-gray-400 hover:text-white">
              Деталі помилки (тільки для розробки)
            </summary>
            <pre className="mt-2 p-4 bg-gray-800 rounded text-xs overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
