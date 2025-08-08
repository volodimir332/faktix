import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase конфігурація - ваші реальні дані
const firebaseConfig = {
  apiKey: "AIzaSyBxf55ui7ZwGAFRJg_14BBefWAHLCZ9sMw",
  authDomain: "faktix-8d2cc.firebaseapp.com",
  projectId: "faktix-8d2cc",
  storageBucket: "faktix-8d2cc.firebasestorage.app",
  messagingSenderId: "685408432041",
  appId: "1:685408432041:web:bbbc88c0a5e97bd3ab1eb8",
  measurementId: "G-NLPRJCP9C6"
};

// Детальна перевірка конфігурації
console.log('🔧 Firebase config check:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasAppId: !!firebaseConfig.appId,
  apiKeyLength: firebaseConfig.apiKey?.length,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Перевірка середовища
console.log('🌍 Environment check:', {
  isBrowser: typeof window !== 'undefined',
  isDevelopment: process.env.NODE_ENV === 'development',
  nodeEnv: process.env.NODE_ENV
});

// Ініціалізація Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  console.log('📱 Firebase app name:', app.name);
  console.log('🔧 Firebase app options:', app.options);
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.error('🔍 Error details:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });
  throw error;
}

// Ініціалізація сервісів
let auth: Auth;
let db: Firestore;

try {
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized');
  console.log('🔐 Auth config:', {
    app: auth.app.name,
    config: auth.config
  });
} catch (error) {
  console.error('❌ Firebase Auth initialization error:', error);
  console.error('🔍 Auth error details:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });
  throw error;
}

try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized');
  console.log('🗄️ Firestore config:', {
    app: db.app.name,
    type: db.type
  });
} catch (error) {
  console.error('❌ Firestore initialization error:', error);
  console.error('🔍 Firestore error details:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });
  throw error;
}

// Ініціалізація Analytics (тільки в браузері)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
    console.log('✅ Analytics initialized');
  } catch (error) {
    console.warn('⚠️ Analytics не може бути ініціалізований:', error);
  }
}

// Підключення до емуляторів для розробки (опціонально)
if (process.env.NODE_ENV === 'development') {
  // Розкоментуйте наступні рядки, якщо використовуєте Firebase Emulator
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

export { auth, db, analytics };
export default app;
