# 🗄️ Cloud Firestore Інтеграція

## ✅ Що вже реалізовано

### 1. Базова конфігурація Firebase
- **Файл**: `src/lib/firebase.ts`
- **Статус**: ✅ Налаштовано
- **Особливості**:
  - Правильна ініціалізація Firestore
  - Експорт `db` об'єкта
  - Детальне логування для діагностики

### 2. Покращений Firestore Service
- **Файл**: `src/lib/firestore-service.ts`
- **Статус**: ✅ Створено
- **Функції**:
  - CRUD операції для користувачів, клієнтів та фактур
  - Real-time підписки
  - Масові операції
  - Детальне логування

### 3. Оновлені контексти
- **ClientContext**: `src/contexts/ClientContext.tsx`
- **InvoiceContext**: `src/contexts/InvoiceContext.tsx`
- **Статус**: ✅ Оновлено
- **Особливості**:
  - Інтеграція з новими Firestore функціями
  - Real-time оновлення
  - Обробка помилок

## 🚀 Структура бази даних

### Колекції Firestore:

#### 1. `users` - Користувачі
```typescript
interface FirestoreUser {
  uid: string;                    // ID користувача (Firebase Auth UID)
  email: string;                  // Email користувача
  displayName?: string;           // Ім'я користувача
  emailVerified: boolean;         // Підтвердження email
  createdAt: Timestamp;           // Дата створення
  updatedAt: Timestamp;           // Дата оновлення
  profile?: {                     // Профіль користувача
    firstName?: string;
    lastName?: string;
    company?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    ico?: string;
    dic?: string;
    typZivnosti?: string;
  };
}
```

#### 2. `clients` - Клієнти
```typescript
interface FirestoreClient {
  userId: string;                 // ID власника (Firebase Auth UID)
  name: string;                   // Назва компанії
  email: string;                  // Email
  street: string;                 // Вулиця
  city: string;                   // Місто
  postalCode: string;             // Поштовий індекс
  country: string;                // Країна
  ico: string;                    // ІČО
  dic: string;                    // ДІČ
  typZivnosti: string;            // Тип житності
  createdAt: Timestamp;           // Дата створення
  updatedAt: Timestamp;           // Дата оновлення
}
```

#### 3. `invoices` - Фактури
```typescript
interface FirestoreInvoice {
  userId: string;                 // ID власника (Firebase Auth UID)
  invoiceNumber: string;          // Номер фактури
  date: string;                   // Дата фактури
  dueDate: string;                // Дата оплати
  customer: ClientData;           // Дані клієнта
  items: InvoiceItem[];           // Товари/послуги
  total: number;                  // Загальна сума
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: Timestamp;           // Дата створення
  updatedAt: Timestamp;           // Дата оновлення
}
```

## 🔧 API Функції

### Користувачі:
```typescript
// Збереження профілю користувача
saveUserProfile(userId: string, userData: Partial<FirestoreUser>)

// Отримання профілю користувача
getUserProfile(userId?: string): Promise<FirestoreUser | null>

// Оновлення профілю користувача
updateUserProfile(profileData: Partial<FirestoreUser['profile']>)
```

### Клієнти:
```typescript
// Створення клієнта
createClient(clientData: Omit<ClientData, 'id'>)

// Отримання всіх клієнтів користувача
getUserClients(): Promise<ClientData[]>

// Оновлення клієнта
updateClient(clientId: string, clientData: Partial<ClientData>)

// Видалення клієнта
deleteClient(clientId: string)

// Підписка на зміни в реальному часі
subscribeToClients(callback: (clients: ClientData[]) => void)

// Масові операції
batchUpdateClients(updates: Array<{ id: string; data: Partial<ClientData> }>)
batchDeleteClients(clientIds: string[])
```

### Фактури:
```typescript
// Створення фактури
createInvoice(invoiceData: Omit<InvoiceData, 'id'>)

// Отримання всіх фактур користувача
getUserInvoices(): Promise<InvoiceData[]>

// Отримання конкретної фактури
getInvoiceById(invoiceId: string): Promise<InvoiceData | null>

// Оновлення фактури
updateInvoice(invoiceId: string, invoiceData: Partial<InvoiceData>)

// Видалення фактури
deleteInvoice(invoiceId: string)

// Підписка на зміни в реальному часі
subscribeToInvoices(callback: (invoices: InvoiceData[]) => void)
```

## 📝 Використання в компонентах

