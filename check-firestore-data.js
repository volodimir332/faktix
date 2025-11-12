// Скрипт для перевірки даних в Firestore
// Запустити в консолі браузера: node check-firestore-data.js

const admin = require('firebase-admin');

// ВАЖЛИВО: Потрібен service account key з Firebase Console
// Завантажте його з: Firebase Console → Project Settings → Service Accounts → Generate new private key

try {
  // Ініціалізація Firebase Admin
  const serviceAccount = require('./firebase-service-account.json'); // Потрібно завантажити
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();

  async function checkData() {
    console.log('🔍 Перевірка даних в Firestore...\n');

    // Перевірка користувачів
    console.log('👥 Користувачі:');
    const usersSnapshot = await db.collection('users').get();
    console.log(`  Знайдено: ${usersSnapshot.size} користувачів`);
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${doc.id}: ${data.email || data.displayName}`);
    });

    // Перевірка фактур
    console.log('\n📄 Фактури:');
    const invoicesSnapshot = await db.collection('invoices').get();
    console.log(`  Знайдено: ${invoicesSnapshot.size} фактур`);
    
    // Групуємо по userId
    const invoicesByUser = {};
    invoicesSnapshot.forEach(doc => {
      const data = doc.data();
      const userId = data.userId;
      if (!invoicesByUser[userId]) {
        invoicesByUser[userId] = [];
      }
      invoicesByUser[userId].push({
        id: doc.id,
        number: data.invoiceNumber,
        customer: data.customer,
        total: data.total,
        status: data.status,
        date: data.date
      });
    });

    Object.entries(invoicesByUser).forEach(([userId, invoices]) => {
      console.log(`\n  User: ${userId} (${invoices.length} фактур)`);
      invoices.forEach(inv => {
        console.log(`    - ${inv.number}: ${inv.customer} - ${inv.total} Kč (${inv.status})`);
      });
    });

    // Перевірка клієнтів
    console.log('\n👤 Клієнти:');
    const clientsSnapshot = await db.collection('clients').get();
    console.log(`  Знайдено: ${clientsSnapshot.size} клієнтів`);
    
    const clientsByUser = {};
    clientsSnapshot.forEach(doc => {
      const data = doc.data();
      const userId = data.userId;
      if (!clientsByUser[userId]) {
        clientsByUser[userId] = [];
      }
      clientsByUser[userId].push({
        id: doc.id,
        name: data.name,
        ic: data.ic
      });
    });

    Object.entries(clientsByUser).forEach(([userId, clients]) => {
      console.log(`\n  User: ${userId} (${clients.length} клієнтів)`);
      clients.forEach(client => {
        console.log(`    - ${client.name} (IČ: ${client.ic})`);
      });
    });

    console.log('\n✅ Перевірка завершена!');
  }

  checkData().catch(err => {
    console.error('❌ Помилка:', err);
    process.exit(1);
  });

} catch (error) {
  console.error('❌ Помилка ініціалізації:', error.message);
  console.log('\n📝 Інструкція:');
  console.log('1. Перейдіть: https://console.firebase.google.com');
  console.log('2. Виберіть проект: faktix-8d2cc');
  console.log('3. Project Settings → Service Accounts');
  console.log('4. Generate new private key');
  console.log('5. Збережіть як: firebase-service-account.json');
}


