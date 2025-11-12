# 🔧 Вирішення помилки Firebase auth/configuration-not-found

## ❌ Проблема
Помилка `Firebase: Error (auth/configuration-not-found)` означає, що Firebase не може знайти правильну конфігурацію проекту.

## 🔍 Кроки для вирішення

### 1. Перевірте Firebase Console

#### Крок 1: Відкрийте Firebase Console
```
https://console.firebase.google.com/
```

#### Крок 2: Виберіть проект
- Увійдіть в свій Google акаунт
- Виберіть проект `faktix-8d2cc`
- Переконайтеся, що проект активний

#### Крок 3: Перевірте налаштування проекту
1. **Authentication** → **Sign-in method**
   - Увімкніть **Email/Password**
   - Збережіть зміни

2. **Project Settings** → **General**
   - Перевірте **Project ID**: `faktix-8d2cc`
   - Перевірте **Project name**: `faktix`

### 2. Перевірте Web App Configuration

#### Крок 1: Додайте Web App
1. **Project Settings** → **General**
2. **Your apps** → **Add app** → **Web**
3. **App nickname**: `faktix-web`
4. **Register app**

#### Крок 2: Скопіюйте конфігурацію
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxf55ui7ZwGAFRJg_14BBefWAHLCZ9sMw",
  authDomain: "faktix-8d2cc.firebaseapp.com",
  projectId: "faktix-8d2cc",
  storageBucket: "faktix-8d2cc.firebasestorage.app",
  messagingSenderId: "685408432041",
  appId: "1:685408432041:web:bbbc88c0a5e97bd3ab1eb8",
  measurementId: "G-NLPRJCP9C6"
};
```

### 3. Перевірте Firestore Database

#### Крок 1: Створіть Firestore Database
1. **Firestore Database** → **Create database**
2. **Start in test mode** (для розробки)
3. **Choose a location**: `europe-west3` (Prague)

#### Крок 2: Налаштуйте правила
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Альтернативне рішення - Створіть новий проект

#### Крок 1: Створіть новий Firebase проект
1. **Create a project**
2. **Project name**: `faktix-new`
3. **Enable Google Analytics**: No
4. **Create project**

#### Крок 2: Налаштуйте Authentication
1. **Authentication** → **Get started**
2. **Sign-in method** → **Email/Password** → **Enable**
3. **Save**

#### Крок 3: Створіть Firestore Database
1. **Firestore Database** → **Create database**
2. **Start in test mode**
3. **Choose location**: `europe-west3`

#### Крок 4: Додайте Web App
1. **Project Settings** → **Add app** → **Web**
2. **App nickname**: `faktix-web`
3. **Register app**
4. **Copy configuration**

### 5. Оновіть конфігурацію в коді

#### Крок 1: Оновіть `src/lib/firebase.ts`
```typescript
const firebaseConfig = {
  // Вставте нову конфігурацію з Firebase Console
  apiKey: "YOUR_NEW_API_KEY",
  authDomain: "YOUR_NEW_PROJECT.firebaseapp.com",
  projectId: "YOUR_NEW_PROJECT_ID",
  storageBucket: "YOUR_NEW_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

#### Крок 2: Перезапустіть сервер
```bash
npm run dev
```

### 6. Тестування

#### Крок 1: Перевірте консоль браузера
- Відкрийте Developer Tools (F12)
- Перейдіть на вкладку Console
- Перевірте, чи немає помилок Firebase

#### Крок 2: Тестуйте реєстрацію
1. Відкрийте `http://localhost:3000/registrace`
2. Заповніть форму
3. Натисніть "Registrovat se"
4. Перевірте, чи немає помилок

## 🚨 Якщо проблема залишається

### Варіант 1: Використовуйте Firebase Emulator
```typescript
// В src/lib/firebase.ts
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

### Варіант 2: Перевірте мережу
- Перевірте підключення до інтернету
- Спробуйте інший браузер
- Очистіть кеш браузера

### Варіант 3: Зверніться до підтримки
- Скопіюйте повну помилку з консолі
- Надішліть скріншот Firebase Console
- Опишіть кроки, які ви виконали

## ✅ Очікуваний результат

Після виконання всіх кроків:
- ✅ Firebase ініціалізується без помилок
- ✅ Реєстрація працює успішно
- ✅ Дані зберігаються в Firestore
- ✅ Авторизація працює правильно

## 📞 Додаткова допомога

Якщо проблема залишається, надайте:
1. Скріншот помилки з консолі
2. Скріншот Firebase Console
3. Опис кроків, які ви виконали








