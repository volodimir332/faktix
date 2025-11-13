"use client";

import { useState, useEffect } from 'react';
import { Cookie, Settings, X } from 'lucide-react';

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

      {/* Minimalist Banner */}
      {!showSettings && (
        <div className="fixed bottom-6 left-6 right-6 z-[9999] animate-slide-up">
          <div className="max-w-4xl mx-auto bg-black/95 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-4">
              {/* Content */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Icon & Text */}
                <div className="flex items-start gap-3 flex-1">
                  <Cookie className="w-5 h-5 text-money flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium mb-1">
                      Používáme cookies
                    </p>
                    <p className="text-gray-400 text-xs">
                      Pro fungování platformy a vylepšování služeb.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={acceptAll}
                    className="bg-money hover:bg-money-dark text-black font-semibold px-5 py-2 rounded-lg transition-all hover:scale-105 text-sm whitespace-nowrap"
                  >
                    Přijmout vše
                  </button>
                  <button
                    onClick={acceptNecessary}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap border border-gray-700"
                  >
                    Pouze nezbytné
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-gray-400 hover:text-white transition-colors text-xs underline"
                  >
                    Nastavení
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimalist Settings Panel */}
      {showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-black/95 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-money" />
                  <h2 className="text-lg font-semibold text-white">
                    Nastavení cookies
                  </h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Cookie Categories */}
              <div className="space-y-3 mb-5">
                {/* Necessary */}
                <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-semibold text-sm text-white">
                          Nezbytné
                        </h3>
                        <span className="bg-money/20 text-money text-xs font-medium px-2 py-0.5 rounded">
                          Vždy aktivní
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">
                        Nutné pro fungování platformy
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-5 bg-money rounded-full flex items-center justify-end px-0.5">
                        <div className="w-4 h-4 bg-black rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="border border-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-white mb-1.5">
                        Analytické
                      </h3>
                      <p className="text-gray-400 text-xs">
                        Vylepšování služeb
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                        className={`w-10 h-5 rounded-full transition-colors flex items-center ${
                          preferences.analytics ? 'bg-money justify-end' : 'bg-gray-700 justify-start'
                        } px-0.5`}
                      >
                        <div className="w-4 h-4 bg-black rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Functional */}
                <div className="border border-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-white mb-1.5">
                        Funkční
                      </h3>
                      <p className="text-gray-400 text-xs">
                        Zapamatování preferencí
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}
                        className={`w-10 h-5 rounded-full transition-colors flex items-center ${
                          preferences.functional ? 'bg-money justify-end' : 'bg-gray-700 justify-start'
                        } px-0.5`}
                      >
                        <div className="w-4 h-4 bg-black rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Marketing */}
                <div className="border border-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-white mb-1.5">
                        Marketing
                      </h3>
                      <p className="text-gray-400 text-xs">
                        Cílená reklama
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                        className={`w-10 h-5 rounded-full transition-colors flex items-center ${
                          preferences.marketing ? 'bg-money justify-end' : 'bg-gray-700 justify-start'
                        } px-0.5`}
                      >
                        <div className="w-4 h-4 bg-black rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-800">
                <button
                  onClick={saveCustom}
                  className="flex-1 bg-money hover:bg-money-dark text-black font-semibold py-2.5 px-5 rounded-lg transition-all hover:scale-105 text-sm"
                >
                  Uložit nastavení
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-sm border border-gray-700"
                >
                  Přijmout vše
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 text-gray-400 hover:text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-sm"
                >
                  Zpět
                </button>
              </div>

              {/* Info */}
              <div className="mt-3 text-center text-xs text-gray-500">
                Více v{' '}
                <a href="/legal/cookies" className="text-money hover:underline">
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

