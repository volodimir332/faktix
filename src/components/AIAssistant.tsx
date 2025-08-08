'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AIAssistantProps {
  onChatOpen?: () => void;
}

export default function AIAssistant({ onChatOpen }: AIAssistantProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const blobRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Генератор випадкових точок для створення форми хмари
  const generateBlobPath = () => {
    const centerX = 100;
    const centerY = 100;
    const baseRadius = 60;
    const points = 8;
    const randomness = 20;
    
    let path = 'M';
    const angleStep = (Math.PI * 2) / points;
    
    for (let i = 0; i <= points; i++) {
      const angle = angleStep * i;
      const radius = baseRadius + (Math.random() - 0.5) * randomness;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        path += `${x},${y}`;
      } else {
        // Використовуємо кубічні криві Безьє для плавних переходів
        const prevAngle = angleStep * (i - 1);
        const prevRadius = baseRadius + (Math.random() - 0.5) * randomness;
        const prevX = centerX + Math.cos(prevAngle) * prevRadius;
        const prevY = centerY + Math.sin(prevAngle) * prevRadius;
        
        const cp1x = prevX + Math.cos(prevAngle + Math.PI/2) * 20;
        const cp1y = prevY + Math.sin(prevAngle + Math.PI/2) * 20;
        const cp2x = x + Math.cos(angle - Math.PI/2) * 20;
        const cp2y = y + Math.sin(angle - Math.PI/2) * 20;
        
        path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
      }
    }
    path += ' Z';
    return path;
  };

  // Анімація морфінгу форми хмари
  useEffect(() => {
    const animateBlob = () => {
      if (blobRef.current) {
        const newPath = generateBlobPath();
        blobRef.current.style.transition = 'd 3s ease-in-out';
        blobRef.current.setAttribute('d', newPath);
      }
    };

    // Початкова форма
    animateBlob();
    
    // Регулярні зміни форми
    const interval = setInterval(animateBlob, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Обробка кліку для відкриття чату
  const handleClick = () => {
    setIsChatOpen(!isChatOpen);
    if (onChatOpen) {
      onChatOpen();
    }
  };

  // Простий чат компонент
  const ChatWindow = () => (
    <div className="absolute bottom-20 right-0 w-80 h-96 bg-gray-900 border border-green-400 rounded-lg shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-800 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
          <span className="text-white font-medium">AI Asistent</span>
        </div>
        <button 
          onClick={() => setIsChatOpen(false)}
          className="text-white hover:text-green-200 transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="p-4 h-full bg-gray-800">
        <div className="space-y-3">
          <div className="bg-green-600 text-white p-3 rounded-lg text-sm">
            Ahoj! Jsem váš AI asistent. Jak vám mohu pomoci s fakturami?
          </div>
          <div className="bg-gray-700 text-gray-300 p-3 rounded-lg text-sm">
            Můžu vám pomoci s:
            <ul className="mt-2 list-disc list-inside">
              <li>Vytvořením nových faktur</li>
              <li>Správou klientů</li>
              <li>Analýzou financí</li>
              <li>Odpověděmi na otázky</li>
            </ul>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <input 
            type="text" 
            placeholder="Napište zprávu..."
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Чат вікно */}
      {isChatOpen && <ChatWindow />}
      
      {/* AI Асистент */}
      <div 
        className={`relative cursor-pointer transition-transform duration-300 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 200 200" 
          className="animate-spin-slow"
          style={{ 
            animation: 'spin 60s linear infinite',
            filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.4))'
          }}
        >
          {/* Градієнти для хмари */}
          <defs>
            <radialGradient id="blobGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#86efac" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#16a34a" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#15803d" stopOpacity="0.6" />
            </radialGradient>
            
            <radialGradient id="innerGlow" cx="50%" cy="50%" r="40%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>

            {/* Пульсуючий ефект */}
            <filter id="pulse">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Анімована хмара */}
          <path
            ref={blobRef}
            fill="url(#blobGradient)"
            filter="url(#pulse)"
            style={{
              transition: 'd 3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          
          {/* Внутрішнє світіння */}
          <circle 
            cx="100" 
            cy="100" 
            r="40" 
            fill="url(#innerGlow)"
            className="animate-pulse"
          />

          {/* Іконка робота (спрощена SVG версія) */}
          <g transform="translate(75, 75)">
            {/* Голова робота */}
            <rect x="10" y="5" width="30" height="20" rx="5" fill="white" opacity="0.9"/>
            {/* Очі */}
            <circle cx="18" cy="12" r="2" fill="#22c55e"/>
            <circle cx="32" cy="12" r="2" fill="#22c55e"/>
            {/* Тіло */}
            <rect x="5" y="25" width="40" height="25" rx="3" fill="white" opacity="0.8"/>
            {/* Руки */}
            <rect x="0" y="30" width="8" height="15" rx="2" fill="white" opacity="0.7"/>
            <rect x="42" y="30" width="8" height="15" rx="2" fill="white" opacity="0.7"/>
          </g>

          {/* Текст "AI" */}
          <text 
            x="100" 
            y="140" 
            textAnchor="middle" 
            fill="white" 
            fontSize="16" 
            fontWeight="bold"
            fontFamily="Inter, sans-serif"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
          >
            AI
          </text>

          {/* Частинки навколо (опціонально) */}
          <g className="animate-pulse">
            <circle cx="60" cy="60" r="1" fill="#22c55e" opacity="0.6">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="140" cy="80" r="1" fill="#16a34a" opacity="0.5">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="80" cy="140" r="1" fill="#22c55e" opacity="0.7">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite"/>
            </circle>
          </g>
        </svg>

        {/* Hover ефект - додаткове світіння */}
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-full bg-green-400 opacity-20 blur-xl animate-pulse"
            style={{ transform: 'scale(1.2)' }}
          />
        )}
      </div>

      {/* CSS для повільного обертання */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
}