"use client";
import { useEffect, useState } from 'react';
import { DollarSign, FileText, Users, TrendingUp } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

const stats: StatItem[] = [
  {
    icon: <FileText className="w-6 h-6" />,
    value: "1,000,000+",
    label: "faktur denně",
    color: "text-green-400"
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    value: "28,850.50",
    label: "Kč denně",
    color: "text-white"
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: "12,456",
    label: "spokojených klientů",
    color: "text-gray-300"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: "85,000",
    label: "faktur měsíčně",
    color: "text-green-400"
  },
  {
    icon: <FileText className="w-6 h-6" />,
    value: "1,000,000+",
    label: "faktur denně",
    color: "text-white"
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    value: "28,850.50",
    label: "Kč denně",
    color: "text-gray-300"
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: "12,456",
    label: "spokojených klientů",
    color: "text-green-400"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: "85,000",
    label: "faktur měsíčně",
    color: "text-white"
  }
];

export function AnimatedStats() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => {
        // Reset position when it reaches the end
        if (prev <= -100) {
          return 0;
        }
        return prev - 0.5; // Slow scroll speed
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black/40 backdrop-blur-sm border-y border-gray-800/50 py-8 overflow-hidden" style={{ transform: 'rotate(-1deg)' }}>
      <div 
        className="flex items-center gap-12 whitespace-nowrap"
        style={{
          transform: `translateX(${scrollPosition}px)`,
          transition: 'transform 0.05s linear'
        }}
      >
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4 min-w-max">
            <div className={`${stat.color} opacity-80`}>
              {stat.icon}
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 