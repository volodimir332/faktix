"use client";
import { useEffect, useState } from 'react';
import { FaktixIcon } from './FaktixLogo';

interface FloatingLogo {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  animationDuration: number;
  direction: 'clockwise' | 'counterclockwise';
}

export function AnimatedLogoBackground() {
  const [logos, setLogos] = useState<FloatingLogo[]>([]);

  useEffect(() => {
    // Генеруємо випадкові позиції для логотипів
    const generateLogos = () => {
      const logoCount = 4; // Кількість логотипів (зменшено в 2 рази)
      const newLogos: FloatingLogo[] = [];

      for (let i = 0; i < logoCount; i++) {
        newLogos.push({
          id: i,
          x: Math.random() * 80, // 0-80% від ширини екрану (трохи менше для великих логотипів)
          y: Math.random() * 80, // 0-80% від висоти екрану
          size: 600 + Math.random() * 400, // 600-1000px розмір (збільшено в 5 разів)
          rotation: Math.random() * 360, // початковий поворот
          animationDuration: 30 + Math.random() * 50, // 30-80 секунд (повільніше для великих логотипів)
          direction: Math.random() > 0.5 ? 'clockwise' : 'counterclockwise'
        });
      }

      setLogos(newLogos);
    };

    generateLogos();
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full min-h-screen overflow-hidden pointer-events-none">
      {logos.map((logo) => (
        <div
          key={logo.id}
          className="absolute opacity-30"
          style={{
            left: `${logo.x}%`,
            top: `${logo.y}%`,
            width: `${logo.size}px`,
            height: `${logo.size}px`,
            transform: `rotate(${logo.rotation}deg)`,
            animation: `
              floatRotate${logo.direction} ${logo.animationDuration}s linear infinite,
              floatMove${logo.id} ${logo.animationDuration * 1.5}s ease-in-out infinite alternate
            `
          }}
        >
          <div className="w-full h-full scale-[8]">
            <FaktixIcon size="xl" />
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes floatRotateclockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes floatRotatecounterclockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes floatMove0 {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(80px, -60px) rotate(90deg); }
          50% { transform: translate(-40px, 100px) rotate(180deg); }
          75% { transform: translate(60px, 40px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        @keyframes floatMove1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-100px, 80px) rotate(-90deg); }
          50% { transform: translate(120px, -40px) rotate(-180deg); }
          75% { transform: translate(-60px, -80px) rotate(-270deg); }
          100% { transform: translate(0, 0) rotate(-360deg); }
        }
        
        @keyframes floatMove2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, 60px) scale(1.1); }
          66% { transform: translate(-80px, -100px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        
        @keyframes floatMove3 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-120px, 120px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        

        
        /* Додаткові анімації для різноманітності */
        @media (prefers-reduced-motion: reduce) {
          div {
            animation-duration: 0.001s !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
} 