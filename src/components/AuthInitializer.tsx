"use client";

import { useEffect } from 'react';
import { initializeAuthStateListener } from '@/lib/auth-state-listener';

export function AuthInitializer() {
  useEffect(() => {
    console.log('🔐 AuthInitializer: Initializing global auth state listener...');
    
    // Ініціалізуємо центральний Auth State Listener
    const unsubscribe = initializeAuthStateListener();
    
    // Очищення при розмонтуванні
    return () => {
      console.log('🔐 AuthInitializer: Cleaning up auth state listener...');
      unsubscribe();
    };
  }, []);

  // Цей компонент не рендерить нічого
  return null;
}