### Використання ClientContext:
```typescript
import { useClients } from '@/contexts/ClientContext';

function MyComponent() {
  const { 
    clients, 
    isLoading, 
    error, 
    addClient, 
    updateClient, 
    deleteClient 
  } = useClients();

  const handleAddClient = async () => {
    const result = await addClient({
      name: 'Нова компанія',
      email: 'test@example.com',
      // ... інші поля
    });
    
    if (result.success) {
      console.log('Клієнт додано з ID:', result.id);
    }
  };

  if (isLoading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;

  return (
    <div>
      {clients.map(client => (
        <div key={client.id}>{client.name}</div>
      ))}
    </div>
  );
}
```

### Використання InvoiceContext:
```typescript
import { useInvoices } from '@/contexts/InvoiceContext';

function MyComponent() {
  const { 
    invoices, 
    isLoading, 
    error, 
    addInvoice, 
    updateInvoice, 
    deleteInvoice 
  } = useInvoices();

  const handleAddInvoice = async () => {
    const result = await addInvoice({
      invoiceNumber: 'INV-001',
      date: '2024-01-01',
      // ... інші поля
    });
    
    if (result.success) {
      console.log('Фактуру додано з ID:', result.id);
    }
  };

  if (isLoading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;

  return (
    <div>
      {invoices.map(invoice => (
        <div key={invoice.id}>{invoice.invoiceNumber}</div>
      ))}
    </div>
  );
}
```

## 🔐 Безпека та правила доступу

### Firestore Security Rules (рекомендовані):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Користувачі можуть читати/писати тільки свої дані
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Клієнти належать конкретному користувачу
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Фактури належать конкретному користувачу
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📊 Логування та діагностика

### Консольні логи:
- `💾` - Збереження даних
- `📖` - Читання даних
- `➕` - Створення
- `🔄` - Оновлення
- `🗑️` - Видалення
- `👂` - Підписка на зміни
- `📡` - Real-time оновлення
- `✅` - Успішні операції
- `❌` - Помилки

### Приклад логування:
```
💾 Saving user profile for: user123
✅ User profile saved successfully
📖 Getting clients for user: user123
✅ Retrieved 5 clients
👂 Setting up real-time subscription for clients...
📡 Clients updated: 6 clients
```

## 🛠️ Налаштування Firebase Console

### 1. Створення проекту:
1. Відкрити [Firebase Console](https://console.firebase.google.com/)
2. Створити новий проект або вибрати існуючий
3. Увімкнути Firestore Database

### 2. Налаштування правил безпеки:
1. Перейти до Firestore Database
2. Вкладка "Rules"
3. Вставити правила безпеки (див. вище)

### 3. Налаштування індексів:
```javascript
// Складений індекс для клієнтів
Collection: clients
Fields: userId (Ascending), createdAt (Descending)

// Складений індекс для фактур
Collection: invoices
Fields: userId (Ascending), createdAt (Descending)
```

## 🔍 Тестування

### Тест 1: Створення клієнта
```typescript
const result = await createClient({
  name: 'Тестова компанія',
  email: 'test@example.com',
  street: 'Тестова вулиця 1',
  city: 'Прага',
  postalCode: '11000',
  country: 'Чехія',
  ico: '12345678',
  dic: 'CZ12345678',
  typZivnosti: 'Fyzická osoba'
});

console.log('Результат:', result);
```

### Тест 2: Створення фактури
```typescript
const result = await createInvoice({
  invoiceNumber: 'INV-001',
  date: '2024-01-01',
  dueDate: '2024-01-31',
  customer: clientData,
  items: [
    {
      name: 'Послуга 1',
      quantity: 1,
      price: 1000,
      total: 1000
    }
  ],
  total: 1000,
  status: 'draft'
});

console.log('Результат:', result);
```

### Тест 3: Real-time підписка
```typescript
const unsubscribe = subscribeToClients((clients) => {
  console.log('Клієнти оновлено:', clients);
});

// Пізніше очистити підписку
unsubscribe();
```

## 🚨 Відомі проблеми та рішення

### Проблема: "Permission denied"
**Рішення**: Перевірити правила безпеки в Firebase Console

### Проблема: "Index not found"
**Рішення**: Створити необхідні індекси в Firebase Console

### Проблема: "User not authenticated"
**Рішення**: Перевірити, чи користувач авторизований

### Проблема: Real-time підписка не працює
**Рішення**: Перевірити правила безпеки та індекси

## 📈 Можливі покращення

1. **Кешування** - зберігання даних в localStorage
2. **Оптимізація запитів** - пагінація та фільтрація
3. **Офлайн підтримка** - синхронізація при відновленні з'єднання
4. **Аналітика** - відстеження використання
5. **Експорт даних** - експорт в CSV/PDF
6. **Резервне копіювання** - автоматичне створення резервних копій

---

**🎉 Cloud Firestore інтеграція успішно налаштована!**
Тепер ваш додаток може створювати, читати, оновлювати та видаляти дані в реальному часі.








