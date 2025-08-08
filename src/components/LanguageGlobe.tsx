"use client";
import { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageGlobe() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'cs' as const, flag: '🇨🇿', name: 'Čeština' },
    { code: 'uk' as const, flag: '🇺🇦', name: 'Українська' }
  ];

  const handleLanguageChange = (langCode: 'cs' | 'uk') => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Globe Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 rounded-full hover:bg-money/10 transition-all duration-300 hover:scale-110"
        title="Změnit jazyk / Змінити мову"
      >
        <Globe className="w-6 h-6 text-money hover:text-money-light transition-colors" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-36 bg-black/95 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-2xl shadow-money/20 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as 'cs' | 'uk')}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code 
                  ? 'bg-money/20 text-money border-l-2 border-money' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 