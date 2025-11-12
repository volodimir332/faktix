"use client";

import { useState, useCallback } from 'react';
import Toast from '@/components/Toast';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, type, id }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const ToastContainer = useCallback(() => (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-3">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  ), [toasts, removeToast]);

  return {
    showToast,
    ToastContainer,
  };
}


