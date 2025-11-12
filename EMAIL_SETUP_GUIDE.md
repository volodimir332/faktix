# 📧 Email Setup Guide - Faktix

## ✅ Налаштування завершено!

Email відправка налаштована та готова до використання.

---

## 📋 Що було зроблено:

### 1️⃣ Встановлено залежності
```bash
npm install nodemailer @types/nodemailer
```

### 2️⃣ Створено API endpoint
**Файл:** `src/app/api/send-email/route.ts`

API endpoint для відправки email через Gmail SMTP.

**Endpoint:** `POST /api/send-email`

**Request body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Тема листа",
  "text": "Текстова версія",
  "html": "<b>HTML</b> версія",
  "attachments": [
    {
      "filename": "file.pdf",
      "content": "base64-content",
      "encoding": "base64"
    }
  ]
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "Email sent!",
  "messageId": "message-id-from-gmail"
}
```

**Response (error):**
```json
{
  "success": false,
  "message": "Email failed",
  "error": "Error details"
}
```

### 3️⃣ Налаштовано environment variables

**Файл:** `.env.local` (не комітиться в Git)

```env
# Email Configuration
EMAIL_USER=xperementus@gmail.com
EMAIL_PASS=qcde xouk sccv nscn
```

⚠️ **ВАЖЛИВО:** 
- `EMAIL_PASS` - це **App Password** від Gmail, НЕ звичайний пароль!
- Цей файл НЕ має комітитись в Git (вже в `.gitignore`)

### 4️⃣ Створено тестовий файл

**Файл:** `test-email.html`

Відкрийте цей файл у браузері для швидкого тестування email API.

---

## 🧪 Як протестувати:

### Варіант 1: Через тестовий HTML файл

1. Запустіть dev сервер:
   ```bash
   npm run dev
   ```

2. Відкрийте файл `test-email.html` в браузері

3. Заповніть форму та натисніть "Відправити"

### Варіант 2: Через curl

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Тест Faktix",
    "text": "Привіт! Це тестовий лист.",
    "html": "<b>Привіт!</b> Це тестовий лист."
  }'
```

### Варіант 3: Через JavaScript/TypeScript

```typescript
const sendEmail = async (to: string, subject: string, html: string) => {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html })
  });
  
  const result = await response.json();
  console.log(result);
};
```

---

## 📤 Приклад використання в компонентах:

### Відправка простого листа:

```typescript
const handleSendEmail = async (email: string) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Rozpočet od Faktix',
        html: '<h2>Váš rozpočet</h2><p>Děkujeme za zájem!</p>'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('✅ Email odeslán!');
    } else {
      alert('❌ Chyba: ' + result.error);
    }
  } catch (error) {
    console.error('Email error:', error);
    alert('❌ Chyba při odesílání');
  }
};
```

### Відправка з PDF вкладенням:

```typescript
const sendEmailWithPDF = async (email: string, pdfBlob: Blob) => {
  // 1. Конвертуємо Blob в Base64
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(pdfBlob);
  });
  
  // 2. Відправляємо email
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      subject: 'Rozpočet od Faktix',
      html: '<h2>Váš rozpočet v příloze</h2>',
      attachments: [{
        filename: 'rozpocet.pdf',
        content: base64.split('base64,')[1], // Видаляємо префікс
        encoding: 'base64'
      }]
    })
  });
  
  return await response.json();
};
```

---

## 🔐 Налаштування Gmail App Password:

Якщо потрібно створити новий App Password:

1. Перейдіть на: https://myaccount.google.com/apppasswords
2. Увійдіть в Google аккаунт
3. Виберіть "Mail" та "Other (Custom name)"
4. Введіть назву (наприклад "Faktix")
5. Скопіюйте згенерований пароль (формат: `xxxx xxxx xxxx xxxx`)
6. Вставте в `.env.local` як `EMAIL_PASS`

⚠️ **Примітка:** Для використання App Passwords потрібно мати увімкнену 2-Step Verification.

---

## 🚀 Deployment (Vercel):

При розгортанні на Vercel додайте environment variables:

1. Перейдіть в: **Project Settings → Environment Variables**
2. Додайте:
   - `EMAIL_USER` = `xperementus@gmail.com`
   - `EMAIL_PASS` = `qcde xouk sccv nscn`
3. Збережіть та redeploy проект

---

## 🐛 Troubleshooting:

### Помилка: "Invalid login"
- Перевірте, що використовуєте App Password, а не звичайний пароль
- Перевірте, що увімкнена 2-Step Verification в Google

### Помилка: "Connection timeout"
- Перевірте, що порт 465 не заблокований файрволом
- Спробуйте використати порт 587 з `secure: false`

### Помилка: "Environment variable not found"
- Перезапустіть dev сервер після зміни `.env.local`
- Перевірте, що змінні називаються `EMAIL_USER` та `EMAIL_PASS`

---

## 📊 Статус:

✅ nodemailer встановлено  
✅ API endpoint створено  
✅ .env.local налаштовано  
✅ Тестовий файл створено  
✅ Dev сервер перезапущено  
🎉 **Готово до використання!**

---

**Створено:** 11 листопада 2025  
**Email:** xperementus@gmail.com  
**Статус:** Активний

