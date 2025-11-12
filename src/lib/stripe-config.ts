import { loadStripe } from '@stripe/stripe-js';

// Тестові ключі Stripe
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RtrJ0Qgyy84dUAst9ld372WUZnvuW6q8uuUHnJw1tUzYiExFb3DYFMXZN5dLkZ6xv3uF5G58CUZX0hhh5fgqB3y007iUDGhKq';
export const STRIPE_SECRET_KEY = 'sk_test_51RtrJ0Qgyy84dUAsVg751lG48vRohWjLMQ0TMYKURxCjLH1B3owhOqaugQaeWixOQZ5pKAB4v33pLvACI5X1GwhV00lZ4X8BI9';

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
