import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

// Глобальний стан автентифікації
let currentUser: User | null = null;
let isAuthenticated = false;
let isEmailVerified = false;

// Слухачі для оновлення стану
const authStateListeners: Array<(user: User | null, authenticated: boolean, verified: boolean) => void> = [];

// Центральний Auth State Listener
export const initializeAuthStateListener = () => {
  console.log('🔐 Initializing global auth state listener...');
  
  return onAuthStateChanged(auth, (user) => {
    console.log('🔐 Auth state changed:', {
      user: user ? user.uid : 'null',
      email: user?.email,
      emailVerified: user?.emailVerified,
      timestamp: new Date().toISOString()
    });

    // Оновлюємо глобальний стан
    currentUser = user;
    isAuthenticated = !!user;
    isEmailVerified = user?.emailVerified || false;

    // Повідомляємо всіх слухачів
    authStateListeners.forEach(listener => {
      try {
        listener(user, isAuthenticated, isEmailVerified);
      } catch (error) {
        console.error('Error in auth state listener:', error);
      }
    });

    // Логуємо зміни для діагностики
    if (user) {
      console.log('✅ User authenticated:', {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName
      });
    } else {
      console.log('ℹ️ No user authenticated (not signed in)');
    }
  });
};

// Функції для отримання поточного стану
export const getCurrentUser = () => currentUser;
export const getIsAuthenticated = () => isAuthenticated;
export const getIsEmailVerified = () => isEmailVerified;

// Функція для підписки на зміни стану автентифікації
export const subscribeToAuthState = (listener: (user: User | null, authenticated: boolean, verified: boolean) => void) => {
  authStateListeners.push(listener);
  
  // Відразу викликаємо з поточним станом
  listener(currentUser, isAuthenticated, isEmailVerified);
  
  // Повертаємо функцію для відписки
  return () => {
    const index = authStateListeners.indexOf(listener);
    if (index > -1) {
      authStateListeners.splice(index, 1);
    }
  };
};

// Функція для перевірки доступу до сторінки
export const checkPageAccess = (pathname: string) => {
  console.log('🔐 Checking page access:', {
    pathname,
    isAuthenticated,
    isEmailVerified,
    user: currentUser?.email
  });

  // Публічні сторінки (доступні без авторизації)
  const publicRoutes = ['/', '/prihlaseni', '/registrace', '/test', '/potvrdit-email'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Приватні сторінки (потребують авторизації)
  const privateRoutes = ['/dashboard', '/faktury', '/analytiky', '/profil', '/nastaveni', '/klienti'];
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  // Користувач авторизований ТА його email підтверджений
  if (isAuthenticated && isEmailVerified) {
    // Якщо він на публічній сторінці, перенаправляємо на дашборд
    if (isPublicRoute) {
      console.log('🔄 Redirecting authenticated user from public route to dashboard');
      return { shouldRedirect: true, target: '/dashboard' };
    }
    
    // Якщо він на приватній сторінці - дозволяємо доступ
    if (isPrivateRoute) {
      console.log('✅ User has access to private route');
      return { shouldRedirect: false };
    }
  }
  
  // Користувач авторизований, але email НЕ підтверджений
  else if (isAuthenticated && !isEmailVerified) {
    // Якщо він не на сторінці підтвердження email, перенаправляємо туди
    if (pathname !== '/potvrdit-email') {
      console.log('🔄 Redirecting unverified user to email verification page');
      return { shouldRedirect: true, target: '/potvrdit-email' };
    }
    
    // Якщо він на сторінці підтвердження - дозволяємо доступ
    return { shouldRedirect: false };
  }
  
  // Користувач НЕ авторизований
  else {
    // Якщо він намагається зайти на приватну сторінку, перенаправляємо на лендінг
    if (isPrivateRoute) {
      console.log('🔄 Redirecting unauthenticated user from private route to landing');
      return { shouldRedirect: true, target: '/' };
    }
    
    // Якщо він на публічній сторінці - дозволяємо доступ
    if (isPublicRoute) {
      console.log('✅ User has access to public route');
      return { shouldRedirect: false };
    }
  }

  // Всі інші випадки - дозволяємо доступ
  return { shouldRedirect: false };
};

// Експортуємо для використання в інших файлах
const authStateSystem = {
  initializeAuthStateListener,
  getCurrentUser,
  getIsAuthenticated,
  getIsEmailVerified,
  subscribeToAuthState,
  checkPageAccess
};

export default authStateSystem;
