"use client";
import { useEffect, useState } from 'react';
import { Users, FileText, DollarSign, TrendingUp, Star, Zap } from 'lucide-react';

interface CloudStatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

const cloudStats: CloudStatItem[] = [
  {
    icon: <Users className="w-5 h-5" />,
    value: "12,456",
    label: "aktivních uživatelů",
    color: "text-green-400"
  },
  {
    icon: <FileText className="w-5 h-5" />,
    value: "1,000,000+",
    label: "faktur měsíčně",
    color: "text-white"
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    value: "28,850",
    label: "Kč denně ušetřeno",
    color: "text-gray-300"
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    value: "85%",
    label: "času ušetřeno",
    color: "text-green-400"
  },
  {
    icon: <Star className="w-5 h-5" />,
    value: "4.9/5",
    label: "hodnocení zákazníků",
    color: "text-white"
  },
  {
    icon: <Zap className="w-5 h-5" />,
    value: "30s",
    label: "průměrný čas faktury",
    color: "text-gray-300"
  },
  {
    icon: <Users className="w-5 h-5" />,
    value: "12,456",
    label: "aktivních uživatelů",
    color: "text-green-400"
  },
  {
    icon: <FileText className="w-5 h-5" />,
    value: "1,000,000+",
    label: "faktur měsíčně",
    color: "text-white"
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    value: "28,850",
    label: "Kč denně ušetřeno",
    color: "text-gray-300"
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    value: "85%",
    label: "času ušetřeno",
    color: "text-green-400"
  },
  {
    icon: <Star className="w-5 h-5" />,
    value: "4.9/5",
    label: "hodnocení zákazníků",
    color: "text-white"
  },
  {
    icon: <Zap className="w-5 h-5" />,
    value: "30s",
    label: "průměrný čas faktury",
    color: "text-gray-300"
  }
];

export function AnimatedCloudStats() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => {
        // Reset position when it reaches the end for seamless loop
        if (prev <= -1200) {
          return 0;
        }
        return prev - 1; // Smooth movement in one direction
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden py-12 relative">
      {/* Uneven cloud background - similar to other backgrounds on the site */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main cloud shape */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 40% at 20% 30%, rgba(128,128,128,0.15) 0%, rgba(128,128,128,0.05) 50%, transparent 70%),
              radial-gradient(ellipse 40% 60% at 80% 70%, rgba(128,128,128,0.12) 0%, rgba(128,128,128,0.03) 60%, transparent 80%),
              radial-gradient(ellipse 50% 50% at 50% 50%, rgba(128,128,128,0.08) 0%, rgba(128,128,128,0.02) 70%, transparent 90%),
              radial-gradient(ellipse 30% 70% at 10% 80%, rgba(128,128,128,0.1) 0%, rgba(128,128,128,0.02) 60%, transparent 80%),
              radial-gradient(ellipse 70% 30% at 90% 20%, rgba(128,128,128,0.13) 0%, rgba(128,128,128,0.04) 50%, transparent 70%)
            `,
            filter: 'blur(20px)',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            transform: 'rotate(-1deg)',
          }}
        />
        
        {/* Additional cloud layers for more unevenness */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 20% at 30% 60%, rgba(128,128,128,0.08) 0%, transparent 50%),
              radial-gradient(ellipse 20% 80% at 70% 40%, rgba(128,128,128,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 85% 85%, rgba(128,128,128,0.09) 0%, transparent 70%)
            `,
            filter: 'blur(15px)',
            borderRadius: '60% 40% 40% 60% / 60% 40% 60% 40%',
            transform: 'rotate(2deg)',
          }}
        />
      </div>
      
      {/* Fade-in gradient on the left */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black via-black/50 to-transparent z-20 pointer-events-none" />
      
      {/* Fade-out gradient on the right */}
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black via-black/50 to-transparent z-20 pointer-events-none" />
      
      {/* Animated content - smooth movement from edge to edge */}
      <div 
        className="flex items-center gap-12 whitespace-nowrap relative z-10"
        style={{
          transform: `translateX(${scrollPosition}px)`,
          transition: 'transform 0.05s linear'
        }}
      >
        {cloudStats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4 min-w-max">
            <div className={`${stat.color} opacity-90`}>
              {stat.icon}
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 