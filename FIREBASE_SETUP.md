# Налаштування Firebase для Faktix

Цей документ містить покрокові інструкції для налаштування Firebase Authentication та Firestore Database для платформи Faktix.

## 1. Створення проекту Firebase

### 1.1 Перейдіть до Firebase Console
1. Відкрийте [Firebase Console](https://console.firebase.google.com/)
2. Увійдіть з вашим Google акаунтом

### 1.2 Створіть новий проект
1. Натисніть "Create a project" або "Add project"
2. Введіть назву проекту (наприклад, "faktix-app")
3. Можете вимкнути Google Analytics (не обов'язково)
4. Натисніть "Create project"

## 2. Налаштування Authentication

### 2.1 Увімкнення Email/Password аутентифікації
1. У Firebase Console перейдіть до "Authentication"
2. Натисніть "Get started"
3. Перейдіть на вкладку "Sign-in method"
4. Натисніть на "Email/Password"
5. Увімкніть "Email/Password" та "Email link (passwordless sign-in)"
6. Натисніть "Save"

### 2.2 Налаштування шаблонів електронних листів (опціонально)
1. У розділі Authentication перейдіть до "Templates"
2. Налаштуйте шаблони для:
   - Email verification
   - Password reset
   - Email change

## 3. Налаштування Firestore Database

### 3.1 Створення бази даних
1. У Firebase Console перейдіть до "Firestore Database"
2. Натисніть "Create database"
3. Виберіть "Start in test mode" (для розробки)
4. Виберіть регіон (наприклад, europe-west3)
5. Натисніть "Done"

### 3.2 Налаштування правил безпеки
1. У Firestore Database перейдіть до вкладки "Rules"
2. Замініть правила на наступні:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Користувач може читати та записувати тільки свої дані
    match /clients/{clientId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 4. Отримання конфігурації Firebase

### 4.1 Додавання веб-додатку
1. У Firebase Console перейдіть до "Project settings" (іконка шестерні)
2. У розділі "Your apps" натисніть іконку веб-додатку (</>)
3. Введіть назву додатку (наприклад, "faktix-web")
4. Можете вимкнути Firebase Hosting
5. Натисніть "Register app"

### 4.2 Копіювання конфігурації
Після реєстрації додатку ви побачите конфігурацію, яка виглядає приблизно так:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 5. Налаштування змінних середовища

### 5.1 Створення файлу .env.local
1. У корені проекту створіть файл `.env.local`
2. Скопіюйте вміст з `firebase-config-example.env`
3. Замініть значення на ваші дані з Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 6. Тестування налаштування

### 6.1 Запуск проекту
```bash
npm run dev
```

### 6.2 Тестування функцій
1. Відкрийте http://localhost:3000
2. Спробуйте зареєструватися з новим акаунтом
3. Перевірте, чи з'явився користувач у Firebase Authentication
4. Спробуйте створити клієнта або фактуру
5. Перевірте, чи з'явилися дані у Firestore Database

## 7. Додаткові налаштування

### 7.1 Налаштування доменів для аутентифікації
1. У Firebase Console перейдіть до Authentication > Settings
2. У розділі "Authorized domains" додайте ваші домени
3. Для розробки додайте `localhost`

### 7.2 Налаштування електронних листів
1. У Authentication > Templates налаштуйте відправника
2. Можете використовувати noreply@your-project.firebaseapp.com
3. Або налаштуйте власний домен

## 8. Безпека

### 8.1 Правила Firestore
Переконайтеся, що правила Firestore правильно налаштовані для захисту даних користувачів.

### 8.2 Змінні середовища
Ніколи не комітьте файл `.env.local` до Git репозиторію.

## 9. Розв'язання проблем

### 9.1 Помилка "Firebase App named '[DEFAULT]' already exists"
Це означає, що Firebase вже ініціалізований. Перевірте, чи правильно імпортується конфігурація.

### 9.2 Помилка "Permission denied"
Перевірте правила Firestore та переконайтеся, що користувач авторизований.

### 9.3 Помилка "Invalid API key"
Перевірте правильність API ключа в змінних середовища.

## 10. Подальші кроки

Після успішного налаштування Firebase ви можете:

1. Додати соціальну аутентифікацію (Google, Facebook)
2. Налаштувати Firebase Hosting для деплою
3. Додати Firebase Storage для файлів
4. Налаштувати Firebase Functions для серверної логіки

---

**Важливо**: Зберігайте конфігурацію Firebase в безпеці та не діліться нею публічно.
