'use client';

import { useState, useEffect } from 'react';
import { Calculator, FileText, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WorkflowDemo = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const steps = [
    {
      id: 1,
      icon: Calculator,
      title: t('workflow.step1.title') || 'Vytvoř kalkulaci',
      titleUk: 'Створи калькуляцію',
      description: t('workflow.step1.desc') || 'Rychle spočítej náklady a zisky projektu',
      descriptionUk: 'Швидко порахуй витрати та прибутки проекту',
      color: 'from-blue-500 to-cyan-500',
      bgGlow: 'bg-blue-500/20',
      borderColor: 'border-blue-500',
      features: [
        { cs: 'Položky a služby', uk: 'Позиції та послуги' },
        { cs: 'Automatický výpočet', uk: 'Автоматичний розрахунок' },
        { cs: 'Marže a slevy', uk: 'Маржа та знижки' }
      ]
    },
    {
      id: 2,
      icon: FileText,
      title: t('workflow.step2.title') || 'Převeď na nabídku',
      titleUk: 'Перетвори на пропозицію',
      description: t('workflow.step2.desc') || 'Jedním kliknutím vytvoř profesionální nabídku',
      descriptionUk: 'Одним кліком створи професійну пропозицію',
      color: 'from-purple-500 to-pink-500',
      bgGlow: 'bg-purple-500/20',
      borderColor: 'border-purple-500',
      features: [
        { cs: 'Profesionální design', uk: 'Професійний дизайн' },
        { cs: 'Údaje z kalkulace', uk: 'Дані з калькуляції' },
        { cs: 'Okamžité odeslání', uk: 'Миттєве надсилання' }
      ]
    },
    {
      id: 3,
      icon: Zap,
      title: t('workflow.step3.title') || 'Vytvoř fakturu',
      titleUk: 'Створи фактуру',
      description: t('workflow.step3.desc') || 'Po schválení nabídky automaticky vygeneruj fakturu',
      descriptionUk: 'Після схвалення пропозиції автоматично згенеруй рахунок',
      color: 'from-green-500 to-emerald-500',
      bgGlow: 'bg-money/20',
      borderColor: 'border-money',
      features: [
        { cs: 'Okamžitý převod', uk: 'Миттєве перетворення' },
        { cs: 'Všechny údaje', uk: 'Всі дані' },
        { cs: 'Připraveno k odeslání', uk: 'Готово до надсилання' }
      ]
    }
  ];

  // Auto-play animation
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  const currentStep = steps[activeStep];
  const Icon = currentStep.icon;

  return (
    <section className="relative py-20 overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">
              {t('workflow.title') || 'Od kalkulace k faktuře'}
            </span>
            <br />
            <span className="text-money">
              {t('workflow.subtitle') || 'za pár sekund'}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('workflow.description') || 'Zjednodušený workflow, který ti ušetří hodiny práce'}
          </p>
        </div>

        {/* Main Demo Area */}
        <div className="relative">
          {/* Progress Bar */}
          <div className="flex items-center justify-center mb-12 space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    setActiveStep(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${
                    index === activeStep
                      ? `bg-gradient-to-br ${step.color} scale-110 shadow-lg`
                      : index < activeStep
                      ? 'bg-gray-700 opacity-50'
                      : 'bg-gray-800 opacity-30'
                  }`}
                >
                  {index < activeStep ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-bold">{index + 1}</span>
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className="w-16 md:w-24 h-1 mx-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        index < activeStep ? 'from-money to-money' : 'from-gray-700 to-gray-700'
                      } transition-all duration-1000`}
                      style={{
                        width: index < activeStep ? '100%' : index === activeStep ? '50%' : '0%'
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Content Card */}
          <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 md:p-12 min-h-[500px]">
            {/* Animated Glow */}
            <div
              className={`absolute inset-0 ${currentStep.bgGlow} blur-3xl opacity-20 rounded-2xl transition-all duration-1000`}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center shadow-2xl animate-pulse-slow`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {currentStep.title}
                </h3>
                <p className="text-lg text-gray-400">
                  {currentStep.description}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {currentStep.features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-money transition-all duration-300 transform hover:scale-105"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 text-money flex-shrink-0`} />
                      <span className="text-white font-medium">{feature.cs}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Arrow to Next Step */}
              {activeStep < steps.length - 1 && (
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setActiveStep((prev) => (prev + 1) % steps.length);
                      setIsAutoPlaying(false);
                    }}
                    className="flex items-center gap-3 bg-money text-black px-6 py-3 rounded-xl font-semibold hover:bg-money-dark transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <span>Další krok</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-money rounded-full animate-pulse" />
              <span>Automatická prezentace každé {isAutoPlaying ? '4' : '∞'} sekundy</span>
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="ml-2 px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-money transition-colors"
              >
                {isAutoPlaying ? 'Pozastavit' : 'Spustit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default WorkflowDemo;

