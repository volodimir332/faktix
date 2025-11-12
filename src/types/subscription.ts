export interface SubscriptionData {
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  priceId: string;
  planName: string;
}

export interface UserSubscription {
  subscription?: SubscriptionData;
  subscriptionStatus?: 'active' | 'past_due' | 'canceled' | 'trialing' | 'free';
  subscriptionEndDate?: Date;
  subscriptionCanceledAt?: Date;
  lastPaymentDate?: Date;
  lastPaymentFailure?: Date;
  stripeCustomerId?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
  trialDays?: number;
}

export interface CheckoutSessionData {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface PortalSessionData {
  returnUrl?: string;
}









