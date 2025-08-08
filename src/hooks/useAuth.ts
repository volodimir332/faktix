"use client";

import { useState, useEffect } from 'react';
import { 
  onAuthStateChange, 
  loginUser, 
  logoutUser, 
  registerUser, 
  resetPassword,
  convertFirebaseUser,
  AuthUser 
} from '@/lib/firebase-auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      const authUser = convertFirebaseUser(firebaseUser);
      setUser(authUser);
      setIsAuthenticated(!!authUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await loginUser(email, password);
    setIsLoading(false);
    return result;
  };

  const logout = async () => {
    setIsLoading(true);
    const result = await logoutUser();
    setIsLoading(false);
    return result;
  };

  const register = async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    const result = await registerUser(email, password, displayName);
    setIsLoading(false);
    return result;
  };

  const resetUserPassword = async (email: string) => {
    setIsLoading(true);
    const result = await resetPassword(email);
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
    resetPassword: resetUserPassword
  };
} 