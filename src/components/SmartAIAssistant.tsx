"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Loader2,
  Sparkles,
  Calculator,
  FileText,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Building,
  Users,
  CreditCard,
  Shield,
  BarChart3,
  Clock,
  CheckCircle,
  Euro,
  Zap,
  Lightbulb
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInvoices } from '@/contexts/InvoiceContext';
import { useClients } from '@/contexts/ClientContext';
import { searchByICO as searchCompanyByICO, searchByName as searchCompanyByName, getZivnostType, determineZivnostType, validateICO, formatICO } from '@/lib/ares-api';
import { calculateTotalTax, TAX_CONFIG_2025 } from '@/lib/tax-config';
import { NewInvoiceModal } from './NewInvoiceModal';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'info' | 'warning' | 'success' | 'action';
}

interface QuickAction {
  id: string;
  label: { cs: string; uk: string };
  icon: React.ComponentType<{ className?: string }>;
  action: string;
  category: 'tax' | 'invoice' | 'analysis' | 'help';
}

interface UserProfile {
  businessType: 'zivnost' | 'sro' | 'osvc' | 'other';
  taxMode: 'standard' | 'simplified' | 'vat_payer';
  annualLimit: number;
  currentTurnover: number;
  vatLimit: number;
  isVatPayer: boolean;
  language: 'cs' | 'uk';
}

interface AIAssistantProps {
  apiKey: string;
}

