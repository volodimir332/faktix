"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnimatedAIBlobProps {
  onClick: () => void;
  className?: string;
}

export default function AnimatedAIBlob({ onClick, className = "" }: AnimatedAIBlobProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { language } = useLanguage();

  // Функція для генерації випадкової форми хмари
  const generateBlobPath = () => {
    const numPoints = 8;
    const radius = 80;
    const variance = 30;
    const centerX = 100;
    const centerY = 100;
    
    let path = `M`;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const randomRadius = radius + (Math.random() - 0.5) * variance;
      const x = centerX + Math.cos(angle) * randomRadius;
      const y = centerY + Math.sin(angle) * randomRadius;
      
      if (i === 0) {
        path += `${x},${y}`;
      } else {
        // Використовуємо Q для створення плавних кривих
        const prevAngle = ((i - 1) / numPoints) * 2 * Math.PI;
        const prevRadius = radius + (Math.random() - 0.5) * variance;
        const prevX = centerX + Math.cos(prevAngle) * prevRadius;
        const prevY = centerY + Math.sin(prevAngle) * prevRadius;
        
        const controlX = (prevX + x) / 2 + (Math.random() - 0.5) * 20;
        const controlY = (prevY + y) / 2 + (Math.random() - 0.5) * 20;
        
        path += ` Q${controlX},${controlY} ${x},${y}`;
      }
    }
    
    path += ' Z';
    return path;
  };

  // Анімація морфінгу форми
  useEffect(() => {
    const animateBlob = () => {
      if (!pathRef.current) return;
      
      const newPath = generateBlobPath();
      pathRef.current.style.transition = 'd 4s ease-in-out';
      pathRef.current.setAttribute('d', newPath);
    };

    // Початкова форма
    if (pathRef.current) {
      pathRef.current.setAttribute('d', generateBlobPath());
    }

    // Анімація кожні 4 секунди
    const interval = setInterval(animateBlob, 4000);
    
    return () => clearInterval(interval);
  }, []);

  // Анімація обертання
  useEffect(() => {
    if (!svgRef.current) return;
    
    let rotation = 0;
    const rotateBlob = () => {
      rotation += 0.5;
      if (svgRef.current) {
        svgRef.current.style.transform = `rotate(${rotation}deg) scale(${isHovered ? 1.1 : 1})`;
      }
    };

    const animationFrame = setInterval(rotateBlob, 50);
    
    return () => clearInterval(animationFrame);
  }, [isHovered]);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-24 h-24">
        {/* SVG Хмара */}
        <svg
          ref={svgRef}
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
          style={{ 
            filter: 'drop-shadow(0 4px 20px rgba(34, 197, 94, 0.4))',
            transformOrigin: 'center'
          }}
        >
          {/* Градієнти */}
          <defs>
            <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="30%" stopColor="#22C55E" />
              <stop offset="70%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            
            <radialGradient id="glow-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.8)" />
              <stop offset="70%" stopColor="rgba(34, 197, 94, 0.3)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
            </radialGradient>

            {/* Анімований градієнт для переливу */}
            <linearGradient id="animated-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0">
                <animate attributeName="stop-color" 
                  values="#A7F3D0;#34D399;#10B981;#A7F3D0" 
                  dur="6s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#22C55E">
                <animate attributeName="stop-color" 
                  values="#22C55E;#16A34A;#059669;#22C55E" 
                  dur="6s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#059669">
                <animate attributeName="stop-color" 
                  values="#059669;#047857;#065F46;#059669" 
                  dur="6s" 
                  repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>

          {/* Свічення навколо */}
          <circle 
            cx="100" 
            cy="100" 
            r="90" 
            fill="url(#glow-gradient)" 
            opacity="0.6"
          />

          {/* Основна хмара */}
          <path
            ref={pathRef}
            fill="url(#animated-gradient)"
            opacity="0.9"
            style={{
              mixBlendMode: 'normal'
            }}
          />

          {/* Додаткові частинки для магічного ефекту */}
          <g opacity="0.7">
            <circle cx="70" cy="80" r="2" fill="#A7F3D0">
              <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="130" cy="70" r="1.5" fill="#34D399">
              <animate attributeName="r" values="1.5;3;1.5" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="85" cy="125" r="2.5" fill="#10B981">
              <animate attributeName="r" values="2.5;1;2.5" dur="5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="5s" repeatCount="indefinite" />
            </circle>
            <circle cx="115" cy="120" r="1" fill="#22C55E">
              <animate attributeName="r" values="1;3.5;1" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>

        {/* Робот і текст AI по центру */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
          {/* Іконка робота */}
          <div className="mb-1">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
              <path 
                d="M12 2C13.1 2 14 2.9 14 4V6C16.21 6 18 7.79 18 10V16C18 18.21 16.21 20 14 20H10C7.79 20 6 18.21 6 16V10C6 7.79 7.79 6 10 6V4C10 2.9 10.9 2 12 2M12 4V6H12.5C12.78 6 13 6.22 13 6.5S12.78 7 12.5 7H11.5C11.22 7 11 6.78 11 6.5S11.22 6 11.5 6H12V4M8 10V16C8 17.1 8.9 18 10 18H14C15.1 18 16 17.1 16 16V10C16 8.9 15.1 8 14 8H10C8.9 8 8 8.9 8 10M9 11H11V13H9V11M13 11H15V13H13V11M9 14H15V16H9V14Z" 
                fill="currentColor"
              />
              <circle cx="10" cy="12" r="1" fill="#059669" />
              <circle cx="14" cy="12" r="1" fill="#059669" />
            </svg>
          </div>
          
          {/* Текст AI */}
          <div 
            className="text-sm font-bold tracking-wider drop-shadow-lg"
            style={{ 
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontFamily: 'monospace'
            }}
          >
            AI
          </div>
        </div>

        {/* Пульсуючий ефект при hover */}
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"
            style={{ animationDuration: '1s' }}
          />
        )}
      </div>

      {/* Тултіп */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 animate-fade-in pointer-events-none">
          {language === 'cs' ? 'FaktiX AI Asistent' : 'FaktiX AI Помічник'}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}