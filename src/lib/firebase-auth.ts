import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified?: boolean;
}

// Реєстрація нового користувача
export const registerUser = async (email: string, password: string, displayName?: string) => {
  try {
    console.log('🔄 Starting user registration for:', email);
    console.log('🔧 Registration details:', {
      email,
      hasPassword: !!password,
      passwordLength: password.length,
      displayName,
      authInstance: !!auth,
      authApp: auth?.app?.name
    });

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ User created successfully:', userCredential.user.uid);
    
    if (displayName && userCredential.user) {
      console.log('🔄 Updating user profile with displayName:', displayName);
      await updateProfile(userCredential.user, { displayName: displayName });
      console.log('✅ User profile updated successfully');
    }

    // === НОВИЙ КРОК: НАДСИЛАЄМО ЛИСТ ДЛЯ ПІДТВЕРДЖЕННЯ ===
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const actionCodeSettings = {
      url: `${APP_URL}/prihlaseni?message=verify-email`,
      handleCodeInApp: false
    } as const;
    console.log('📧 Sending email verification...', { redirectUrl: actionCodeSettings.url });
    await sendEmailVerification(userCredential.user, actionCodeSettings);
    console.log('✅ Email verification sent successfully');
    
    return { 
      success: true, 
      user: userCredential.user,
      message: 'Реєстрація майже завершена! Ми надіслали лист на вашу пошту для підтвердження.'
    };
  } catch (error: unknown) {
    console.error('❌ Registration error:', error);
    
    // Детальна діагностика помилки
    if (error instanceof Error) {
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    const firebaseError = error as { code?: string; message?: string };
    const errorCode = firebaseError.code || 'unknown-error';
    const errorMessage = getErrorMessage(errorCode);

    console.log('🚨 Registration failed:', { 
      errorCode, 
      errorMessage,
      originalMessage: firebaseError.message 
    });
    
    return {
      success: false,
      error: errorCode,
      message: errorMessage
    };
  }
};

// Повторне надсилання листа підтвердження
export const resendVerificationEmail = async () => {
  const user = auth.currentUser;
  if (!user) return { success: false, message: 'Користувач не авторизований' };
  try {
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const actionCodeSettings = {
      url: `${APP_URL}/prihlaseni?message=verify-email`,
      handleCodeInApp: false
    } as const;
    await sendEmailVerification(user, actionCodeSettings);
    return { success: true };
  } catch (error) {
    console.error('❌ Resend verification error:', error);
    return { success: false };
  }
};

// Вхід користувача
export const loginUser = async (email: string, password: string) => {
  try {
    console.log('🔄 Starting user login for:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ User logged in successfully:', userCredential.user.uid);
    
    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    console.error('❌ Login error:', error);
    const firebaseError = error as { code?: string };
    const errorCode = firebaseError.code || 'unknown-error';
    const errorMessage = getErrorMessage(errorCode);
    
    console.log('🚨 Login failed:', { errorCode, errorMessage });
    
    return { 
      success: false, 
      error: errorCode,
      message: errorMessage
    };
  }
};

// Вхід через Google
export const signInWithGoogle = async () => {
  try {
    console.log('🔄 Starting Google Sign-In');
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const userCredential = await signInWithPopup(auth, provider);
    console.log('✅ User signed in with Google:', userCredential.user.uid);
    
    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    console.error('❌ Google Sign-In error:', error);
    const firebaseError = error as { code?: string };
    const errorCode = firebaseError.code || 'unknown-error';
    const errorMessage = getErrorMessage(errorCode);
    
    console.log('🚨 Google Sign-In failed:', { errorCode, errorMessage });
    
    return { 
      success: false, 
      error: errorCode,
      message: errorMessage
    };
  }
};

// Вихід користувача
export const logoutUser = async () => {
  try {
    console.log('🔄 Starting user logout');
    
    await signOut(auth);
    console.log('✅ User logged out successfully');
    
    return { success: true };
  } catch (error: unknown) {
    console.error('❌ Logout error:', error);
    const firebaseError = error as { code?: string };
    const errorCode = firebaseError.code || 'unknown-error';
    const errorMessage = getErrorMessage(errorCode);
    
    console.log('🚨 Logout failed:', { errorCode, errorMessage });
    
    return { 
      success: false, 
      error: errorCode,
      message: errorMessage
    };
  }
};

// Скидання пароля
export const resetPassword = async (email: string) => {
  try {
    console.log('🔄 Starting password reset for:', email);
    
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Password reset email sent successfully');
    
    return { success: true };
  } catch (error: unknown) {
    console.error('❌ Password reset error:', error);
    const firebaseError = error as { code?: string };
    const errorCode = firebaseError.code || 'unknown-error';
    const errorMessage = getErrorMessage(errorCode);
    
    console.log('🚨 Password reset failed:', { errorCode, errorMessage });
    
    return { 
      success: false, 
      error: errorCode,
      message: errorMessage
    };
  }
};

// Отримання поточного користувача
export const getCurrentUser = (): User | null => {
  const user = auth.currentUser;
  console.log('👤 Current user:', user ? user.uid : 'null');
  return user;
};

// Підписка на зміни стану аутентифікації
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  console.log('🔔 Setting up auth state listener');
  
  return onAuthStateChanged(auth, (user) => {
    console.log('🔄 Auth state changed:', user ? user.uid : 'null');
    callback(user);
  });
};

// Конвертація Firebase User в AuthUser
export const convertFirebaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified
  };
};

// Error messages
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'Користувача з такою електронною поштою не знайдено',
    'auth/wrong-password': 'Неправильний пароль',
    'auth/email-already-in-use': 'Користувач з такою електронною поштою вже існує',
    'auth/weak-password': 'Пароль занадто слабкий',
    'auth/invalid-email': 'Неправильний формат електронної пошти',
    'auth/too-many-requests': 'Забагато спроб входу. Спробуйте пізніше',
    'auth/network-request-failed': 'Помилка мережі. Перевірте з\'єднання',
    'auth/user-disabled': 'Обліковий запис відключено',
    'auth/operation-not-allowed': 'Операція не дозволена',
    'auth/invalid-credential': 'Неправильні облікові дані',
    'auth/requires-recent-login': 'Потрібен нещодавній вхід для цієї операції',
    'auth/account-exists-with-different-credential': 'Обліковий запис вже існує з іншими обліковими даними'
  };
  
  return errorMessages[errorCode] || 'Сталася невідома помилка';
};
