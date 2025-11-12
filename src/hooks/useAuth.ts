"use client";

import { useState, useEffect } from 'react';
import { 
  loginUser, 
  logoutUser, 
  registerUser, 
  resetPassword,
  signInWithGoogle as googleSignIn,
  convertFirebaseUser,
  AuthUser 
} from '@/lib/firebase-auth';
import { subscribeToAuthState } from '@/lib/auth-state-listener';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 useAuth: Setting up auth state subscription...');
    
    // Підписуємося на зміни стану автентифікації
    const unsubscribe = subscribeToAuthState((firebaseUser, authenticated, emailVerified) => {
      console.log('🔐 useAuth: Auth state updated:', {
        user: firebaseUser?.email,
        authenticated,
        emailVerified
      });
      
      const authUser = convertFirebaseUser(firebaseUser);
      setUser(authUser);
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    });

    // Очищення при розмонтуванні
    return () => {
      console.log('🔐 useAuth: Cleaning up auth state subscription...');
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 useAuth: Attempting login...');
    setIsLoading(true);
    const result = await loginUser(email, password);
    setIsLoading(false);
    return result;
  };

  const logout = async () => {
    console.log('🔐 useAuth: Attempting logout...');
    setIsLoading(true);
    const result = await logoutUser();
    setIsLoading(false);
    return result;
  };

  const register = async (email: string, password: string, displayName?: string) => {
    console.log('🔐 useAuth: Attempting registration...');
    setIsLoading(true);
    const result = await registerUser(email, password, displayName);
    setIsLoading(false);
    return result;
  };

  const resetUserPassword = async (email: string) => {
    console.log('🔐 useAuth: Attempting password reset...');
    setIsLoading(true);
    const result = await resetPassword(email);
    setIsLoading(false);
    return result;
  };

  const signInWithGoogle = async () => {
    console.log('🔐 useAuth: Attempting Google Sign-In...');
    setIsLoading(true);
    const result = await googleSignIn();
    setIsLoading(false);
    return result;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    resetPassword: resetUserPassword,
    signInWithGoogle
  };
} 