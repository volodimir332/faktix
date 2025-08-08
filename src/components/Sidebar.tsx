'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3,
  Users,
  FileText,
  Euro,
  User,
  Activity,
  Tags,
  Settings,
  Bell,
  Menu,
  X,
  Home,
  Globe,
  Plus,
  ChevronDown,
  Newspaper,
  Calculator
} from 'lucide-react';
import { FaktixIcon } from './FaktixLogo';
import { useLanguage } from '@/contexts/LanguageContext';
import { NewInvoiceModal } from './NewInvoiceModal';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  // Ensure client-side rendering and handle responsive design
  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      // On mobile and tablet, use compact mode
      setIsCompactMode(window.innerWidth < 1024);
    };
    
    // Set initial state
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigationItems = [
    { href: '/dashboard', icon: BarChart3, label: t('nav.dashboard'), page: 'dashboard' },
    { href: '/faktury', icon: FileText, label: t('nav.invoices'), page: 'faktury' },
    { href: '#', icon: Users, label: t('nav.clients'), page: 'klienti' },
    { href: '#', icon: Euro, label: t('nav.finance'), page: 'finance' },
    { href: '/profil', icon: User, label: t('nav.profile'), page: 'profil' },
    { href: '/analytiky', icon: Activity, label: t('nav.analytics'), page: 'analytiky' },
    { href: '#', icon: Tags, label: t('nav.quotes'), page: 'nabidky' },
    { href: '#', icon: Settings, label: t('nav.settings'), page: 'nastaveni' },
  ];

  // Get current page label safely
  const getCurrentPageLabel = () => {
    if (!mounted) return t('nav.dashboard');
    return navigationItems.find(item => item.href === pathname)?.label || t('nav.dashboard');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'cs' ? 'uk' : 'cs');
  };

  return (
    <>

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-40 ${isCompactMode ? 'w-16' : 'w-56'} border-r border-gray-700/50 bg-black/60 backdrop-blur-sm flex flex-col transition-all duration-300 ease-in-out translate-x-0`}>
        {/* Header */}
        <div className={`${isCompactMode ? 'p-3' : 'p-6'} border-b border-gray-700/50`}>
          <div className={`flex items-center ${isCompactMode ? 'justify-center' : 'space-x-3'}`}>
            <FaktixIcon size={isCompactMode ? "sm" : "md"} />
            {!isCompactMode && (
              <div>
                <div className="font-medium text-white">faktix</div>
                <div className="text-sm text-gray-400">
                  {getCurrentPageLabel()}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Navigation */}
        <div className={`flex-1 ${isCompactMode ? 'p-2' : 'p-4'}`}>
          {/* New Button */}
          <div className={`relative mb-4 ${isCompactMode ? 'flex justify-center' : ''}`}>
            <div className="relative group">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`bg-money text-black ${isCompactMode ? 'px-2 py-3 justify-center' : 'px-3 py-2'} text-sm flex items-center rounded-lg font-medium hover:bg-money-dark transition-colors money-glow w-full`}
              >
                <Plus className={`w-4 h-4 ${isCompactMode ? '' : 'mr-2'}`} />
                {!isCompactMode && (
                  <>
                    {t('dropdown.new')}
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
              
              {/* Tooltip for compact mode */}
              {isCompactMode && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap top-1/2 transform -translate-y-1/2">
                  {t('dropdown.new')}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
                </div>
              )}
            </div>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className={`absolute ${isCompactMode ? 'left-full ml-2 top-0' : 'top-full mt-2 left-0'} w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50`}>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsInvoiceModalOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-money hover:text-black transition-colors flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    {t('dropdown.newInvoice')}
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Navigate to new client page
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-money hover:text-black transition-colors flex items-center"
                  >
                    <Users className="w-4 h-4 mr-3" />
                    {t('dropdown.newClient')}
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Navigate to new quote page
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-money hover:text-black transition-colors flex items-center"
                  >
                    <Tags className="w-4 h-4 mr-3" />
                    {t('dropdown.newQuote')}
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Navigate to new document page
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-money hover:text-black transition-colors flex items-center"
                  >
                    <Newspaper className="w-4 h-4 mr-3" />
                    {t('dropdown.newDocument')}
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Navigate to new calculation page
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-money hover:text-black transition-colors flex items-center"
                  >
                    <Calculator className="w-4 h-4 mr-3" />
                    {t('dropdown.newCalculation')}
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Navigate to new report page
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-money hover:text-black transition-colors flex items-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-3" />
                    {t('dropdown.newReport')}
                  </button>
                </div>
              </div>
            )}
            
            {/* Backdrop to close dropdown */}
            {isDropdownOpen && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              />
            )}
          </div>
          
          {/* Main Section */}
          <div className="mb-6">
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = mounted && pathname === item.href;
                
                return (
                  <div key={item.page} className="relative group">
                    <Link
                      href={item.href}
                      className={`flex items-center ${isCompactMode ? 'px-2 py-3 justify-center' : 'px-3 py-2'} text-sm rounded-lg transition-colors ${
                        isActive 
                          ? 'text-money' 
                          : 'text-gray-300 hover:bg-money/10 hover:text-money'
                      }`}

                    >
                      <Icon className={`w-4 h-4 ${isCompactMode ? '' : 'mr-3'}`} />
                      {!isCompactMode && item.label}
                    </Link>
                    
                    {/* Tooltip for compact mode */}
                    {isCompactMode && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap top-1/2 transform -translate-y-1/2">
                        {item.label}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Secondary Section */}
          <div className="border-t border-gray-700/50 pt-4">
            <nav className="space-y-1">
              <div className="relative group">
                <a href="#" className={`flex items-center ${isCompactMode ? 'px-2 py-3 justify-center' : 'px-3 py-2'} text-sm rounded-lg text-gray-300 hover:bg-money/10 hover:text-money transition-colors`}>
                  <Bell className={`w-4 h-4 ${isCompactMode ? '' : 'mr-3'}`} />
                  {!isCompactMode && 'Notifikace'}
                </a>
                
                {/* Tooltip for compact mode */}
                {isCompactMode && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap top-1/2 transform -translate-y-1/2">
                    Notifikace
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Section - Home Button */}
        <div className={`${isCompactMode ? 'p-2' : 'p-4'} border-t border-gray-700/50`}>
          <div className="relative group">
            <Link
              href="/"
              className={`flex items-center ${isCompactMode ? 'px-2 py-3 justify-center' : 'px-3 py-2'} text-sm rounded-lg text-gray-300 hover:bg-money/10 hover:text-money transition-colors`}

            >
              <Home className={`w-4 h-4 ${isCompactMode ? '' : 'mr-3'}`} />
              {!isCompactMode && t('nav.home')}
            </Link>
            
            {/* Tooltip for compact mode */}
            {isCompactMode && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap top-1/2 transform -translate-y-1/2">
                {t('nav.home')}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
              </div>
            )}
          </div>
          
          {/* Language Switcher */}
          <div className="relative group">
            <button
              onClick={toggleLanguage}
              className={`flex items-center ${isCompactMode ? 'px-2 py-3 justify-center' : 'px-3 py-2'} text-sm rounded-lg text-gray-300 hover:bg-money/10 hover:text-money transition-colors w-full mt-2`}
            >
              <Globe className={`w-4 h-4 ${isCompactMode ? '' : 'mr-3'}`} />
              {!isCompactMode && <span>{language === 'cs' ? 'CS' : 'UA'}</span>}
            </button>
            
            {/* Tooltip for compact mode */}
            {isCompactMode && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap top-1/2 transform -translate-y-1/2">
                {language === 'cs' ? 'Čeština' : 'Українська'}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* New Invoice Modal */}
      <NewInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </>
  );
} 