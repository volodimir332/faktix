"use client";
import { useEffect, useState } from 'react';

export function AnimatedChart() {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Анімація один раз від 0 до 100%
    const duration = 3000; // 3 секунди
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      
      // Easing function для плавності
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(easedProgress);
      
      if (progress >= 1) {
        clearInterval(interval);
        setAnimationComplete(true);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, []);

  // Нові цифри як ви просили
  const keyFacts = [
    { 
      finalValue: 4850, 
      suffix: '+', 
      label: 'Vystavených faktur měsíčně',
      format: 'number'
    },
    { 
      finalValue: 1250, 
      suffix: '+', 
      label: 'Spokojených firem po celé ČR',
      format: 'number'
    },
    { 
      finalValue: 98170000, 
      suffix: '', 
      label: 'Zpracovaných Kč denně',
      format: 'currency'
    }
  ];

  const getAnimatedValue = (finalValue: number, format: string) => {
    if (animationComplete) {
      // Після завершення анімації показуємо фінальне значення
      if (format === 'currency') {
        return finalValue.toLocaleString('cs-CZ');
      }
      return finalValue.toLocaleString('cs-CZ');
    }
    
    // Під час анімації рахуємо поточне значення
    const currentValue = Math.floor(finalValue * animationProgress);
    
    if (format === 'currency') {
      return currentValue.toLocaleString('cs-CZ');
    }
    return currentValue.toLocaleString('cs-CZ');
  };

  return (
    <div className={`relative py-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      
      {/* KEY FACTS заголовок */}
      <div className="text-center mb-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-300 tracking-[0.2em] mb-2">
          KEY FACTS
        </h2>
        <div className="w-16 h-0.5 bg-money mx-auto"></div>
      </div>

      {/* Статистики в ряд як на скріншоті */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-20">
        {keyFacts.map((fact, index) => (
          <div key={index} className="text-center">
            <div className="mb-4">
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                {getAnimatedValue(fact.finalValue, fact.format)}
              </span>
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-money">
                {fact.suffix}
              </span>
            </div>
            <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-xs mx-auto">
              {fact.label}
            </p>
          </div>
        ))}
      </div>

      {/* Секція знизу як на скріншоті */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Лівий блок з текстом */}
          <div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="text-money">FAKTURY</span>{' '}
              <span className="text-white">KTERÉ VÁS</span><br />
              <span className="text-white">POSUNOU VPŘED</span>
            </h3>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Ať už potřebujete automatizovat fakturaci, spravovat klienty 
              nebo sledovat platby v reálném čase - faktix vám ušetří hodiny 
              práce každý den a přinese jasný přehled o vašem podnikání.
            </p>

            <button className="bg-money text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-money-light transition-all duration-300 hover:scale-105 shadow-lg">
              Začít zdarma
            </button>
          </div>

          {/* Pravý blok s benefity */}
          <div className="space-y-6">
            <div className="bg-black/30 border border-gray-700/30 rounded-lg p-6 hover:border-money/30 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-2 h-2 bg-money rounded-full animate-pulse"></div>
                <h4 className="text-white font-semibold text-lg">Automatická fakturace</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Opakující se faktury se vytvoří samy. Ušetříte 80% času.
              </p>
            </div>

            <div className="bg-black/30 border border-gray-700/30 rounded-lg p-6 hover:border-money/30 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-2 h-2 bg-money rounded-full animate-pulse"></div>
                <h4 className="text-white font-semibold text-lg">Real-time přehledy</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Okamžitý přehled o platbách, pohledávkách a zisku.
              </p>
            </div>

            <div className="bg-black/30 border border-gray-700/30 rounded-lg p-6 hover:border-money/30 transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-2 h-2 bg-money rounded-full animate-pulse"></div>
                <h4 className="text-white font-semibold text-lg">Chytrá analytika</h4>
              </div>
              <p className="text-gray-400 text-sm">
                AI vám poradí, kdy poslat upomínku a jak zvýšit zisk.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements - тільки якщо анімація завершена */}
      {animationComplete && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-20 h-20 border border-money/10 rounded-full animate-pulse"
            style={{
              top: '15%',
              right: '10%',
            }}
          />
          <div 
            className="absolute w-32 h-32 border border-money/5 rounded-full animate-pulse"
            style={{
              bottom: '20%',
              left: '5%',
            }}
          />
        </div>
      )}

      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-money/3 via-transparent to-money/3 blur-3xl -z-10" />
    </div>
  );
} 