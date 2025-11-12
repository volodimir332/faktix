/**
 * 🛠 Автофікс проблем з кольорами oklab/oklch
 * 
 * Ця утиліта автоматично виправляє проблеми з сучасними форматами кольорів oklab() та oklch(),
 * які не підтримуються деякими браузерами та бібліотеками (html2canvas, jsPDF тощо).
 * 
 * Використання:
 * - Викликайте patchUnsupportedColors() при ініціалізації додатку
 * - Або викликайте перед генерацією PDF/скріншотів
 */

export interface ColorFixOptions {
  /** Запасний колір для заміни (за замовчуванням: #ffffff) */
  fallbackColor?: string;
  /** Чи виводити попередження в консоль (за замовчуванням: true) */
  logWarnings?: boolean;
  /** Додаткові формати кольорів для виправлення */
  additionalFormats?: string[];
}

/**
 * Перевіряє, чи містить значення CSS несумісні формати кольорів
 */
export function hasUnsupportedColor(value: string, additionalFormats: string[] = []): boolean {
  const formats = ['oklab(', 'oklch(', ...additionalFormats];
  return formats.some(format => value.includes(format));
}

/**
 * Замінює несумісні кольори в CSS правилах
 */
export function patchCSSRule(
  rule: CSSStyleRule,
  fallbackColor: string = '#ffffff',
  logWarnings: boolean = true,
  additionalFormats: string[] = []
): number {
  let replacedCount = 0;
  
  if (!rule.style) return replacedCount;
  
  for (const prop of Array.from(rule.style)) {
    const val = rule.style.getPropertyValue(prop);
    
    if (hasUnsupportedColor(val, additionalFormats)) {
      rule.style.setProperty(prop, fallbackColor, 'important');
      replacedCount++;
      
      if (logWarnings) {
        console.warn(
          `⚠️ Замінено несумісний колір у: ${rule.selectorText || 'unknown'}`,
          `\n   Властивість: ${prop}`,
          `\n   Старе значення: ${val}`,
          `\n   Нове значення: ${fallbackColor}`
        );
      }
    }
  }
  
  return replacedCount;
}

/**
 * Головна функція для автоматичного виправлення всіх несумісних кольорів на сторінці
 */
export function patchUnsupportedColors(options: ColorFixOptions = {}): void {
  // Перевірка на серверне середовище
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return; // Нічого не робимо на сервері
  }
  
  const {
    fallbackColor = '#ffffff',
    logWarnings = true,
    additionalFormats = []
  } = options;
  
  const startTime = performance.now();
  let totalReplacements = 0;
  let totalSheets = 0;
  let skippedSheets = 0;
  
  if (logWarnings) {
    console.log('🔧 Починаємо перевірку та виправлення несумісних кольорів...');
  }
  
  // Перевіряємо всі таблиці стилів на сторінці
  const styleSheets = Array.from(document.styleSheets);
  
  styleSheets.forEach((sheet, sheetIndex) => {
    try {
      totalSheets++;
      const rules = sheet.cssRules || sheet.rules || [];
      
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        
        if (rule instanceof CSSStyleRule) {
          const replaced = patchCSSRule(
            rule,
            fallbackColor,
            logWarnings,
            additionalFormats
          );
          totalReplacements += replaced;
        }
      }
    } catch (err) {
      // Ігноруємо помилки доступу до стилів з інших доменів (CORS)
      skippedSheets++;
      if (logWarnings && err instanceof Error) {
        console.debug(
          `ℹ️ Пропущено таблицю стилів #${sheetIndex}:`,
          err.message,
          '\n(Це нормально для зовнішніх стилів)'
        );
      }
    }
  });
  
  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);
  
  if (logWarnings) {
    console.log(
      `✅ Виправлення завершено за ${duration}ms`,
      `\n   Перевірено таблиць: ${totalSheets}`,
      `\n   Пропущено (CORS): ${skippedSheets}`,
      `\n   Виправлено кольорів: ${totalReplacements}`
    );
  }
}

