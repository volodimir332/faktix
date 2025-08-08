'use client';

import { usePathname } from 'next/navigation';
import SmartAIAssistant from './SmartAIAssistant';

export default function ConditionalAIAssistant() {
  const pathname = usePathname();
  
  // Список сторінок, де НЕ показувати AI асистента
  const excludedPaths = ['/', '/prihlaseni', '/registrace'];
  
  // Показувати AI асистента тільки якщо поточна сторінка НЕ в списку виключень
  const shouldShowAI = pathname ? !excludedPaths.includes(pathname) : true;
  
  if (!shouldShowAI) {
    return null;
  }
  
  return <SmartAIAssistant apiKey="sk-88afcb2330714e84a2d319156c27e406" />;
} 