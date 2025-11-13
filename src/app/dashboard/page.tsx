"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3,
  Users,
  FileText,
  Clock,
  Search,
  Bell,
  CheckCircle,
  DollarSign
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import WelcomeModal from "@/components/WelcomeModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInvoices } from "@/contexts/InvoiceContext";

export default function DashboardPage() {
  const [activePeriod, setActivePeriod] = useState('year');
  const [mounted, setMounted] = useState(false);
  const { invoices } = useInvoices();

  const { t } = useLanguage();
  
  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Compute live metrics from invoices
  const totalInvoices = invoices.length;
  const unpaidInvoices = invoices.filter(inv => inv.status !== 'paid').length;
  const unpaidAmount = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)
    .toLocaleString('cs-CZ') + ' Kč';
  // Čekající na úhradu: odeslané faktury před datem splatnosti
  const pendingInvoices = invoices.filter(inv => {
    const isSent = inv.status === 'sent';
    const due = new Date(inv.dueDate).getTime();
    const now = new Date();
    now.setHours(0,0,0,0);
    return isSent && due >= now.getTime();
  }).length;
  const monthlyIncomeNumber = invoices
    .filter(inv => inv.status === 'paid')
    .filter(inv => {
      const d = new Date(inv.date);
      const now = new Date();
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
  const monthlyIncome = monthlyIncomeNumber.toLocaleString('cs-CZ') + ' Kč';

  // Data for different periods (fallbacks use live metrics where relevant)
  const periodData: Record<string, {
    income: string;
    incomeChange: string;
    totalInvoices: number;
    unpaidInvoices: number;
    newInvoices: number;
    newInvoicesPeriod: string;
    unpaidAmount: string;
    chartData: Array<{
      day: string;
      income: number;
      unpaid: number;
      new: number;
      total: number;
    }>;
  }> = {
    week: {
      income: monthlyIncome,
      incomeChange: '+8% od minulého týdne',
      totalInvoices: totalInvoices,
      unpaidInvoices: unpaidInvoices,
      newInvoices: 8,
      newInvoicesPeriod: 'Tento týden',
      unpaidAmount: unpaidAmount,
      chartData: [
        { day: 'Po', income: 3500, unpaid: 1200, new: 2, total: 4700 },
        { day: 'Út', income: 4200, unpaid: 1100, new: 3, total: 5300 },
        { day: 'St', income: 3800, unpaid: 1300, new: 1, total: 5100 },
        { day: 'Čt', income: 4500, unpaid: 1000, new: 4, total: 5500 },
        { day: 'Pá', income: 5200, unpaid: 900, new: 2, total: 6100 },
        { day: 'So', income: 2800, unpaid: 800, new: 1, total: 3600 },
        { day: 'Ne', income: 1500, unpaid: 700, new: 0, total: 2200 }
      ]
    },
    month: {
      income: monthlyIncome,
      incomeChange: '+12% od minulého měsíce',
      totalInvoices: totalInvoices,
      unpaidInvoices: unpaidInvoices,
      newInvoices: 45,
      newInvoicesPeriod: 'Tento měsíc',
      unpaidAmount: unpaidAmount,
      chartData: [
        { day: '1', income: 3500, unpaid: 1200, new: 2, total: 4700 },
        { day: '2', income: 4200, unpaid: 1100, new: 3, total: 5300 },
        { day: '3', income: 3800, unpaid: 1300, new: 1, total: 5100 },
        { day: '4', income: 4500, unpaid: 1000, new: 4, total: 5500 },
        { day: '5', income: 5200, unpaid: 900, new: 2, total: 6100 },
        { day: '6', income: 4800, unpaid: 950, new: 3, total: 5750 },
        { day: '7', income: 3900, unpaid: 1100, new: 1, total: 5000 },
        { day: '8', income: 4100, unpaid: 1050, new: 2, total: 5150 },
        { day: '9', income: 4400, unpaid: 980, new: 4, total: 5380 },
        { day: '10', income: 4700, unpaid: 920, new: 3, total: 5620 },
        { day: '11', income: 5000, unpaid: 880, new: 2, total: 5880 },
        { day: '12', income: 5300, unpaid: 850, new: 5, total: 6150 },
        { day: '13', income: 5600, unpaid: 820, new: 3, total: 6420 },
        { day: '14', income: 5900, unpaid: 790, new: 4, total: 6690 },
        { day: '15', income: 6200, unpaid: 760, new: 2, total: 6960 },
        { day: '16', income: 6500, unpaid: 730, new: 3, total: 7230 },
        { day: '17', income: 6800, unpaid: 700, new: 5, total: 7500 },
        { day: '18', income: 7100, unpaid: 670, new: 2, total: 7770 },
        { day: '19', income: 7400, unpaid: 640, new: 4, total: 8040 },
        { day: '20', income: 7700, unpaid: 610, new: 3, total: 8310 },
        { day: '21', income: 8000, unpaid: 580, new: 2, total: 8580 },
        { day: '22', income: 8300, unpaid: 550, new: 5, total: 8850 },
        { day: '23', income: 8600, unpaid: 520, new: 3, total: 9120 },
        { day: '24', income: 8900, unpaid: 490, new: 4, total: 9390 },
        { day: '25', income: 9200, unpaid: 460, new: 2, total: 9660 },
        { day: '26', income: 9500, unpaid: 430, new: 3, total: 9930 },
        { day: '27', income: 9800, unpaid: 400, new: 5, total: 10200 },
        { day: '28', income: 10100, unpaid: 370, new: 2, total: 10470 },
        { day: '29', income: 10400, unpaid: 340, new: 4, total: 10740 },
        { day: '30', income: 10700, unpaid: 310, new: 3, total: 11010 }
      ]
    },
    quarter: {
      income: monthlyIncome,
      incomeChange: '+15% od minulého kvartálu',
      totalInvoices: totalInvoices,
      unpaidInvoices: unpaidInvoices,
      newInvoices: 180,
      newInvoicesPeriod: 'Tento kvartál',
      unpaidAmount: unpaidAmount,
      chartData: [
        { day: 'Led', income: 125500, unpaid: 45000, new: 45, total: 170500 },
        { day: 'Úno', income: 132000, unpaid: 42000, new: 52, total: 174000 },
        { day: 'Bře', income: 123000, unpaid: 48000, new: 38, total: 171000 }
      ]
    },
    year: {
      income: monthlyIncome,
      incomeChange: '+22% od minulého roku',
      totalInvoices: totalInvoices,
      unpaidInvoices: unpaidInvoices,
      newInvoices: 720,
      newInvoicesPeriod: 'Tento rok',
      unpaidAmount: unpaidAmount,
      chartData: [
        { day: 'Led', income: 125500, unpaid: 45000, new: 45, total: 170500 },
        { day: 'Úno', income: 132000, unpaid: 42000, new: 52, total: 174000 },
        { day: 'Bře', income: 123000, unpaid: 48000, new: 38, total: 171000 },
        { day: 'Dub', income: 118000, unpaid: 51000, new: 42, total: 169000 },
        { day: 'Kvě', income: 135000, unpaid: 39000, new: 58, total: 174000 },
        { day: 'Čvn', income: 142000, unpaid: 36000, new: 65, total: 178000 },
        { day: 'Čvc', income: 128000, unpaid: 44000, new: 48, total: 172000 },
        { day: 'Srp', income: 121000, unpaid: 47000, new: 41, total: 168000 },
        { day: 'Zář', income: 138000, unpaid: 38000, new: 62, total: 176000 },
        { day: 'Říj', income: 145000, unpaid: 35000, new: 69, total: 180000 },
        { day: 'Lis', income: 131000, unpaid: 43000, new: 51, total: 174000 },
        { day: 'Pro', income: 124000, unpaid: 46000, new: 44, total: 170000 }
      ]
    }
  };
  
  const currentData = periodData[activePeriod];
  
  
  // Format total invoices consistently
  const formattedTotalInvoices = mounted ? currentData.totalInvoices.toLocaleString() : '0';
  
  // Build yearly monthly chart from real invoices (paid) for current year
  const monthLabels = ['Led','Úno','Bře','Dub','Kvě','Čvn','Čvc','Srp','Zář','Říj','Lis','Pro'];
  const currentYear = new Date().getFullYear();
  const monthly = Array.from({ length: 12 }, (_, i) => ({
    label: monthLabels[i],
    income: 0,
    count: 0,
    lastDate: '' as string
  }));
  invoices
    .filter(inv => inv.status === 'paid')
    .forEach(inv => {
      const d = new Date(inv.date);
      if (d.getFullYear() === currentYear) {
        const m = d.getMonth();
        monthly[m].income += Number(inv.total) || 0;
        monthly[m].count += 1;
        monthly[m].lastDate = d.toLocaleDateString('cs-CZ');
      }
    });
  const maxIncome = Math.max(1, ...monthly.map(m => m.income));
  
  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Sidebar />
        <div className="ml-16 flex flex-col min-h-screen">
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-gray-400 mt-1">Přehled vašeho podnikání</p>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="text-center text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }
  
    return (
    <div className="min-h-screen bg-black text-white">
              <Sidebar />
              <WelcomeModal />
              <div className="ml-0 md:ml-16">

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - Компактніший для мобільних */}
        <div className="border-b border-gray-700 p-2 md:p-6 pl-14 lg:pl-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
            <div>
              <h1 className="text-lg md:text-2xl font-semibold">{t('dashboard.title')}</h1>
              <p className="text-[10px] md:text-sm text-gray-400 mt-0.5 md:mt-1">{t('dashboard.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
              
              {/* Search - Ховаємо на маленьких екранах */}
              <div className="relative flex-1 md:flex-initial hidden sm:block">
                <input
                  type="text"
                  placeholder={t('dashboard.search')}
                  className="minimal-input pl-10 pr-4 py-2 w-full md:w-64"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              
              {/* Notifications */}
              <button className="minimal-button p-2">
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 md:p-6">
          {/* Period Toggle Buttons */}
          <div className="flex items-center space-x-1.5 md:space-x-3 mb-3 md:mb-6 overflow-x-auto">
            <button
              onClick={() => setActivePeriod('week')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: activePeriod === 'week' ? '2px solid #4ade80' : '2px solid #4b5563',
                backgroundColor: 'black',
                color: activePeriod === 'week' ? '#4ade80' : 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {t('period.week')}
            </button>
            <button
              onClick={() => setActivePeriod('month')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: activePeriod === 'month' ? '2px solid #4ade80' : '2px solid #4b5563',
                backgroundColor: 'black',
                color: activePeriod === 'month' ? '#4ade80' : 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {t('period.month')}
            </button>
            <button
              onClick={() => setActivePeriod('quarter')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: activePeriod === 'quarter' ? '2px solid #4ade80' : '2px solid #4b5563',
                backgroundColor: 'black',
                color: activePeriod === 'quarter' ? '#4ade80' : 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {t('period.quarter')}
            </button>
            <button
              onClick={() => setActivePeriod('year')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: activePeriod === 'year' ? '2px solid #4ade80' : '2px solid #4b5563',
                backgroundColor: 'black',
                color: activePeriod === 'year' ? '#4ade80' : 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {t('period.year')}
            </button>
          </div>

          {/* Summary Cards - Супер компактні для мобільних */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-4 mb-3 md:mb-6">
            {/* Move GREEN card to the first position */}
            <div className="bg-gradient-to-br from-money/20 to-money/10 backdrop-blur-sm border-money-thick rounded-lg md:rounded-xl p-1.5 md:p-4">
              <div className="flex items-center justify-between mb-0.5">
                <div className="text-[10px] md:text-base text-white truncate">{t('dashboard.monthlyIncome')}</div>
                <DollarSign className="w-3 h-3 md:w-6 md:h-6 text-money flex-shrink-0" style={{ strokeWidth: 1 }} />
              </div>
              <div className="text-base md:text-3xl font-bold text-white truncate">{currentData.income}</div>
              <div className="text-[8px] md:text-xs text-money mt-0 font-medium truncate">{currentData.incomeChange}</div>
            </div>

            {/* Unpaid invoices card now second */}
            <div className="bg-gradient-to-br from-pink-300/30 to-rose-200/20 backdrop-blur-sm border border-pink-300 rounded-lg md:rounded-xl p-1.5 md:p-4">
              <div className="flex items-center justify-between mb-0.5">
                <div className="text-[10px] md:text-base text-white truncate">Nezaplaceno</div>
                <FileText className="w-3 h-3 md:w-6 md:h-6 text-pink-300 flex-shrink-0" style={{ strokeWidth: 1 }} />
              </div>
              <div className="text-base md:text-3xl font-bold text-white">{currentData.unpaidInvoices}</div>
              <div className="text-[8px] md:text-xs text-gray-300 mt-0 font-medium truncate">{currentData.unpaidAmount}</div>
            </div>

            {/* Pending invoices (before due date) */}
            <div className="bg-gradient-to-br from-sky-300/30 to-sky-200/20 backdrop-blur-sm rounded-lg md:rounded-xl p-1.5 md:p-4">
              <div className="flex items-center justify-between mb-0.5">
                <div className="text-[10px] md:text-base text-white truncate">Čekající</div>
                <Clock className="w-3 h-3 md:w-6 md:h-6 text-sky-300 flex-shrink-0" style={{ strokeWidth: 1 }} />
              </div>
              <div className="text-base md:text-3xl font-bold text-white">{pendingInvoices}</div>
              <div className="text-[8px] md:text-xs text-gray-300 mt-0 font-medium truncate">Před splatností</div>
            </div>

            {/* Total invoices */}
            <div className="bg-gradient-to-br from-blue-400/20 to-blue-400/10 backdrop-blur-sm border border-blue-400 rounded-lg md:rounded-xl p-1.5 md:p-4">
              <div className="flex items-center justify-between mb-0.5">
                <div className="text-[10px] md:text-base text-white truncate">Celkem</div>
                <FileText className="w-3 h-3 md:w-6 md:h-6 text-blue-400 flex-shrink-0" style={{ strokeWidth: 1 }} />
              </div>
              <div className="text-base md:text-3xl font-bold text-white">{formattedTotalInvoices}</div>
              <div className="text-[8px] md:text-xs text-gray-300 mt-0 font-medium truncate">{t('dashboard.allTime')}</div>
            </div>
          </div>

          {/* Sales Dynamic Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
            {/* Chart Section */}
            <div className="col-span-1 lg:col-span-3 bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">{t('dashboard.businessAnalytics')}</h3>
                  <p className="text-sm text-gray-400">{t('dashboard.interactiveData')}</p>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-xs text-money">
                    Monthly Income
                  </span>
                </div>
              </div>
              
              {/* Chart Container */}
              <div className="h-64 relative">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {(() => {
                    const steps = [maxIncome, Math.round(maxIncome * 0.75), Math.round(maxIncome * 0.5), Math.round(maxIncome * 0.25), 0];
                    return steps.map((value, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-xs text-gray-500 w-12">{value}K</span>
                        <div className="flex-1 h-px bg-gray-700/20 ml-3"></div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Simple Line Chart with Green Shadow - with single month labels */}
                <div className="absolute inset-0 flex items-end justify-between pl-16 pr-4 pb-8">
                  {monthly.map((m, index) => (
                    <div key={index} className="flex flex-col items-center relative group">
                      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 whitespace-nowrap shadow-xl">
                        <div className="text-xs text-white font-medium mb-1">{m.label}</div>
                        <div className="text-xs text-money">Příjem: {m.income.toLocaleString('cs-CZ')} Kč</div>
                        <div className="text-xs text-blue-300">Faktur: {m.count}</div>
                        {m.lastDate && <div className="text-xs text-gray-400">Poslední: {m.lastDate}</div>}
                      </div>
                      <div className="text-xs text-gray-400 mt-4 font-medium">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Line Chart with Green Shadow */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  {/* Green Shadow Area */}
                  <defs>
                    <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Line Path */}
                  <path
                    d={(() => {
                      const points = monthly.map((m, index) => {
                        const x = 64 + (index * 96);
                        const y = 200 - (m.income / maxIncome) * 150;
                        return `${x} ${y}`;
                      });
                      return `M ${points.join(' L ')}`;
                    })()}
                    stroke="#00ff88"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Shadow Area */}
                  <path
                    d={(() => {
                      const points = monthly.map((m, index) => {
                        const x = 64 + (index * 96);
                        const y = 200 - (m.income / maxIncome) * 150;
                        return `${x} ${y}`;
                      });
                      const lastPoint = points[points.length - 1];
                      const firstPoint = points[0];
                      return `M ${firstPoint} L ${points.join(' L ')} L ${lastPoint.split(' ')[0]} 200 L ${firstPoint.split(' ')[0]} 200 Z`;
                    })()}
                    fill="url(#shadowGradient)"
                  />
                  
                  {/* Simple Data Points (Dots) */}
                  {monthly.map((m, index) => {
                    const x = 64 + (index * 96);
                    const y = 200 - (m.income / maxIncome) * 150;
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#00ff88"
                        stroke="#000"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
              </div>
              
              {/* Chart Summary */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-lime-400 rounded-full"></div>
                    <span className="text-xs text-gray-400">Monthly Income</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-400">Unpaid Invoices</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-sky-400 rounded-full"></div>
                    <span className="text-xs text-gray-400">New Invoices</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                    <span className="text-xs text-gray-400">Total Invoices</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-money font-medium">+23%</span> vs last year
                </div>
              </div>
            </div>

            {/* Quick Actions Buttons - Compact Side Panel */}
            <div className="col-span-1 grid grid-cols-2 lg:flex lg:flex-col gap-3 md:gap-4 lg:h-[420px]">
              <div className="relative lg:flex-1">
                <button className="relative w-full bg-black border border-green-300 p-3 md:p-5 rounded-xl overflow-hidden flex items-center space-x-3 md:space-x-4 shadow-lg hover:shadow-xl h-full group">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-money relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm md:text-lg font-semibold text-white relative z-10">Nová faktura</span>
                </button>
              </div>
              <div className="relative lg:flex-1">
                <button className="relative w-full bg-black border border-green-300 p-3 md:p-5 rounded-xl overflow-hidden flex items-center space-x-3 md:space-x-4 shadow-lg hover:shadow-xl h-full group">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-money relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm md:text-lg font-semibold text-white relative z-10">Kalkulačka</span>
                </button>
              </div>
              <div className="relative lg:flex-1">
                <button className="relative w-full bg-black border border-green-300 p-3 md:p-5 rounded-xl overflow-hidden flex items-center space-x-3 md:space-x-4 shadow-lg hover:shadow-xl h-full group">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-money relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm md:text-lg font-semibold text-white relative z-10">Cenová nabídka</span>
                </button>
              </div>
              <div className="relative lg:flex-1">
                <button className="relative w-full bg-black border border-green-300 p-3 md:p-5 rounded-xl overflow-hidden flex items-center space-x-3 md:space-x-4 shadow-lg hover:shadow-xl h-full group">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-money relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm md:text-lg font-semibold text-white relative z-10">Nový klient</span>
                </button>
              </div>
            </div>

            <style jsx>{`
              @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
            {/* Invoice Statistics */}
            <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Statistiky faktur</h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-money rounded-full"></div>
                    <span className="text-sm text-gray-300">Zaplacené faktury</span>
                  </div>
                  <span className="text-sm font-medium text-white">72%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">Nezaplacené faktury</span>
                  </div>
                  <span className="text-sm font-medium text-white">23%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-sm text-gray-300 whitespace-nowrap">Po splatnosti</span>
                  </div>
                  <span className="text-sm font-medium text-white">5%</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Průměrná doba splatnosti</span>
                  <span className="text-sm font-medium text-white">14 dní</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Poslední aktivita</h3>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {[
                  { action: "Faktura #2505 byla vytvořena", time: "před 5 min", icon: FileText, color: "money" },
                  { action: "Platba od ACME Corp přijata", time: "před 1 hod", icon: CheckCircle, color: "green" },
                  { action: "Nový klient Beta Ltd přidán", time: "před 2 hod", icon: Users, color: "blue" },
                  { action: "Faktura #2504 byla odeslána", time: "včera", icon: FileText, color: "orange" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-950/70 rounded-lg border border-gray-700/50 hover:border-gray-600/70 transition-all">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${
                      activity.color === 'money' ? 'bg-money/20 border border-money/40' :
                      activity.color === 'green' ? 'bg-green-900/40 border border-green-500/40' :
                      activity.color === 'blue' ? 'bg-blue-900/40 border border-blue-500/40' :
                      'bg-orange-900/40 border border-orange-500/40'
                    }`}>
                      <activity.icon className={`w-4 h-4 ${
                        activity.color === 'money' ? 'text-money' :
                        activity.color === 'green' ? 'text-green-400' :
                        activity.color === 'blue' ? 'text-blue-400' :
                        'text-orange-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{activity.action}</div>
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
    </div>
  );
} 