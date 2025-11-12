import { getFunctions, httpsCallable } from 'firebase/functions';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { CheckoutSessionData, PortalSessionData, PricingPlan } from '@/types/subscription';

// Ініціалізація Firebase Functions (регіон us-central1)
const functions = getFunctions(undefined, 'us-central1');

// Ініціалізація Stripe (публічний ключ). Безпечна ініціалізація, щоб не падало без ключа/в SSR
export const isStripeConfigured = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const stripePromise: Promise<Stripe | null> = (typeof window !== 'undefined' && isStripeConfigured)
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
  : Promise.resolve(null);

// Тарифні плани
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'CZK',
    interval: 'month',
    features: [
      '5 faktur на місяць',
      'Базова підтримка',
      'Експорт PDF',
      'Email уведомления'
    ],
    stripePriceId: '',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    currency: 'CZK',
    interval: 'month',
    features: [
      'Необмежена кількість фактур',
      'Пріоритетна підтримка',
      'Експорт PDF, Excel',
      'Email уведомления',
      'API доступ',
      'Розширена аналітика',
      'Багато користувачів'
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    popular: true,
    trialDays: 14
  },
  {
    id: 'business',
    name: 'Business',
    price: 599,
    currency: 'CZK',
    interval: 'month',
    features: [
      'Все з Pro плану',
      'Індивідуальна підтримка',
      'Налаштування під ваші потреби',
      'Інтеграція з ERP системами',
      'Білий лейбл',
      'Dedicated менеджер'
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID!,
    popular: false,
    trialDays: 14
  }
];

/**
 * Створює сесію оплати Stripe
 */
export const createCheckoutSession = async (data: CheckoutSessionData) => {
  try {
    if (!isStripeConfigured) {
      throw new Error('Stripe není nakonfigurován: nastavte NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY v .env.local');
    }
    console.log('💳 Creating checkout session for price:', data.priceId);
    
    const createStripeCheckoutSession = httpsCallable(functions, 'createStripeCheckoutSession');
    const result = await createStripeCheckoutSession(data);
    
    const { sessionId, url } = result.data as { sessionId: string; url: string };
    
    console.log('✅ Checkout session created:', sessionId);
    
    return { sessionId, url };
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Перенаправляє користувача на сторінку оплати Stripe
 */
export const redirectToCheckout = async (data: CheckoutSessionData) => {
  try {
    const { sessionId } = await createCheckoutSession(data);
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe není inicializován (chybí veřejný klíč). Nastavte NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.');
    }
    
    const { error } = await stripe.redirectToCheckout({
      sessionId
    });
    
    if (error) {
      console.error('❌ Stripe checkout error:', error);
      throw error;
    }
    
    console.log('✅ Redirected to Stripe checkout');
  } catch (error) {
    console.error('❌ Error redirecting to checkout:', error);
    throw error;
  }
};

/**
 * Створює сесію порталу клієнта Stripe
 */
export const createPortalSession = async (data: PortalSessionData = {}) => {
  try {
    console.log('🔐 Creating portal session');
    
    const createStripePortalSession = httpsCallable(functions, 'createStripePortalSession');
    const result = await createStripePortalSession(data);
    
    const { url } = result.data as { url: string };
    
    console.log('✅ Portal session created');
    
    return url;
  } catch (error) {
    console.error('❌ Error creating portal session:', error);
    throw error;
  }
};

/**
 * Перенаправляє користувача на портал клієнта Stripe
 */
export const redirectToPortal = async (data: PortalSessionData = {}) => {
  try {
    if (!isStripeConfigured) {
      throw new Error('Stripe není nakonfigurován: nastavte NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY v .env.local');
    }
    const url = await createPortalSession(data);
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  } catch (error) {
    console.error('❌ Error redirecting to portal:', error);
    throw error;
  }
};

/**
 * Перевіряє, чи активна підписка користувача
 */
export const isSubscriptionActive = (subscriptionStatus?: string): boolean => {
  return subscriptionStatus === 'active' || subscriptionStatus === 'trialing';
};

/**
 * Перевіряє, чи знаходиться підписка на пробному періоді
 */
export const isSubscriptionTrialing = (subscriptionStatus?: string): boolean => {
  return subscriptionStatus === 'trialing';
};

/**
 * Перевіряє, чи закінчилася підписка
 */
export const isSubscriptionExpired = (subscriptionStatus?: string): boolean => {
  return subscriptionStatus === 'canceled' || subscriptionStatus === 'past_due';
};

/**
 * Форматує ціну для відображення
 */
export const formatPrice = (price: number, currency: string): string => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: currency
  }).format(price);
};

/**
 * Отримує популярний план
 */
export const getPopularPlan = (): PricingPlan | undefined => {
  return PRICING_PLANS.find(plan => plan.popular);
};

/**
 * Отримує план за ID
 */
export const getPlanById = (id: string): PricingPlan | undefined => {
  return PRICING_PLANS.find(plan => plan.id === id);
};
