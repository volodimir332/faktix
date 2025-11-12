'use client';

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe-config';
import { Loader2, CheckCircle, XCircle, CreditCard } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  currency?: string;
  invoiceId?: string;
  customerEmail?: string;
  description?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

interface PaymentFormProps {
  amount: number;
  currency?: string;
  invoiceId?: string;
  customerEmail?: string;
  description?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

function PaymentForm({
  amount,
  currency,
  invoiceId,
  customerEmail,
  description,
  onSuccess,
  onError,
  onCancel
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const effectiveCurrency = currency ?? 'CZK';

  // Створюємо платежний інтент при завантаженні
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency: effectiveCurrency,
            invoiceId,
            customerEmail,
            description
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        setPaymentStatus('error');
        onError?.(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, currency, invoiceId, customerEmail, description, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?invoiceId=${invoiceId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        setPaymentStatus('error');
        onError?.(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentStatus('success');
        onSuccess?.(paymentIntent.id);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('Payment failed');
      setPaymentStatus('error');
      onError?.('Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-money" />
        <span className="ml-3 text-gray-300">Připravuji platbu...</span>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="text-center p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Platba úspěšná!</h3>
        <p className="text-gray-300">Vaše platba byla zpracována úspěšně.</p>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="text-center p-8">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Chyba platby</h3>
        <p className="text-gray-300 mb-4">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-money text-black px-6 py-2 rounded-lg hover:bg-money-light transition-colors"
        >
          Zkusit znovu
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-money" />
        <h3 className="text-lg font-semibold text-white">Platba kartou</h3>
      </div>

      <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Částka k zaplacení:</span>
          <span className="text-xl font-bold text-money">
            {new Intl.NumberFormat('cs-CZ', {
              style: 'currency',
              currency: effectiveCurrency
            }).format(amount)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement />
        
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            disabled={isLoading}
          >
            Zrušit
          </button>
          <button
            type="submit"
            disabled={!stripe || !elements || isLoading}
            className="flex-1 px-4 py-3 bg-money text-black rounded-lg hover:bg-money-light transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Zpracování...
              </>
            ) : (
              'Zaplatit'
            )}
          </button>
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-400 text-center">
        Platba je zabezpečena společností Stripe
      </div>
    </div>
  );
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
