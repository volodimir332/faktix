# 💾 Data Storage Guide - Де і як зберігаються дані

## 📊 Огляд системи зберігання

Faktix використовує **гібридну систему зберігання**:
- **Firestore (хмара)** - для користувачів, фактур, клієнтів
- **LocalStorage (браузер)** - для калькуляцій, налаштувань, кешу

---

## 🔥 Firestore (Cloud Database)

### Колекції та структура:

#### 1️⃣ `users` - Користувачі
```javascript
{
  uid: "wUfNPa9PXbaT6E4XcHD6uDiywOp2",
  email: "user@example.com",
  displayName: "John Doe",
  createdAt: Timestamp,
  subscription: {
    plan: "starter",
    status: "active",
    expiresAt: Timestamp
  }
}
```

#### 2️⃣ `invoices` - Фактури
```javascript
{
  id: "INV-20251111-540",
  userId: "wUfNPa9PXbaT6E4XcHD6uDiywOp2",
  invoiceNumber: "INV-20251111-540",
  date: "2025-11-11",
  dueDate: "2025-11-25",
  customer: "LIVEN s.r.o.",
  items: [
    {
      description: "Web design",
      quantity: 1,
      unitPrice: 5000,
      total: 5000
    }
  ],
  total: 5000,
  status: "draft" | "sent" | "paid" | "overdue",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 3️⃣ `clients` - Клієнти
```javascript
{
  id: "client_abc123",
  userId: "wUfNPa9PXbaT6E4XcHD6uDiywOp2",
  name: "LIVEN s.r.o.",
  ic: "12345678",
  dic: "CZ12345678",
  email: "info@liven.cz",
  phone: "+420 123 456 789",
  address: {
    street: "Václavské náměstí 1",
    city: "Praha",
    zip: "110 00",
    country: "Česká republika"
  },
  createdAt: Timestamp
}
```

#### 4️⃣ `calculations` - Калькуляції (майбутнє)
```javascript
{
  id: "calc_xyz789",
  userId: "wUfNPa9PXbaT6E4XcHD6uDiywOp2",
  name: "Obnova koupelny",
  items: [...],
  total: 150000,
  createdAt: Timestamp
}
```

---

## 📦 LocalStorage (Browser)

### Ключі та дані:

#### 1️⃣ `faktix-calculations` - Калькуляції
```javascript
[
  {
    id: "calc-1699876543210-abc123",
    name: "Obnova koupelny",
    description: "Uložená kalkulace",
    items: [
      {
        id: "item-1",
        name: "Obklad stěn",
        unit: "m²",
        price: 450,
        quantity: 35,
        total: 15750
      }
    ],
    total: 150000,
    createdAt: "2025-11-11T10:30:00.000Z"
  }
]
```

#### 2️⃣ `faktix-profile` - Профіль користувача
```javascript
{
  businessType: "zivnost",
  ic: "21311048",
  dic: "CZ21311048",
  companyName: "John Doe - OSVČ",
  address: "Praha 1",
  // ... інші дані
}
```

#### 3️⃣ `saved-rozpocet-templates` - Збережені шаблони
```javascript
[
  {
    id: "saved-1699876543210",
    name: "Šablona 1 - 11.11.2025",
    baseTemplateId: "rozpocet-abc123",
    items: [...],
    total: 85000,
    createdAt: "2025-11-11T10:30:00.000Z"
  }
]
```

#### 4️⃣ Auth tokens (Firebase)
- Керується автоматично Firebase SDK
- Зберігає токени авторизації
- Ключі: `firebase:authUser:...`

---

## 🔄 Синхронізація даних

### Firestore → LocalStorage
**НЕ використовується** - Firestore працює незалежно

### LocalStorage → Firestore (майбутнє)
**План:** Перенести калькуляції в Firestore для:
- ✅ Доступу з будь-якого пристрою
- ✅ Резервного копіювання
- ✅ Співпраці між користувачами

---

## 🍎 Safari: Memory-only Cache

### Що це означає?

В Safari Firestore використовує **тільки RAM кеш**:
- ✅ Дані завантажуються з сервера
- ✅ Кешуються в оперативній пам'яті
- ❌ НЕ зберігаються в IndexedDB (через баги Safari)
- ⚠️ Кеш очищається при закритті вкладки

### Чи втрачаються дані?

**НІ!** Дані ЗАВЖДИ зберігаються на сервері Firestore:
- ✅ Фактури зберігаються в Firestore
- ✅ Клієнти зберігаються в Firestore
- ✅ При перезавантаженні завантажуються з сервера
- ⚠️ Потрібне з'єднання з інтернетом

---

## 📱 Доступ до даних

### Як подивитися дані в Firestore?

1. **Firebase Console:**
   - Перейдіть на: https://console.firebase.google.com
   - Виберіть проект: `faktix-8d2cc`
   - Відкрийте: Firestore Database
   - Побачите всі колекції та документи

2. **В коді:**
```typescript
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Отримати всі фактури
const invoicesRef = collection(db, 'invoices');
const snapshot = await getDocs(invoicesRef);
snapshot.forEach(doc => {
  console.log(doc.id, doc.data());
});
```

### Як подивитися LocalStorage?

1. **Chrome DevTools:**
   - Натисніть F12
   - Перейдіть на вкладку "Application"
   - Розкрийте "Local Storage"
   - Виберіть `http://localhost:3000`

