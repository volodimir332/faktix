# 💳 Stripe Subscriptions Інтеграція

## ✅ Що вже реалізовано

### 1. Firebase Cloud Functions
- **Файл**: `functions/src/index.ts`
- **Функції**:
  - `createStripeCheckoutSession` - створення сесії оплати
  - `stripeWebhookHandler` - обробка подій Stripe
  - `createStripePortalSession` - створення порталу клієнта

### 2. Фронтенд сервіси
- **Файл**: `src/lib/subscription-service.ts`
- **Функції**:
  - `redirectToCheckout` - перенаправлення на оплату
  - `redirectToPortal` - перенаправлення на портал
  - `PRICING_PLANS` - тарифні плани

### 3. Сторінка тарифів
- **Файл**: `src/app/pricing/page.tsx`
- **Функції**:
  - Відображення тарифних планів
  - Кнопки підписки
  - FAQ та довіра

### 4. Керування підпискою
- **Файл**: `src/components/Sidebar.tsx`
- **Функції**:
  - Кнопка "Підписка" в Sidebar
  - Перенаправлення на портал клієнта

## 🚀 Як працює система

### Процес підписки:
1. **Користувач** → обирає план на `/pricing`
2. **Frontend** → викликає `createStripeCheckoutSession`
3. **Cloud Function** → створює Stripe Customer та Checkout Session
4. **Stripe** → перенаправляє на сторінку оплати
5. **Користувач** → вводить дані картки
6. **Stripe** → надсилає webhook подію
7. **Cloud Function** → оновлює дані в Firestore

### Процес керування підпискою:
1. **Користувач** → натискає "Підписка" в Sidebar
2. **Frontend** → викликає `createStripePortalSession`
3. **Cloud Function** → створює сесію порталу
4. **Stripe** → перенаправляє на портал клієнта
5. **Користувач** → керує підпискою

## 🔧 Налаштування

### 1. Stripe Dashboard
1. Створіть акаунт на [stripe.com](https://stripe.com)
2. Отримайте API ключі:
   - **Publishable Key** (для фронтенду)
   - **Secret Key** (для Cloud Functions)
   - **Webhook Secret** (для верифікації)

### 2. Створення продуктів та цін
```bash
# Створення продукту
stripe products create --name="Faktix Pro" --description="Pro план для Faktix"

# Створення ціни
stripe prices create \
  --product=prod_xxx \
  --unit-amount=29900 \
  --currency=czk \
  --recurring-interval=month \
  --nickname="Pro Plan"
```

### 3. Налаштування змінних середовища
```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID=price_...

# Firebase Functions config
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
firebase functions:config:set app.url="http://localhost:3000"
```

### 4. Налаштування Webhook
1. В Stripe Dashboard → Webhooks
2. Додайте endpoint: `https://your-project.cloudfunctions.net/stripeWebhookHandler`
3. Виберіть події:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`

## 📊 Структура даних

### Firestore Document (users/{userId}):
```typescript
{
  // Базова інформація
  uid: string;
  email: string;
  displayName?: string;
  
  // Stripe інформація
  stripeCustomerId?: string;
  
  // Підписка
  subscription?: {
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: 'active' | 'past_due' | 'canceled' | 'trialing';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    trialEnd?: Date;
    priceId: string;
    planName: string;
  };
  
  // Статус підписки
  subscriptionStatus?: 'active' | 'past_due' | 'canceled' | 'trialing' | 'free';
  subscriptionEndDate?: Date;
  subscriptionCanceledAt?: Date;
  lastPaymentDate?: Date;
  lastPaymentFailure?: Date;
}
```

## 🔐 Безпека

### Cloud Functions:
- ✅ Перевірка автентифікації
- ✅ Валідація вхідних даних
- ✅ Обробка помилок
- ✅ Логування операцій

### Webhook:
- ✅ Перевірка підпису Stripe
- ✅ Валідація подій
- ✅ Безпечна обробка даних

### Frontend:
- ✅ Перевірка автентифікації
- ✅ Безпечні API виклики
- ✅ Обробка помилок

## 📝 API Функції

### createStripeCheckoutSession
```typescript
// Вхідні дані
{
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
}

// Вихідні дані
{
  sessionId: string;
  url: string;
}
```

### createStripePortalSession
```typescript
// Вхідні дані
{
  returnUrl?: string;
}

// Вихідні дані
{
  url: string;
}
```

## 🎯 Тарифні плани

### Free Plan:
- 5 фактур на місяць
- Базова підтримка
- Експорт PDF
- Email уведомления

### Pro Plan (299 CZK/місяць):
- Необмежена кількість фактур
- Пріоритетна підтримка
- Експорт PDF, Excel
- Email уведомления
- API доступ
- Розширена аналітика
- Багато користувачів

### Business Plan (599 CZK/місяць):
- Все з Pro плану
- Індивідуальна підтримка
- Налаштування під ваші потреби
- Інтеграція з ERP системами
- Білий лейбл
- Dedicated менеджер

## 🔍 Тестування

### Тест 1: Створення підписки
1. Перейдіть на `/pricing`
2. Виберіть Pro план
3. Натисніть "Підписатися"
4. Перевірте, що перенаправляє на Stripe

### Тест 2: Webhook події
1. Завершіть оплату в Stripe
2. Перевірте логи Cloud Functions
3. Перевірте, що дані оновилися в Firestore

### Тест 3: Портал клієнта
1. Увійдіть в систему
2. Натисніть "Підписка" в Sidebar
3. Перевірте, що перенаправляє на портал

### Тест 4: Скасування підписки
1. Перейдіть на портал клієнта
2. Скасуйте підписку
3. Перевірте, що статус оновився в Firestore

## 🚨 Відомі проблеми та рішення

### Проблема: "Stripe не ініціалізований"
**Рішення**: Перевірте `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` в `.env.local`

### Проблема: "Webhook signature verification failed"
**Рішення**: Перевірте `stripe.webhook_secret` в Firebase Functions config

### Проблема: "Price ID не знайдено"
**Рішення**: Перевірте `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` та створіть ціни в Stripe

### Проблема: "User not authenticated"
**Рішення**: Перевірте, чи користувач авторизований

## 📈 Можливі покращення

1. **Локалізація** - підтримка різних мов
2. **Аналітика** - відстеження конверсії
3. **A/B тестування** - різні варіанти цін
4. **Промокоди** - система знижок
5. **Реферальна система** - заохочення за запрошення
6. **Білінг портал** - власний інтерфейс керування
7. **Email уведомления** - автоматичні листи
8. **Інтеграція з CRM** - синхронізація даних

## 🛠️ Розгортання

### 1. Побудова Functions:
```bash
cd functions
npm install
npm run build
```

### 2. Розгортання Functions:
```bash
firebase deploy --only functions
```

### 3. Налаштування змінних:
```bash
firebase functions:config:set stripe.secret_key="sk_live_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
firebase functions:config:set app.url="https://your-domain.com"
```

### 4. Оновлення webhook URL:
В Stripe Dashboard оновіть webhook URL на:
`https://your-project.cloudfunctions.net/stripeWebhookHandler`

---

**🎉 Stripe Subscriptions інтеграція успішно налаштована!**
Тепер ваш SaaS додаток підтримує повноцінну систему підписок з автоматичним списанням коштів.









