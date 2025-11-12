import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, convertToStripeAmount } from '@/lib/stripe-config';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'CZK', invoiceId, customerEmail, description } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Конвертуємо суму в центи для Stripe
    const stripeAmount = convertToStripeAmount(amount, currency);

    // Створюємо платежний інтент
    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency: currency.toLowerCase(),
      metadata: {
        invoiceId: invoiceId || 'unknown',
        customerEmail: customerEmail || 'unknown',
        description: description || 'Invoice payment'
      },
      description: description || `Payment for invoice ${invoiceId}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: stripeAmount,
      currency: currency
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
