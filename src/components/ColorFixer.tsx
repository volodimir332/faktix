'use client';

import { useEffect } from 'react';
import { patchUnsupportedColors, type ColorFixOptions } from '@/lib/color-fix';

/**
 * 🎨 ColorFixer Component
 * 
 * Автоматично виправляє проблеми з несумісними форматами кольорів (oklab, oklch)
 * на всій сторінці. Запускається один раз при монтуванні.
 * 
 * Використання:
 * ```tsx
 * <ColorFixer fallbackColor="#ffffff" />
 * ```
 */

interface ColorFixerProps {
  /** Запасний колір для заміни (за замовчуванням: #ffffff) */
  fallbackColor?: string;
  /** Чи виводити попередження в консоль (за замовчуванням: false у продакшні) */
  logWarnings?: boolean;
  /** Додаткові формати кольорів для виправлення */
  additionalFormats?: string[];
  /** Чи запускати виправлення при кожній зміні DOM (за замовчуванням: false) */
  watchDOM?: boolean;
}

export function ColorFixer({
  fallbackColor = '#ffffff',
  logWarnings = process.env.NODE_ENV === 'development',
  additionalFormats = [],
  watchDOM = false,
}: ColorFixerProps) {
  useEffect(() => {
    const options: ColorFixOptions = {
      fallbackColor,
      logWarnings,
      additionalFormats,
    };
    
    // Початкове виправлення
    patchUnsupportedColors(options);
    
    // Опціонально: спостерігати за змінами DOM
    if (watchDOM && typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => {
        // Виправляємо без логів для продуктивності
        patchUnsupportedColors({ ...options, logWarnings: false });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
      
      return () => {
        observer.disconnect();
      };
    }
  }, [fallbackColor, logWarnings, additionalFormats, watchDOM]);
  
  // Цей компонент нічого не рендерить
  return null;
}


