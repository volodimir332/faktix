"use client";
import { CheckCircle, DollarSign, Zap } from 'lucide-react';
import Link from 'next/link';

interface StarterPlanProps {
  className?: string;
  showFeatures?: boolean;
  compact?: boolean;
  variant?: 'default' | 'highlighted' | 'minimal';
}

export function StarterPlan({ 
  className = "", 
  showFeatures = true, 
  compact = false, 
  variant = 'default' 
}: StarterPlanProps) {
  const features = [
    'Adresář s 5 kontakty',
    'Vystávování a evidence faktur',
    'Přehledy o nákladech a výnosech',
    '3 šablony vzhledu faktur',
    'Zákaznická podpora přes aplikaci faktix',
    'Přístup pro 1 uživatele',
    'Mobilní aplikace'
  ];

  const getVariantStyles = () => {
    switch (variant) {
      case 'highlighted':
        return 'border-money ring-2 ring-money/30 bg-gradient-to-br from-black to-gray-900';
      case 'minimal':
        return 'border-gray-700 bg-gray-900/50';
      default:
        return 'border-money/50 bg-black';
    }
  };

  return (
    <div className={`relative rounded-xl border p-6 ${getVariantStyles()} ${className}`}>
      {variant === 'highlighted' && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-money text-black px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Doporučený start
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
        <p className="text-gray-400 text-sm mb-4">Pro rychlou fakturaci</p>
        
        <div className="relative mb-4">
          <DollarSign className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-gray-400 opacity-30" />
          <div className="text-4xl font-bold text-money">0 <span className="text-lg text-gray-400">Kč</span></div>
          <div className="text-sm text-gray-500 mt-1">Navždy zdarma</div>
        </div>
      </div>

      {showFeatures && !compact && (
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-money flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {compact && (
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Zahrnuje:</div>
          <div className="text-xs text-gray-500">
            {features.slice(0, 3).join(' • ')}...
          </div>
        </div>
      )}

      <Link href="/registrace" className="w-full">
        <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          variant === 'highlighted' 
            ? 'bg-money text-black hover:bg-money-light' 
            : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
        }`}>
          Začít zdarma
        </button>
      </Link>

      {!compact && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            14-denní bezplatná zkušební doba
          </p>
        </div>
      )}
    </div>
  );
} 