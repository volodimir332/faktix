import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence } from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  Firestore,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache
} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// КРИТИЧНО: Глобально відключаємо IndexedDB для Safari ПЕРЕД будь-якою ініціалізацією Firebase
if (typeof window !== 'undefined') {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    console.log('🍎 Safari detected - BLOCKING IndexedDB globally');
    // Блокуємо IndexedDB API для Safari
    if (typeof indexedDB !== 'undefined') {
      const originalIndexedDB = window.indexedDB;
      Object.defineProperty(window, 'indexedDB', {
        get: function() {
          console.warn('⚠️ IndexedDB access blocked for Safari compatibility');
          return undefined;
        },
        configurable: true
      });
    }
  }
}

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
  projectId: firebaseConfig.projectId,
  isBrowser: typeof window !== 'undefined',
  nodeEnv: process.env.NODE_ENV
});

// Перевірка середовища
console.log('🌍 Environment check:', {
  isBrowser: typeof window !== 'undefined',
  isDevelopment: process.env.NODE_ENV === 'development',
  nodeEnv: process.env.NODE_ENV,
  userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server'
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
  
  // Для Safari встановлюємо in-memory persistence для Auth
  const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    auth.setPersistence(inMemoryPersistence).then(() => {
      console.log('✅ Auth: In-memory persistence set for Safari');
    }).catch((err) => {
      console.warn('⚠️ Failed to set Auth persistence:', err.message);
    });
  }
  
  console.log('✅ Firebase Auth initialized');
  console.log('🔐 Auth config:', {
    app: auth.app.name,
    config: auth.config,
    persistence: isSafari ? 'in-memory (Safari)' : 'local'
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
  // Детекція Safari для вибору правильного типу кешу
  const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isSafari) {
    console.log('🍎 Safari detected - Using memory-only cache (NO IndexedDB)');
    // Для Safari використовуємо тільки memory cache БЕЗ IndexedDB
    db = initializeFirestore(app, {
      localCache: memoryLocalCache()
    });
  } else {
    console.log('🌐 Non-Safari browser - Using persistent cache with IndexedDB');
    // Для інших браузерів використовуємо persistent cache з IndexedDB
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    } catch (e) {
      console.warn('⚠️ Failed to initialize with persistent cache, falling back to memory cache');
      db = initializeFirestore(app, {
        localCache: memoryLocalCache()
      });
    }
  }
  
  console.log('✅ Firestore initialized');
  console.log('🗄️ Firestore config:', {
    app: db.app.name,
    type: db.type,
    cacheType: isSafari ? 'memory-only (Safari)' : 'persistent (IndexedDB)'
  });
} catch (error) {
  console.error('❌ Firestore initialization error:', error);
  console.error('🔍 Firestore error details:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });
  throw error;
}

// Ініціалізація Analytics (тільки в браузері, НЕ в Safari через IndexedDB)
let analytics = null;
if (typeof window !== 'undefined') {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isSafari) {
    console.log('🍎 Safari: Analytics DISABLED (prevents IndexedDB issues)');
  } else {
    try {
      analytics = getAnalytics(app);
      console.log('✅ Analytics initialized');
    } catch (error) {
      console.warn('⚠️ Analytics не може бути ініціалізований:', error);
    }
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
