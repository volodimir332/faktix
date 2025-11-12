# 📱 Розгортання мобільних додатків Faktix

Цей документ містить покрокові інструкції для розгортання Faktix на iOS (App Store) та Android (Google Play Store).

## ✅ Що вже готово

### PWA (Progressive Web App) ✔️
Ваш додаток вже **повністю підготовлений як PWA**:
- ✅ Service Worker налаштований
- ✅ manifest.json створено
- ✅ Мета-теги додано
- ✅ Офлайн підтримка
- ✅ Іконки та скріншоти

**Як встановити PWA на телефон:**

#### На iPhone/iPad (Safari):
1. Відкрийте сайт у Safari
2. Натисніть кнопку "Поділитися" (квадрат зі стрілкою)
3. Прокрутіть вниз та виберіть "На екран «Домой»"
4. Натисніть "Добавити"
5. Готово! Додаток тепер працює як нативний

#### На Android (Chrome):
1. Відкрийте сайт у Chrome
2. Натисніть меню (три крапки)
3. Виберіть "Добавить на главный экран"
4. Натисніть "Установить"
5. Готово! Додаток тепер працює як нативний

---

## 🚀 Розгортання нативних додатків (App Store / Play Store)

Для публікації в магазинах додатків використаємо **Capacitor**.

### Крок 1: Встановлення Capacitor

```bash
cd /Users/volodymyrkrutskyi/Desktop/fakrury/faktury

# Встановлюємо Capacitor
npm install @capacitor/core @capacitor/cli

# Ініціалізуємо Capacitor
npx cap init

# Встановлюємо платформи
npm install @capacitor/ios @capacitor/android

# Додаємо платформи
npx cap add ios
npx cap add android
```

### Крок 2: Налаштування для iOS

```bash
# Збираємо проект
npm run build

# Копіюємо файли в iOS проект
npx cap sync ios

# Відкриваємо в Xcode
npx cap open ios
```

**В Xcode:**
1. Підключіть ваш Apple Developer аккаунт
2. Налаштуйте Bundle Identifier (наприклад: `com.faktix.app`)
3. Налаштуйте іконки (Assets.xcassets)
4. Налаштуйте splash screen
5. Виберіть Device → Any iOS Device (arm64)
6. Product → Archive
7. Distribute App → App Store Connect
8. Завантажте в App Store Connect

**Вимоги для App Store:**
- Apple Developer аккаунт ($99/рік)
- Заповнені метадані (опис, скріншоти, іконки)
- Privacy Policy
- Terms of Service

### Крок 3: Налаштування для Android

```bash
# Збираємо проект
npm run build

# Копіюємо файли в Android проект
npx cap sync android

# Відкриваємо в Android Studio
npx cap open android
```

**В Android Studio:**
1. Налаштуйте Package Name (наприклад: `com.faktix.app`)
2. Налаштуйте іконки (res/mipmap)
3. Налаштуйте splash screen
4. Build → Generate Signed Bundle / APK
5. Створіть keystore (якщо немає)
6. Виберіть Build Type: Release
7. Підпишіть APK/AAB

**Завантаження в Google Play:**
1. Відкрийте Google Play Console
2. Створіть новий додаток
3. Завантажте AAB файл
4. Заповніть метадані
5. Створіть store listing

**Вимоги для Google Play:**
- Google Developer аккаунт ($25 одноразово)
- Заповнені метадані
- Privacy Policy
- Іконки різних розмірів
- Скріншоти

---

## 📦 Додаткові налаштування Capacitor

### capacitor.config.ts

Створіть файл `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.faktix.app',
  appName: 'Faktix',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false,
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small",
      spinnerColor: "#00ff88"
    }
  }
};

export default config;
```

### Плагіни для мобільних функцій

```bash
# Камера
npm install @capacitor/camera

# Файлова система
npm install @capacitor/filesystem

# Сповіщення
npm install @capacitor/local-notifications

# Поділитися
npm install @capacitor/share

# Статус мережі
npm install @capacitor/network
```

---

## 🎨 Іконки та Splash Screens