/**
 * Створює CSS fallback для проблемних властивостей
 * Використовуйте це в inline стилях або CSS-in-JS
 */
export function createColorFallback(modernColor: string, fallbackColor: string): string {
  return fallbackColor; // Для PDF та старих браузерів
}

/**
 * Додає fallback кольори до inline стилів елемента
 */
export function patchElementStyles(
  element: HTMLElement,
  fallbackColor: string = '#ffffff'
): void {
  // Перевірка на серверне середовище
  if (typeof window === 'undefined') {
    return;
  }
  
  const style = window.getComputedStyle(element);
  
  // Перевіряємо color
  if (hasUnsupportedColor(style.color)) {
    element.style.setProperty('color', fallbackColor, 'important');
  }
  
  // Перевіряємо background-color
  if (hasUnsupportedColor(style.backgroundColor)) {
    element.style.setProperty('background-color', fallbackColor, 'important');
  }
  
  // Перевіряємо border-color
  if (hasUnsupportedColor(style.borderColor)) {
    element.style.setProperty('border-color', fallbackColor, 'important');
  }
}

/**
 * Рекурсивно виправляє кольори для елемента та всіх його нащадків
 */
export function patchElementTree(
  rootElement: HTMLElement,
  fallbackColor: string = '#ffffff'
): number {
  // Перевірка на серверне середовище
  if (typeof window === 'undefined') {
    return 0;
  }
  
  let fixedCount = 0;
  const elements = rootElement.querySelectorAll('*');
  
  elements.forEach(el => {
    if (el instanceof HTMLElement) {
      patchElementStyles(el, fallbackColor);
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Агресивно форсує всі computed styles як inline styles з безпечними кольорами
 * Використовується перед html2canvas для гарантованого уникнення oklab/oklch
 */
export function forceInlineStyles(
  rootElement: HTMLElement,
  colorReplacements: Record<string, string> = {}
): number {
  // Перевірка на серверне середовище
  if (typeof window === 'undefined') {
    return 0;
  }
  
  let fixedCount = 0;
  const elements = [rootElement, ...Array.from(rootElement.querySelectorAll('*'))];
  
  // Властивості, які треба форсувати
  const colorProperties = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
    'textDecorationColor',
    'caretColor'
  ];
  
  elements.forEach(el => {
    if (!(el instanceof HTMLElement)) return;
    
    const computed = window.getComputedStyle(el);
    
    colorProperties.forEach(prop => {
      const value = computed.getPropertyValue(prop);
      
      if (!value || value === 'none' || value === 'transparent') return;
      
      // Перевіряємо на oklab/oklch
      if (hasUnsupportedColor(value)) {
        // Замінюємо на безпечний колір
        const safeProp = prop.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        
        // Визначаємо безпечний колір
        let safeColor = '#ffffff';
        
        // Якщо це текст, використовуємо чорний
        if (prop === 'color') {
          safeColor = '#000000';
        }
        // Якщо це фон, використовуємо білий
        else if (prop === 'backgroundColor') {
          safeColor = '#ffffff';
        }
        // Для border використовуємо сірий
        else if (prop.includes('border') || prop.includes('Border')) {
          safeColor = '#e5e5e5';
        }
        
        // Перевіряємо custom replacements
        if (colorReplacements[prop]) {
          safeColor = colorReplacements[prop];
        }
        
        el.style.setProperty(safeProp, safeColor, 'important');
        fixedCount++;
      } else {
        // Навіть якщо колір безпечний, форсуємо його як inline для html2canvas
        const safeProp = prop.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        el.style.setProperty(safeProp, value);
      }
    });
  });
  
  return fixedCount;
}

/**
 * ПРАВИЛЬНЕ виправлення: зберігає класи, але додає inline styles з !important
 * Це перезаписує oklab кольори, але зберігає layout
 */
export function overrideOklabColors(rootElement: HTMLElement): number {
  // Перевірка на серверне середовище
  if (typeof window === 'undefined') {
    return 0;
  }
  
  let fixedCount = 0;
  const elements = [rootElement, ...Array.from(rootElement.querySelectorAll('*'))];
  
  // Тільки кольорові властивості
  const colorProperties = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
    'textDecorationColor',
    'fill',
    'stroke'
  ];
  
  elements.forEach(el => {
    if (!(el instanceof HTMLElement)) return;
    
    const computed = window.getComputedStyle(el);
    
    colorProperties.forEach(prop => {
      const cssProperty = prop.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      const value = computed.getPropertyValue(cssProperty);
      
      if (!value || value === 'none' || value === 'transparent') return;
      
      // Перевіряємо на oklab/oklch
      if (hasUnsupportedColor(value)) {
        // Визначаємо безпечний колір
        let safeColor = '#000000';
        
        if (prop === 'color' || prop === 'fill' || prop === 'stroke') {
          safeColor = '#000000'; // Чорний для тексту
        } else if (prop === 'backgroundColor') {
          safeColor = '#ffffff'; // Білий для фону
        } else if (prop.includes('border') || prop.includes('Border')) {
          safeColor = '#e5e5e5'; // Сірий для рамок
        } else if (prop === 'outlineColor') {
          safeColor = '#000000';
        }
        
        // Додаємо inline style з !important (не видаляємо класи!)
        el.style.setProperty(cssProperty, safeColor, 'important');
        fixedCount++;
      }
    });
  });
  
  return fixedCount;
}

/**
 * РОЗУМНЕ виправлення: зберігає дизайн, але замінює oklab/oklch на безпечні кольори
 * Працює з клонованим документом в html2canvas onclone callback
 */
export function fixClonedDocument(doc: Document): void {
  if (!doc.body) return;
  
  console.log('🎨 УЛЬТРА-РАДИКАЛЬНЕ виправлення: знищуємо всі oklab/oklch...');
  
  // Крок 1: Видаляємо ВСІ <style> теги, які містять oklab/oklch
  const styleTags = doc.querySelectorAll('style');
  let removedStyles = 0;
  styleTags.forEach(styleTag => {
    if (styleTag.textContent && (styleTag.textContent.includes('oklab') || styleTag.textContent.includes('oklch'))) {
      // Замість видалення - очищаємо вміст (безпечніше)
      let cleaned = styleTag.textContent;
      
      // Замінюємо окремі oklab/oklch функції
      cleaned = cleaned.replace(/oklab\([^)]+\)/g, '#000000');
      cleaned = cleaned.replace(/oklch\([^)]+\)/g, '#000000');
      
      // КРИТИЧНО: Видаляємо цілі CSS правила з градієнтами що містять oklab
      // Знаходимо і видаляємо background-image з gradient + oklab
      cleaned = cleaned.replace(/background-image\s*:\s*linear-gradient\([^;]*oklab[^;]*\)\s*;?/gi, 'background-image: none;');
      cleaned = cleaned.replace(/background-image\s*:\s*linear-gradient\([^;]*oklch[^;]*\)\s*;?/gi, 'background-image: none;');
      cleaned = cleaned.replace(/background\s*:\s*linear-gradient\([^;]*oklab[^;]*\)\s*;?/gi, 'background: #000000;');
      cleaned = cleaned.replace(/background\s*:\s*linear-gradient\([^;]*oklch[^;]*\)\s*;?/gi, 'background: #000000;');
      
      styleTag.textContent = cleaned;
      removedStyles++;
    }
  });
  console.log(`✅ Очищено ${removedStyles} <style> тегів від oklab/oklch`);
  
  // Крок 2: Створюємо детальний CSS з безпечними кольорами
  const style = doc.createElement('style');
  style.id = 'oklab-safe-colors';
  
  // Детальний CSS який зберігає дизайн
  style.textContent = `
    /* ПОВНА блокада oklab/oklch */
    * {
      color: revert !important;
      background-color: revert !important;
      border-color: revert !important;
    }
    
    /* Базові кольори тексту */
    .text-black { color: #000000 !important; }
    .text-white { color: #ffffff !important; }
    .text-gray-900 { color: #111827 !important; }
    .text-gray-800 { color: #1f2937 !important; }
    .text-gray-700 { color: #374151 !important; }
    .text-gray-600 { color: #4b5563 !important; }
    .text-gray-500 { color: #6b7280 !important; }
    .text-gray-400 { color: #9ca3af !important; }
    .text-gray-300 { color: #d1d5db !important; }
    .text-money { color: #10b981 !important; }
    .text-money-light { color: #34d399 !important; }
    .text-red-500 { color: #ef4444 !important; }
    .text-red-600 { color: #dc2626 !important; }
    .text-orange-500 { color: #f97316 !important; }
    .text-blue-500 { color: #3b82f6 !important; }
    
    /* Базові фони */
    .bg-white { background-color: #ffffff !important; }
    .bg-black { background-color: #000000 !important; }
    .bg-gray-50 { background-color: #f9fafb !important; }
    .bg-gray-100 { background-color: #f3f4f6 !important; }
    .bg-gray-200 { background-color: #e5e7eb !important; }
    .bg-gray-800 { background-color: #1f2937 !important; }
    .bg-gray-900 { background-color: #111827 !important; }
    .bg-money { background-color: #10b981 !important; }
    .bg-money-light { background-color: #d1fae5 !important; }
    .bg-red-100 { background-color: #fee2e2 !important; }
    .bg-orange-100 { background-color: #ffedd5 !important; }
    .bg-blue-100 { background-color: #dbeafe !important; }
    
    /* Рамки */
    .border-gray-200 { border-color: #e5e7eb !important; }
    .border-gray-300 { border-color: #d1d5db !important; }
    .border-gray-700 { border-color: #374151 !important; }
    .border-money { border-color: #10b981 !important; }
    
    /* Градієнти - ПОВНІСТЮ ВИДАЛЕНО, замінено на простий фон */
    .bg-gradient-to-br,
    .bg-gradient-to-r,
    .bg-gradient-to-l,
    .bg-gradient-to-t,
    .bg-gradient-to-b,
    .bg-gradient-to-tr,
    .bg-gradient-to-tl,
    .bg-gradient-to-bl {
      background-image: none !important;
      background-color: #000000 !important;
    }
    .from-black,
    .from-gray-900,
    .from-money,
    .via-black,
    .via-gray-900,
    .to-black,
    .to-gray-900 {
      /* Ігноруємо ці класи - вони тепер марні */
    }
    
    /* Таблиці */
    table { background-color: #ffffff !important; }
    thead { background-color: #f9fafb !important; }
    th { background-color: #f9fafb !important; color: #374151 !important; }
    td { color: #111827 !important; }
    
    /* Тіні */
    .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
    .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1) !important; }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1) !important; }
  `;
  
  if (doc.head) {
    doc.head.insertBefore(style, doc.head.firstChild);
    console.log('✅ Безпечні кольори додано');
  }
  
  // Крок 3: Виправляємо ВСІ inline стилі
  const elements = doc.querySelectorAll('*');
  let fixedInlineCount = 0;
  
  elements.forEach(el => {
    if (!(el instanceof HTMLElement)) return;
    
    // Перевіряємо inline стилі
    const inlineStyle = el.getAttribute('style') || '';
    if (inlineStyle.includes('oklab') || inlineStyle.includes('oklch')) {
      let fixedStyle = inlineStyle;
      
      // Замінюємо окремі oklab/oklch
      fixedStyle = fixedStyle.replace(/oklab\([^)]+\)/g, '#000000');
      fixedStyle = fixedStyle.replace(/oklch\([^)]+\)/g, '#000000');
      
      // КРИТИЧНО: Видаляємо градієнти з oklab/oklch
      if (fixedStyle.includes('gradient')) {
        fixedStyle = fixedStyle.replace(/background-image\s*:\s*linear-gradient\([^;)]*\)/gi, 'background-image: none');
        fixedStyle = fixedStyle.replace(/background\s*:\s*linear-gradient\([^;)]*\)/gi, 'background: #000000');
        // Додаємо чорний фон якщо був градієнт
        if (!fixedStyle.includes('background-color')) {
          fixedStyle += '; background-color: #000000';
        }
      }
      
      el.setAttribute('style', fixedStyle);
      fixedInlineCount++;
    }
  });
  
  console.log(`✅ Виправлено ${fixedInlineCount} inline стилів з oklab`);
  
  // Крок 3.5: Видаляємо Tailwind gradient класи (bg-gradient-*)
  let removedGradientClasses = 0;
  elements.forEach(el => {
    if (!(el instanceof HTMLElement)) return;
    
    const classes = el.className;
    if (typeof classes === 'string' && classes.includes('bg-gradient')) {
      // Видаляємо всі gradient класи
      const newClasses = classes.split(' ').filter(c => 
        !c.startsWith('bg-gradient') && 
        !c.startsWith('from-') && 
        !c.startsWith('via-') && 
        !c.startsWith('to-')
      ).join(' ');
      
      if (newClasses !== classes) {
        el.className = newClasses;
        // Додаємо чорний фон замість градієнта
        el.style.setProperty('background-color', '#000000', 'important');
        el.style.setProperty('background-image', 'none', 'important');
        removedGradientClasses++;
      }
    }
  });
  
  if (removedGradientClasses > 0) {
    console.log(`✅ Видалено gradient класи з ${removedGradientClasses} елементів`);
  }
  
  // Крок 4: АГРЕСИВНО виправляємо computed styles
  // Це критично для html2canvas, який читає computed styles
  let fixedComputedCount = 0;
  
  elements.forEach(el => {
    if (!(el instanceof HTMLElement)) return;
    
    try {
      const computed = doc.defaultView?.getComputedStyle(el);
      if (!computed) return;
      
      const propsToCheck = [
        'color', 
        'backgroundColor', 
        'background',
        'backgroundImage',
        'borderColor', 
        'borderTopColor', 
        'borderRightColor', 
        'borderBottomColor', 
        'borderLeftColor',
        'outlineColor',
        'fill',
        'stroke'
      ];
      
      let needsFix = false;
      const fixes: Array<[string, string]> = [];
      
      for (const prop of propsToCheck) {
        const value = computed.getPropertyValue(prop);
        if (value && (value.includes('oklab') || value.includes('oklch'))) {
          needsFix = true;
          
          // Спеціальна обробка для градієнтів
          if (prop === 'backgroundImage' || prop === 'background') {
            if (value.includes('gradient')) {
              // Замінюємо градієнт на простий чорний фон
              fixes.push([prop, 'none']);
              fixes.push(['backgroundColor', '#000000']);
            } else {
              fixes.push([prop, 'none']);
            }
          } else {
            // Замінюємо на чорний або білий в залежності від властивості
            const safeColor = prop.includes('background') ? '#ffffff' : '#000000';
            fixes.push([prop, safeColor]);
          }
        }
      }
      
      if (needsFix) {
        // Застосовуємо виправлення через inline стиль
        for (const [prop, value] of fixes) {
          el.style.setProperty(prop, value, 'important');
        }
        fixedComputedCount++;
      }
    } catch (e) {
      // Ігноруємо помилки для окремих елементів
    }
  });
  
  console.log(`✅ Виправлено ${fixedComputedCount} computed стилів з oklab`);
  
  // Крок 5: Видаляємо oklab/oklch з усіх CSS правил у stylesheets
  let fixedRules = 0;
  try {
    const sheets = Array.from(doc.styleSheets || []);
    sheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || []);
        rules.forEach((rule, index) => {
          if (rule instanceof CSSStyleRule) {
            const styleText = rule.style.cssText;
            if (styleText && (styleText.includes('oklab') || styleText.includes('oklch'))) {
              // Видаляємо це правило
              try {
                sheet.deleteRule(index);
                fixedRules++;
              } catch (e) {
                // Не вдалося видалити - спробуємо замінити
                for (let i = 0; i < rule.style.length; i++) {
                  const prop = rule.style[i];
                  const value = rule.style.getPropertyValue(prop);
                  if (value && (value.includes('oklab') || value.includes('oklch'))) {
                    rule.style.setProperty(prop, '#000000', 'important');
                  }
                }
              }
            }
          }
        });
      } catch (e) {
        // Ігноруємо помилки з окремими sheets (CORS тощо)
      }
    });
  } catch (e) {
    console.log('⚠️ Не вдалося виправити CSS правила (це нормально)');
  }
  
  if (fixedRules > 0) {
    console.log(`✅ Видалено ${fixedRules} CSS правил з oklab`);
  }
  
  console.log(`✅ ЗАГАЛОМ виправлено: ${fixedInlineCount + fixedComputedCount} елементів + ${fixedRules} CSS правил`);
}

