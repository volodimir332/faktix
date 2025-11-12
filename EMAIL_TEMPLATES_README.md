# 📧 Email Templates - Інструкція використання

## 🎯 Що це?

Професійні HTML-шаблони для відправки фактур, калькуляцій та цінових пропозицій клієнтам.

## ✨ Особливості

- ✅ Білий фон, професійний дизайн
- ✅ Логотип компанії зверху
- ✅ Адаптивний дизайн (мобільні пристрої)
- ✅ Підпис "Створено через Faktix" знизу
- ✅ Кнопка "Reply-To" веде на email користувача
- ✅ Підтримка фактур, калькуляцій та цінових пропозицій

---

## 📁 Файли

```
src/
├── lib/
│   └── emailTemplate.ts          # HTML templates
└── app/api/
    └── send-email/
        └── route.ts               # API для відправки
```

---

## 🚀 Як використовувати

### 1️⃣ Відправка фактури (Invoice)

```typescript
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'client@example.com',
    subject: 'Faktura č. 2024001 od IP Tiling s.r.o.',
    
    // ✅ Використовуємо template
    useTemplate: true,
    emailType: 'invoice',
    
    // Дані для template
    userName: 'Ivan Petrenko',
    userEmail: 'ivan@ip-tiling.cz',
    companyName: 'IP Tiling s.r.o.',
    clientName: 'Pan Novák',
    invoiceNumber: '2024001',
    logoUrl: 'https://faktix.cz/logo.png',        // опціонально
    companySite: 'https://ip-tiling.cz',          // опціонально
    
    // PDF вкладення (base64)
    pdfBuffer: pdfBase64String,
  })
});
```

**Клієнт побачить:**

```
📧 Subject: Faktura č. 2024001 od IP Tiling s.r.o.
From: IP Tiling s.r.o. <system@faktix.cz>
Reply-To: Ivan Petrenko <ivan@ip-tiling.cz>

[Логотип]
IP Tiling s.r.o.
Faktura č. 2024001

Dobrý den, Pan Novák!

Přijímáte fakturu od IP Tiling s.r.o.
V příloze najdete fakturu ve formátu PDF.

Pokud máte jakékoli dotazy: ivan@ip-tiling.cz

[Příloha: invoice.pdf]

─────────────────
Vytvořeno přes Faktix 💼
```

---

### 2️⃣ Відправка калькуляції (Calculation)

```typescript
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'client@example.com',
    subject: 'Cenová nabídka - Koupelna 2024',
    
    // ✅ Використовуємо template
    useTemplate: true,
    emailType: 'calculation',
    
    // Дані для template
    userName: 'Ivan Petrenko',
    userEmail: 'ivan@ip-tiling.cz',
    companyName: 'IP Tiling s.r.o.',
    clientName: 'Pan Novák',
    calculationName: 'Rekonstrukce koupelny',
    totalAmount: '45 780 Kč',
    logoUrl: 'https://faktix.cz/logo.png',
    
    // PDF вкладення
    pdfBuffer: pdfBase64String,
  })
});
```

**Клієнт побачить:**

```
📧 Subject: Cenová nabídka - Koupelna 2024
From: IP Tiling s.r.o.

[Логотип]
IP Tiling s.r.o.
Cenová nabídka

Dobrý den, Pan Novák!

Posíláme vám cenovou nabídku Rekonstrukce koupelny.

┌─────────────────────┐
│ Celková částka      │
│ 45 780 Kč           │
└─────────────────────┘

[Příloha: calculation.pdf]

─────────────────
Vytvořeno přes Faktix 📊
```

---

### 3️⃣ Старий спосіб (без template)

Якщо не передати `useTemplate: true`, працює як раніше:

```typescript
const response = await fetch('/api/send-email', {
  method: 'POST',
  body: JSON.stringify({
    to: 'client@example.com',
    subject: 'Test',
    text: 'Plain text',
    html: '<h1>Custom HTML</h1>',  // Власний HTML
    pdfBuffer: pdfBase64String,
  })
});
```

---

## 🎨 Параметри Template

| Параметр | Тип | Обов'язковий | Опис |
|----------|-----|--------------|------|
| `useTemplate` | boolean | ✅ Так | Використовувати template |
| `emailType` | `'invoice'` \| `'calculation'` \| `'offer'` | ✅ Так | Тип документу |
| `userName` | string | ✅ Так | Ім'я відправника |
| `userEmail` | string | ✅ Так | Email відправника |
| `companyName` | string | ❌ Ні | Назва компанії |
| `clientName` | string | ❌ Ні | Ім'я клієнта |
| `invoiceNumber` | string | ❌ Ні | Номер фактури (для invoice) |
| `calculationName` | string | ❌ Ні | Назва калькуляції (для calculation) |
| `totalAmount` | string | ❌ Ні | Загальна сума (для calculation) |
| `logoUrl` | string | ❌ Ні | URL логотипу (за замовчуванням Faktix) |
| `companySite` | string | ❌ Ні | Сайт компанії (за замовчуванням faktix.cz) |

---

## 📱 Адаптивний дизайн

Email автоматично адаптується під мобільні пристрої:

```css
/* Мобільні екрани (< 600px) */
- Ширина: 100%
- Padding: 20px
- Font-size: 14px
- Button: менша
```

---

## 🔧 Інтеграція в компоненти

### SendInvoiceModal.tsx

```typescript
const handleSendEmail = async () => {
  // Отримати дані користувача з localStorage
  const userProfile = localStorage.getItem('userProfile');
  const { firstName, lastName, companyName, email } = JSON.parse(userProfile);
  
  const response = await fetch('/api/send-email', {
    method: 'POST',
    body: JSON.stringify({
      to: clientEmail,
      subject: `Faktura č. ${invoiceNumber}`,
      useTemplate: true,                    // ✅ Використовуємо template
      emailType: 'invoice',
      userName: `${firstName} ${lastName}`,
      userEmail: email,
      companyName,
      clientName: clientName,
      invoiceNumber,
      pdfBuffer: pdfBase64,
    })
  });
};
```

### SendTemplateModal.tsx

```typescript
const handleSendCalculation = async () => {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    body: JSON.stringify({
      to: clientEmail,
      subject: `Cenová nabídka - ${calculationName}`,
      useTemplate: true,                    // ✅ Використовуємо template
      emailType: 'calculation',
      userName: `${firstName} ${lastName}`,
      userEmail: email,
      companyName,
      clientName,
      calculationName,
      totalAmount: `${total.toLocaleString()} Kč`,
      pdfBuffer: pdfBase64,
    })
  });
};
```

---

## 🎯 Переваги

✅ **Професійний вигляд** - клієнти бачать гарний email
✅ **Брендинг** - логотип компанії, "Створено через Faktix"
✅ **Адаптивність** - працює на всіх пристроях
✅ **Простота** - не потрібно писати HTML вручну
✅ **Гнучкість** - можна використовувати старий спосіб (без template)

---

## 💡 Приклади

Дивись приклади використання в:
- `src/components/SendInvoiceModal.tsx`
- `src/components/SendTemplateModal.tsx`

---

## 🐛 Дебаг

Console logs в API:

```
📧 Використовую професійний email template...
✅ HTML template згенеровано
✅ Email sent successfully: <messageId>
📨 From (displayed): "Ivan Petrenko" <system@faktix.cz>
📬 Reply-To: "Ivan Petrenko" <ivan@ip-tiling.cz>
```

---

**Створено для Faktix 💼**

