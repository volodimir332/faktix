"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import Link from 'next/link';
import { FaktixLogo } from '@/components/FaktixLogo';
import { CloudBackground } from '@/components/CloudBackground';

interface EmailVerificationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function EmailVerificationGuard({ 
  children, 
  fallback 
}: EmailVerificationGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Якщо користувач не авторизований, перенаправляємо на логін
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/prihlaseni');
    }
  }, [isAuthenticated, router]);

  // Якщо користувач авторизований але email не підтверджений
  if (isAuthenticated && user && !user.emailVerified) {
    const handleResendVerification = async () => {
      if (!auth.currentUser) return;
      
      setIsResending(true);
      try {
        await sendEmailVerification(auth.currentUser);
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } catch (error) {
        console.error('Помилка відправки email:', error);
      } finally {
        setIsResending(false);
      }
    };

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <CloudBackground />
        
        <div className="w-full max-w-md relative z-10">
          <div className="backdrop-blur-md bg-black/40 border border-gray-700/50 shadow-2xl shadow-black/50 rounded-lg p-6">
            <div className="text-center mb-6">
              <Link href="/" className="inline-flex mb-6">
                <FaktixLogo size="lg" />
              </Link>
              
              <div className="mx-auto mb-4 w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <span className="text-yellow-500 text-2xl">📧</span>
              </div>
              
              <h1 className="text-2xl font-bold text-money">
                Підтвердіть вашу пошту
              </h1>
            </div>
            
            <div className="space-y-4">
              <div className="text-center text-gray-400">
                <p className="mb-2">
                  Ми надіслали лист для підтвердження на адресу:
                </p>
                <p className="font-medium text-white">{user.email}</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400 text-lg">ℹ️</span>
                  <div className="text-sm text-blue-400">
                    <p className="font-medium mb-1">Що робити далі:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Перевірте вашу поштову скриньку</li>
                      <li>• Знайдіть лист від Faktix</li>
                      <li>• Натисніть посилання для підтвердження</li>
                      <li>• Поверніться на сайт</li>
                    </ul>
                  </div>
                </div>
              </div>

              {resendSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 text-lg">✅</span>
                    <span className="text-sm text-green-400">
                      Лист для підтвердження надіслано знову!
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full bg-money text-black hover:bg-money-dark disabled:bg-gray-600 disabled:text-gray-400 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isResending ? (
                    <>
                      <span className="animate-spin mr-2">🔄</span>
                      Надсилаємо...
                    </>
                  ) : (
                    <>
                      📧 Надіслати лист знову
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-transparent border border-gray-600 text-white hover:bg-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🔄 Оновити сторінку
                </button>

                <button
                  onClick={() => router.push('/prihlaseni')}
                  className="w-full bg-transparent text-gray-400 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Увійти з іншим акаунтом
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Якщо email підтверджений або користувач не авторизований, показуємо дітей
  return <>{children}</>;
}
