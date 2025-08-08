"use client";
import { 
  Users, 
  BarChart3, 
  CreditCard, 
  Database, 
  Zap,
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';

interface ServiceCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const services: ServiceCard[] = [
  {
    icon: Zap,
    title: 'Automatická fakturace',
    description: 'Opakující se faktury se vytvoří a odešlou automaticky. Ušetřete 90% času s chytrými šablonami a pravidly.'
  },
  {
    icon: TrendingUp,
    title: 'Správa pohledávek',
    description: 'Automatické upomínky, sledování termínů plateb a inteligentní doporučení pro rychlejší inkaso.'
  },
  {
    icon: BarChart3,
    title: 'Real-time analytika',
    description: 'Živé přehledy zisku, cashflow a výkonnosti. Exporty pro daňové přiznání a účetní software.'
  },
  {
    icon: CreditCard,
    title: 'QR platby',
    description: 'Moderní QR kódy na fakturách pro okamžité platby. Podpora Apple Pay, Google Pay a bankovních aplikací.'
  },
  {
    icon: Database,
    title: 'Export do účetnictví',
    description: 'Přímé propojení s Flexibee, Money S3, Pohoda a dalšími. Synchronizace dat bez ruční práce.'
  },
  {
    icon: Shield,
    title: 'API integrace',
            description: 'Propojte faktix s vaším e-shopem, CRM nebo ERP systémem. RESTful API s kompletní dokumentací.'
  }
];

export function ServiceGrid() {
  return (
    <section id="funkce" className="py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Postavujeme </span>
            <span className="text-money">rychleji</span>
            <br />
            <span className="text-gray-400">s jistotou</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Kompletní řešení pro moderní fakturaci s pokročilými funkcemi, 
            které vám pomohou efektivně spravovat vaše podnikání a dosáhnout větších zisků
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <div
                key={index}
                className="group relative bg-gray-900/20 backdrop-blur-sm rounded-xl p-5 border border-gray-800/30 transition-all duration-500 hover:scale-[1.02] hover:bg-gray-900/30"
                style={{
                  background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.4) 0%, rgba(3, 7, 18, 0.5) 100%)'
                }}
              >
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-money/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       style={{
                         background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 136, 0.2) 50%, transparent 100%)',
                         animation: 'slide 3s infinite linear',
                         transform: 'translateX(-100%)'
                       }}>
                  </div>
                  <div className="absolute inset-[1px] bg-gray-900/40 rounded-xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-5 p-3 bg-money/5 rounded-lg inline-flex">
                    <IconComponent className="w-6 h-6 text-money" />
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-money transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>

                  {/* Feature indicator */}
                  <div className="mt-5 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-money rounded-full animate-pulse"></div>
                    <span className="text-xs text-money font-medium">Aktivní funkce</span>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-money/3 via-transparent to-emerald-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center space-x-6 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-money" />
              <span>Nasazení za 24 hodin</span>
            </div>
            <div className="hidden md:block w-px h-3 bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <Users className="w-3 h-3 text-money" />
              <span>24/7 technická podpora</span>
            </div>
            <div className="hidden md:block w-px h-3 bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3 text-money" />
              <span>99.9% uptime záruka</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 