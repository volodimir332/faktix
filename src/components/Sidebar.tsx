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
  Calculator,
  LogOut,
  AlertTriangle,
  CreditCard
} from 'lucide-react';
import { FaktixIcon } from './FaktixLogo';
import { useLanguage } from '@/contexts/LanguageContext';
import { NewInvoiceModal } from './NewInvoiceModal';
import { useAuth } from '@/hooks/useAuth';
import { redirectToPortal } from '@/lib/subscription-service';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { logout, user } = useAuth();

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
    { href: '/kalkulace', icon: Calculator, label: 'Kalkulace a nabídky', page: 'kalkulace' },
    { href: '#', icon: Users, label: t('nav.clients'), page: 'klienti' },
    { href: '#', icon: Euro, label: t('nav.finance'), page: 'finance' },
    { href: '/profil', icon: User, label: t('nav.profile'), page: 'profil' },
    { href: '/ucetnictvi', icon: Activity, label: 'Účetnictví', page: 'ucetnictvi' },
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

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        setIsLogoutModalOpen(false);
        router.push('/');
      } else {
        console.error('Помилка виходу:', result.message);
      }
    } catch (error) {
      console.error('Помилка виходу:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await redirectToPortal({
        returnUrl: `${window.location.origin}/dashboard`
      });
    } catch (error) {
      console.error('Error redirecting to portal:', error);
      alert('Помилка при відкритті порталу підписки');
    }
  };

  return (
    <>
      {/* Приховуємо scrollbar */}
      <style jsx global>{`
        .sidebar-container::-webkit-scrollbar {
          display: none;
        }
        .sidebar-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .sidebar-container {
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar-container:hover {
          width: 14rem !important; /* 56 = 224px = w-56 */
        }
        @media (min-width: 1024px) {
          .sidebar-container {
            width: 4rem; /* 16 = 64px = w-16 */
          }
        }
        @media (max-width: 1023px) {
          .sidebar-container {
            width: 4rem !important;
          }
          .sidebar-container:hover {
            width: 4rem !important;
          }
        }
      `}</style>

      {/* Mobile Menu Button - Fixed in top left - Показуємо на мобільних і планшетах */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-money text-black shadow-lg hover:bg-money-dark transition-all duration-300 hover:scale-110"
        aria-label={isMobileMenuOpen ? "Закрити меню" : "Відкрити меню"}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay для закриття меню при кліку поза ним */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-container fixed inset-y-0 left-0 z-40 border-r border-gray-700/50 bg-black/95 backdrop-blur-md flex flex-col overflow-y-auto transition-all duration-300
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        lg:w-16 lg:group lg:hover:w-56`}>
        {/* Header */}
        <div className="p-2 border-b border-gray-700/50">
          <div className="flex items-center justify-center lg:group-hover:justify-start lg:group-hover:space-x-2 transition-all duration-300">
            <FaktixIcon size="sm" />
            <div className={`lg:group-hover:block opacity-100 lg:group-hover:opacity-100 transition-opacity duration-300 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
              <div className="font-medium text-white whitespace-nowrap text-sm">faktix</div>
              <div className="text-xs text-gray-400 whitespace-nowrap">
                {getCurrentPageLabel()}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-2">
          {/* New Button */}
          <div className="relative mb-3">
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-money text-black px-3 py-2 text-sm flex items-center justify-center lg:group-hover:justify-start rounded-lg font-medium hover:bg-money-dark money-glow w-full"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span className="hidden lg:group-hover:inline ml-2 whitespace-nowrap opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                  {t('dropdown.new')}
                </span>
                <ChevronDown className={`w-3 h-3 ml-2 transition-transform hidden lg:group-hover:inline opacity-0 lg:group-hover:opacity-100 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Tooltip for compact mode */}
              <div className="lg:group-hover:hidden absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap top-1/2 transform -translate-y-1/2">
                {t('dropdown.new')}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900"></div>
              </div>
            </div>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-full lg:group-hover:left-0 ml-2 lg:group-hover:ml-0 top-0 lg:group-hover:top-full lg:group-hover:mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
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
          <div className="mb-4">
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = mounted && pathname === item.href;
                
                return (
                  <div key={item.page} className="relative">
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-2 py-2 justify-start text-sm rounded-lg ${
                        isActive 
                          ? 'text-money' 
                          : 'text-gray-300 hover:bg-money/10 hover:text-money'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className={`ml-2 whitespace-nowrap transition-opacity duration-300 ${isMobileMenuOpen ? 'inline opacity-100' : 'hidden lg:group-hover:inline opacity-0 lg:group-hover:opacity-100'}`}>{item.label}</span>
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Secondary Section */}
          <div className="border-t border-gray-700/50 pt-2">
            <nav className="space-y-1">
              <div className="relative">
                <a href="#" className="flex items-center px-2 py-2 justify-center lg:group-hover:justify-start text-sm rounded-lg text-gray-300 hover:bg-money/10 hover:text-money">
                  <Bell className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden lg:group-hover:inline ml-2 whitespace-nowrap opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">Notifikace</span>
                </a>
              </div>
            </nav>
          </div>
        </div>

          {/* Bottom Section - Home Button */}
        <div className="p-2 border-t border-gray-700/50">
          <div className="relative">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-2 py-2 justify-start text-sm rounded-lg text-gray-300 hover:bg-money/10 hover:text-money"
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              <span className={`ml-2 whitespace-nowrap transition-opacity duration-300 ${isMobileMenuOpen ? 'inline opacity-100' : 'hidden lg:group-hover:inline opacity-0 lg:group-hover:opacity-100'}`}>{t('nav.home')}</span>
            </Link>
          </div>
          
          {/* Settings Button */}
          <div className="relative mt-1">
            <button className="flex items-center px-2 py-2 justify-center lg:group-hover:justify-start text-sm rounded-lg text-gray-300 hover:bg-money/10 hover:text-money w-full">
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:group-hover:inline ml-2 whitespace-nowrap opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">Nastavení</span>
            </button>
          </div>
          
          {/* Language Switcher */}
          <div className="relative mt-1">
            <button
              onClick={toggleLanguage}
              className="flex items-center px-2 py-2 justify-center lg:group-hover:justify-start text-sm rounded-lg text-gray-300 hover:bg-money/10 hover:text-money w-full"
            >
              <Globe className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:group-hover:inline ml-2 whitespace-nowrap opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">{language === 'cs' ? 'CS' : 'UA'}</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="relative mt-1">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center px-2 py-2 justify-center lg:group-hover:justify-start text-sm rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:group-hover:inline ml-2 whitespace-nowrap opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">Вийти</span>
            </button>
          </div>

          {/* Manage Subscription Button */}
          <div className="relative mt-1">
            <button
              onClick={handleManageSubscription}
              className="flex items-center px-2 py-2 justify-center lg:group-hover:justify-start text-sm rounded-lg text-money hover:bg-money/10 hover:text-money-light w-full"
            >
              <CreditCard className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:group-hover:inline ml-2 whitespace-nowrap opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">Підписка</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* New Invoice Modal */}
      <NewInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsLogoutModalOpen(false)}
        >
          <div 
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Підтвердження виходу</h3>
                <p className="text-sm text-gray-400">Ви дійсно хочете вийти з облікового запису?</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-300 mb-6">
              <p>Після виходу вам потрібно буде знову увійти в систему для доступу до ваших даних.</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Скасувати
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Вийти
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 