"use client";
import { useState } from 'react';
import { CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

type PricingPeriod = 'yearly' | 'quarterly' | 'monthly';

interface PricingPlan {
  name: string;
  description: string;
  features: string[];
  monthlyPrice: number; // Ціна без ДПГ
  isPopular?: boolean;
  isFree?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    description: 'Pro rychlou fakturaci',
    monthlyPrice: 0,
    isFree: true,
    features: [
      'Adresář s 5 kontakty',
      'Vystávování a evidence faktur',
      'Přehledy o nákladech a výnosech',
      '3 šablony vzhledu faktur',
      'Zákaznická podpora přes aplikaci faktix',
      'Přístup pro 1 uživatele',
      'Mobilní aplikace'
    ]
  },
  {
    name: 'Základní',
    description: 'Pro neomezenou fakturaci',
    monthlyPrice: 189, // Ціна без ДПГ (229 / 1.21)
    features: [
      'Stejné funkce jako předplatné Zdarma',
      'Neomezený adresář',
      'Navíc získáte',
      'Štítkování a přílohy dokumentů',
      'Ceník a sklad',
      'Napojení na software externí účetní',
      'Telefonická zákaznická podpora',
      'Přístup pro 2 uživatele'
    ]
  },
  {
    name: 'Oblíbený',
    description: 'Pro automatizaci ve fakturování',
    monthlyPrice: 386, // Ціна bez ДПГ (467 / 1.21)
    isPopular: true,
    features: [
      'Stejné funkce jako Základní předplatné',
      'Neomezený adresář',
      'Navíc získáte',
      'Napojení na pokladnu',
      'Propojení s bankovními účty',
      'Automatické párování plateb s fakturami',
      'Automatické upomínky',
      'Automatické poděkování za úhradu',
      'Prodejky',
      'Doklady k úhradě',
      'Přiznání k dani z příjmů'
    ]
  },
  {
    name: 'Prémiový',
    description: 'Pro náročné uživatele',
    monthlyPrice: 664, // Ціна bez ДПГ (804 / 1.21)
    features: [
      'Stejné funkce jako Oblíbené předplatné',
      'Neomezený adresář',
      'Navíc získáte',
      'Propojení přes API pro 75 000 požadavků měsíčně',
      'Přednostní telefonická podpora',
      'Přístup pro 9 uživatelů'
    ]
  }
];

export function PricingToggle() {
  const [period, setPeriod] = useState<PricingPeriod>('yearly');
  const [autoSwitch, setAutoSwitch] = useState(false);
  const [includeVAT, setIncludeVAT] = useState(true); // Додано стан для ДПГ

  const getPrice = (monthlyPrice: number): { display: number; original: number; savings: number } => {
    if (monthlyPrice === 0) return { display: 0, original: 0, savings: 0 };
    
    // Розраховуємо базову ціну залежно від періоду
    let basePrice: number;
    switch (period) {
      case 'quarterly':
        const quarterlyDiscount = 0.15;
        basePrice = Math.round(monthlyPrice * (1 - quarterlyDiscount));
        break;
      case 'yearly':
        const yearlyDiscount = 0.30;
        basePrice = Math.round(monthlyPrice * (1 - yearlyDiscount));
        break;
      default:
        basePrice = monthlyPrice;
    }
    
    // Додаємо ДПГ якщо включено
    const finalPrice = includeVAT ? Math.round(basePrice * 1.21) : basePrice;
    const originalPrice = includeVAT ? Math.round(monthlyPrice * 1.21) : monthlyPrice;
    
    return {
      display: finalPrice,
      original: originalPrice,
      savings: originalPrice - finalPrice
    };
  };

  const getPeriodText = (): string => {
    switch (period) {
      case 'quarterly': return '/kvartál';
      case 'yearly': return '/rok';
      default: return '/měsíc';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Period Toggle with Auto Switch and VAT Toggle */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-4">
          {/* Auto Switch Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoSwitch(!autoSwitch)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoSwitch ? 'bg-money' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoSwitch ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-400">Auto-switch</span>
          </div>
          
          {/* VAT Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIncludeVAT(!includeVAT)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                includeVAT ? 'bg-money' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  includeVAT ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-400">S DPH</span>
          </div>
          
          {/* Period Selection */}
          <div className="border border-gray-800 rounded-lg p-1 flex">
            {[
              { key: 'yearly' as PricingPeriod, label: 'Ročně' },
              { key: 'quarterly' as PricingPeriod, label: 'Kvartálně' },
              { key: 'monthly' as PricingPeriod, label: 'Měsíčně' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  period === key
                    ? 'bg-money text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => {
          const pricing = getPrice(plan.monthlyPrice);
          const isPopular = plan.isPopular;

          return (
            <div
              key={index}
              className={`relative rounded-xl border p-6 ${
                isPopular
                  ? 'border-money ring-2 ring-money'
                  : 'border-money/50'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-money text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Oblíbený
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  {plan.isFree ? (
                    <div className="text-4xl font-bold text-money">0 <span className="text-lg text-gray-400">Kč</span></div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-money">
                        {pricing.display} <span className="text-lg text-gray-400">Kč{getPeriodText()}</span>
                      </div>
                      {pricing.savings > 0 && (
                        <div className="mt-1">
                          <span className="text-sm text-gray-400 line-through">{pricing.original} Kč</span>
                          <div className="text-sm text-money font-medium">
                            Ušetříte {pricing.savings} Kč {getPeriodText()}
                          </div>
                        </div>
                      )}
                      {!includeVAT && (
                        <div className="mt-1">
                          <div className="text-xs text-gray-500">
                            Bez DPH
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    {feature === 'Navíc získáte' ? (
                      <div className="text-sm font-semibold text-gray-400 mt-2">{feature}</div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 text-money flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <Link href="/registrace" className="w-full">
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isPopular
                      ? 'bg-money text-black hover:bg-money-light'
                      : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {plan.isFree ? 'Začít zdarma' : 'Vybrat plán'}
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Bottom Info */}
      <div className="text-center mt-12">
        <p className="text-gray-400 text-sm">
          Všechny plány zahrnují 14-denní bezplatnou zkušební dobu. Zrušit můžete kdykoli.
        </p>
        <div className="mt-4">
          <Link href="/kontakt" className="text-money hover:text-money-light text-sm font-medium">
            Potřebujete individuální řešení? Kontaktujte nás →
          </Link>
        </div>
      </div>
    </div>
  );
} 