export default function SmartAIAssistant({ apiKey }: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'actions' | 'analysis'>('chat');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const { invoices } = useInvoices();
  const { clients } = useClients();

  // Розумний аналіз профілю користувача на основі фактур та даних
  const analyzeUserProfile = (): UserProfile => {
    const totalTurnover = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    const thisYearInvoices = invoices.filter(inv => 
      new Date(inv.date).getFullYear() === new Date().getFullYear()
    );
    
    const yearlyTurnover = thisYearInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    // КРИТИЧНО: Читаємо РЕАЛЬНІ дані користувача з правильного джерела
    let businessType: 'zivnost' | 'sro' | 'osvc' | 'other' = 'zivnost';
    
    // Перевіряємо, чи ми в браузері (localStorage доступний тільки в браузері)
    if (typeof window !== 'undefined') {
    try {
        // Читаємо дані з правильного ключа localStorage
        const savedProfile = localStorage.getItem('userProfileData');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
          const userBusinessType = parsed.company?.businessType || '';
          
                  // Визначаємо тип бізнесу на основі РЕАЛЬНИХ даних користувача
        if (userBusinessType.includes('OSVČ') || userBusinessType.includes('Živnostník') || 
            userBusinessType.includes('Podnikatel') || userBusinessType.includes('živnost')) {
          businessType = 'osvc';
        } else if (userBusinessType.includes('s.r.o.') || userBusinessType.includes('Společnost s ručením omezeným')) {
          businessType = 'sro';
        } else if (userBusinessType.includes('a.s.') || userBusinessType.includes('Akciová společnost')) {
          businessType = 'sro'; // Акціонерне товариство також використовує корпоративну логіку
        } else if (userBusinessType.includes('v.o.s.') || userBusinessType.includes('Veřejná obchodní společnost')) {
          businessType = 'sro'; // Товариство з необмеженою відповідальністю
        } else if (userBusinessType.includes('k.s.') || userBusinessType.includes('Komanditní společnost')) {
          businessType = 'sro'; // Командитне товариство
        } else if (userBusinessType.includes('Družstvo')) {
          businessType = 'sro'; // Кооператив
        } else {
          // За замовчуванням OSVČ, якщо тип не визначений
          businessType = 'osvc';
        }
          
          console.log('РЕАЛЬНИЙ тип бізнесу користувача:', userBusinessType, '→', businessType);
      }
    } catch (error) {
        console.log('Не вдалося завантажити збережений профіль:', error);
      }
    }

    // Визначення режиму оподаткування
    let taxMode: 'standard' | 'simplified' | 'vat_payer' = 'simplified';
    if (yearlyTurnover > 1000000) {
      taxMode = 'vat_payer';
    } else if (yearlyTurnover > 500000) {
      taxMode = 'standard';
    }

    return {
      businessType,
      taxMode,
      annualLimit: businessType === 'sro' ? 0 : 2000000, // Для s.r.o. немає ліміту
      currentTurnover: yearlyTurnover,
      vatLimit: 2000000, // Новий ліміт ПДВ 2025
      isVatPayer: yearlyTurnover > 1000000,
      language: language as 'cs' | 'uk'
    };
  };

  // Використовуємо useState для зберігання профілю
  const [userProfile, setUserProfile] = useState<UserProfile>({
    businessType: 'osvc',
    taxMode: 'simplified',
    annualLimit: 2000000,
    currentTurnover: 0,
    vatLimit: 2000000,
    isVatPayer: false,
    language: language as 'cs' | 'uk'
  });

  // Оновлюємо профіль тільки в браузері
  useEffect(() => {
    const profile = analyzeUserProfile();
    setUserProfile(profile);
  }, [invoices.length, language]);

  // Слухаємо зміни в localStorage для автоматичного оновлення
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorageChange = () => {
        const profile = analyzeUserProfile();
        setUserProfile(profile);
      };

      // Слухаємо зміни в localStorage
      window.addEventListener('storage', handleStorageChange);
      
      // Також оновлюємо при фокусі на вікні (коли користувач повертається на вкладку)
      window.addEventListener('focus', handleStorageChange);

      // Періодично перевіряємо зміни кожні 2 секунди
      const interval = setInterval(handleStorageChange, 2000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('focus', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, []);

          // Логіка для нормального повідомлення
        useEffect(() => {
          const message = document.getElementById('aiSuggestionMessage');
          if (!message) return;

          // Масив з чеськими повідомленнями
          const suggestions = [
            {
              title: "Jsem váš AI účetní asistent",
              text: "Potřebujete pomoci s daněmi nebo fakturami?",
              action: () => { setIsExpanded(true); }
            },
            {
              title: "Jsem váš AI účetní asistent",
              text: "Chcete zkontrolovat své daňové limity?",
              action: () => { setIsExpanded(true); }
            },
            {
              title: "Jsem váš AI účetní asistent",
              text: "Můžu vám poradit s optimalizací daní?",
              action: () => { setIsExpanded(true); }
            },
            {
              title: "Jsem váš AI účetní asistent",
              text: "Potřebujete pomoc s DPH nebo faktury?",
              action: () => { setIsExpanded(true); }
            }
          ];

          // Функція, яка показує повідомлення
          const showMessage = () => {
            const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
            const contentContainer = message.querySelector('.message-content');
            const closeButton = message.querySelector('#closeMessageButton');
            
            if (contentContainer) {
              contentContainer.innerHTML = `
                <div class="ai-title">${randomSuggestion.title}</div>
                <div class="ai-question">${randomSuggestion.text}</div>
              `;
            }

            // Обробник кліку на повідомлення
            message.onclick = (e) => {
              // Не запускаємо дію, якщо клікнули на кнопку закриття
              if (e.target === closeButton) return;
              
              randomSuggestion.action();
              hideMessage();
            };
            
            // Обробник кліку на кнопку закриття
            if (closeButton) {
              (closeButton as HTMLElement).onclick = (e: MouseEvent) => {
                e.stopPropagation(); // Запобігає запуску основного обробника
                hideMessage();
              };
            }
            
            // Робимо повідомлення видимим
            message.classList.add('visible');
            
            // НЕ ховаємо автоматично - тільки при кліку на кнопку закриття
          };

          // Функція, яка ховає повідомлення
          const hideMessage = () => {
            message.classList.remove('visible');
          };

          // Показуємо перше повідомлення через 3 секунди, тільки якщо користувач не наводить на робота
          const timer = setTimeout(() => {
            if (!isHovered) {
              showMessage();
            }
          }, 3000);

          // Очищення таймера при розмонтуванні компонента
          return () => {
            clearTimeout(timer);
          };
        }, [isHovered]);

  // Функція для рендерингу OSVČ дашборду
  const renderOSVCDashboard = () => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const totalIncome = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    
    // Отримуємо тип живності з профілю
    const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('userProfileData') : null;
    const profileData = savedProfile ? JSON.parse(savedProfile) : null;
    const typZivnosti = profileData?.company?.typZivnosti || 'Nedefinováno';
    
    // Визначаємо відсоток паушальних витрат на основі типу живності
    let pausalniVydajeRate = 0.60; // За замовчуванням 60%
    if (typZivnosti.includes('80%')) {
      pausalniVydajeRate = 0.80;
    } else if (typZivnosti.includes('60%')) {
      pausalniVydajeRate = 0.60;
    } else if (typZivnosti.includes('40%')) {
      pausalniVydajeRate = 0.40;
    }
    
    // ІДЕАЛЬНИЙ АЛГОРИТМ ДЛЯ OSVČ 2025
    const pausalni_vydaje = totalIncome * pausalniVydajeRate;
    const zaklad_dane = totalIncome - pausalni_vydaje; // податкова база
    
    // Податок на доходи - ПРАВИЛЬНИЙ АЛГОРИТМ 2025 з пільгою
    const SLEVA_NA_POPLATNIKA = 30840; // Пільга на платника 2025
    const progressiveThreshold = 1677000; // ПРАВИЛЬНИЙ поріг 2025
    
    // Спочатку розраховуємо податок з усього податкового базису
    let danPredSlevou = 0;
    
    if (zaklad_dane <= progressiveThreshold) {
      danPredSlevou = zaklad_dane * 0.15; // 15% базова ставка
    } else {
      danPredSlevou = progressiveThreshold * 0.15 + (zaklad_dane - progressiveThreshold) * 0.23; // 23% над лімітом
    }
    
    // Потім застосовуємо пільгу і забезпечуємо, що податок не буде від'ємним
    const incomeTax = Math.max(0, danPredSlevou - SLEVA_NA_POPLATNIKA);
    
    // КОНСТАНТИ ЗА ТЕХНІЧНИМ ЗАВДАННЯМ 2025
    const MIN_ROCNA_ZAKLAD_SOCIALNI = 195930; // Правильна мінімальна база 2025
    const MIN_ROCNA_ZAKLAD_ZDRAVOTNI = 279942; // Правильна мінімальна база 2025
    
    // Соціальне страхування - ПРАВИЛЬНА ЛОГІКА 2025
    const vypocitanyVymerovaci = zaklad_dane * 0.55; // 55% від податкового базису
    
    const finalniZakladSocialni = Math.max(vypocitanyVymerovaci, MIN_ROCNA_ZAKLAD_SOCIALNI);
    const finalniSocialni = finalniZakladSocialni * 0.292; // 29.2%
    
    // Медичне страхування - ПРАВИЛЬНА ЛОГІКА 2025
    const finalniZakladZdravotni = Math.max(vypocitanyVymerovaci, MIN_ROCNA_ZAKLAD_ZDRAVOTNI);
    const finalniZdravotni = finalniZakladZdravotni * 0.135; // 13.5%
    
    // КОНТРОЛЬ МІНІМАЛЬНИХ АВАНСІВ ДЛЯ НАСТУПНОГО РОКУ
    const min_socialni_mesicne = 4759;
    const min_zdravotni_mesicne = 3143;
    
    // Місячні аванси для наступного року на основі поточного прибутку
    const socialni_mesicne_vypoct = finalniSocialni / 12;
    const zdravotni_mesicne_vypoct = finalniZdravotni / 12;
    
    const final_socialni_mesicne = Math.max(socialni_mesicne_vypoct, min_socialni_mesicne);
    const final_zdravotni_mesicne = Math.max(zdravotni_mesicne_vypoct, min_zdravotni_mesicne);
    
    const totalTaxes = incomeTax + finalniSocialni + finalniZdravotni;

    return (
      <>
        {/* Quick Tax Calculator для OSVČ */}
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Calculator className="w-5 h-5 text-green-400 mr-2" />
            <span className="font-medium text-white">{language === 'cs' ? 'Rychlý výpočet daní - OSVČ' : 'Швидкий розрахунок податків - ОСВЧ'}</span>
          </div>
          
          {/* Тип живності */}
          <div className="mb-3 p-2 bg-blue-600/20 border border-blue-500/30 rounded text-xs">
            <div className="text-blue-300">{language === 'cs' ? 'Typ živnosti:' : 'Тип живності:'}</div>
            <div className="text-blue-100 font-medium">{typZivnosti}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-black/20 rounded p-2">
              <div className="text-gray-400 text-xs">{language === 'cs' ? 'Příjem' : 'Дохід'}</div>
              <div className="text-green-400 font-bold">{totalIncome.toLocaleString()} Kč</div>
            </div>
            <div className="bg-black/20 rounded p-2">
              <div className="text-gray-400 text-xs">{language === 'cs' ? 'Paušální výdaje' : 'Паушальні витрати'}</div>
              <div className="text-blue-400 font-bold">{(pausalniVydajeRate * 100).toFixed(0)}%</div>
            </div>
            <div className="bg-black/20 rounded p-2">
              <div className="text-gray-400 text-xs">{language === 'cs' ? 'Daň z příjmů (15%/23%)' : 'Податок з доходу (15%/23%)'}</div>
              <div className="text-orange-400 font-bold">{incomeTax.toLocaleString()} Kč</div>
            </div>
            <div className="bg-black/20 rounded p-2">
              <div className="text-gray-400 text-xs">{language === 'cs' ? 'Sociální (29.2%)' : 'Соціальне (29.2%)'}</div>
              <div className="text-blue-400 font-bold">{finalniSocialni.toLocaleString()} Kč</div>
              <div className="text-gray-500 text-xs">{language === 'cs' ? `${final_socialni_mesicne.toLocaleString()} Kč/měs` : `${final_socialni_mesicne.toLocaleString()} крон/міс`}</div>
            </div>
            <div className="bg-black/20 rounded p-2">
              <div className="text-gray-400 text-xs">{language === 'cs' ? 'Zdravotní (13.5%)' : 'Медичне (13.5%)'}</div>
              <div className="text-purple-400 font-bold">{finalniZdravotni.toLocaleString()} Kč</div>
              <div className="text-gray-500 text-xs">{language === 'cs' ? `${final_zdravotni_mesicne.toLocaleString()} Kč/měs` : `${final_zdravotni_mesicne.toLocaleString()} крон/міс`}</div>
            </div>
            <div className="col-span-2 bg-red-900/20 border border-red-500/30 rounded p-2 text-center">
              <div className="text-gray-400 text-xs">{language === 'cs' ? 'CELKEM K ZAPLACENÍ' : 'ВСЬОГО ДО СПЛАТИ'}</div>
              <div className="text-red-400 font-bold text-lg">{totalTaxes.toLocaleString()} Kč</div>
              <div className="text-gray-500 text-xs">({((totalTaxes / totalIncome) * 100).toFixed(1)}% {language === 'cs' ? 'z příjmu' : 'від доходу'})</div>
            </div>
          </div>
        </div>

        {/* Monthly Payment Schedule для OSVČ */}
        <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="font-medium text-white">{language === 'cs' ? 'Měsíční platby - OSVČ' : 'Місячні платежі - ОСВЧ'}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-black/20 rounded p-2">
              <div className="text-gray-400 text-xs">{language === 'cs' ? 'Sociální měsíčně' : 'Соціальне на місяць'}</div>
              <div className="text-blue-400 font-bold">{final_socialni_mesicne.toLocaleString()} Kč</div>
              <div className="text-gray-500 text-xs">{language === 'cs' ? 'splatnost 20.' : 'термін до 20.'}</div>
            </div>
            <div className="bg-black/20 rounded p-2">
              <div className="text-gray-400 text-xs">{language === 'cs' ? 'Zdravotní měsíčně' : 'Медичне на місяць'}</div>
              <div className="text-purple-400 font-bold">{final_zdravotni_mesicne.toLocaleString()} Kč</div>
              <div className="text-gray-500 text-xs">{language === 'cs' ? 'splatnost 8.' : 'термін до 8.'}</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Функція для рендерингу SRO дашборду
  const renderSRODashboard = () => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const totalIncome = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    
    // Використовуємо фіксовані витрати для прикладу
    const defaultExpenses = totalIncome * 0.7;
    const profit = totalIncome - defaultExpenses;
    const corporateTax = profit > 0 ? profit * 0.21 : 0; // 21% корпоративний податок

    return (
      <>
        {/* Quick Tax Calculator для SRO */}
        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Calculator className="w-5 h-5 text-blue-400 mr-2" />
            <span className="font-medium text-white">{language === 'cs' ? 'Rychlý výpočet daní - Firma' : 'Швидкий розрахунок податків - Фірма'}</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="text-center">
              <div className="text-gray-400 text-xs">{language === 'cs' ? 'Korporátní daň (2025)' : 'Корпоративний податок (2025)'}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 rounded p-2">
                <div className="text-gray-400 text-xs">{language === 'cs' ? 'Obrat' : 'Оборот'}</div>
                <div className="text-white font-bold">{totalIncome.toLocaleString()} Kč</div>
              </div>
              <div className="bg-black/20 rounded p-2">
                <div className="text-gray-400 text-xs">{language === 'cs' ? 'Náklady (70%)' : 'Витрати (70%)'}</div>
                <div className="text-orange-400 font-bold">{defaultExpenses.toLocaleString()} Kč</div>
                <div className="text-gray-500 text-xs flex items-center mt-1">
                  <span className="mr-1">ℹ️</span>
                  {language === 'cs' ? 'Zadejte reálné náklady' : 'Введіть реальні витрати'}
                </div>
              </div>
              <div className="bg-black/20 rounded p-2">
                <div className="text-gray-400 text-xs">{language === 'cs' ? 'Zisk před zdaněním' : 'Прибуток до оподаткування'}</div>
                <div className="text-blue-400 font-bold">{profit.toLocaleString()} Kč</div>
              </div>
              <div className="bg-black/20 rounded p-2">
                <div className="text-gray-400 text-xs">{language === 'cs' ? 'Korporátní daň (21%)' : 'Корпоративний податок (21%)'}</div>
                <div className="text-green-400 font-bold">{corporateTax.toLocaleString()} Kč</div>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded p-2 text-xs text-gray-300">
              ℹ️ {language === 'cs' ? 'Sociální a zdravotní pojištění se platí ze mzdy zaměstnanců/jednatele.' : 'Соціальне та медичне страхування сплачується із зарплати співробітників/директора.'}
            </div>
          </div>
        </div>
      </>
    );
  };



  // Rychlé akce
  const quickActions: QuickAction[] = [
    {
      id: 'tax_calculation',
      label: { cs: 'Kolik daní zaplatím?', uk: 'Скільки податків сплачу?' },
      icon: Calculator,
      action: 'calculate_taxes',
      category: 'tax'
    },
    {
      id: 'create_invoice',
      label: { cs: 'Vytvořit fakturu', uk: 'Створити рахунок' },
      icon: FileText,
      action: 'create_invoice',
      category: 'invoice'
    },
    {
      id: 'check_limits',
      label: { cs: 'Zkontrolovat limity', uk: 'Перевірити ліміти' },
      icon: TrendingUp,
      action: 'check_limits',
      category: 'analysis'
    },
    {
      id: 'tax_calendar',
      label: { cs: 'Daňový kalendář', uk: 'Податковий календар' },
      icon: Calendar,
      action: 'tax_calendar',
      category: 'tax'
    },
    {
      id: 'client_analysis',
      label: { cs: 'Analýza klientů', uk: 'Аналіз клієнтів' },
      icon: Users,
      action: 'analyze_clients',
      category: 'analysis'
    },
    {
      id: 'vat_check',
      label: { cs: 'Kontrola IČ/DIČ', uk: 'Перевірка ІЧ/ДІЧ' },
      icon: Shield,
      action: 'validate_company',
      category: 'help'
    },
    {
      id: 'monthly_payments',
      label: { cs: 'Měsíční platby', uk: 'Місячні платежі' },
      icon: Clock,
      action: 'monthly_payments',
      category: 'tax'
    },
    {
      id: 'sro_comparison',
      label: { cs: 'ŽIVNOST vs s.r.o.', uk: 'ŽIVNOST vs s.r.o.' },
      icon: Building,
      action: 'sro_comparison',
      category: 'analysis'
    },
    {
      id: 'expense_tips',
      label: { cs: 'Tipy na výdaje', uk: 'Поради щодо витрат' },
      icon: Euro,
      action: 'expense_tips',
      category: 'help'
    },
    {
      id: 'vat_registration',
      label: { cs: 'Registrace DPH', uk: 'Реєстрація ПДВ' },
      icon: CheckCircle,
      action: 'vat_registration',
      category: 'help'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ініціалізація з аналізом користувача
  useEffect(() => {
    if (isExpanded && messages.length === 0) {
      const profile = analyzeUserProfile();
      const analysisMessage = generateProfileAnalysis(profile);
      
      const greetingMessage: Message = {
        id: '1',
        content: analysisMessage,
        role: 'assistant',
        timestamp: new Date(),
        type: 'info'
      };
      setMessages([greetingMessage]);
    }
  }, [isExpanded, messages.length, invoices.length]);

  const generateProfileAnalysis = (profile: UserProfile): string => {
    const riskLevel = profile.annualLimit > 0 ? profile.currentTurnover / profile.annualLimit : 0;
    const vatRisk = profile.currentTurnover / profile.vatLimit;
    
    // Функція для отримання назви типу підприємства
    const getBusinessTypeName = (type: string, lang: 'cs' | 'uk'): string => {
      // Перевіряємо, чи це нова детальна назва
      if (type.includes('Společnost s ručením omezeným')) {
        return lang === 'cs' ? 'Společnost s ručením omezeným (s.r.o.)' : 'Товариство з обмеженою відповідальністю (s.r.o.)';
      } else if (type.includes('Akciová společnost')) {
        return lang === 'cs' ? 'Akciová společnost (a.s.)' : 'Акціонерне товариство (a.s.)';
      } else if (type.includes('Veřejná obchodní společnost')) {
        return lang === 'cs' ? 'Veřejná obchodní společnost (v.o.s.)' : 'Публічне торгове товариство (v.o.s.)';
      } else if (type.includes('Komanditní společnost')) {
        return lang === 'cs' ? 'Komanditní společnost (k.s.)' : 'Командитне товариство (k.s.)';
      } else if (type.includes('Družstvo')) {
        return lang === 'cs' ? 'Družstvo' : 'Кооператив';
      } else if (type.includes('OSVČ') || type.includes('Živnostník')) {
        return lang === 'cs' ? 'OSVČ (Živnostník)' : 'ОСВЧ (Živnostník)';
      }
      
      // Fallback для старих типів
      switch (type) {
        case 'zivnost':
          return lang === 'cs' ? 'Živnostník (OSVČ)' : 'Živnostník (ОСВЧ)';
        case 'sro':
          return lang === 'cs' ? 'Společnost s.r.o.' : 'Товариство з обмеженою відповідальністю';
        case 'osvc':
          return lang === 'cs' ? 'Osoba samostatně výdělečně činná' : 'Особа, що самостійно заробляє';
        case 'other':
          return lang === 'cs' ? 'Jiný typ podnikání' : 'Інший тип підприємництва';
        default:
          return lang === 'cs' ? type || 'Neznámý typ' : type || 'Невідомий тип';
      }
    };
    
    let analysis = '';
    
    if (language === 'cs') {
      analysis = `Zdravím! Analyzoval jsem váš profil:\n\n`;
      analysis += `📊 Typ podnikání: ${getBusinessTypeName(profile.businessType, 'cs')}\n`;
      analysis += `💰 Roční obrat: ${profile.currentTurnover.toLocaleString()} Kč\n`;
      
      if (profile.annualLimit > 0) {
        analysis += `📈 Využití limitu: ${(riskLevel * 100).toFixed(1)}%\n`;
      }
      
      analysis += `\n`;
      
      if (riskLevel > 0.8 && profile.annualLimit > 0) {
        analysis += `⚠️ POZOR: Blížíte se k ročnímu limitu!\n`;
      }
      
      if (vatRisk > 0.8 && !profile.isVatPayer) {
        analysis += `🚨 UPOZORNĚNÍ: Blížíte se k DPH limitu!\n`;
      }
      
      analysis += `\nJak vám mohu pomoci?`;
    } else {
      analysis = `Привіт! Проаналізував ваш профіль:\n\n`;
      analysis += `📊 Тип підприємництва: ${getBusinessTypeName(profile.businessType, 'uk')}\n`;
      analysis += `💰 Річний оборот: ${profile.currentTurnover.toLocaleString()} крон\n`;
      
      if (profile.annualLimit > 0) {
        analysis += `📈 Використання ліміту: ${(riskLevel * 100).toFixed(1)}%\n`;
      }
      
      analysis += `\n`;
      
      if (riskLevel > 0.8 && profile.annualLimit > 0) {
        analysis += `⚠️ УВАГА: Наближення до річного ліміту!\n`;
      }
      
      if (vatRisk > 0.8 && !profile.isVatPayer) {
        analysis += `🚨 ПОПЕРЕДЖЕННЯ: Наближення до ПДВ ліміту!\n`;
      }
      
      analysis += `\nЯк можу допомогти?`;
    }
    
    return analysis;
  };

  // Покращений системний промпт з аналізом
  const systemPrompt = `Jste FaktiX AI - expertní účetní asistent specializovaný na české a ukrajinské daňové zákonodárství.

PROFIL UŽIVATELE:
- Typ podnikání: ${userProfile.businessType}
- Roční obrat: ${userProfile.currentTurnover} Kč
- DPH plátce: ${userProfile.isVatPayer ? 'ANO' : 'NE'}
- Využití limitu: ${((userProfile.currentTurnover / userProfile.annualLimit) * 100).toFixed(1)}%

AKTUÁLNÍ STAV FAKTUR:
- Celkem faktur: ${invoices.length}
- Zaplacených: ${invoices.filter(inv => inv.status === 'paid').length}
- Nezaplacených: ${invoices.filter(inv => inv.status === 'sent').length}
- Prošlých: ${invoices.filter(inv => inv.status === 'overdue').length}

ZNALOSTI:
České daně 2025:
- DPH: základní 21%, snížená 12%, 10%
- Daň z příjmů FO: 15% + 7% solidární daň nad 1,7M Kč
- Sociální pojištění: 28% (zaměstnavatel) + 6,5% (zaměstnanec)
- Zdravotní pojištění: 9% (zaměstnavatel) + 4,5% (zaměstnanec)
- Limit pro DPH: 1 000 000 Kč ročně

Ukrajinské daně:
- ПДВ: 20%
- Податок на прибуток: 18%
- Військовий збір: 1,5%

VAŠE ÚKOLY:
1. Personalizované daňové poradenství
2. Analýza rizik a limitů
3. Kontrola správnosti faktur
4. Optimalizace daní
5. Validace IČ/DIČ přes ARES
6. Monitoring deadline

Odpovídejte VŽDY v jazyce dotazu (čeština/ukrajinština).
Buďte konkrétní, profesionální a osobní.
Používejte emoji pro lepší vizuál.`;

  const handleQuickAction = async (actionId: string) => {
    let response = '';
    
    switch (actionId) {
      case 'calculate_taxes':
        const taxes = calculateTaxes();
        response = taxes;
        break;
      case 'check_limits':
        response = checkLimits();
        break;
      case 'tax_calendar':
        response = getTaxCalendar();
        break;
      case 'analyze_clients':
        response = analyzeClients();
        break;
      case 'create_invoice':
        // Відкриваємо модальне вікно
        setIsInvoiceModalOpen(true);
        response = language === 'cs' 
          ? '✅ Otevírám formulář pro vytvoření faktury...'
          : '✅ Відкриваю форму створення рахунку...';
        break;
      case 'validate_company':
        response = language === 'cs'
          ? '🔍 Pro kontrolu firmy zadejte IČ (8 číslic) nebo název firmy.\n\nPříklad:\n• IČ: 12345678\n• Název: "ACME s.r.o."\n\nNapište mi IČ nebo název a já zkontroluju údaje v ARES databázi.'
          : '🔍 Для перевірки фірми введіть ІЧ (8 цифр) або назву фірми.\n\nПриклад:\n• ІЧ: 12345678\n• Назва: "ACME s.r.o."\n\nНапишіть мені ІЧ або назву і я перевірю дані в базі ARES.';
        break;
      case 'monthly_payments':
        response = getMonthlyPaymentSchedule();
        break;
      case 'sro_comparison':
        response = getSroComparison();
        break;
      case 'expense_tips':
        response = getExpenseTips();
        break;
      case 'vat_registration':
        response = getVatRegistrationInfo();
        break;
      default:
        response = language === 'cs' ? 'Funkce v přípravě...' : 'Функція в розробці...';
    }

    const actionMessage: Message = {
      id: Date.now().toString(),
      content: response,
      role: 'assistant',
      timestamp: new Date(),
      type: actionId === 'create_invoice' ? 'success' : 'info'
    };

    setMessages(prev => [...prev, actionMessage]);
    
    // Переключаємося на чат для перегляду результату
    if (actionId !== 'create_invoice') {
      setActiveTab('chat');
    }
  };

  // Función para determinar el tipo de cálculo basado en el perfil
  const calculateTaxes = (): string => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const totalIncome = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    
    // Elegir el cálculo correcto basado en el tipo de negocio
    if (userProfile.businessType === 'sro') {
      return calculateSROTaxes(totalIncome);
    } else {
      return calculateOSVCTaxes(totalIncome);
    }
  };

  // SRO Tax Calculation (Corporate Tax)
  const calculateSROTaxes = (totalIncome: number): string => {
    if (totalIncome <= 0) {
      return language === 'cs' 
        ? 'Zadejte obrat pro výpočet daní.' 
        : 'Введіть оборот для розрахунку податків.';
    }

    // Pro SRO se platí pouze korporátní daň z ZISKU (příjmy - výdaje)
    // Sociální a zdravotní pojištění se platí ze mzdy zaměstnanců/jednatele
    
    // Předpokládáme průměrné výdaje 70% pro SRO (lze upravit)
    const expenses = totalIncome * 0.7;
    const profit = totalIncome - expenses;
    
    // Korporátní daň 21% z zisku
    const corporateTax = profit * 0.21;
    
    const taxRate = profit > 0 ? ((corporateTax / totalIncome) * 100).toFixed(1) : '0.0';
    const profitMargin = profit > 0 ? ((profit / totalIncome) * 100).toFixed(1) : '0.0';
    
    return language === 'cs' 
      ? `💼 SRO - Daňový rozbor (2025):\n\n` +
        `📊 Celkový obrat: ${totalIncome.toLocaleString()} Kč\n` +
        `📉 Náklady (odhad 70%): ${expenses.toLocaleString()} Kč\n` +
        `💰 Zisk před zdaněním: ${profit.toLocaleString()} Kč (${profitMargin}%)\n\n` +
        `🏢 Daň z příjmů PO (21%): ${corporateTax.toLocaleString()} Kč\n` +
        `📈 Efektivní daňová sazba: ${taxRate}% z obratu\n\n` +
        `ℹ️ POZNÁMKA:\n` +
        `• Sociální pojištění: placeno ze mzdy jednatele/zaměstnanců\n` +
        `• Zdravotní pojištění: placeno ze mzdy jednatele/zaměstnanců\n` +
        `• Pro přesnější výpočet zadejte skutečné náklady\n\n` +
        `💡 TIP: Optimalizujte náklady pro snížení daňové povinnosti`
      : `💼 ТОВ - Податковий аналіз (2025):\n\n` +
        `📊 Загальний оборот: ${totalIncome.toLocaleString()} крон\n` +
        `📉 Витрати (оцінка 70%): ${expenses.toLocaleString()} крон\n` +
        `💰 Прибуток до оподаткування: ${profit.toLocaleString()} крон (${profitMargin}%)\n\n` +
        `🏢 Податок на прибуток підприємств (21%): ${corporateTax.toLocaleString()} крон\n` +
        `📈 Ефективна податкова ставка: ${taxRate}% з обороту\n\n` +
        `ℹ️ ПРИМІТКА:\n` +
        `• Соціальне страхування: сплачується із зарплати директора/співробітників\n` +
        `• Медичне страхування: сплачується із зарплати директора/співробітників\n` +
        `• Для точнішого розрахунку введіть реальні витрати\n\n` +
        `💡 ПОРАДА: Оптимізуйте витрати для зменшення податкового навантаження`;
  };

  // OSVČ Tax Calculation - Updated with new tax config
  const calculateOSVCTaxes = (totalIncome: number): string => {
    if (totalIncome <= 0) {
      return language === 'cs' 
        ? 'Zadejte příjem pro výpočet.' 
        : 'Введіть прибуток для розрахунку.';
    }
    
    // Use new tax configuration
    const taxCalculation = calculateTotalTax(totalIncome);
    
    // Monthly payments calculation
    const min_socialni_mesicne = TAX_CONFIG_2025.SOCIAL_INSURANCE_MIN_ANNUAL_BASE / 12;
    const min_zdravotni_mesicne = TAX_CONFIG_2025.HEALTH_INSURANCE_MIN_ANNUAL_BASE / 12;
    
    const socialni_mesicne_vypoct = taxCalculation.socialInsurance / 12;
    const zdravotni_mesicne_vypoct = taxCalculation.healthInsurance / 12;
    
    const final_socialni_mesicne = Math.max(socialni_mesicne_vypoct, min_socialni_mesicne);
    const final_zdravotni_mesicne = Math.max(zdravotni_mesicne_vypoct, min_zdravotni_mesicne);
    
    if (language === 'cs') {
      let result = `📊 SPRÁVNÝ VÝPOČET DANÍ PRO ŽIVNOST 2025:\n\n` +
        `💰 Celkový příjem: ${totalIncome.toLocaleString()} Kč\n` +
        `💼 Paušální výdaje (${(TAX_CONFIG_2025.LUMP_SUM_EXPENSE_RATE * 100)}%): ${(totalIncome * TAX_CONFIG_2025.LUMP_SUM_EXPENSE_RATE).toLocaleString()} Kč\n` +
        `💼 Základ daně: ${taxCalculation.taxBase.toLocaleString()} Kč\n\n` +
        `📋 ROZPIS DANÍ A POJISTNÉHO:\n`;
      
      // Daň z příjmů
      result += `• 💰 Daň z příjmů (${(TAX_CONFIG_2025.INCOME_TAX_RATE * 100)}%): ${taxCalculation.incomeTax.toLocaleString()} Kč\n`;
      result += `  💳 Sleva na poplatníka: ${TAX_CONFIG_2025.TAX_DISCOUNT_ANNUAL.toLocaleString()} Kč\n`;
      
      // Sociální pojištění s indikátorem minimální báze
      const socialIndicator = taxCalculation.socialUsesMinBase ? ' ⚠️ Uplatněn minimální vyměřovací základ' : '';
      result += `• 👥 Sociální pojištění (${(TAX_CONFIG_2025.SOCIAL_INSURANCE_RATE * 100)}%): ${taxCalculation.socialInsurance.toLocaleString()} Kč${socialIndicator}\n` +
        `  📋 Vyměřovací základ: ${(taxCalculation.socialInsurance / TAX_CONFIG_2025.SOCIAL_INSURANCE_RATE).toLocaleString()} Kč/rok\n` +
        `  💸 Měsíčně: ${final_socialni_mesicne.toLocaleString()} Kč (min. ${min_socialni_mesicne.toLocaleString()} Kč)\n`;
      
      // Zdravotní pojištění s indikátorem minimální báze
      const healthIndicator = taxCalculation.healthUsesMinBase ? ' ⚠️ Uplatněn minimální vyměřovací základ' : '';
      result += `• 🏥 Zdravotní pojištění (${(TAX_CONFIG_2025.HEALTH_INSURANCE_RATE * 100)}%): ${taxCalculation.healthInsurance.toLocaleString()} Kč${healthIndicator}\n` +
        `  📋 Vyměřovací základ: ${(taxCalculation.healthInsurance / TAX_CONFIG_2025.HEALTH_INSURANCE_RATE).toLocaleString()} Kč/rok\n` +
        `  💸 Měsíčně: ${final_zdravotni_mesicne.toLocaleString()} Kč (min. ${min_zdravotni_mesicne.toLocaleString()} Kč)\n\n` +
        `💸 CELKEM K ZAPLACENÍ: ${taxCalculation.total.toLocaleString()} Kč\n` +
        `📈 Efektivní sazba: ${((taxCalculation.total / totalIncome) * 100).toFixed(1)}% z příjmu\n\n` +
        `💡 SPRÁVNÉ MĚSÍČNÍ ZÁLOHY 2025:\n` +
        `• Sociální: ${final_socialni_mesicne.toLocaleString()} Kč (splatnost 20.)\n` +
        `• Zdravotní: ${final_zdravotni_mesicne.toLocaleString()} Kč (splatnost 8.)\n` +
        `• Daň (záloha): ${(taxCalculation.incomeTax / 12).toLocaleString()} Kč (splatnost 15.)\n\n` +
        `⚠️ MINIMÁLNÍ ZÁLOHY 2025:\n` +
        `📋 Sociální min.: ${min_socialni_mesicne.toLocaleString()} Kč/měs (${TAX_CONFIG_2025.SOCIAL_INSURANCE_MIN_ANNUAL_BASE.toLocaleString()} Kč/rok)\n` +
        `📋 Zdravotní min.: ${min_zdravotni_mesicne.toLocaleString()} Kč/měs (${TAX_CONFIG_2025.HEALTH_INSURANCE_MIN_ANNUAL_BASE.toLocaleString()} Kč/rok)`;
      
      return result;
    } else {
      let result = `📊 ПРАВИЛЬНИЙ РОЗРАХУНОК ПОДАТКІВ ДЛЯ ŽIVNOST 2025:\n\n` +
        `💰 Загальний прибуток: ${totalIncome.toLocaleString()} крон\n` +
        `💼 Паушальні витрати (${(TAX_CONFIG_2025.LUMP_SUM_EXPENSE_RATE * 100)}%): ${(totalIncome * TAX_CONFIG_2025.LUMP_SUM_EXPENSE_RATE).toLocaleString()} крон\n` +
        `💼 Податкова база: ${taxCalculation.taxBase.toLocaleString()} крон\n\n` +
        `📋 РОЗПИС ПОДАТКІВ ТА СТРАХУВАННЯ:\n`;
      
      // Daň z příjmů
      result += `• 💰 Податок з доходу (${(TAX_CONFIG_2025.INCOME_TAX_RATE * 100)}%): ${taxCalculation.incomeTax.toLocaleString()} крон\n`;
      result += `  💳 Знижка на платника: ${TAX_CONFIG_2025.TAX_DISCOUNT_ANNUAL.toLocaleString()} крон\n`;
      
      // Sociální pojištění s indikátorem minimální báze
      const socialIndicator = taxCalculation.socialUsesMinBase ? ' ⚠️ Застосовано мінімальну базу для розрахунку' : '';
      result += `• 👥 Соціальне страхування (${(TAX_CONFIG_2025.SOCIAL_INSURANCE_RATE * 100)}%): ${taxCalculation.socialInsurance.toLocaleString()} крон${socialIndicator}\n` +
        `  📋 Основа для нарахування: ${(taxCalculation.socialInsurance / TAX_CONFIG_2025.SOCIAL_INSURANCE_RATE).toLocaleString()} крон/рік\n` +
        `  💸 Щомісяця: ${final_socialni_mesicne.toLocaleString()} крон (мін. ${min_socialni_mesicne.toLocaleString()} крон)\n`;
      
      // Zdravotní pojištění s indikátorem minimální báze
      const healthIndicator = taxCalculation.healthUsesMinBase ? ' ⚠️ Застосовано мінімальну базу для розрахунку' : '';
      result += `• 🏥 Медичне страхування (${(TAX_CONFIG_2025.HEALTH_INSURANCE_RATE * 100)}%): ${taxCalculation.healthInsurance.toLocaleString()} крон${healthIndicator}\n` +
        `  📋 Основа для нарахування: ${(taxCalculation.healthInsurance / TAX_CONFIG_2025.HEALTH_INSURANCE_RATE).toLocaleString()} крон/рік\n` +
        `  💸 Щомісяця: ${final_zdravotni_mesicne.toLocaleString()} крон (мін. ${min_zdravotni_mesicne.toLocaleString()} крон)\n\n` +
        `💸 ВСЬОГО ДО СПЛАТИ: ${taxCalculation.total.toLocaleString()} крон\n` +
        `📈 Ефективна ставка: ${((taxCalculation.total / totalIncome) * 100).toFixed(1)}% від доходу\n\n` +
        `💡 ПРАВИЛЬНІ МІСЯЧНІ АВАНСИ 2025:\n` +
        `• Соціальне: ${final_socialni_mesicne.toLocaleString()} крон (термін 20.)\n` +
        `• Медичне: ${final_zdravotni_mesicne.toLocaleString()} крон (термін 8.)\n` +
        `• Податок (аванс): ${(taxCalculation.incomeTax / 12).toLocaleString()} крон (термін 15.)\n\n` +
        `⚠️ МІНІМАЛЬНІ АВАНСИ 2025:\n` +
        `📋 Соціальне мін.: ${min_socialni_mesicne.toLocaleString()} крон/міс (${TAX_CONFIG_2025.SOCIAL_INSURANCE_MIN_ANNUAL_BASE.toLocaleString()} крон/рік)\n` +
        `📋 Медичне мін.: ${min_zdravotni_mesicne.toLocaleString()} крон/міс (${TAX_CONFIG_2025.HEALTH_INSURANCE_MIN_ANNUAL_BASE.toLocaleString()} крон/рік)`;
      
      return result;
    }
  };

  const checkLimits = (): string => {
    const riskLevel = userProfile.currentTurnover / userProfile.annualLimit;
    const vatRisk = userProfile.currentTurnover / userProfile.vatLimit;
    
    if (language === 'cs') {
      let message = `📊 KONTROLA LIMITŮ:\n\n`;
      message += `📈 Roční obrat: ${userProfile.currentTurnover.toLocaleString()} / ${userProfile.annualLimit.toLocaleString()} Kč (${(riskLevel * 100).toFixed(1)}%)\n`;
      message += `🎯 DPH limit: ${userProfile.currentTurnover.toLocaleString()} / ${userProfile.vatLimit.toLocaleString()} Kč (${(vatRisk * 100).toFixed(1)}%)\n\n`;
      
      if (riskLevel > 0.9) {
        message += `🚨 KRITICKÉ: Překročíte roční limit!\n`;
      } else if (riskLevel > 0.8) {
        message += `⚠️ POZOR: Blížíte se k limitu!\n`;
      } else {
        message += `✅ Limity v pořádku\n`;
      }
      
      return message;
    } else {
      let message = `📊 ПЕРЕВІРКА ЛІМІТІВ:\n\n`;
      message += `📈 Річний оборот: ${userProfile.currentTurnover.toLocaleString()} / ${userProfile.annualLimit.toLocaleString()} крон (${(riskLevel * 100).toFixed(1)}%)\n`;
      message += `🎯 ПДВ ліміт: ${userProfile.currentTurnover.toLocaleString()} / ${userProfile.vatLimit.toLocaleString()} крон (${(vatRisk * 100).toFixed(1)}%)\n\n`;
      
      if (riskLevel > 0.9) {
        message += `🚨 КРИТИЧНО: Перевищите річний ліміт!\n`;
      } else if (riskLevel > 0.8) {
        message += `⚠️ УВАГА: Наближення до ліміту!\n`;
      } else {
        message += `✅ Ліміти в порядку\n`;
      }
      
      return message;
    }
  };

  const getTaxCalendar = (): string => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    
    if (language === 'cs') {
      return `📅 OFICIÁLNÍ DAŇOVÝ KALENDÁŘ 2025:\n\n` +
        `🗓️ Aktuální měsíc: ${currentMonth}\n\n` +
        `📋 KLÍČOVÉ TERMÍNY 2025:\n` +
        `• 10. ledna - Přihlášení k paušální dani\n` +
        `• 1. dubna - Daňové přiznání (papír)\n` +
        `• 2. května - Daňové přiznání (elektronicky)\n` +
        `• 1. července - Přes daňového poradce\n\n` +
        `💰 PAUŠÁLNÍ DAŇ - NOVÉ ČÁSTKY 2025:\n` +
        `• 1. pásmo (do 1M Kč): 8 716 Kč/měsíc\n` +
        `• 2. pásmo (1-1,5M): 16 745 Kč/měsíc\n` +
        `• 3. pásmo (1,5-2M): 27 139 Kč/měsíc\n` +
        `• Splatnost: do 20. každého měsíce\n\n` +
        `🏥 POJISTNÉ 2025 - VYŠŠÍ MINIMUM:\n` +
        `• Sociální (OSVČ): min. 4 759 Kč/měs (do 20.)\n` +
        `• Zdravotní (OSVČ): min. 3 143 Kč/měs (do 8.)\n\n` +
        `🧾 DPH 2025:\n` +
        `• Standardní: 21%, Snížená: 12%, Nulová: 0%\n` +
        `• Měsíční/čtvrtletní: do 25. následujícího měsíce\n\n` +
        `⚠️ ZMĚNY 2025: Progresivní daň 23% nad vyšší příjmy!`;
    } else {
      return `📅 ОФІЦІЙНИЙ ПОДАТКОВИЙ КАЛЕНДАР 2025:\n\n` +
        `🗓️ Поточний місяць: ${currentMonth}\n\n` +
        `📋 КЛЮЧОВІ ТЕРМІНИ 2025:\n` +
        `• 10 січня - Реєстрація паушального податку\n` +
        `• 1 квітня - Податкова декларація (папір)\n` +
        `• 2 травня - Податкова декларація (електронно)\n` +
        `• 1 липня - Через податкового консультанта\n\n` +
        `💰 ПАУШАЛЬНИЙ ПОДАТОК - НОВІ СУМИ 2025:\n` +
        `• 1 діапазон (до 1М крон): 8 716 крон/місяць\n` +
        `• 2 діапазон (1-1,5М): 16 745 крон/місяць\n` +
        `• 3 діапазон (1,5-2М): 27 139 крон/місяць\n` +
        `• Термін: до 20 кожного місяця\n\n` +
        `🏥 СТРАХУВАННЯ 2025 - ВИЩИЙ МІНІМУМ:\n` +
        `• Соціальне (OSVČ): мін. 4 759 крон/міс (до 20.)\n` +
        `• Медичне (OSVČ): мін. 3 143 крон/міс (до 8.)\n\n` +
        `🧾 ПДВ 2025:\n` +
        `• Базова: 21%, Знижена: 12%, Нульова: 0%\n` +
        `• Щомісячно/щоквартально: до 25 наступного місяця\n\n` +
        `⚠️ ЗМІНИ 2025: Прогресивний податок 23% для високих доходів!`;
    }
  };

  const analyzeClients = (): string => {
    const clientInvoices = new Map();
    
    invoices.forEach(inv => {
      if (!clientInvoices.has(inv.customer)) {
        clientInvoices.set(inv.customer, { count: 0, total: 0, paid: 0 });
      }
      const client = clientInvoices.get(inv.customer);
      client.count++;
      client.total += inv.total;
      if (inv.status === 'paid') {
        client.paid += inv.total;
      }
    });

    const topClients = Array.from(clientInvoices.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 3);

    if (language === 'cs') {
      let analysis = `👥 ANALÝZA KLIENTŮ:\n\n`;
      analysis += `📊 Celkem klientů: ${clientInvoices.size}\n\n`;
      analysis += `🏆 TOP 3 klienti:\n`;
      topClients.forEach(([name, data], index) => {
        analysis += `${index + 1}. ${name}\n`;
        analysis += `   💰 ${data.total.toLocaleString()} Kč (${data.count} faktur)\n`;
        analysis += `   ✅ Zaplaceno: ${data.paid.toLocaleString()} Kč\n\n`;
      });
      return analysis;
    } else {
      let analysis = `👥 АНАЛІЗ КЛІЄНТІВ:\n\n`;
      analysis += `📊 Всього клієнтів: ${clientInvoices.size}\n\n`;
      analysis += `🏆 ТОП 3 клієнти:\n`;
      topClients.forEach(([name, data], index) => {
        analysis += `${index + 1}. ${name}\n`;
        analysis += `   💰 ${data.total.toLocaleString()} крон (${data.count} рахунків)\n`;
        analysis += `   ✅ Сплачено: ${data.paid.toLocaleString()} крон\n\n`;
      });
      return analysis;
    }
  };

  const getMonthlyPaymentSchedule = (): string => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const totalIncome = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    
    // OFICIÁLNÍ MINIMÁLNÍ ZÁLOHY 2025 (dle posібника)
    const averageWage2025 = 46800;
    const monthlyIncome = totalIncome / 12;
    
    // Sociální pojištění - min. 35% průměrné mzdy 
    const monthlyMinSocial = averageWage2025 * 0.35; // 16,380 Kč
    const monthlyBaseSocial = Math.max(monthlyIncome * 0.55, monthlyMinSocial);
    const monthlySocial = monthlyBaseSocial * 0.292;
    
    // Zdravotní pojištění - min. 50% průměrné mzdy
    const monthlyMinHealth = averageWage2025 * 0.5; // 23,400 Kč
    const monthlyBaseHealth = Math.max(monthlyIncome * 0.5, monthlyMinHealth);
    const monthlyHealth = monthlyBaseHealth * 0.135;

    if (language === 'cs') {
      return `📅 OFICIÁLNÍ MĚSÍČNÍ ZÁLOHY 2025:\n\n` +
        `💼 NOVÉ MINIMÁLNÍ ZÁKLADY (výrazné zvýšení!):\n` +
        `• Sociální min.: ${monthlyMinSocial.toLocaleString()} Kč/měs (35% prům.mzdy)\n` +
        `• Zdravotní min.: ${monthlyMinHealth.toLocaleString()} Kč/měs (50% prům.mzdy)\n\n` +
        `📋 VAŠE AKTUÁLNÍ ZÁLOHY:\n` +
        `• 👥 Sociální pojištění: ${monthlySocial.toLocaleString()} Kč\n` +
        `  💼 Základ: ${monthlyBaseSocial.toLocaleString()} Kč/měs (55% příjmu vs min.)\n` +
        `  ⏰ Splatnost: 20. den v měsíci\n\n` +
        `• 🏥 Zdravotní pojištění: ${monthlyHealth.toLocaleString()} Kč\n` +
        `  💼 Základ: ${monthlyBaseHealth.toLocaleString()} Kč/měs (50% příjmu vs min.)\n` +
        `  ⏰ Splatnost: 8. den následujícího měsíce\n\n` +
        `⚠️ DŮLEŽITÉ: Minimální zálohy výrazně vzrostly v 2025!\n` +
        `📋 Oficiální částky: Sociální 4 759 Kč, Zdravotní 3 143 Kč\n` +
        `💡 TIP: Nastavte si automatické platby!`;
    } else {
      return `📅 ОФІЦІЙНІ МІСЯЧНІ АВАНСИ 2025:\n\n` +
        `💼 НОВІ МІНІМАЛЬНІ БАЗИ (значне збільшення!):\n` +
        `• Соціальне мін.: ${monthlyMinSocial.toLocaleString()} крон/міс (35% сер.зарплати)\n` +
        `• Медичне мін.: ${monthlyMinHealth.toLocaleString()} крон/міс (50% сер.зарплати)\n\n` +
        `📋 ВАШІ ПОТОЧНІ АВАНСИ:\n` +
        `• 👥 Соціальне страхування: ${monthlySocial.toLocaleString()} крон\n` +
        `  💼 База: ${monthlyBaseSocial.toLocaleString()} крон/міс (55% доходу vs мін.)\n` +
        `  ⏰ Термін: 20 число кожного місяця\n\n` +
        `• 🏥 Медичне страхування: ${monthlyHealth.toLocaleString()} крон\n` +
        `  💼 База: ${monthlyBaseHealth.toLocaleString()} крон/міс (50% доходу vs мін.)\n` +
        `  ⏰ Термін: 8 число наступного місяця\n\n` +
        `⚠️ ВАЖЛИВО: Мінімальні аванси значно зросли у 2025!\n` +
        `📋 Офіційні суми: Соціальне 4 759 крон, Медичне 3 143 крон\n` +
        `💡 ПОРАДА: Налаштуйте автоматичні платежі!`;
    }
  };

  const getSroComparison = (): string => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const totalIncome = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    
    // ŽIVNOST VÝPOČET 2025 (oficiální pravidla)
    const taxableIncomeZiv = totalIncome * 0.6; // 60% paušální výdaje
    
    // Progresivní zdanění 2025
    const averageWage2025 = 46800;
    const progressiveThreshold = averageWage2025 * 36 * 12; // 36-násobek ročně
    
    let incomeTaxZiv = 0;
    if (taxableIncomeZiv <= progressiveThreshold) {
      incomeTaxZiv = taxableIncomeZiv * 0.15; // 15% základní sazba
    } else {
      incomeTaxZiv = progressiveThreshold * 0.15 + (taxableIncomeZiv - progressiveThreshold) * 0.23; // 23% nad limit
    }
    
    // Nové minimální základy pojištění 2025
    const monthlyIncomeBaseZiv = totalIncome / 12;
    
    // Sociální - min. 35% průměrné mzdy
    const monthlyMinSocial = averageWage2025 * 0.35; // 16,380 Kč
    const monthlyBaseSocial = Math.max(monthlyIncomeBaseZiv * 0.55, monthlyMinSocial);
    const socialZiv = Math.min(monthlyBaseSocial * 12 * 0.292, 2234736 * 0.292);
    
    // Zdravotní - min. 50% průměrné mzdy  
    const monthlyMinHealth = averageWage2025 * 0.5; // 23,400 Kč
    const monthlyBaseHealth = Math.max(monthlyIncomeBaseZiv * 0.5, monthlyMinHealth);
    const healthZiv = monthlyBaseHealth * 12 * 0.135;
    
    const totalZiv = incomeTaxZiv + socialZiv + healthZiv;

    // s.r.o. VÝPOČET 2025 (zjednodušený)
    const corporateTax = totalIncome * 0.21; // 21% daň z příjmů právnických osob (nová sazba 2025)
    const minSalary = 200000; // minimální mzda majitele
    const salaryTax = minSalary * 0.15;
    const salarySocial = minSalary * 0.25;
    const salaryHealth = minSalary * 0.045;
    const totalSro = corporateTax + salaryTax + salarySocial + salaryHealth;

    if (language === 'cs') {
      return `⚖️ OFICIÁLNÍ POROVNÁNÍ 2025 - ŽIVNOST vs s.r.o.:\n\n` +
        `📊 Pro roční obrat ${totalIncome.toLocaleString()} Kč:\n\n` +
        `👤 ŽIVNOST 2025:\n` +
        `• Daň z příjmů (15%/23% progrese): ${incomeTaxZiv.toLocaleString()} Kč\n` +
        `• Sociální pojištění (35% min.): ${socialZiv.toLocaleString()} Kč\n` +
        `• Zdravotní pojištění (50% min.): ${healthZiv.toLocaleString()} Kč\n` +
        `💸 CELKEM: ${totalZiv.toLocaleString()} Kč\n\n` +
        `🏢 s.r.o. 2025:\n` +
        `• Daň z příjmů PO (21% NOVÁ): ${corporateTax.toLocaleString()} Kč\n` +
        `• Min. mzda majitele: ${(salaryTax + salarySocial + salaryHealth).toLocaleString()} Kč\n` +
        `💸 CELKEM: ${totalSro.toLocaleString()} Kč\n\n` +
        `📈 ROZDÍL: ${Math.abs(totalZiv - totalSro).toLocaleString()} Kč\n` +
        `${totalSro < totalZiv ? '✅ s.r.o. je výhodnější!' : '❌ ŽIVNOST je výhodnější!'}\n\n` +
        `⚠️ DŮLEŽITÉ ZMĚNY 2025:\n` +
        `• Progresivní daň 23% pro vyšší příjmy\n` +
        `• Vyšší minimální pojistné pro OSVČ\n` +
        `• Nová sazba daně PO: 21% (dříve 19%)\n` +
        `• s.r.o. má vyšší administrativu!`;
    } else {
      return `⚖️ ОФІЦІЙНЕ ПОРІВНЯННЯ 2025 - ŽIVNOST vs s.r.o.:\n\n` +
        `📊 Для річного обороту ${totalIncome.toLocaleString()} крон:\n\n` +
        `👤 ŽIVNOST 2025:\n` +
        `• Податок з доходу (15%/23% прогресія): ${incomeTaxZiv.toLocaleString()} крон\n` +
        `• Соціальне страхування (35% мін.): ${socialZiv.toLocaleString()} крон\n` +
        `• Медичне страхування (50% мін.): ${healthZiv.toLocaleString()} крон\n` +
        `💸 ВСЬОГО: ${totalZiv.toLocaleString()} крон\n\n` +
        `🏢 s.r.o. 2025:\n` +
        `• Податок з доходу ЮО (21% НОВА): ${corporateTax.toLocaleString()} крон\n` +
        `• Мін. зарплата власника: ${(salaryTax + salarySocial + salaryHealth).toLocaleString()} крон\n` +
        `💸 ВСЬОГО: ${totalSro.toLocaleString()} крон\n\n` +
        `📈 РІЗНИЦЯ: ${Math.abs(totalZiv - totalSro).toLocaleString()} крон\n` +
        `${totalSro < totalZiv ? '✅ s.r.o. вигідніше!' : '❌ ŽIVNOST вигідніше!'}\n\n` +
        `⚠️ ВАЖЛИВІ ЗМІНИ 2025:\n` +
        `• Прогресивний податок 23% для високих доходів\n` +
        `• Вище мінімальне страхування для OSVČ\n` +
        `• Нова ставка податку ЮО: 21% (раніше 19%)\n` +
        `• s.r.o. має більше адміністрації!`;
    }
  };

  const getExpenseTips = (): string => {
    if (language === 'cs') {
      return `💡 TIPY NA DAŇOVÉ VÝDAJE:\n\n` +
        `🏠 Kancelář doma:\n` +
        `• Až 80% nákladů na elektřinu, plyn, internet\n` +
        `• Poměrná část nájmu nebo úroků z hypotéky\n` +
        `• Kancelářské potřeby a nábytek\n\n` +
        `🚗 Doprava:\n` +
        `• Pohonné hmoty (při použití pro podnikání)\n` +
        `• Parkovné při cestách za klienty\n` +
        `• Veřejná doprava na služební cesty\n\n` +
        `📱 Technologie:\n` +
        `• Notebook, telefon, software\n` +
        `• Internet, telefonní tarify\n` +
        `• Cloudové služby, hosting\n\n` +
        `📚 Vzdělávání:\n` +
        `• Kurzy, certifikace\n` +
        `• Odborná literatura\n` +
        `• Konference, networking akce\n\n` +
        `⚠️ Vždy si nechte fakturu a dokažte souvislost s podnikáním!`;
    } else {
      return `💡 ПОРАДИ ЩОДО ПОДАТКОВИХ ВИТРАТ:\n\n` +
        `🏠 Офіс вдома:\n` +
        `• До 80% витрат на електрику, газ, інтернет\n` +
        `• Пропорційна частина оренди або відсотків по іпотеці\n` +
        `• Офісне обладнання та меблі\n\n` +
        `🚗 Транспорт:\n` +
        `• Паливо (при використанні для бізнесу)\n` +
        `• Паркування при поїздках до клієнтів\n` +
        `• Громадський транспорт на службових поїздках\n\n` +
        `📱 Технології:\n` +
        `• Ноутбук, телефон, програмне забезпечення\n` +
        `• Інтернет, телефонні тарифи\n` +
        `• Хмарні сервіси, хостинг\n\n` +
        `📚 Освіта:\n` +
        `• Курси, сертифікації\n` +
        `• Професійна література\n` +
        `• Конференції, networking заходи\n\n` +
        `⚠️ Завжди зберігайте чеки та доводьте зв'язок з бізнесом!`;
    }
  };

  const getVatRegistrationInfo = (): string => {
    const currentTurnover = userProfile.currentTurnover;
    const vatLimit = userProfile.vatLimit;
    const percentageUsed = (currentTurnover / vatLimit) * 100;

    if (language === 'cs') {
      return `🧾 OFICIÁLNÍ PRAVIDLA DPH 2025:\n\n` +
        `📊 Váš současný stav:\n` +
        `• Obrat: ${currentTurnover.toLocaleString()} Kč\n` +
        `• Povinný limit: 2 000 000 Kč (kalendářní rok)\n` +
        `• Využito: ${percentageUsed.toFixed(1)}% limitu\n\n` +
        `📋 NOVÉ SAZBY DPH 2025:\n` +
        `• Základní sazba: 21% (většina zboží/služeb)\n` +
        `• Snížená sazba: 12% (potraviny, doprava, knihy)\n` +
        `• Nulová sazba: 0% (zdravotnictví, vzdělání)\n\n` +
        `⚡ REGISTRACE:\n` +
        `• Povinně: při překročení 2M Kč za kalendářní rok\n` +
        `• Dobrovolně: kdykoli (výhodné při B2B)\n` +
        `• Nový limit pro rychlou registraci: 2 536 500 Kč\n` +
        `• Lhůta: do 15 dnů od překročení\n\n` +
        `📋 ČTVRTLETNÍ HLÁŠENÍ 2025:\n` +
        `• Nový limit: do 15M Kč obratu (dříve 10M)\n` +
        `• Měsíční/čtvrtletní podle obratu\n\n` +
        `🇪🇺 NOVÝ REŽIM PRO MALÉ PODNIKY:\n` +
        `• EU firmy: osvobození v ČR do 2M Kč\n` +
        `• České firmy: osvobození v EU do 100k €\n` +
        `• Platí od 1.1.2025`;
    } else {
      return `🧾 ОФІЦІЙНІ ПРАВИЛА ПДВ 2025:\n\n` +
        `📊 Ваш поточний стан:\n` +
        `• Оборот: ${currentTurnover.toLocaleString()} крон\n` +
        `• Обов'язковий ліміт: 2 000 000 крон (календарний рік)\n` +
        `• Використано: ${percentageUsed.toFixed(1)}% ліміту\n\n` +
        `📋 НОВІ СТАВКИ ПДВ 2025:\n` +
        `• Базова ставка: 21% (більшість товарів/послуг)\n` +
        `• Знижена ставка: 12% (продукти, транспорт, книги)\n` +
        `• Нульова ставка: 0% (медицина, освіта)\n\n` +
        `⚡ РЕЄСТРАЦІЯ:\n` +
        `• Обов'язково: при перевищенні 2М крон за календарний рік\n` +
        `• Добровільно: будь-коли (вигідно при B2B)\n` +
        `• Новий ліміт швидкої реєстрації: 2 536 500 крон\n` +
        `• Термін: до 15 днів від перевищення\n\n` +
        `📋 КВАРТАЛЬНА ЗВІТНІСТЬ 2025:\n` +
        `• Новий ліміт: до 15М крон обороту (раніше 10М)\n` +
        `• Місячна/квартальна залежно від обороту\n\n` +
        `🇪🇺 НОВИЙ РЕЖИМ ДЛЯ МАЛИХ ПІДПРИЄМСТВ:\n` +
        `• ЄС фірми: звільнення в ЧР до 2М крон\n` +
        `• Чеські фірми: звільнення в ЄС до 100к €\n` +
        `• Діє з 1.01.2025`;
    }
  };

  // Функції для кнопок з основними питаннями
  const handleTaxObligations = (e: React.MouseEvent) => {
    e.preventDefault();
    sendMessage('Jaké jsou mé daňové povinnosti?');
  };
  const handleTaxDeadline = (e: React.MouseEvent) => {
    e.preventDefault();
    sendMessage('Kdy musím podat daňové přiznání?');
  };
  const handleCostOptimization = (e: React.MouseEvent) => {
    e.preventDefault();
    sendMessage('Jak optimalizovat náklady?');
  };
  const handleVatRegistration = (e: React.MouseEvent) => {
    e.preventDefault();
    sendMessage('Potřebuji registrovat DPH?');
  };
  const handleMonthlyPayments = (e: React.MouseEvent) => {
    e.preventDefault();
    sendMessage('Jaké jsou mé měsíční platby?');
  };

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || inputValue.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = messageToSend;
    if (!customMessage) {
      setInputValue('');
    }
    setIsLoading(true);

    // Перевіряємо чи це запит на валідацію ІЧ
    const icoMatch = currentInput.match(/\b\d{8}\b/);
    const isCompanyQuery = currentInput.toLowerCase().includes('ič') || 
                          currentInput.toLowerCase().includes('іч') ||
                          currentInput.toLowerCase().includes('ares') ||
                          currentInput.toLowerCase().includes('firma') ||
                          currentInput.toLowerCase().includes('фірма') ||
                          icoMatch;

    if (isCompanyQuery && icoMatch) {
      // Обробляємо запит ARES + RŽP
      try {
        const ico = icoMatch[0];
        console.log('🔄 AI Assistant: Starting two-step search for IČO:', ico);
        
        // Крок 1: Отримуємо основні дані з ARES
        console.log('📡 AI Assistant: Step 1 - Fetching data from ARES...');
        const aresResult = await searchCompanyByICO(ico);
        
        let aresResponse = '';
        if (aresResult.success && aresResult.data) {
          const company = aresResult.data;
          console.log('✅ AI Assistant: ARES data received:', company.obchodniJmeno);
          
          // Крок 2: Отримуємо тип живності з Živnostenský rejstřík
          console.log('📡 AI Assistant: Step 2 - Fetching živnost data from RZP...');
          let typZivnosti = "Nedefinováno";
          
          try {
            const zivnostResult = await getZivnostType(company.ico);
            console.log('📊 AI Assistant: Živnost API response:', zivnostResult);
            
            if (zivnostResult.success && zivnostResult.data) {
              console.log('📋 AI Assistant: Raw živnost data:', zivnostResult.data);
              typZivnosti = determineZivnostType(zivnostResult.data);
              console.log('🎯 AI Assistant: Determined živnost type:', typZivnosti);
            } else {
              console.warn('⚠️ AI Assistant: Živnost data not found or error:', zivnostResult.error);
            }
          } catch (error) {
            console.error('❌ AI Assistant: Error fetching živnost data:', error);
            // Продовжуємо без типу живності
          }

          if (language === 'cs') {
            aresResponse = `🏢 INFORMACE O FIRMĚ:\n\n` +
              `📋 Název: ${company.obchodniJmeno}\n` +
              `🆔 IČ: ${formatICO(company.ico)}\n` +
              `💼 DIČ: ${company.dic || 'Neuvedeno'}\n` +
              `🏛️ Právní forma: ${company.pravniForma}\n` +
              `📍 Adresa: ${company.adresa.ulice} ${company.adresa.cisloOrientacni || ''}, ${company.adresa.mesto} ${company.adresa.psc}\n` +
              `🎯 Plátce DPH: ${company.platceDPH ? '✅ ANO' : '❌ NE'}\n` +
              `📅 Vznik: ${company.datumVzniku}\n` +
              `⚡ Stav: ${company.stavSubjektu}\n` +
              `🏷️ Typ živnosti: ${typZivnosti}\n\n` +
              `${company.platceDPH ? '✅ Firma je plátce DPH - můžete vystavit fakturu s DPH.' : '⚠️ Firma není plátce DPH - vystavte fakturu bez DPH.'}`;
          } else {
            aresResponse = `🏢 ІНФОРМАЦІЯ ПРО ФІРМУ:\n\n` +
              `📋 Назва: ${company.obchodniJmeno}\n` +
              `🆔 ІЧ: ${formatICO(company.ico)}\n` +
              `💼 ДІЧ: ${company.dic || 'Не вказано'}\n` +
              `🏛️ Правова форма: ${company.pravniForma}\n` +
              `📍 Адреса: ${company.adresa.ulice} ${company.adresa.cisloOrientacni || ''}, ${company.adresa.mesto} ${company.adresa.psc}\n` +
              `🎯 Платник ПДВ: ${company.platceDPH ? '✅ ТАК' : '❌ НІ'}\n` +
              `📅 Дата створення: ${company.datumVzniku}\n` +
              `⚡ Статус: ${company.stavSubjektu}\n` +
              `🏷️ Тип живності: ${typZivnosti}\n\n` +
              `${company.platceDPH ? '✅ Фірма є платником ПДВ - можете виставити рахунок з ПДВ.' : '⚠️ Фірма не є платником ПДВ - виставте рахунок без ПДВ.'}`;
          }
        } else {
          aresResponse = language === 'cs' 
            ? `❌ Firma s IČ ${ico} nebyla nalezena v databázi ARES.\n\nMožné příčiny:\n• Nesprávné IČ\n• Firma je zrušená\n• Problém s ARES databází`
            : `❌ Фірма з ІЧ ${ico} не знайдена в базі ARES.\n\nМожливі причини:\n• Неправильний ІЧ\n• Фірма ліквідована\n• Проблема з базою ARES`;
        }

        const aresMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aresResponse,
          role: 'assistant',
          timestamp: new Date(),
          type: aresResult.success ? 'success' : 'warning'
        };

        setMessages(prev => [...prev, aresMessage]);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('ARES Error:', error);
      }
    }

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-5).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: inputValue }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || t('ai.error');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t('ai.error'),
        role: 'assistant',
        timestamp: new Date(),
        type: 'warning'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
      <div className="fixed bottom-20 right-6 z-50">
      {/* Чарівна кнопка */}
      {!isExpanded && (
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsExpanded(true)}
        >
          {/* Головний контейнер, який тримає все разом */}
          <div className="ai-helper-container">
            {/* Це ваша існуюча кнопка з роботом */}
            <div className="robot-button">
              <div className="magic-icon-button">
                {/* Кольорові краплі всередині іконки */}
                <div className="icon-blob icon-blob1"></div>
                <div className="icon-blob icon-blob2"></div>
                <div className="icon-blob icon-blob3"></div>
                <div className="icon-blob icon-blob4"></div>

                {/* Іконка робота поверх кольорів */}
                <div className="icon-container">
                  <Bot className="w-15 h-15" style={{ strokeWidth: '0.8' }} />
            </div>
              </div>
              
              {/* Текст AI під іконкою - ВИНЕСЕНО ЗА МЕЖІ magic-icon-button */}
              <div className="ai-label-below">
                АІ
              </div>
            </div>

            {/* Мінімалістичне повідомлення з кнопкою закриття */}
            <div className="ai-message" id="aiSuggestionMessage">
              <div className="message-content">
                {/* Текст буде додаватися сюди динамічно через JavaScript */}
              </div>
              <button className="close-button" id="closeMessageButton" title="Закрити">Х</button>
            </div>
          </div>
          {/* Кінець коду чарівної кнопки */}

          {/* При наведенні показуємо наше повідомлення */}
          {isHovered && (
            <div className="ai-message visible" id="hoverMessage">
              <div className="message-content">
                <div className="ai-title">Jsem váš AI účetní asistent</div>
                <div className="ai-question">Potřebujete pomoci s daněmi nebo fakturami?</div>
              </div>
              <button className="close-button" onClick={() => setIsHovered(false)} title="Закрити">Х</button>
            </div>
          )}
        </div>
      )}

      {/* Expanded Smart Assistant Window */}
      {isExpanded && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="simple-green-header p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-white" />
              <div>
                <div className="font-bold text-white">{t('ai.title')}</div>
                <div className="text-xs text-white opacity-80">
                    Smart Accountant • {(() => {
                      switch (userProfile.businessType) {
                        case 'zivnost':
                          return language === 'cs' ? 'ŽIVNOSTNÍK' : 'ŽIVNOSTNÍK';
                        case 'sro':
                        return language === 'cs' ? 'FIRMA (a.s./s.r.o.)' : 'ФІРМА (a.s./s.r.o.)';
                        case 'osvc':
                          return language === 'cs' ? 'OSVČ' : 'ОСВЧ';
                        case 'other':
                          return language === 'cs' ? 'JINÝ TYP' : 'ІНШИЙ ТИП';
                        default:
                          return userProfile.businessType;
                      }
                    })()}
                  </div>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white/10 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-money border-b-2 border-money'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'actions'
                  ? 'text-money border-b-2 border-money'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚡ Akce
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'analysis'
                  ? 'text-money border-b-2 border-money'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📊 Analýza
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                          message.role === 'user'
                            ? 'bg-money text-black'
                            : message.type === 'warning'
                            ? 'bg-red-800/30 text-red-200 border border-red-700'
                            : message.type === 'success'
                            ? 'bg-green-800/30 text-green-200 border border-green-700'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        <div className="whitespace-pre-line">{message.content}</div>
                        <div className="text-xs mt-1 opacity-60">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Кнопки з основними питаннями - показуємо тільки якщо немає повідомлень */}
                  {messages.length === 0 && (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400 mb-3">
                        {language === 'cs' ? 'Možná vás zajímá:' : 'Можливо вас цікавить:'}
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={handleTaxObligations}
                          className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 hover:border-money"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-money">💰</span>
                            <span className="text-white text-sm">
                              {language === 'cs' ? 'Jaké jsou mé daňové povinnosti?' : 'Які мої податкові зобов\'язання?'}
                            </span>
                          </div>
                        </button>
                        
                        <button
                          onClick={handleTaxDeadline}
                          className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 hover:border-money"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-money">📅</span>
                            <span className="text-white text-sm">
                              {language === 'cs' ? 'Kdy musím podat daňové přiznání?' : 'Коли я повинен подати податкову декларацію?'}
                            </span>
                          </div>
                        </button>
                        
                        <button
                          onClick={handleCostOptimization}
                          className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 hover:border-money"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-money">📊</span>
                            <span className="text-white text-sm">
                              {language === 'cs' ? 'Jak optimalizovat náklady?' : 'Як оптимізувати витрати?'}
                            </span>
                          </div>
                        </button>
                        
                        <button
                          onClick={handleVatRegistration}
                          className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 hover:border-money"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-money">🏢</span>
                            <span className="text-white text-sm">
                              {language === 'cs' ? 'Potřebuji registrovat DPH?' : 'Чи потрібно реєструвати ПДВ?'}
                            </span>
                          </div>
                        </button>
                        
                        <button
                          onClick={handleMonthlyPayments}
                          className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 hover:border-money"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-money">💳</span>
                            <span className="text-white text-sm">
                              {language === 'cs' ? 'Jaké jsou mé měsíční platby?' : 'Які мої щомісячні платежі?'}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-white p-3 rounded-2xl flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{t('ai.thinking')}</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('ai.placeholder')}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-money"
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!inputValue.trim() || isLoading}
                      className="bg-money text-black p-2 rounded-lg hover:bg-money-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="p-4 space-y-3 overflow-y-auto h-full">
                <div className="text-sm text-gray-400 mb-4">
                  {language === 'cs' ? 'Rychlé akce:' : 'Швидкі дії:'}
                </div>
                
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-3"
                    >
                      <Icon className="w-5 h-5 text-money" />
                      <span className="text-white text-sm">
                        {action.label[language as 'cs' | 'uk']}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="p-4 space-y-4 overflow-y-auto h-full">
                {/* ГОЛОВНИЙ "ДИРИГЕНТ" - Стандартизований дашборд */}
                  {(() => {
                  // Використовуємо ЗАЛІЗНУ логіку вибору
                  if (userProfile.businessType === 'osvc') {
                    // Показуємо ІДЕАЛЬНИЙ дашборд для OSVČ
                    return renderOSVCDashboard();
                  } else if (userProfile.businessType === 'sro') {
                    // Показуємо ІДЕАЛЬНИЙ дашборд для S.R.O.
                    return renderSRODashboard();
                  } else {
                    // Показуємо повідомлення про помилку, якщо тип невідомий
                      return (
                      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
                        <div className="text-red-400 font-medium mb-2">
                          ⚠️ {language === 'cs' ? 'Neznámý typ podnikání' : 'Невідомий тип підприємництва'}
                          </div>
                        <div className="text-gray-300 text-sm">
                          {language === 'cs' 
                            ? 'Systém nemohl rozpoznat váš typ podnikání. Zkontrolujte nastavení v profilu.'
                            : 'Система не змогла розпізнати ваш тип підприємництва. Перевірте налаштування в профілі.'
                          }
                        </div>
                      </div>
                    );
                  }
                  })()}

                {/* Smart Tips */}
                <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="font-medium text-white">{language === 'cs' ? 'Chytrá rada' : 'Розумна порада'}</span>
                  </div>
                  {(() => {
                    const currentTurnover = userProfile.currentTurnover;
                    const vatLimit = userProfile.vatLimit;
                    const annualLimit = userProfile.annualLimit;
                    
                    // Різні поради для різних типів бізнесу
                    if (userProfile.businessType === 'osvc') {
                      // Поради для OSVČ
                    if (!userProfile.isVatPayer && currentTurnover > vatLimit * 0.9) {
                      return (
                        <div className="text-sm">
                          <div className="text-orange-400 font-medium mb-1">⚠️ {language === 'cs' ? 'Pozor na DPH limit 2025!' : 'Увага на ПДВ ліміт 2025!'}</div>
                          <div className="text-gray-300">{language === 'cs' ? 'Blížíte se k novému limitu 2M Kč. Připravte se na registraci k DPH a navýšení cen o 21%. Nové stawky: 21%/12%/0%.' : 'Наближаєтесь до нового ліміту 2М крон. Підготуйтеся до реєстрації ПДВ та підвищення цін на 21%. Нові ставки: 21%/12%/0%.'}</div>
                        </div>
                      );
                      } else if (currentTurnover > annualLimit * 0.9) {
                        return (
                          <div className="text-sm">
                            <div className="text-orange-400 font-medium mb-1">⚠️ {language === 'cs' ? 'Pozor na limit příjmů OSVČ!' : 'Увага на ліміт доходів ОСВЧ!'}</div>
                            <div className="text-gray-300">{language === 'cs' ? 'Blížíte se k limitu 2M Kč pro OSVČ. Nad limitem musíte přejít na účetnictví.' : 'Наближаєтесь до ліміту 2М крон для ОСВЧ. Понад лімітом ви повинні перейти на бухгалтерський облік.'}</div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-sm">
                            <div className="text-green-400 font-medium mb-1">💡 {language === 'cs' ? 'Tip pro OSVČ' : 'Порада для ОСВЧ'}</div>
                            <div className="text-gray-300">{language === 'cs' ? 'Pravidelně odvádějte zálohy na sociální a zdravotní pojištění. Sledujte své příjmy pro správný výpočet daní.' : 'Регулярно сплачуйте аванси на соціальне та медичне страхування. Відстежуйте свої доходи для правильного розрахунку податків.'}</div>
                        </div>
                      );
                    }
                    } else if (userProfile.businessType === 'sro') {
                      // Поради для SRO
                      if (!userProfile.isVatPayer && currentTurnover > vatLimit * 0.9) {
                      return (
                        <div className="text-sm">
                            <div className="text-orange-400 font-medium mb-1">⚠️ {language === 'cs' ? 'Pozor na DPH limit pro firmu!' : 'Увага на ПДВ ліміт для фірми!'}</div>
                            <div className="text-gray-300">{language === 'cs' ? 'Blížíte se k limitu 2M Kč. Firma musí být registrována k DPH. Nové stawky: 21%/12%/0%.' : 'Наближаєтесь до ліміту 2М крон. Фірма повинна бути зареєстрована для ПДВ. Нові ставки: 21%/12%/0%.'}</div>
                        </div>
                      );
                      } else {
                      return (
                        <div className="text-sm">
                            <div className="text-blue-400 font-medium mb-1">💡 {language === 'cs' ? 'Tip pro firmu' : 'Порада для фірми'}</div>
                            <div className="text-gray-300">{language === 'cs' ? 'Veděte si účetnictví a pravidelně kontrolujte náklady. Sociální a zdravotní pojištění se platí ze mzdy.' : 'Ведіть бухгалтерський облік і регулярно перевіряйте витрати. Соціальне та медичне страхування сплачується із зарплати.'}</div>
                        </div>
                      );
                      }
                    } else {
                      // Загальна порада для невідомих типів
                      return (
                        <div className="text-sm">
                          <div className="text-blue-400 font-medium mb-1">💡 {language === 'cs' ? 'Tip pro optimalizaci' : 'Порада для оптимізації'}</div>
                          <div className="text-gray-300">{language === 'cs' ? 'Pravidelně kontrolujte své příjmy a výdaje. Udržujte si přehled o daňových povinnostech.' : 'Регулярно перевіряйте свої доходи та витрати. Зберігайте контроль над податковими зобов\'язаннями.'}</div>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* Business Profile - Стандартизований для різних типів */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">📊 {language === 'cs' ? 'Profil podnikání' : 'Профіль підприємництва'}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === 'cs' ? 'Typ:' : 'Тип:'}</span>
                      <span className="text-white">{(() => {
                        switch (userProfile.businessType) {
                          case 'zivnost':
                            return language === 'cs' ? 'Živnostník' : 'Živnostník';
                          case 'sro':
                            return language === 'cs' ? 'Firma (a.s./s.r.o.)' : 'ФІРМА (a.s./s.r.o.)';
                          case 'osvc':
                            return language === 'cs' ? 'OSVČ' : 'ОСВЧ';
                          case 'other':
                            return language === 'cs' ? 'Jiný typ' : 'Інший тип';
                          default:
                            return userProfile.businessType;
                        }
                      })()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === 'cs' ? 'Roční obrat:' : 'Річний оборот:'}</span>
                      <span className="text-white">{userProfile.currentTurnover.toLocaleString()} Kč</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === 'cs' ? 'DPH plátce:' : 'Платник ПДВ:'}</span>
                      <span className="text-white">{userProfile.isVatPayer ? (language === 'cs' ? 'ANO' : 'ТАК') : (language === 'cs' ? 'NE' : 'НІ')}</span>
                    </div>
                  </div>
                </div>

                {/* Limits Analysis - Стандартизований для різних типів */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">📈 {language === 'cs' ? 'Limitní analýza' : 'Лімітний аналіз'}</h3>
                  <div className="space-y-3">
                    {userProfile.businessType === 'osvc' && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{language === 'cs' ? 'Roční limit (OSVČ)' : 'Річний ліміт (ОСВЧ)'}</span>
                        <span className="text-white">
                          {((userProfile.currentTurnover / userProfile.annualLimit) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-money h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((userProfile.currentTurnover / userProfile.annualLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {language === 'cs' ? 'Zbývá:' : 'Залишилось:'} {(userProfile.annualLimit - userProfile.currentTurnover).toLocaleString()} Kč
                      </div>
                    </div>
                    )}
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{language === 'cs' ? 'DPH limit' : 'ПДВ ліміт'}</span>
                        <span className="text-white">
                          {((userProfile.currentTurnover / userProfile.vatLimit) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((userProfile.currentTurnover / userProfile.vatLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {language === 'cs' ? 'Zbývá:' : 'Залишилось:'} {(userProfile.vatLimit - userProfile.currentTurnover).toLocaleString()} Kč
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Stats */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">📋 {language === 'cs' ? 'Stav faktur' : 'Стан рахунків'}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-2 bg-green-900/30 rounded">
                      <div className="text-green-400 font-bold">
                        {invoices.filter(inv => inv.status === 'paid').length}
                      </div>
                      <div className="text-gray-400">{language === 'cs' ? 'Zaplacené' : 'Сплачені'}</div>
                    </div>
                    <div className="text-center p-2 bg-orange-900/30 rounded">
                      <div className="text-orange-400 font-bold">
                        {invoices.filter(inv => inv.status === 'sent').length}
                      </div>
                      <div className="text-gray-400">{language === 'cs' ? 'Čekající' : 'Очікують'}</div>
                    </div>
                    <div className="text-center p-2 bg-red-900/30 rounded">
                      <div className="text-red-400 font-bold">
                        {invoices.filter(inv => inv.status === 'overdue').length}
                      </div>
                      <div className="text-gray-400">{language === 'cs' ? 'Prošlé' : 'Прострочені'}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-700/30 rounded">
                      <div className="text-gray-400 font-bold">
                        {invoices.filter(inv => inv.status === 'draft').length}
                      </div>
                      <div className="text-gray-400">{language === 'cs' ? 'Koncepty' : 'Чернетки'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* New Invoice Modal */}
      <NewInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </div>
  );
}