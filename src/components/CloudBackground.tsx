"use client";
import { memo } from 'react';

// ⚡ ОПТИМІЗАЦІЯ: React.memo для запобігання зайвим ре-рендерам
export const CloudBackground = memo(function CloudBackground() {
  return (
    <div className="fixed inset-0 w-full h-full min-h-screen overflow-hidden pointer-events-none">
      {/* Base gradient background - covers entire viewport */}
      <div className="absolute inset-0 w-full h-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* Essential Green Cloud Substances - Optimized */}
      {/* Large Organic Green Cloud - Top Left */}
      <div 
        className="fixed top-[15%] left-[8%] w-64 h-40 blur-3xl"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, rgba(0, 255, 136, 0.10) 0%, rgba(0, 255, 136, 0.06) 50%, transparent 80%)`,
          borderRadius: '70% 30% 60% 40%',
          animation: 'drift-slow 50s infinite ease-in-out, glow-pulse 25s infinite ease-in-out'
        }}
      ></div>
      
      {/* Medium Floating Substance - Right Side */}
      <div 
        className="fixed top-[65%] right-[12%] w-48 h-56 blur-2xl"
        style={{
          background: `radial-gradient(ellipse at 60% 40%, rgba(0, 204, 102, 0.08) 0%, rgba(0, 204, 102, 0.04) 60%, transparent 90%)`,
          borderRadius: '50% 50% 80% 20%',
          animation: 'drift-medium 45s infinite ease-in-out, glow-pulse 20s infinite ease-in-out'
        }}
      ></div>

      {/* Center Accent */}
      <div 
        className="fixed top-[45%] left-[55%] w-32 h-40 blur-xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(51, 255, 153, 0.12) 0%, rgba(51, 255, 153, 0.05) 70%, transparent 100%)`,
          borderRadius: '80% 20% 60% 40%',
          animation: 'drift-fast 35s infinite ease-in-out, glow-pulse 15s infinite ease-in-out'
        }}
      ></div>

      {/* NEW: Header Area Green Clusters - Gothic Scattered */}
      {/* Large corner cluster - Top Right */}
      <div 
        className="fixed top-[5%] right-[15%] w-56 h-32 blur-2xl"
        style={{
          background: `radial-gradient(ellipse at 70% 30%, rgba(0, 255, 136, 0.12) 0%, rgba(0, 255, 136, 0.07) 50%, transparent 85%)`,
          borderRadius: '65% 35% 85% 15%',
          animation: 'drift-medium 40s infinite ease-in-out, glow-pulse 18s infinite ease-in-out',
          transform: 'rotate(45deg)'
        }}
      ></div>

      {/* Medium cluster - Top Center */}
      <div 
        className="fixed top-[8%] left-[45%] w-40 h-24 blur-xl"
        style={{
          background: `radial-gradient(circle at 60% 40%, rgba(51, 255, 153, 0.14) 0%, rgba(51, 255, 153, 0.08) 60%, transparent 90%)`,
          borderRadius: '90% 10% 70% 30%',
          animation: 'drift-fast 35s infinite ease-in-out, glow-pulse 12s infinite ease-in-out',
          transform: 'rotate(-25deg)'
        }}
      ></div>

      {/* Small cluster - Top Left Corner */}
      <div 
        className="fixed top-[2%] left-[5%] w-28 h-20 blur-lg"
        style={{
          background: `radial-gradient(ellipse at 80% 20%, rgba(0, 204, 102, 0.16) 0%, rgba(0, 204, 102, 0.08) 50%, transparent 80%)`,
          borderRadius: '75% 25% 60% 40%',
          animation: 'drift-slow 55s infinite ease-in-out, glow-pulse 20s infinite ease-in-out',
          transform: 'rotate(78deg)'
        }}
      ></div>

      {/* Large middle-left cluster */}
      <div 
        className="fixed top-[25%] left-[2%] w-72 h-36 blur-3xl"
        style={{
          background: `radial-gradient(ellipse at 40% 60%, rgba(0, 255, 136, 0.09) 0%, rgba(0, 255, 136, 0.05) 60%, transparent 85%)`,
          borderRadius: '55% 45% 80% 20%',
          animation: 'drift-medium 48s infinite ease-in-out reverse, glow-pulse 22s infinite ease-in-out',
          transform: 'rotate(-67deg)'
        }}
      ></div>

      {/* Medium right edge cluster */}
      <div 
        className="fixed top-[35%] right-[3%] w-44 h-28 blur-2xl"
        style={{
          background: `radial-gradient(circle at 30% 70%, rgba(51, 255, 153, 0.13) 0%, rgba(51, 255, 153, 0.06) 70%, transparent 95%)`,
          borderRadius: '40% 60% 90% 10%',
          animation: 'drift-fast 38s infinite ease-in-out, glow-pulse 16s infinite ease-in-out',
          transform: 'rotate(134deg)'
        }}
      ></div>

      {/* Small bottom clusters */}
      <div 
        className="fixed bottom-[15%] left-[75%] w-36 h-20 blur-xl"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(0, 255, 136, 0.11) 0%, rgba(0, 255, 136, 0.06) 65%, transparent 90%)`,
          borderRadius: '85% 15% 45% 55%',
          animation: 'drift-slow 42s infinite ease-in-out, glow-pulse 14s infinite ease-in-out',
          transform: 'rotate(-45deg)'
        }}
      ></div>

      <div 
        className="fixed bottom-[25%] right-[20%] w-24 h-32 blur-lg"
        style={{
          background: `radial-gradient(circle at 70% 30%, rgba(0, 204, 102, 0.15) 0%, rgba(0, 204, 102, 0.07) 55%, transparent 85%)`,
          borderRadius: '95% 5% 65% 35%',
          animation: 'drift-medium 36s infinite ease-in-out reverse, glow-pulse 18s infinite ease-in-out',
          transform: 'rotate(89deg)'
        }}
      ></div>

      {/* WHITE FLOATING ICONS - Completely Fixed Background */}
      {/* File Icon - Top Right */}
      <div 
        className="fixed top-[12%] right-[25%] w-6 h-6 opacity-20"
        style={{
          transform: 'rotate(15deg)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      </div>

      {/* Dollar Icon - Left Side */}
      <div 
        className="fixed top-[30%] left-[12%] w-5 h-5 opacity-25"
        style={{
          transform: 'rotate(-30deg)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
          <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" />
        </svg>
      </div>

      {/* Euro Icon - Right Side */}
      <div 
        className="fixed top-[55%] right-[8%] w-4 h-4 opacity-22"
        style={{
          transform: 'rotate(67deg)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
          <path d="M7.07,11H9.5C9.5,9.89 10.39,9 11.5,9S13.5,9.89 13.5,11H16.93C16.72,7.59 13.95,5 10.5,5C7.05,5 4.28,7.59 4.07,11H7.07M7.07,13H4.07C4.28,16.41 7.05,19 10.5,19C13.95,19 16.72,16.41 16.93,13H13.5C13.5,14.11 12.61,15 11.5,15S9.5,14.11 9.5,13H7.07Z" />
        </svg>
      </div>

      {/* File Icon - Bottom Left */}
      <div 
        className="fixed bottom-[35%] left-[18%] w-5 h-5 opacity-18"
        style={{
          transform: 'rotate(-78deg)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      </div>

      {/* Dollar Icon - Center */}
      <div 
        className="fixed top-[40%] left-[70%] w-6 h-6 opacity-15"
        style={{
          transform: 'rotate(45deg)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
          <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" />
        </svg>
      </div>

      {/* Euro Icon - Bottom Right */}
      <div 
        className="fixed top-[40%] left-[70%] w-6 h-6 opacity-15"
        style={{
          transform: 'rotate(45deg)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
          <path d="M7.07,11H9.5C9.5,9.89 10.39,9 11.5,9S13.5,9.89 13.5,11H16.93C16.72,7.59 13.95,5 10.5,5C7.05,5 4.28,7.59 4.07,11H7.07M7.07,13H4.07C4.28,16.41 7.05,19 10.5,19C13.95,19 16.72,16.41 16.93,13H13.5C13.5,14.11 12.61,15 11.5,15S9.5,14.11 9.5,13H7.07Z" />
        </svg>
      </div>

      {/* Additional scattered icons */}
      {/* File Icon - Top Center */}
      <div 
        className="fixed top-[18%] left-[65%] w-3 h-3 opacity-12"
        style={{
          transform: 'rotate(156deg)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      </div>

      {/* Dollar Icon - Bottom */}
      <div 
        className="fixed bottom-[8%] left-[40%] w-5 h-5 opacity-20"
        style={{
          transform: 'rotate(-89deg)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
          <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" />
        </svg>
      </div>
      
      {/* Simplified gradient overlay */}
      <div className="absolute inset-0 w-full h-full min-h-screen opacity-5">
        <div 
          className="absolute inset-0 w-full h-full min-h-screen"
          style={{
            background: `
              radial-gradient(ellipse at 25% 25%, var(--color-money-glow) 0%, transparent 80%),
              radial-gradient(ellipse at 75% 75%, rgba(255,255,255,0.02) 0%, transparent 70%)
            `,
            animation: 'bg-particles-move 50s linear infinite'
          }}
        ></div>
      </div>
    </div>
  );
}); 