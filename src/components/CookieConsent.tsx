"use client";

import { useState, useEffect } from 'react';
import { Cookie, Settings, X, Check } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be changed
    analytics: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('faktix_cookie_consent');
    if (!consent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch (e) {
        console.error('Error loading cookie preferences:', e);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('faktix_cookie_consent', JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);

    // Apply preferences (you can add logic here to enable/disable tracking)
    if (prefs.analytics) {
      // Enable Google Analytics
      console.log('Analytics enabled');
    }
    if (prefs.functional) {
      // Enable functional cookies
      console.log('Functional cookies enabled');
    }
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled');
    }
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    });
  };

  const acceptNecessary = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />

      {/* Main Banner */}
      {!showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 animate-slide-up">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-orange-100 rounded-xl flex-shrink-0">
                  <Cookie className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    🍪 Cookies a ochrana soukromí
                  </h2>
                  <p className="text-slate-700 leading-relaxed">
                    Používáme cookies pro zajištění fungování platformy, analýzu návštěvnosti 
                    a zlepšování vašeho zážitku. Některé cookies jsou nezbytné a nelze je vypnout, 
                    jiné můžete přizpůsobit podle svých preferencí.
                  </p>
                </div>
              </div>

              {/* Quick info */}
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-sm text-slate-800">Nezbytné</span>
                  </div>
                  <p className="text-xs text-slate-600">Nutné pro fungování</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-600 font-bold text-sm">?</span>
                    <span className="font-semibold text-sm text-slate-800">Analytické</span>
                  </div>
                  <p className="text-xs text-slate-600">Vylepšování služeb</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-orange-600 font-bold text-sm">?</span>
                    <span className="font-semibold text-sm text-slate-800">Marketing</span>
                  </div>
                  <p className="text-xs text-slate-600">Cílená reklama</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={acceptAll}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Přijmout vše
                </button>
                <button
                  onClick={acceptNecessary}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Pouze nezbytné
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Přizpůsobit
                </button>
              </div>

              {/* Links */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap justify-center gap-4 text-sm">
                <a href="/legal/ochrana-udaju" className="text-emerald-600 hover:underline font-semibold">
                  Ochrana osobních údajů
                </a>
                <span className="text-slate-400">•</span>
                <a href="/legal/cookies" className="text-emerald-600 hover:underline font-semibold">
                  Podrobnosti o cookies
                </a>
                <span className="text-slate-400">•</span>
                <a href="/legal/obchodni-podminky" className="text-emerald-600 hover:underline font-semibold">
                  Obchodní podmínky
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Nastavení cookies
                  </h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Cookie Categories */}
              <div className="space-y-4">
                {/* Necessary */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-slate-800">
                          🔒 Nezbytné cookies
                        </h3>
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded">
                          Vždy aktivní
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm mb-3">
                        Tyto cookies jsou nutné pro základní fungování platformy (přihlášení, 
                        bezpečnost, ukládání nastavení). Nelze je vypnout.
                      </p>
                      <p className="text-xs text-slate-600">
                        Příklady: auth_token, session_id, csrf_token, cookie_consent
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-800 mb-2">
                        📊 Analytické cookies
                      </h3>
                      <p className="text-slate-700 text-sm mb-3">
                        Pomáhají nám pochopit, jak používáte platformu, abychom ji mohli vylepšovat. 
                        Měří návštěvnost, chování uživatelů a výkon stránek.
                      </p>
                      <p className="text-xs text-slate-600">
                        Používáme: Google Analytics, Firebase Analytics
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                        className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                          preferences.analytics ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                        } px-1`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Functional */}
                <div className="border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-800 mb-2">
                        🔧 Funkční cookies
                      </h3>
                      <p className="text-slate-700 text-sm mb-3">
                        Zlepšují uživatelský zážitek zapamatováním vašich preferencí 
                        (téma, jazyk, měna, nedávno zobrazené položky).
                      </p>
                      <p className="text-xs text-slate-600">
                        Příklady: theme, sidebar_collapsed, currency, date_format
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}
                        className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                          preferences.functional ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                        } px-1`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Marketing */}
                <div className="border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-800 mb-2">
                        🎯 Marketingové cookies
                      </h3>
                      <p className="text-slate-700 text-sm mb-3">
                        Používají se pro cílené reklamy a remarketing. Mohou sdílet informace 
                        s třetími stranami (Google Ads, Facebook Pixel).
                      </p>
                      <p className="text-xs text-slate-600">
                        Používáme: Google Ads, Meta Pixel (Facebook/Instagram)
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                        className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                          preferences.marketing ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                        } px-1`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={saveCustom}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Uložit nastavení
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Přijmout vše
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Zpět
                </button>
              </div>

              {/* Info */}
              <div className="mt-4 text-center text-sm text-slate-600">
                Více informací najdete v naší{' '}
                <a href="/legal/cookies" className="text-emerald-600 hover:underline font-semibold">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

