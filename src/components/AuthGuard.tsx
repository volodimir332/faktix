"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Чекаємо завершення завантаження

    console.log('AuthGuard: Checking authentication for pathname:', pathname);
    console.log('AuthGuard: isAuthenticated:', isAuthenticated);

    // Публічні сторінки (доступні без авторизації)
    const publicRoutes = ['/', '/prihlaseni', '/registrace', '/test'];
    const isPublicRoute = pathname ? publicRoutes.includes(pathname) : false;

    // Приватні сторінки (потребують авторизації)  
    const privateRoutes = ['/dashboard', '/faktury', '/analytiky', '/profil', '/nastaveni', '/klienti'];
    const isPrivateRoute = pathname ? privateRoutes.some(route => pathname.startsWith(route)) : false;

    console.log('AuthGuard Debug:', {
      pathname,
      isAuthenticated,
      isPublicRoute,
      isPrivateRoute,
      isLoading
    });

    // Швидка перевірка для публічних сторінок
    if (isPublicRoute) {
      console.log('AuthGuard: Public route, showing content immediately');
      return;
    }

    // Перевірка для приватних сторінок
    if (isPrivateRoute && !isAuthenticated) {
      console.log('AuthGuard: Private route without auth, redirecting to home');
      router.replace('/');
      return;
    }

    // Якщо авторизований на публічній сторінці
    if (isAuthenticated && isPublicRoute) {
      console.log('AuthGuard: Logged in on public route, redirecting to dashboard');
      router.replace('/dashboard');
      return;
    }

    // Всі інші випадки - показуємо контент
    console.log('AuthGuard: Showing content');

  }, [pathname, isAuthenticated, isLoading, router]);

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

  return <>{children}</>;
} 