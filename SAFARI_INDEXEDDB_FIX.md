# 🍎 Safari IndexedDB Fix

## Проблема

Safari має відомі проблеми з IndexedDB, які призводять до помилок:
```
UnknownError: Connection to Indexed Database server lost. Refresh the page to try again
```

Firebase Firestore використовує IndexedDB для offline persistence, що спричиняє краші в Safari.

---

## ✅ Рішення

### 1️⃣ Детекція Safari та відключення persistence

**Файл:** `src/lib/firebase.ts`

```typescript
// Налаштування persistence тільки в браузері
if (typeof window !== 'undefined') {
  // Перевіряємо чи це Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isSafari) {
    console.log('🍎 Safari detected - IndexedDB persistence DISABLED');
    // Не використовуємо persistence в Safari
  } else {
    // Для інших браузерів увімкнути multi-tab persistence
    enableMultiTabIndexedDbPersistence(db)
      .then(() => console.log('✅ Persistence enabled'))
      .catch((err) => {
        // Graceful fallback
        console.warn('⚠️ Persistence error:', err.message);
      });
  }
}
```

### 2️⃣ Що це означає?

**В Safari:**
- ❌ Немає offline кешування даних
- ✅ Всі запити до Firestore через мережу
- ✅ Немає крашів IndexedDB
- ✅ Стабільна робота

**В Chrome/Firefox/Edge:**
- ✅ Є offline кешування
- ✅ Швидша робота (дані з кешу)
- ✅ Multi-tab синхронізація

---

## 🔧 Додаткові виправлення

### Metadata Warnings (Next.js 15+)

**Проблема:**
```
⚠ Unsupported metadata themeColor/viewport in metadata export
```

**Рішення:** Винести `themeColor` і `viewport` в окремий export

**Файл:** `src/app/layout.tsx`

**Було:**
```typescript
export const metadata = {
  // ...
  themeColor: "#00ff88",
  viewport: {
    width: "device-width",
    initialScale: 1,
  }
};
```

**Стало:**
```typescript
export const metadata = {
  // ... без themeColor і viewport
};

// Окремий export
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#00ff88",
};
```

---

## 📊 Результат

### До виправлення:
- ❌ 100+ IndexedDB помилок в Safari
- ❌ WebSocket crashes
- ❌ Metadata warnings

### Після виправлення:
- ✅ Немає IndexedDB помилок
- ✅ Стабільна робота в Safari
- ✅ Немає metadata warnings
- ✅ Всі дані зберігаються коректно

---

## 🧪 Як перевірити:

1. **Відкрийте Safari**
2. **Перейдіть на:** http://localhost:3000
3. **Перевірте консоль:**
   - Має бути: `🍎 Safari detected - IndexedDB persistence DISABLED`
   - Не має бути: `UnknownError: Connection to Indexed Database`

4. **Перевірте функціональність:**
   - Авторизація працює ✅
   - Клієнти зберігаються ✅
   - Фактури створюються ✅
   - Калькуляції працюють ✅

---

## 🔍 Технічні деталі

### Safari User Agent Detection

```typescript
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
```

Цей regex:
- ✅ Знаходить Safari (desktop + mobile)
- ✅ Виключає Chrome (містить "safari" в UA)
- ✅ Виключає Android WebView

### Firestore Persistence API

```typescript
enableMultiTabIndexedDbPersistence(db)  // Multi-tab
enableIndexedDbPersistence(db)          // Single-tab
```

**Error codes:**
- `failed-precondition` - Multiple tabs open
- `unimplemented` - Browser не підтримує
- `permission-denied` - User заборонив

---

## 📚 Корисні посилання

- [Firebase Persistence Docs](https://firebase.google.com/docs/firestore/manage-data/enable-offline)
- [Safari IndexedDB Issues](https://bugs.webkit.org/show_bug.cgi?id=226547)
- [Next.js Viewport API](https://nextjs.org/docs/app/api-reference/functions/generate-viewport)

---

## ⚠️ Важливо

1. **Safari користувачі:** Робота без offline кешу, але стабільно
2. **Chrome/Firefox:** Повний функціонал з offline підтримкою
3. **Дані:** Всі дані зберігаються в Firestore (не залежить від IndexedDB)

---

**Створено:** 11 листопада 2025  
**Статус:** ✅ Виправлено  
**Браузери:** Safari, Chrome, Firefox, Edge


