'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  DollarSign, 
  Euro, 
  CreditCard, 
  Receipt, 
  Calculator,
  PiggyBank,
  TrendingUp
} from 'lucide-react';

interface IconConfig {
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  iconColor: string;
}

const iconConfigs: IconConfig[] = [
  {
    icon: FileText,
    bgColor: 'bg-gradient-to-br from-green-300 to-green-500',
    iconColor: 'text-black'
  },
  {
    icon: DollarSign,
    bgColor: 'bg-gradient-to-br from-green-400 to-green-600',
    iconColor: 'text-black'
  },
  {
    icon: Euro,
    bgColor: 'bg-gradient-to-br from-lime-300 to-lime-500',
    iconColor: 'text-black'
  },
  {
    icon: CreditCard,
    bgColor: 'bg-gradient-to-br from-emerald-300 to-emerald-500',
    iconColor: 'text-black'
  },
  {
    icon: Receipt,
    bgColor: 'bg-gradient-to-br from-green-500 to-green-700',
    iconColor: 'text-black'
  },
  {
    icon: Calculator,
    bgColor: 'bg-gradient-to-br from-lime-400 to-green-600',
    iconColor: 'text-black'
  },
  {
    icon: PiggyBank,
    bgColor: 'bg-gradient-to-br from-emerald-400 to-green-600',
    iconColor: 'text-black'
  },
  {
    icon: TrendingUp,
    bgColor: 'bg-gradient-to-br from-lime-500 to-green-500',
    iconColor: 'text-black'
  }
];

export default function AnimatedIconBox() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDissolving, setIsDissolving] = useState(false);
  const [isForming, setIsForming] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start dissolving current icon
      setIsDissolving(true);
      
      // After dissolve animation (400ms), switch to new icon
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % iconConfigs.length);
        setIsDissolving(false);
        setIsForming(true);
        
        // After form animation (400ms), settle
        setTimeout(() => {
          setIsForming(false);
        }, 400);
      }, 400);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const currentConfig = iconConfigs[currentIndex];
  const IconComponent = currentConfig.icon;

  return (
    <div 
      className="inline-block flex-shrink-0"
      style={{
        width: '1.0em',
        height: '1.0em',
        minWidth: '1.0em',
        maxWidth: '1.0em',
        minHeight: '1.0em',
        maxHeight: '1.0em',
        flexShrink: 0,
        flexGrow: 0,
        verticalAlign: 'baseline',
        alignSelf: 'baseline',
        transform: 'translateY(0.15em)'
      }}
    >
      <div 
        className={`
          ${currentConfig.bgColor}
          rounded-lg 
          flex items-center justify-center
          shadow-lg
        `}
        style={{
          width: '1.0em',
          height: '1.0em',
          minWidth: '1.0em',
          maxWidth: '1.0em',
          minHeight: '1.0em',
          maxHeight: '1.0em',
          flexShrink: 0,
          flexGrow: 0,
          transform: 'none',
          transition: 'background-color 0.5s ease-in-out'
        }}
      >
        <div 
          className="relative overflow-visible"
          style={{
            width: '1.0em',
            height: '1.0em',
            minWidth: '1.0em',
            maxWidth: '1.0em',
            minHeight: '1.0em',
            maxHeight: '1.0em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Icon with particle effect */}
          <div
            className={`flex items-center justify-center transition-all duration-400 ease-in-out ${currentConfig.iconColor}`}
            style={{
              transform: isDissolving 
                ? 'scale(0.3) rotate(180deg)' 
                : isForming 
                  ? 'scale(1) rotate(0deg)' 
                  : 'scale(1) rotate(0deg)',
              opacity: isDissolving 
                ? 0 
                : isForming 
                  ? 1 
                  : 1,
              filter: isDissolving 
                ? 'blur(3px)' 
                : isForming 
                  ? 'blur(0px)' 
                  : 'blur(0px)',
              transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            }}
          >
            <div 
              style={{
                width: '0.78em',
                height: '0.78em',
                minWidth: '0.78em',
                maxWidth: '0.78em',
                minHeight: '0.78em',
                maxHeight: '0.78em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconComponent className={`w-full h-full ${currentConfig.iconColor}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 