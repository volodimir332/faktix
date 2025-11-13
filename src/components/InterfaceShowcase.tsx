'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const InterfaceShowcase = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);



  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, 
          black 0%, 
          rgba(3, 7, 18, 0.3) 15%, 
          rgba(17, 24, 39, 0.15) 30%, 
          rgba(3, 7, 18, 0.2) 50%, 
          rgba(17, 24, 39, 0.1) 70%, 
          rgba(3, 7, 18, 0.15) 85%, 
          black 100%)`
      }}
    >
      {/* Top and Bottom Fade Effects */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-0"></div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-0"></div>
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/2 to-emerald-500/2"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.03)_0%,transparent_70%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {(() => {
              const title = t('interface.title');
              const words = title.split(' ');
              if (words.length === 2) {
                return (
                  <>
                    <span className="text-white">{words[0]} </span>
                    <span className="text-money">{words[1]}</span>
                  </>
                );
              }
              return <span className="text-white">{title}</span>;
            })()}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('interface.subtitle')}
          </p>
        </div>

        {/* Single Large Screenshot */}
        <div className={`relative max-w-5xl mx-auto transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="relative group transition-transform duration-500 hover:scale-[1.02]">
            {/* Glow Effect */}
            <div className="absolute -inset-8 bg-gradient-to-r from-green-400/10 to-emerald-500/10 rounded-3xl blur-2xl opacity-75 transition-all duration-500"></div>
            
            {/* Browser Header */}
            <div className="relative bg-transparent rounded-t-2xl px-6 py-4 border border-green-500/20 border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-6 text-gray-400 text-sm font-mono bg-gray-700/50 rounded px-3 py-1">
                  faktix.app/dashboard
                </div>
              </div>
            </div>

            {/* Main Screenshot Container */}
            <div className="relative bg-transparent rounded-b-lg border border-green-500/20 border-t-0 overflow-visible shadow-2xl">
              
              <img 
                src="/screenshot1.png" 
                alt="Faktix Dashboard Interface"
                className="w-full h-auto max-h-[500px] object-cover object-top"
                style={{
                  maskImage: 'radial-gradient(ellipse 80% 70% at center, black 40%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at center, black 40%, transparent 100%)'
                }}
              />

              {/* Floating Indicators */}
              <div className="absolute top-6 right-6 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-75"></div>
              <div className="absolute top-6 left-6 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-gray-400 mb-6">
            {t('interface.cta.text')}
          </p>
          <Link href="/registrace" className="inline-block bg-money text-black px-5 py-2.5 rounded-xl font-semibold text-base hover:bg-money-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            {t('interface.cta.button')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InterfaceShowcase; 