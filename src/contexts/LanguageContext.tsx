'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'cs' | 'uk';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  cs: {
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Přehled vašeho podnikání',
    'dashboard.newInvoice': 'Nová faktura',
    'dashboard.search': 'Hledat...',
    'dashboard.totalInvoices': 'Celkem faktur',
    'dashboard.unpaidInvoices': 'Nezaplacené',
    'dashboard.overdueInvoices': 'Po splatnosti',
    'dashboard.paidInvoices': 'Zaplacené',
    'dashboard.totalIncome': 'Celkový příjem',
    'dashboard.thisMonth': 'Tento měsíc',
    'dashboard.thisYear': 'Tento rok',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.invoices': 'Faktury',
    'nav.clients': 'Klienti',
    'nav.finance': 'Příjmy & Výdaje',
    'nav.profile': 'Profil',
    'nav.analytics': 'Analytiky',
    'nav.quotes': 'Cenové nabídky',
    'nav.settings': 'Nastavení',
    'nav.notifications': 'Notifikace',
    'nav.home': 'Hlavní stránka',
    'nav.functions': 'Funkce',
    'nav.pricing': 'Ceny',
    'nav.about': 'O nás',
    'nav.contact': 'Kontakt',
    'nav.login': 'Přihlásit se',
    'nav.signup': 'Registrovat se',
    
    // Hero section
    'hero.title.fast': 'Rychlá',
    'hero.title.for': 'pro moderní podnikatele',
    'hero.subtitle': 'Vytvořte profesionální fakturu za méně než minutu. Jednoduché, rychlé a spolehlivé.',
    'hero.cta.start': 'Začít zdarma',
    'hero.cta.demo': 'Ukázka',
    
    // Social proof
    'social.title.before': 'Důvěřuje nám již',
    'social.count': '1000',
    'social.title.after': 'spokojených podnikatelů',
    
    // Invoices
    'invoices.title': 'Faktury',
    'invoices.subtitle': 'Správa vašich faktur',
    'invoices.newInvoice': 'Nová faktura',
    'invoices.search': 'Hledat faktury...',
    'invoices.invoiceNumber': 'Číslo faktury',
    'invoices.customer': 'Zákazník',
    'invoices.date': 'Datum',
    'invoices.amount': 'Částka',
    'invoices.status': 'Stav',
    'invoices.actions': 'Akce',
    'invoices.draft': 'Koncept',
    'invoices.sent': 'Odesláno',
    'invoices.paid': 'Zaplaceno',
    'invoices.overdue': 'Po splatnosti',
    
    // Invoice Detail
    'invoice.detail': 'Detail faktury',
    'invoice.download': 'Stáhnout PDF',
    'invoice.send': 'Odeslat',
    'invoice.edit': 'Upravit',
    'invoice.delete': 'Smazat',
    'invoice.print': 'Tisk',
    'invoice.back': 'Zpět',
    
    // Forms
    'form.customer': 'Odběratel *',
    'form.invoiceNumber': 'Číslo faktury *',
    'form.issueDate': 'Datum vystavení *',
    'form.dueDate': 'Datum splatnosti',
    'form.items': 'Položky faktury *',
    'form.description': 'Popis',
    'form.quantity': 'Množství',
    'form.unitPrice': 'Jednotková cena',
    'form.total': 'Celkem',
    'form.addItem': 'Přidat položku',
    'form.removeItem': 'Odebrat položku',
    'form.save': 'Uložit',
    'form.cancel': 'Zrušit',
    
    // Client Modal
    'client.new': 'Nový klient',
    'client.name': 'Název firmy',
    'client.ico': 'IČO',
    'client.dic': 'DIČ',
    'client.address': 'Adresa',
    'client.city': 'Město',
    'client.zip': 'PSČ',
    'client.phone': 'Telefon',
    'client.email': 'Email',
    'client.website': 'Web',
    'client.save': 'Uložit klienta',
    'client.search': 'Vyhledat podle IČO',
    
    // Messages
    'message.invoiceCreated': 'Faktura byla úspěšně vytvořena',
    'message.invoiceSaved': 'Faktura byla uložena',
    'message.clientSaved': 'Klient byl uložen',
    'message.error': 'Došlo k chybě',
    'message.notFound': 'Faktura nebyla nalezena',
    'message.confirmDelete': 'Opravdu chcete smazat tuto fakturu?',
    
    // Validation
    'validation.required': 'Toto pole je povinné',
    'validation.invalidIco': 'Neplatné IČO',
    'validation.invalidEmail': 'Neplatný email',
    
    // Common
    'common.loading': 'Načítání...',
    'common.yes': 'Ano',
    'common.no': 'Ne',
    'common.ok': 'OK',
    'common.cancel': 'Zrušit',
    'common.close': 'Zavřít',
    'common.edit': 'Upravit',
    'common.delete': 'Smazat',
    'common.save': 'Uložit',
    'common.search': 'Hledat',
    'common.filter': 'Filtr',
    'common.sort': 'Seřadit',
    'common.export': 'Export',
    'common.import': 'Import',
    
    // Dashboard specific
    'dashboard.totalInvoicesCard': 'Celkem faktur',
    'dashboard.paidCard': 'Zaplacené', 
    'dashboard.unpaidCard': 'Nezaplacené',
    'dashboard.overdueCard': 'Po splatnosti',
    
    // Filters
    'filters.allStatuses': 'Všechny stavy',
    'filters.allClients': 'Všichni klienti',
    'filters.moreFilters': 'Více filtrů',
    
    // Table headers
    'table.invoiceNumber': 'Číslo faktury',
    'table.client': 'Klient',
    'table.date': 'Datum',
    'table.dueDate': 'Splatnost',
    'table.amount': 'Částka',
    'table.status': 'Status',
    'table.actions': 'Akce',
    
    // Status badges
    'status.paid': 'Zaplaceno',
    'status.sent': 'Odesláno',
    'status.overdue': 'Po splatnosti',
    'status.draft': 'Koncept',
    
    // Dashboard periods
    'period.week': 'Týden',
    'period.month': 'Měsíc', 
    'period.quarter': 'Kvartál',
    'period.year': 'Rok',
    'period.thisWeek': 'Tento týden',
    'period.thisYear': 'Tento rok',
    'period.fromLastWeek': 'od minulého týdne',
    'period.fromLastMonth': 'od minulého měsíce',
    'period.fromLastYear': 'od minulého roku',
    
    // Dashboard quick actions
    'dashboard.quickActions': 'Rychlé akce',
    'dashboard.createInvoice': 'Vytvořit fakturu',
    'dashboard.addClient': 'Přidat klienta',
    'dashboard.viewReports': 'Zobrazit reporty',
    'dashboard.settings': 'Nastavení',
    
    // Dropdown menu items
    'dropdown.new': 'Nová',
    'dropdown.newInvoice': 'Nová faktura',
    'dropdown.newClient': 'Nový klient',
    'dropdown.newQuote': 'Nová nabídka',
    'dropdown.newDocument': 'Nový dokument',
    'dropdown.newCalculation': 'Nová kalkulace',
    'dropdown.newReport': 'Nový report',
    
    // Dashboard stats
    'dashboard.recentInvoices': 'Nejnovější faktury',
    'dashboard.unpaidAmount': 'Nezaplacené faktury',
    'dashboard.income': 'Příjem',
    'dashboard.expenses': 'Výdaje',
    'dashboard.profit': 'Zisk',
    'dashboard.growth': 'Růst',
    
    // Action buttons
    'action.markAsPaid': 'Označit jako zaplacené',
    'action.markAsUnpaid': 'Označit jako nezaplacené',
    
    // AI Assistant
    'ai.title': 'FaktiX AI',
    'ai.subtitle': 'Účetní asistent',
    'ai.tooltip': 'Váš AI účetní asistent',
    'ai.placeholder': 'Zeptejte se na cokoliv...',
    'ai.thinking': 'Přemýšlím...',
    'ai.quickQuestions': 'Rychlé otázky:',
    'ai.greeting': 'Ahoj! Jsem FaktiX AI, váš chytrý účetní asistent. Mohu vám pomoci s daněmi, fakturami a české i ukrajinské legislativě. Co vás zajímá?',
    'ai.error': 'Omlouvám se, došlo k chybě. Zkuste to prosím znovu.',
    
    // Form labels
    'form.paymentMethod': 'Způsob platby',
    'form.bankTransfer': 'Převodem',
    'form.cash': 'Hotově',
    'form.card': 'Kartou',
    'form.language': 'Jazyk',
    'form.czech': 'Čeština',
    'form.ukrainian': 'Ukrajinština',
    'form.taxStatus': 'Nejsme plátci DPH',
    'form.country': 'Česká republika',
    'form.advance': 'Záloha',
    'form.advanceType': 'Fakturu zaplacenou',
    'form.footerText': 'Fyzická osoba zapsaná v živnostenském rejstříku.',
    
    // Dashboard cards text
    'dashboard.total': 'Celkem',
    'dashboard.totalInvoicesNumber': 'Celkem faktur',
    'dashboard.incomeGrowth': 'Příjem',
    'dashboard.totalProfit': 'Celkový zisk',
    'dashboard.newInvoices': 'Nové faktury',
    'dashboard.monthlyIncome': 'Měsíční příjmy',
    'dashboard.allTime': 'Za celou dobu',
    'dashboard.fromLastMonth': '+12% od minulého měsíce',
    'dashboard.businessAnalytics': 'Business Analytics',
    'dashboard.interactiveData': 'Interactive data visualization',
  },
  uk: {
    // Dashboard
    'dashboard.title': 'Панель керування',
    'dashboard.subtitle': 'Огляд вашого бізнесу',
    'dashboard.newInvoice': 'Новий рахунок',
    'dashboard.search': 'Пошук...',
    'dashboard.totalInvoices': 'Всього рахунків',
    'dashboard.unpaidInvoices': 'Неоплачені',
    'dashboard.overdueInvoices': 'Прострочені',
    'dashboard.paidInvoices': 'Оплачені',
    'dashboard.totalIncome': 'Загальний дохід',
    'dashboard.thisMonth': 'Цей місяць',
    'dashboard.thisYear': 'Цей рік',
    
    // Navigation
    'nav.dashboard': 'Панель керування',
    'nav.invoices': 'Рахунки',
    'nav.clients': 'Клієнти',
    'nav.finance': 'Доходи та витрати',
    'nav.profile': 'Профіль',
    'nav.analytics': 'Аналітика',
    'nav.quotes': 'Цінові пропозиції',
    'nav.settings': 'Налаштування',
    'nav.notifications': 'Сповіщення',
    'nav.home': 'Головна сторінка',
    'nav.functions': 'Функції',
    'nav.pricing': 'Ціни',
    'nav.about': 'Про нас',
    'nav.contact': 'Контакт',
    'nav.login': 'Увійти',
    'nav.signup': 'Зареєструватися',
    
    // Hero section
    'hero.title.fast': 'Швидке',
    'hero.title.for': 'для сучасних підприємців',
    'hero.subtitle': 'Створіть професійний рахунок менше ніж за хвилину. Просто, швидко та надійно.',
    'hero.cta.start': 'Почати безкоштовно',
    'hero.cta.demo': 'Демо',
    
    // Social proof
    'social.title.before': 'Нам довіряють вже',
    'social.count': '1000',
    'social.title.after': 'задоволених підприємців',
    
    // Invoices
    'invoices.title': 'Рахунки',
    'invoices.subtitle': 'Управління вашими рахунками',
    'invoices.newInvoice': 'Новий рахунок',
    'invoices.search': 'Пошук рахунків...',
    'invoices.invoiceNumber': 'Номер рахунку',
    'invoices.customer': 'Клієнт',
    'invoices.date': 'Дата',
    'invoices.amount': 'Сума',
    'invoices.status': 'Статус',
    'invoices.actions': 'Дії',
    'invoices.draft': 'Чернетка',
    'invoices.sent': 'Відправлено',
    'invoices.paid': 'Оплачено',
    'invoices.overdue': 'Прострочено',
    
    // Invoice Detail
    'invoice.detail': 'Деталі рахунку',
    'invoice.download': 'Завантажити PDF',
    'invoice.send': 'Відправити',
    'invoice.edit': 'Редагувати',
    'invoice.delete': 'Видалити',
    'invoice.print': 'Друк',
    'invoice.back': 'Назад',
    
    // Forms
    'form.customer': 'Отримувач *',
    'form.invoiceNumber': 'Номер рахунку *',
    'form.issueDate': 'Дата виставлення *',
    'form.dueDate': 'Дата сплати',
    'form.items': 'Позиції рахунку *',
    'form.description': 'Опис',
    'form.quantity': 'Кількість',
    'form.unitPrice': 'Ціна за одиницю',
    'form.total': 'Всього',
    'form.addItem': 'Додати позицію',
    'form.removeItem': 'Видалити позицію',
    'form.save': 'Зберегти',
    'form.cancel': 'Скасувати',
    
    // Client Modal
    'client.new': 'Новий клієнт',
    'client.name': 'Назва компанії',
    'client.ico': 'ІПН',
    'client.dic': 'ПДВ',
    'client.address': 'Адреса',
    'client.city': 'Місто',
    'client.zip': 'Поштовий індекс',
    'client.phone': 'Телефон',
    'client.email': 'Email',
    'client.website': 'Веб-сайт',
    'client.save': 'Зберегти клієнта',
    'client.search': 'Пошук за ІПН',
    
    // Messages
    'message.invoiceCreated': 'Рахунок успішно створено',
    'message.invoiceSaved': 'Рахунок збережено',
    'message.clientSaved': 'Клієнта збережено',
    'message.error': 'Сталася помилка',
    'message.notFound': 'Рахунок не знайдено',
    'message.confirmDelete': 'Дійсно видалити цей рахунок?',
    
    // Validation
    'validation.required': 'Це поле обов\'язкове',
    'validation.invalidIco': 'Невірний ІПН',
    'validation.invalidEmail': 'Невірний email',
    
    // Common
    'common.loading': 'Завантаження...',
    'common.yes': 'Так',
    'common.no': 'Ні',
    'common.ok': 'OK',
    'common.cancel': 'Скасувати',
    'common.close': 'Закрити',
    'common.edit': 'Редагувати',
    'common.delete': 'Видалити',
    'common.save': 'Зберегти',
    'common.search': 'Пошук',
    'common.filter': 'Фільтр',
    'common.sort': 'Сортування',
    'common.export': 'Експорт',
    'common.import': 'Імпорт',
    
    // Dashboard specific
    'dashboard.totalInvoicesCard': 'Всього рахунків',
    'dashboard.paidCard': 'Оплачені', 
    'dashboard.unpaidCard': 'Неоплачені',
    'dashboard.overdueCard': 'Прострочені',
    
    // Filters
    'filters.allStatuses': 'Всі статуси',
    'filters.allClients': 'Всі клієнти',
    'filters.moreFilters': 'Більше фільтрів',
    
    // Table headers
    'table.invoiceNumber': 'Номер рахунку',
    'table.client': 'Клієнт',
    'table.date': 'Дата',
    'table.dueDate': 'Сплата',
    'table.amount': 'Сума',
    'table.status': 'Статус',
    'table.actions': 'Дії',
    
    // Status badges
    'status.paid': 'Оплачено',
    'status.sent': 'Відправлено',
    'status.overdue': 'Прострочено',
    'status.draft': 'Чернетка',
    
    // Dashboard periods
    'period.week': 'Тиждень',
    'period.month': 'Місяць', 
    'period.quarter': 'Квартал',
    'period.year': 'Рік',
    'period.thisWeek': 'Цей тиждень',
    'period.thisYear': 'Цей рік',
    'period.fromLastWeek': 'від минулого тижня',
    'period.fromLastMonth': 'від минулого місяця',
    'period.fromLastYear': 'від минулого року',
    
    // Dashboard quick actions
    'dashboard.quickActions': 'Швидкі дії',
    'dashboard.createInvoice': 'Створити рахунок',
    'dashboard.addClient': 'Додати клієнта',
    'dashboard.viewReports': 'Переглянути звіти',
    'dashboard.settings': 'Налаштування',
    
    // Dropdown menu items
    'dropdown.new': 'Нова',
    'dropdown.newInvoice': 'Новий рахунок',
    'dropdown.newClient': 'Новий клієнт',
    'dropdown.newQuote': 'Нова пропозиція',
    'dropdown.newDocument': 'Новий документ',
    'dropdown.newCalculation': 'Новий розрахунок',
    'dropdown.newReport': 'Новий звіт',
    
    // Dashboard stats
    'dashboard.recentInvoices': 'Останні рахунки',
    'dashboard.unpaidAmount': 'Неоплачені рахунки',
    'dashboard.income': 'Дохід',
    'dashboard.expenses': 'Витрати',
    'dashboard.profit': 'Прибуток',
    'dashboard.growth': 'Зростання',
    
    // Action buttons
    'action.markAsPaid': 'Позначити як оплачене',
    'action.markAsUnpaid': 'Позначити як неоплачене',
    
    // AI Assistant
    'ai.title': 'FaktiX AI',
    'ai.subtitle': 'Помічник бухгалтера',
    'ai.tooltip': 'Ваш AI помічник бухгалтера',
    'ai.placeholder': 'Запитайте що завгодно...',
    'ai.thinking': 'Думаю...',
    'ai.quickQuestions': 'Швидкі питання:',
    'ai.greeting': 'Привіт! Я FaktiX AI, ваш розумний помічник бухгалтера. Можу допомогти з податками, рахунками та чеським і українським законодавством. Що вас цікавить?',
    'ai.error': 'Вибачте, сталася помилка. Спробуйте ще раз.',
    
    // Form labels
    'form.paymentMethod': 'Спосіб оплати',
    'form.bankTransfer': 'Переказом',
    'form.cash': 'Готівкою',
    'form.card': 'Карткою',
    'form.language': 'Мова',
    'form.czech': 'Чеська',
    'form.ukrainian': 'Українська',
    'form.taxStatus': 'Не є платниками ПДВ',
    'form.country': 'Чеська республіка',
    'form.advance': 'Аванс',
    'form.advanceType': 'Рахунок оплачений',
    'form.footerText': 'Фізична особа, зареєстрована в реєстрі підприємців.',
    
    // Dashboard cards text
    'dashboard.total': 'Всього',
    'dashboard.totalInvoicesNumber': 'Всього рахунків',
    'dashboard.incomeGrowth': 'Дохід',
    'dashboard.totalProfit': 'Загальний прибуток',
    'dashboard.newInvoices': 'Нові рахунки',
    'dashboard.monthlyIncome': 'Місячний дохід',
    'dashboard.allTime': 'За весь час',
    'dashboard.fromLastMonth': '+12% від минулого місяця',
    'dashboard.businessAnalytics': 'Бізнес-аналітика',
    'dashboard.interactiveData': 'Інтерактивна візуалізація даних',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'cs' }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (key: string): string => {
    if (!mounted) {
      return translations[defaultLanguage]?.[key] || key;
    }
    return translations[language]?.[key] || key;
  };

  // ⚡ ОПТИМІЗАЦІЯ: Мемоізація value щоб запобігти зайвим ре-рендерам
  const value: LanguageContextType = React.useMemo(() => ({
    language: mounted ? language : defaultLanguage,
    setLanguage,
    t,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [mounted, language, defaultLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 