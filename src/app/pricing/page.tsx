"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Star, ArrowRight, Shield, Zap, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PRICING_PLANS, redirectToCheckout, formatPrice } from '@/lib/subscription-service';
import { FaktixLogo } from '@/components/FaktixLogo';
import { CloudBackground } from '@/components/CloudBackground';

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, stripePriceId: string) => {
    if (!isAuthenticated) {
      router.push('/prihlaseni?redirect=pricing');
      return;
    }

    if (planId === 'free') {
      router.push('/dashboard');
      return;
    }

    try {
      setIsLoading(planId);
      
      await redirectToCheckout({
        priceId: stripePriceId,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`
      });
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Помилка при підписці. Спробуйте ще раз.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <CloudBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <FaktixLogo size="lg" />
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Головна
              </button>
              {isAuthenticated ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-money text-black px-4 py-2 rounded-lg font-medium hover:bg-money-dark transition-colors"
                >
                  Дашборд
                </button>
              ) : (
                <button
                  onClick={() => router.push('/prihlaseni')}
                  className="bg-money text-black px-4 py-2 rounded-lg font-medium hover:bg-money-dark transition-colors"
                >
                  Увійти
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">
              Виберіть план, який підходить вам
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Почніть безкоштовно з 14-денним пробним періодом. 
              Скасуйте в будь-який момент.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-money shadow-2xl shadow-money/20' 
                    : 'border-gray-700'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-money text-black px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Найпопулярніший
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-400">/{plan.interval}</span>
                    )}
                  </div>
                  {plan.trialDays && (
                    <p className="text-money text-sm">
                      {plan.trialDays} днів безкоштовно
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-money mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id, plan.stripePriceId)}
                  disabled={isLoading === plan.id}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                    plan.popular
                      ? 'bg-money text-black hover:bg-money-dark'
                      : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                  } ${isLoading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading === plan.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Завантаження...
                    </>
                  ) : (
                    <>
                      {plan.price === 0 ? 'Почати безкоштовно' : 'Підписатися'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-8">Чому обирають Faktix?</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <Shield className="w-12 h-12 text-money mb-4" />
                <h3 className="text-xl font-semibold mb-2">Безпека</h3>
                <p className="text-gray-400">
                  Ваші дані захищені банківським рівнем безпеки
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="w-12 h-12 text-money mb-4" />
                <h3 className="text-xl font-semibold mb-2">Швидкість</h3>
                <p className="text-gray-400">
                  Створюйте фактури за 30 секунд
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 text-money mb-4" />
                <h3 className="text-xl font-semibold mb-2">Підтримка</h3>
                <p className="text-gray-400">
                  24/7 підтримка українською мовою
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Часті питання
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Чи можу я скасувати підписку?
                </h3>
                <p className="text-gray-400">
                  Так, ви можете скасувати підписку в будь-який момент. 
                  Доступ до функцій залишиться до кінця оплаченого періоду.
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Що включає пробний період?
                </h3>
                <p className="text-gray-400">
                  Пробний період включає всі функції обраного плану. 
                  Кредитна карта не буде списана протягом 14 днів.
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Чи можу я змінити план?
                </h3>
                <p className="text-gray-400">
                  Так, ви можете оновити або знизити план в будь-який момент 
                  через особистий кабінет.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-400">
              <p>&copy; 2024 Faktix. Всі права захищені.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}