2. **Safari DevTools:**
   - Натисніть Cmd+Option+C
   - Перейдіть на вкладку "Storage"
   - Виберіть "Local Storage"

3. **JavaScript Console:**
```javascript
// Подивитися калькуляції
localStorage.getItem('faktix-calculations')

// Подивитися профіль
localStorage.getItem('faktix-profile')

// Очистити все
localStorage.clear()
```

---

## 🔒 Безпека даних

### Firestore Security Rules

**Файл:** `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Користувачі можуть читати/писати тільки свої дані
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Фактури - тільки власні
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
    }
    
    // Клієнти - тільки власні
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
    }
  }
}
```

### LocalStorage
- ⚠️ Доступний через JavaScript
- ⚠️ НЕ шифрований
- ✅ Ізольований по доменах
- ⚠️ НЕ зберігайте паролі або sensitive дані

---

## 📊 Ліміти та квоти

### Firestore (Spark Plan - безкоштовний)
- ✅ Зберігання: 1 GB
- ✅ Читання: 50,000 / день
- ✅ Запис: 20,000 / день
- ✅ Видалення: 20,000 / день

### LocalStorage
- ⚠️ Ліміт: ~5-10 MB залежно від браузера
- ✅ Safari: 5 MB
- ✅ Chrome: 10 MB
- ✅ Firefox: 10 MB

---

## 🔄 Backup та Export

### Firestore Backup

**Автоматичний backup** (через Firebase Console):
1. Перейдіть на: Firebase Console → Firestore
2. Натисніть "Export data"
3. Виберіть колекції
4. Оберіть Cloud Storage bucket
5. Експорт у форматі JSON

**Програмний backup:**
```typescript
// Експорт фактур
const invoices = await getDocs(collection(db, 'invoices'));
const data = invoices.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
const json = JSON.stringify(data, null, 2);
// Завантажити як файл
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
// ... download logic
```

### LocalStorage Backup

```javascript
// Експорт усіх даних LocalStorage
const backup = {};
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  backup[key] = localStorage.getItem(key);
}
console.log(JSON.stringify(backup, null, 2));

// Імпорт
Object.keys(backup).forEach(key => {
  localStorage.setItem(key, backup[key]);
});
```

---

## 🚀 Міграція даних (план)

### Fase 1: Поточний стан ✅
- Firestore: users, invoices, clients
- LocalStorage: calculations, profile

### Fase 2: Майбутнє планування
- Перенести `calculations` в Firestore
- Перенести `profile` в Firestore/users
- LocalStorage тільки для кешу

### Fase 3: Синхронізація
- Real-time sync між пристроями
- Offline підтримка (для non-Safari)
- Конфлікт резолвер

---

## ❓ FAQ

### 1. Що станеться якщо очистити LocalStorage?
- ❌ Втратите калькуляції
- ❌ Втратите налаштування профілю
- ✅ Фактури та клієнти залишаться (в Firestore)
- ✅ Авторизація залишиться

### 2. Що станеться якщо видалити IndexedDB в Safari?
- ✅ Нічого - Safari не використовує IndexedDB
- ✅ Всі дані в Firestore залишаються

### 3. Чи можу працювати offline?
- ❌ Safari: НІ (memory-only cache)
- ✅ Chrome/Firefox: ТАК (persistent cache)
- ⚠️ LocalStorage працює offline завжди

### 4. Скільки займає місця в Firestore?
```javascript
// Приблизний розмір одного документу:
- Invoice: ~1-2 KB
- Client: ~0.5-1 KB
- User: ~0.5 KB

// На 1 GB можна зберегти:
- ~500,000 - 1,000,000 фактур
- ~1,000,000 - 2,000,000 клієнтів
```

### 5. Як перенести дані на інший комп'ютер?
- ✅ Firestore: автоматично (увійдіть в аккаунт)
- ❌ LocalStorage: потрібен експорт/імпорт

---

## 🎯 Рекомендації

1. **Регулярний backup:**
   - Експортуйте дані раз на місяць
   - Зберігайте JSON файли

2. **Не зберігайте критичні дані тільки в LocalStorage:**
   - Переносьте важливі калькуляції в Firestore (створюйте фактури)

3. **Моніторинг квот:**
   - Перевіряйте використання в Firebase Console
   - Плануйте upgrade при досягненні 80% ліміту

4. **Тестування в Safari:**
   - Перевіряйте що всі дані зберігаються
   - Консоль має показувати: "🍎 Safari: memory-only cache"

---

**Створено:** 11 листопада 2025  
**Оновлено:** 11 листопада 2025  
**Версія:** 1.0

