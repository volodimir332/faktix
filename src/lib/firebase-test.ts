import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Тестова Firebase конфігурація (використовуйте цю для тестування)
const firebaseConfig = {
  apiKey: "AIzaSyBxf55ui7ZwGAFRJg_14BBefWAHLCZ9sMw",
  authDomain: "faktix-8d2cc.firebaseapp.com",
  projectId: "faktix-8d2cc",
  storageBucket: "faktix-8d2cc.firebasestorage.app",
  messagingSenderId: "685408432041",
  appId: "1:685408432041:web:bbbc88c0a5e97bd3ab1eb8",
  measurementId: "G-NLPRJCP9C6"
};

// Альтернативна конфігурація (якщо перша не працює)
const firebaseConfigAlt = {
  apiKey: "AIzaSyBxf55ui7ZwGAFRJg_14BBefWAHLCZ9sMw",
  authDomain: "faktix-8d2cc.firebaseapp.com",
  projectId: "faktix-8d2cc",
  storageBucket: "faktix-8d2cc.firebasestorage.app",
  messagingSenderId: "685408432041",
  appId: "1:685408432041:web:bbbc88c0a5e97bd3ab1eb8"
};

console.log('🧪 Testing Firebase configuration...');

let app;
let auth: Auth;
let db: Firestore;
let analytics = null;

try {
  // Спробуємо першу конфігурацію
  app = initializeApp(firebaseConfig);
  console.log('✅ Primary config worked');
} catch (error) {
  console.log('❌ Primary config failed, trying alternative...');
  try {
    app = initializeApp(firebaseConfigAlt);
    console.log('✅ Alternative config worked');
  } catch (error2) {
    console.error('❌ Both configs failed:', error2);
    throw error2;
  }
}

try {
  auth = getAuth(app);
  console.log('✅ Auth initialized');
} catch (error) {
  console.error('❌ Auth initialization failed:', error);
  throw error;
}

try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized');
} catch (error) {
  console.error('❌ Firestore initialization failed:', error);
  throw error;
}

if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
    console.log('✅ Analytics initialized');
  } catch (error) {
    console.warn('⚠️ Analytics failed:', error);
  }
}

export { auth, db, analytics };
export default app;








