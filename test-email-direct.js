// Простий тест email без Next.js
// Запустити: node test-email-direct.js

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Читаємо .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Парсимо SYSTEM_EMAIL та SYSTEM_APP_PASSWORD
const systemEmailMatch = envContent.match(/SYSTEM_EMAIL=(.+)/);
const systemPasswordMatch = envContent.match(/SYSTEM_APP_PASSWORD=(.+)/);

const SYSTEM_EMAIL = systemEmailMatch ? systemEmailMatch[1].trim() : null;
const SYSTEM_APP_PASSWORD = systemPasswordMatch ? systemPasswordMatch[1].trim() : null;

console.log('🔍 Перевірка credentials:');
console.log('SYSTEM_EMAIL:', SYSTEM_EMAIL ? `${SYSTEM_EMAIL.substring(0, 10)}...` : 'НЕ ЗНАЙДЕНО');
console.log('SYSTEM_APP_PASSWORD:', SYSTEM_APP_PASSWORD ? `${SYSTEM_APP_PASSWORD.substring(0, 4)}...` : 'НЕ ЗНАЙДЕНО');
console.log('SYSTEM_EMAIL length:', SYSTEM_EMAIL?.length);
console.log('SYSTEM_APP_PASSWORD length:', SYSTEM_APP_PASSWORD?.length);

if (!SYSTEM_EMAIL || !SYSTEM_APP_PASSWORD) {
  console.error('❌ SYSTEM_EMAIL або SYSTEM_APP_PASSWORD не знайдено в .env.local');
  process.exit(1);
}

async function testEmail() {
  try {
    console.log('\n🔧 Створюю SMTP transporter...');
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SYSTEM_EMAIL,
        pass: SYSTEM_APP_PASSWORD,
      },
    });

    console.log('🔌 Перевіряю з\'єднання з Gmail SMTP...');
    await transporter.verify();
    console.log('✅ З\'єднання успішне!');

    console.log('\n📧 Відправляю тестовий email...');
    const info = await transporter.sendMail({
      from: `"Faktix Test" <${SYSTEM_EMAIL}>`,
      to: SYSTEM_EMAIL, // Відправляємо самому собі для тесту
      subject: '🎉 Тест з Faktix',
      text: 'Це тестовий email з Faktix. Якщо ви бачите цей лист - email працює!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #10b981;">✅ Email працює!</h2>
          <p>Це тестовий email з Faktix.</p>
          <p>Якщо ви бачите цей лист - налаштування email правильні!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Відправлено: ${new Date().toLocaleString('uk-UA')}
          </p>
        </div>
      `,
    });

    console.log('✅ Email відправлено успішно!');
    console.log('📬 Message ID:', info.messageId);
    console.log('\n🎉 ВСЕ ПРАЦЮЄ! Перевірте email:', SYSTEM_EMAIL);

  } catch (error) {
    console.error('\n❌ ПОМИЛКА:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.error('\n🔐 Проблема з credentials:');
      console.error('1. Перевірте що SYSTEM_APP_PASSWORD це App Password (не звичайний пароль)');
      console.error('2. App Password має бути 16 символів БЕЗ ПРОБІЛІВ');
      console.error('3. Створіть новий App Password: https://myaccount.google.com/apppasswords');
      console.error('4. Перевірте що увімкнена 2-Step Verification');
      console.error('5. Перевірте що email та пароль правильні в .env.local');
    }
    
    console.error('\nДеталі помилки:', error);
    process.exit(1);
  }
}

testEmail();