### Розміри іконок:

**iOS:**
- 1024x1024 (App Store)
- 180x180 (iPhone)
- 167x167 (iPad Pro)
- 152x152 (iPad)
- 120x120 (iPhone)
- 87x87 (iPhone)
- 80x80 (iPad)
- 76x76 (iPad)
- 60x60 (iPhone)
- 58x58 (iPhone)
- 40x40 (iPad, iPhone)
- 29x29 (iPhone)
- 20x20 (iPhone)

**Android:**
- 512x512 (Play Store)
- 192x192 (xxxhdpi)
- 144x144 (xxhdpi)
- 96x96 (xhdpi)
- 72x72 (hdpi)
- 48x48 (mdpi)

### Генерація іконок:

Використайте онлайн генератор:
- https://icon.kitchen/
- https://www.appicon.co/
- https://makeappicon.com/

---

## 🔧 Налаштування package.json

Додайте скрипти в `package.json`:

```json
{
  "scripts": {
    "build:mobile": "next build && next export",
    "ios:dev": "npm run build:mobile && npx cap sync ios && npx cap open ios",
    "android:dev": "npm run build:mobile && npx cap sync android && npx cap open android",
    "ios:build": "npm run build:mobile && npx cap sync ios",
    "android:build": "npm run build:mobile && npx cap sync android"
  }
}
```

---

## 📱 Адаптивність

Ваш додаток використовує:
- ✅ Tailwind CSS - повністю адаптивний
- ✅ Mobile-first підхід
- ✅ Responsive breakpoints
- ✅ Touch-friendly інтерфейс

### Перевірка адаптивності:

1. Відкрийте DevTools (F12)
2. Увімкніть Device Toolbar (Ctrl+Shift+M)
3. Виберіть різні пристрої:
   - iPhone 14 Pro Max
   - iPhone SE
   - iPad Pro
   - Samsung Galaxy S21
   - Pixel 5

---

## 🚨 Важливо

### Перед публікацією:

1. **Тестування:**
   - Протестуйте на реальних пристроях
   - Перевірте всі функції
   - Тестуйте офлайн режим

2. **Документація:**
   - Privacy Policy (обов'язково!)
   - Terms of Service
   - Support Email
   - Опис додатку

3. **Метадані:**
   - Якісні скріншоти
   - Промо-відео (опціонально)
   - Опис функцій
   - Ключові слова

4. **Безпека:**
   - HTTPS обов'язково
   - Захист даних користувачів
   - Відповідність GDPR

---

## 📊 Моніторинг та аналітика

Рекомендовані сервіси:
- Google Analytics for Firebase
- Sentry (для відстеження помилок)
- TestFlight (для iOS бета-тестування)
- Google Play Console (для Android)

---

## 💡 Корисні посилання

**Документація:**
- Capacitor: https://capacitorjs.com/docs
- Next.js PWA: https://github.com/shadowwalker/next-pwa
- Apple Developer: https://developer.apple.com/
- Google Play Console: https://play.google.com/console

**Інструменти:**
- App Store Connect: https://appstoreconnect.apple.com/
- Google Play Console: https://play.google.com/console
- Firebase Console: https://console.firebase.google.com/

---

## ✅ Чеклист перед релізом

- [ ] PWA працює на всіх пристроях
- [ ] Іконки та splash screens готові
- [ ] Privacy Policy створено
- [ ] Terms of Service створено
- [ ] Скріншоти зроблено
- [ ] Опис додатку написано
- [ ] Apple Developer аккаунт активний ($99/рік)
- [ ] Google Developer аккаунт активний ($25 одноразово)
- [ ] Всі функції протестовано
- [ ] Офлайн режим працює
- [ ] Firebase налаштовано
- [ ] HTTPS включено

---

## 🎉 Готово!

Ваш додаток **вже працює як PWA** і може бути встановлений на будь-який телефон!

Для публікації в App Store та Google Play потрібно виконати кроки вище.

**Питання?** Звертайтеся до документації Capacitor або пишіть у підтримку!


