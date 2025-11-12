'use client';

import { usePathname } from 'next/navigation';
import SmartAIAssistant from './SmartAIAssistant';
import { useAuth } from '@/hooks/useAuth';

export default function ConditionalAIAssistant() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  
  // Список сторінок, де НЕ показувати AI асистента
  const excludedExact: string[] = [
    '/',
    '/login',
    '/register',
    '/prihlaseni',
    '/registrace',
    '/pricing',
    '/potvrdit-email',
    '/email-verification',
    '/payment-success'
  ];

  const excludedPrefixes: string[] = ['/test'];

  const isExcludedPath = (p: string | null): boolean => {
    if (!p) return true;
    if (excludedExact.includes(p)) return true;
    return excludedPrefixes.some((prefix) => p.startsWith(prefix));
  };

  // Показувати тільки для авторизованих користувачів і не на екранах лендингу/логіну/реєстрації
  const shouldShowAI = isAuthenticated && !isExcludedPath(pathname);
  
  if (!shouldShowAI) {
    return null;
  }
  
  return <SmartAIAssistant apiKey="sk-88afcb2330714e84a2d319156c27e406" />;
} 