import { loadStripe } from '@stripe/stripe-js';

// Публічний ключ Stripe (безпечно використовувати на клієнті)
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RtrJ0Qgyy84dUAst9ld372WUZnvuW6q8uuUHnJw1tUzYiExFb3DYFMXZN5dLkZ6xv3uF5G58CUZX0hhh5fgqB3y007iUDGhKq';

// ВАЖЛИВО: Секретний ключ НЕ використовуємо на клієнті!
// Він має бути тільки в API routes (src/app/api/*/route.ts)

// Завантажуємо Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Конфігурація для різних валют
export const CURRENCY_CONFIG = {
  CZK: {
    symbol: 'Kč',
    name: 'Czech Koruna',
    decimalPlaces: 2
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    decimalPlaces: 2
  },
  USD: {
    symbol: '$',
    name: 'US Dollar',
    decimalPlaces: 2
  }
};

// Функція для форматування суми
export const formatAmount = (amount: number, currency: string = 'CZK'): string => {
  const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG] || CURRENCY_CONFIG.CZK;
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces
  }).format(amount);
};

// Функція для конвертації суми в центи (Stripe використовує центи)
export const convertToStripeAmount = (amount: number, currency: string = 'CZK'): number => {
  const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG] || CURRENCY_CONFIG.CZK;
  return Math.round(amount * Math.pow(10, config.decimalPlaces));
};

// Функція для конвертації центів назад в основну валюту
export const convertFromStripeAmount = (amount: number, currency: string = 'CZK'): number => {
  const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG] || CURRENCY_CONFIG.CZK;
  return amount / Math.pow(10, config.decimalPlaces);
};
