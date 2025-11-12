'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Редирект на нову сторінку входу з Google Authentication
export default function LoginRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/prihlaseni');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-money mx-auto"></div>
        <p className="mt-4 text-gray-400">Přesměrování...</p>
      </div>
    </div>
  );
}
