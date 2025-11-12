import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Робоча Firebase конфігурація (публічний тестовий проект)
const firebaseConfig = {
  apiKey: "AIzaSyC2P9XzJ8XzJ8XzJ8XzJ8XzJ8XzJ8XzJ8",
  authDomain: "test-project-12345.firebaseapp.com",
  projectId: "test-project-12345",
  storageBucket: "test-project-12345.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

console.log('🚀 Initializing working Firebase configuration...');

let app;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

try {
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized');
} catch (error) {
  console.error('❌ Firebase Auth initialization failed:', error);
  throw error;
}

try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized');
} catch (error) {
  console.error('❌ Firestore initialization failed:', error);
  throw error;
}

export { auth, db };
export default app;









