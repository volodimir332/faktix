"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import EmailVerificationGuard from './EmailVerificationGuard';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Чекаємо завершення завантаження

    console.log('🔐 AuthGuard: Checking authentication for pathname:', pathname);
    console.log('🔐 AuthGuard: isAuthenticated:', isAuthenticated);
    console.log('🔐 AuthGuard: user:', user);

    // Публічні сторінки (доступні без авторизації)
    const publicRoutes = ['/', '/prihlaseni', '/registrace', '/test', '/potvrdit-email'];
    const isPublicRoute = pathname ? publicRoutes.includes(pathname) : false;

    // Приватні сторінки (потребують авторизації)  
    const privateRoutes = ['/dashboard', '/faktury', '/analytiky', '/profil', '/nastaveni', '/klienti'];
    const isPrivateRoute = pathname ? privateRoutes.some(route => pathname.startsWith(route)) : false;

    console.log('🔐 AuthGuard Debug:', {
      pathname,
      isAuthenticated,
      isPublicRoute,
      isPrivateRoute,
      isLoading,
      userEmail: user?.email,
      emailVerified: user?.emailVerified
    });

    // Користувач авторизований ТА його email підтверджений
    if (isAuthenticated && user && user.emailVerified) {
      console.log('✅ AuthGuard: User authenticated and email verified');
      
      // Якщо він на публічній сторінці (лендінг, логін, реєстрація), перенаправляємо на дашборд
      if (isPublicRoute) {
        console.log('🔄 AuthGuard: Redirecting authenticated user from public route to dashboard');
        router.replace('/dashboard');
        return;
      }
      
      // Якщо він на приватній сторінці - дозволяємо доступ
      if (isPrivateRoute) {
        console.log('✅ AuthGuard: User has access to private route');
        return;
      }
    }
    
    // Користувач авторизований, але email НЕ підтверджений
    else if (isAuthenticated && user && !user.emailVerified) {
      console.log('⚠️ AuthGuard: User authenticated but email not verified');
      
      // Якщо він не на сторінці підтвердження email, перенаправляємо туди
      if (pathname !== '/potvrdit-email') {
        console.log('🔄 AuthGuard: Redirecting unverified user to email verification page');
        router.replace('/potvrdit-email');
        return;
      }
      
      // Якщо він на сторінці підтвердження - дозволяємо доступ
      return;
    }
    
    // Користувач НЕ авторизований
    else {
      console.log('❌ AuthGuard: User not authenticated');
      
      // Якщо він намагається зайти на приватну сторінку, перенаправляємо на лендінг
      if (isPrivateRoute) {
        console.log('🔄 AuthGuard: Redirecting unauthenticated user from private route to landing');
        router.replace('/');
        return;
      }
      
      // Якщо він на публічній сторінці - дозволяємо доступ
      if (isPublicRoute) {
        console.log('✅ AuthGuard: User has access to public route');
        return;
      }
    }

    // Всі інші випадки - показуємо контент
    console.log('✅ AuthGuard: Showing content');

  }, [pathname, isAuthenticated, isLoading, router, user]);

  // Показуємо loader під час перевірки
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-6 border-2 border-money shadow-lg shadow-money/30 animate-pulse">
            <span className="text-white font-black text-xl font-mono">f</span>
          </div>
          <div className="text-white text-2xl font-bold mb-2">faktix</div>
          <div className="text-gray-400 text-sm">Ověřování přístupu...</div>
          {/* Loading animation */}
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-2 border-money border-t-transparent rounded-full animate-spin"></div>
          </div>
          {/* Debug info */}
          <div className="mt-4 text-xs text-gray-500">
            Path: {pathname} | Loading: {isLoading.toString()} | Auth: {isAuthenticated.toString()}
          </div>
        </div>
      </div>
    );
  }

  // Для приватних сторінок використовуємо EmailVerificationGuard
  const privateRoutes = ['/dashboard', '/faktury', '/analytiky', '/profil', '/nastaveni', '/klienti'];
  const isPrivateRoute = pathname ? privateRoutes.some(route => pathname.startsWith(route)) : false;

  if (isPrivateRoute && isAuthenticated) {
    return (
      <EmailVerificationGuard>
        {children}
      </EmailVerificationGuard>
    );
  }

  return <>{children}</>;
} 