/**
 * ЗАСТАРІЛА: УЛЬТРА-АГРЕСИВНЕ виправлення: видаляє всі class names і копіює computed styles
 * Це гарантує, що Tailwind CSS oklab кольори не будуть використовуватись
 * УВАГА: Руйнує layout! Використовуйте overrideOklabColors замість цього
 */
export function stripClassesAndForceStyles(rootElement: HTMLElement): number {
  // Перевірка на серверне середовище
  if (typeof window === 'undefined') {
    return 0;
  }
  
  let fixedCount = 0;
  const elements = [rootElement, ...Array.from(rootElement.querySelectorAll('*'))];
  
  // Всі CSS властивості, які треба копіювати
  const importantProps = [
    // Colors
    'color', 'backgroundColor', 'borderColor',
    'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
    // Layout
    'display', 'position', 'top', 'right', 'bottom', 'left',
    'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight',
    'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    // Flexbox
    'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignContent', 'gap',
    'flex', 'flexGrow', 'flexShrink', 'flexBasis',
    // Grid
    'gridTemplateColumns', 'gridTemplateRows', 'gridColumn', 'gridRow', 'gridGap',
    // Border
    'border', 'borderWidth', 'borderStyle', 'borderRadius',
    'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
    // Text
    'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'textAlign',
    'textDecoration', 'textTransform', 'letterSpacing', 'wordSpacing',
    // Other
    'opacity', 'boxShadow', 'overflow', 'overflowX', 'overflowY',
    'zIndex', 'transform', 'transition'
  ];
  
  elements.forEach(el => {
    if (!(el instanceof HTMLElement)) return;
    
    // Отримуємо computed styles ПЕРЕД видаленням класів
    const computed = window.getComputedStyle(el);
    
    // Видаляємо ВСІ класи
    const hadClasses = el.className.length > 0;
    el.removeAttribute('class');
    
    // Копіюємо важливі властивості як inline styles
    importantProps.forEach(prop => {
      let value = computed.getPropertyValue(prop.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`));
      
      if (!value || value === 'none') return;
      
      // Якщо це колір з oklab/oklch - замінюємо
      if (hasUnsupportedColor(value)) {
        if (prop === 'color') {
          value = '#000000';
        } else if (prop === 'backgroundColor') {
          value = '#ffffff';
        } else if (prop.includes('border') || prop.includes('Border')) {
          value = '#e5e5e5';
        } else {
          value = '#000000';
        }
        fixedCount++;
      }
      
      // Встановлюємо як inline style з !important
      const cssProp = prop.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      el.style.setProperty(cssProp, value, 'important');
    });
    
    if (hadClasses) {
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Автоматично запускає виправлення після завантаження DOM
 */
export function autoFixOnLoad(options: ColorFixOptions = {}): void {
  // Перевірка на серверне середовище
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return; // Не запускаємо на сервері
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      patchUnsupportedColors(options);
    });
  } else {
    // DOM вже завантажено
    patchUnsupportedColors(options);
  }
  
  // Додатково запускаємо після повного завантаження
  window.addEventListener('load', () => {
    patchUnsupportedColors({ ...options, logWarnings: false });
  });
}

