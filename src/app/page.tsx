"use client";
import { 
  ArrowRight,
  Zap,
  Euro,
  Smartphone,
  Star,
  Play,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import Link from "next/link";

import { FaktixLogo } from "@/components/FaktixLogo";
import { CloudBackground } from "@/components/CloudBackground";
import { AnimatedLogoBackground } from "@/components/AnimatedLogoBackground";
import { LanguageGlobe } from "@/components/LanguageGlobe";
import { PricingToggle } from "@/components/PricingToggle";
import { StarterPlan } from "@/components/StarterPlan";
import { ServiceGrid } from "@/components/ServiceGrid";
import InterfaceShowcase from "@/components/InterfaceShowcase";
import AnimatedIconBox from "@/components/AnimatedIconBox";
import { AnimatedStats } from "@/components/AnimatedStats";
import { AnimatedCloudStats } from "@/components/AnimatedCloudStats";
import { ScreenshotShowcase } from "@/components/ScreenshotShowcase";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-black text-white relative">
      
      {/* Fixed background layer covering full viewport */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <AnimatedLogoBackground />
        <div className="absolute inset-0 w-full h-full opacity-40">
          <CloudBackground />
        </div>
      </div>
      
      {/* All content in single z-index layer */}
      <div className="relative z-10">
        {/* Header - Fixed */}
        <header className="border-b border-gray-700 fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <FaktixLogo size="lg" />

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#funkce" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.functions')}
              </a>
              <a href="#ceny" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.pricing')}
              </a>
              <a href="#o-nas" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.about')}
              </a>
              <a href="#kontakt" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.contact')}
              </a>
            </nav>

            {/* Language & Auth */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Language Globe */}
              <LanguageGlobe />
              
              {/* Auth Buttons */}
              <Link href="/login" className="hidden sm:block text-gray-300 hover:text-white transition-colors">
                {t('nav.login')}
              </Link>
              <Link href="/register" className="bg-black text-white border-2 border-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-300 text-sm sm:text-base">
                <span className="hidden sm:inline">{t('nav.signup')}</span>
                <span className="sm:hidden">{t('nav.signup').split(' ')[0]}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        {/* Green organic blur accent (top, біля хедера) */}
        <div
          className="absolute left-[10%] top-[-20px] -z-10 pointer-events-none"
          style={{
            width: '520px',
            height: '280px',
            background: 'radial-gradient(ellipse 80% 30% at 20% 30%, rgba(0,255,136,0.9) 0%, rgba(0,255,136,0.3) 40%, rgba(0,128,68,0.6) 60%, rgba(0,64,34,0.4) 80%, transparent 90%), radial-gradient(ellipse 40% 70% at 80% 70%, rgba(0,255,136,0.7) 0%, rgba(0,128,68,0.5) 50%, transparent 70%)',
            filter: 'blur(30px)',
            opacity: 0.9,
            borderRadius: '30% 70% 80% 20% / 60% 30% 70% 40%',
            transform: 'rotate(-8deg)',
          }}
        />
        {/* Green organic blur accent (top-right, біля заголовку) */}
        <div
          className="absolute right-[5%] top-[20%] -z-10 pointer-events-none"
          style={{
            width: '280px',
            height: '160px',
            background: 'radial-gradient(ellipse 60% 40% at 30% 20%, rgba(0,255,136,0.8) 0%, rgba(0,255,136,0.2) 50%, rgba(0,128,68,0.7) 70%, transparent 85%), radial-gradient(ellipse 30% 80% at 70% 80%, rgba(0,255,136,0.6) 0%, rgba(0,64,34,0.4) 60%, transparent 80%)',
            filter: 'blur(25px)',
            opacity: 0.85,
            borderRadius: '80% 20% 40% 60% / 20% 80% 60% 40%',
            transform: 'rotate(25deg)',
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-[2.645rem] sm:text-[3.306rem] md:text-[3.968rem] lg:text-[4.629rem] font-bold mb-4 leading-tight">
              <div className="text-white flex items-baseline justify-center gap-2 md:gap-3 lg:gap-4 flex-nowrap">
                <span className="flex-shrink-0">{t('hero.title.fast')}</span>
                  <AnimatedIconBox />
                <span className="flex-shrink-0">fakturace</span>
              </div>
              <div className="text-money mt-2">
                {t('hero.title.for')}
              </div>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-[10%]">
              <Link href="/registrace" className="bg-money text-black px-10 py-5 rounded-lg font-semibold text-lg hover:bg-money-dark transition-all duration-300 flex items-center gap-3">
                <span>{t('hero.cta.start')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center gap-3 text-white bg-black border-2 border-gray-600 px-8 py-5 rounded-lg hover:bg-gray-800 transition-all duration-300 text-lg">
                <Play className="w-5 h-5" />
                {t('hero.cta.demo')}
              </button>
            </div>
            
            {/* Animated Cloud Stats Bar */}
            <div className="mt-16">
              <AnimatedCloudStats />
            </div>
          </div>


        </div>
      </section>

      {/* Screenshot Showcase Section */}
      <ScreenshotShowcase />

      {/* Interface Showcase Section */}
      <InterfaceShowcase />

      {/* Features Section */}
      <section className="py-16 relative">
        {/* Green organic blur accent (біля функцій) */}
        <div
          className="absolute right-[8%] top-[-80px] -z-10 pointer-events-none"
          style={{
            width: '340px',
            height: '180px',
            background: 'radial-gradient(ellipse 50% 80% at 80% 30%, rgba(0,255,136,0.9) 0%, rgba(0,255,136,0.4) 40%, rgba(0,128,68,0.8) 60%, rgba(0,64,34,0.3) 80%, transparent 90%), radial-gradient(ellipse 70% 30% at 20% 70%, rgba(0,255,136,0.5) 0%, rgba(0,128,68,0.6) 50%, transparent 70%)',
            filter: 'blur(35px)',
            opacity: 0.8,
            borderRadius: '20% 80% 60% 40% / 80% 20% 40% 60%',
            transform: 'rotate(18deg)',
          }}
        />
        {/* Green organic blur accent (bottom-left, біля функцій) */}
        <div
          className="absolute left-[3%] bottom-[10%] -z-10 pointer-events-none"
          style={{
            width: '320px',
            height: '200px',
            background: 'radial-gradient(ellipse 40% 90% at 10% 40%, rgba(0,255,136,0.8) 0%, rgba(0,255,136,0.3) 50%, rgba(0,128,68,0.7) 70%, transparent 85%), radial-gradient(ellipse 90% 40% at 90% 60%, rgba(0,255,136,0.6) 0%, rgba(0,64,34,0.5) 60%, transparent 80%), radial-gradient(ellipse 30% 60% at 50% 20%, rgba(0,255,136,0.4) 0%, transparent 50%)',
            filter: 'blur(40px)',
            opacity: 0.75,
            borderRadius: '60% 40% 30% 70% / 40% 60% 70% 30%',
            transform: 'rotate(-15deg)',
          }}
        />
        {/* Green organic blur accent (center, біля функцій) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
          style={{
            width: '280px',
            height: '160px',
            background: 'radial-gradient(ellipse 70% 50% at 30% 40%, rgba(0,255,136,0.7) 0%, rgba(0,255,136,0.3) 50%, rgba(0,128,68,0.6) 70%, transparent 85%), radial-gradient(ellipse 40% 70% at 70% 60%, rgba(0,255,136,0.5) 0%, rgba(0,64,34,0.4) 60%, transparent 80%)',
            filter: 'blur(30px)',
            opacity: 0.7,
            borderRadius: '50% 50% 30% 70% / 70% 30% 50% 50%',
            transform: 'rotate(45deg)',
          }}
        />
        {/* Green organic blur accent (top-center, біля функцій) */}
        <div
          className="absolute left-[40%] top-[5%] -z-10 pointer-events-none"
          style={{
            width: '200px',
            height: '120px',
            background: 'radial-gradient(ellipse 60% 40% at 40% 30%, rgba(0,255,136,0.6) 0%, rgba(0,255,136,0.2) 60%, rgba(0,128,68,0.5) 80%, transparent 90%)',
            filter: 'blur(25px)',
            opacity: 0.65,
            borderRadius: '70% 30% 60% 40% / 40% 70% 30% 60%',
            transform: 'rotate(-30deg)',
          }}
        />
        <ServiceGrid />
      </section>

      {/* Animated Statistics Bar - Full Width */}
      <AnimatedStats />

      {/* Starter Plan Showcase */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Začněte <span className="text-money">zdarma</span> ještě dnes
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Vytvořte svou první fakturu za méně než minutu. Žádné závazky, žádné skryté poplatky.
          </p>
          
          <div className="flex justify-center">
            <StarterPlan className="max-w-sm" variant="highlighted" />
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Všechny funkce zdarma na 14 dní. Pak můžete pokračovat nebo přejít na placený plán.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-28 relative">
        {/* Green organic blur accent (залишаю стару, біля відгуків) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
          style={{
            width: '900px',
            height: '420px',
            background: 'radial-gradient(ellipse 60% 60% at 40% 30%, rgba(0,255,136,0.9) 0%, rgba(0,255,136,0.2) 40%, rgba(0,128,68,0.8) 60%, rgba(0,64,34,0.4) 80%, transparent 90%), radial-gradient(ellipse 80% 40% at 80% 70%, rgba(0,255,136,0.7) 0%, rgba(0,128,68,0.6) 50%, transparent 70%), radial-gradient(ellipse 30% 80% at 20% 80%, rgba(0,255,136,0.5) 0%, rgba(0,64,34,0.3) 60%, transparent 80%)',
            filter: 'blur(45px)',
            opacity: 0.95,
            borderRadius: '70% 30% 20% 80% / 30% 70% 80% 20%',
            transform: 'rotate(-12deg) translate(-50%, -50%)',
          }}
        />
        {/* Green organic blur accent (bottom-right, біля відгуків) */}
        <div
          className="absolute right-[2%] bottom-[15%] -z-10 pointer-events-none"
          style={{
            width: '380px',
            height: '240px',
            background: 'radial-gradient(ellipse 70% 50% at 20% 20%, rgba(0,255,136,0.8) 0%, rgba(0,255,136,0.3) 50%, rgba(0,128,68,0.7) 70%, transparent 85%), radial-gradient(ellipse 40% 80% at 80% 80%, rgba(0,255,136,0.6) 0%, rgba(0,64,34,0.5) 60%, transparent 80%), radial-gradient(ellipse 50% 40% at 60% 40%, rgba(0,255,136,0.4) 0%, transparent 50%)',
            filter: 'blur(35px)',
            opacity: 0.9,
            borderRadius: '40% 60% 80% 20% / 60% 40% 20% 80%',
            transform: 'rotate(35deg)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">
              {t('social.title.before')} <span className="text-money font-bold">{t('social.count')}+</span> {t('social.title.after')}
            </h2>
            <div className="flex justify-center items-center gap-8 opacity-60 mb-16">
              <Zap className="w-12 h-12" />
              <Euro className="w-12 h-12" />
              <Smartphone className="w-12 h-12" />
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "Konečně řešení, které skutečně zjednodušuje fakturaci. Za měsíc jsem ušetřil 10 hodin práce.",
                name: "Petr Novák",
                company: "TechStart s.r.o.",
                rating: 5
              },
              {
                text: "Automatické párování plateb je neuvěřitelné. Už nemusím kontrolovat každou platbu ručně.",
                name: "Jana Svobodová", 
                company: "Design Studio",
                rating: 5
              },
              {
                text: "Nejlepší investice do našeho podnikání. ROI se vrátil už za první měsíc používání.",
                name: "Martin Dvořák",
                company: "Consulting Group",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="minimal-card p-6">
                                 <div className="flex items-center mb-4">
                   {[...Array(testimonial.rating)].map((_, i) => (
                     <Star key={i} className="w-4 h-4 text-money fill-current" />
                   ))}
                 </div>
                <p className="text-gray-300 mb-4">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingToggle />

      {/* CTA Section */}
      <section className="py-28 relative">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Připraveni začít fakturovat?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Připojte se k tisícům spokojených podnikatelů. Bez závazků, zrušit můžete kdykoliv.
          </p>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-12">
            <div className="flex-1 max-w-sm">
              <StarterPlan compact={true} variant="minimal" />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-1">
              <Link href="/registrace" className="bg-money text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-money-dark transition-colors">
                Začít zdarma
              </Link>
              <Link href="/prihlaseni" className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Přihlásit se
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontakt" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <FaktixLogo size="md" className="mb-4" />
              <p className="text-gray-400 mb-4">
                Moderní fakturační systém pro podnikatele v České republice a na Ukrajině.
              </p>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center hover-money cursor-pointer">
                  <Mail className="w-4 h-4 mr-2" />
                  info@faktix.cz
                </div>
                <div className="flex items-center hover-money cursor-pointer">
                  <Phone className="w-4 h-4 mr-2" />
                  +420 123 456 789
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#funkce" className="hover:text-white transition-colors">Funkce</a></li>
                <li><a href="#ceny" className="hover:text-white transition-colors">Ceny</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrace</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Podpora</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Nápověda</a></li>
                <li><a href="#kontakt" className="hover:text-white transition-colors">Kontakt</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Společnost</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#o-nas" className="hover:text-white transition-colors">O nás</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kariéra</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ochrana dat</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Podmínky</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 faktix. Všechna práva vyhrazena.</p>
          </div>
        </div>
      </footer>
      
      </div> {/* End of relative z-10 content container */}
    </div>
  );
}
