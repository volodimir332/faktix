"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import AIAccountantChat from "@/components/AIAccountantChat";
import { 
  Calculator, 
  BarChart3, 
  Shield, 
  Building, 
  PieChart as PieIcon,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Sparkles
} from "lucide-react";
import { getUserProfileFromStorage } from "@/lib/user-profile-analyzer";
import { calculateTaxes, getBusinessTypeDisplayName } from "@/lib/universal-tax-calculator";
import { UserProfile, TaxCalculationResult } from "@/lib/user-profile-analyzer";
import { CZECH_TAX_CONFIG_2025 } from "@/lib/tax_config_2025";
import { useInvoices } from "@/contexts/InvoiceContext";

export default function UcetnictviPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [income, setIncome] = useState<number>(500000);
  const [calc, setCalc] = useState<TaxCalculationResult | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const { invoices } = useInvoices();

  useEffect(() => {
    setProfile(getUserProfileFromStorage());
  }, []);

  useEffect(() => {
    if (profile) setCalc(calculateTaxes(profile, income));
  }, [profile, income]);

  // Calculate invoice statistics
  const invoiceStats = {
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'sent').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    totalPaid: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
    totalPending: invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0),
  };

  // Calculate year progress (use suppression to avoid hydration mismatch)
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const yearProgress = ((invoiceStats.totalPaid / 2000000) * 100).toFixed(1);
  const vatProgress = ((invoiceStats.totalPaid / CZECH_TAX_CONFIG_2025.VAT_REGISTRATION_LIMIT) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      <div className="ml-16 p-8 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Účetnictví a Analýza</h1>
              <p className="text-gray-400">Kompletní přehled daní, odvodů, faktur a limitů</p>
            </div>
            
            {/* AI Chat Toggle */}
            <button
              onClick={() => setShowAIChat(!showAIChat)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-money to-money/80 hover:from-money/90 hover:to-money/70 text-black font-semibold rounded-lg transition-all shadow-lg hover:shadow-money/50"
            >
              <Sparkles className="w-5 h-5" />
              <span>AI Бухгалтер</span>
            </button>
          </div>

          {/* AI Chat Sidebar */}
          {showAIChat && (
            <div className="fixed top-0 right-0 h-screen w-[450px] bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 shadow-2xl z-50 animate-slide-in-right">
              <AIAccountantChat 
                language="uk" 
                onClose={() => setShowAIChat(false)}
              />
            </div>
          )}

          {/* Profile Summary */}
          {profile && (
            <div className="bg-gradient-to-br from-money/10 to-money/5 border border-money/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-6 h-6 text-money" />
                <h2 className="text-xl font-bold">Profil podnikání</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Typ podnikání</div>
                  <div className="text-white font-semibold mt-1">{getBusinessTypeDisplayName(profile)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">IČO</div>
                  <div className="text-white font-semibold mt-1">{profile.ico || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">DPH plátce</div>
                  <div className="text-white font-semibold mt-1">{profile.dic ? 'Ano' : 'Ne'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Roční příjem (upravit)</div>
                  <input 
                    type="number" 
                    value={income} 
                    onChange={(e) => setIncome(Number(e.target.value))} 
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white mt-1 focus:outline-none focus:border-money"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Invoice Statistics */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-money" />
              Stav faktur
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">{invoiceStats.paid}</span>
                </div>
                <div className="text-sm text-gray-400">Zaplacené</div>
                <div className="text-xs text-green-300 mt-1" suppressHydrationWarning>
                  {mounted ? invoiceStats.totalPaid.toLocaleString('cs-CZ') : invoiceStats.totalPaid} Kč
                </div>
              </div>
              
              <div className="bg-orange-900/20 border border-orange-700/30 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-400">{invoiceStats.pending}</span>
                </div>
                <div className="text-sm text-gray-400">Čekající</div>
                <div className="text-xs text-orange-300 mt-1" suppressHydrationWarning>
                  {mounted ? invoiceStats.totalPending.toLocaleString('cs-CZ') : invoiceStats.totalPending} Kč
                </div>
              </div>
              
              <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-2xl font-bold text-red-400">{invoiceStats.overdue}</span>
                </div>
                <div className="text-sm text-gray-400">Prošlé</div>
              </div>
              
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-400">{invoiceStats.draft}</span>
                </div>
                <div className="text-sm text-gray-400">Koncepty</div>
              </div>
            </div>
          </div>

          {/* Tax Calculations */}
          {calc && (
            <>
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-money" />
                  Daňové zatížení
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-600/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-5 h-5 text-emerald-300"/>
                      <span className="font-semibold">Daň z příjmů</span>
                    </div>
                  <div className="text-3xl font-bold text-emerald-200" suppressHydrationWarning>
                    {typeof calc.incomeTax === 'number' ? `${mounted ? calc.incomeTax.toLocaleString('cs-CZ') : calc.incomeTax} Kč` : calc.incomeTax}
                  </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-600/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-blue-300"/>
                      <span className="font-semibold">Sociální pojištění</span>
                    </div>
                  <div className="text-3xl font-bold text-blue-200" suppressHydrationWarning>
                    {typeof calc.social === 'number' ? `${mounted ? calc.social.toLocaleString('cs-CZ') : calc.social} Kč` : calc.social}
                  </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-600/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-purple-300"/>
                      <span className="font-semibold">Zdravotní pojištění</span>
                    </div>
                  <div className="text-3xl font-bold text-purple-200" suppressHydrationWarning>
                    {typeof calc.health === 'number' ? `${mounted ? calc.health.toLocaleString('cs-CZ') : calc.health} Kč` : calc.health}
                  </div>
                  </div>
                </div>
              </div>

              {/* Total and Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">Celkem k úhradě ročně</div>
                <div className="text-money text-4xl font-extrabold mb-4" suppressHydrationWarning>
                  {typeof calc.total === 'number' ? `${mounted ? calc.total.toLocaleString('cs-CZ') : calc.total} Kč` : calc.total}
                </div>
                <div className="text-sm text-gray-400 mb-2">Měsíční průměr</div>
                <div className="text-gray-300 text-2xl font-bold" suppressHydrationWarning>
                  {typeof calc.total === 'number' ? `${mounted ? Math.round(calc.total / 12).toLocaleString('cs-CZ') : Math.round(calc.total / 12)} Kč` : '—'}
                </div>
                </div>
                
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                  <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-money"/>
                    Rozložení daní a odvodů
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                    <div className="bg-emerald-900/30 border border-emerald-700/30 rounded-lg p-3 text-center">
                      <div className="text-emerald-300 font-bold">Daň</div>
                      <div className="text-gray-300 mt-1">
                        {typeof calc.incomeTax === 'number' ? `${calc.incomeTax.toLocaleString()} Kč` : calc.incomeTax}
                      </div>
                    </div>
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-lg p-3 text-center">
                      <div className="text-blue-300 font-bold">Sociální</div>
                      <div className="text-gray-300 mt-1">
                        {typeof calc.social === 'number' ? `${calc.social.toLocaleString()} Kč` : calc.social}
                      </div>
                    </div>
                    <div className="bg-purple-900/30 border border-purple-700/30 rounded-lg p-3 text-center">
                      <div className="text-purple-300 font-bold">Zdravotní</div>
                      <div className="text-gray-300 mt-1">
                        {typeof calc.health === 'number' ? `${calc.health.toLocaleString()} Kč` : calc.health}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Limits and Progress */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-money" />
              Limity a průběh roku
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* OSVČ Limit */}
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Roční limit OSVČ</span>
                  <span className="text-white font-bold">{yearProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-money h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(parseFloat(yearProgress), 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500" suppressHydrationWarning>
                    {mounted ? invoiceStats.totalPaid.toLocaleString('cs-CZ') : invoiceStats.totalPaid} Kč
                  </span>
                  <span className="text-gray-500">2 000 000 Kč</span>
                </div>
              </div>

              {/* VAT Limit */}
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">DPH registrace limit</span>
                  <span className="text-white font-bold">{vatProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(parseFloat(vatProgress), 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500" suppressHydrationWarning>
                    {mounted ? invoiceStats.totalPaid.toLocaleString('cs-CZ') : invoiceStats.totalPaid} Kč
                  </span>
                  <span className="text-gray-500" suppressHydrationWarning>
                    {mounted ? CZECH_TAX_CONFIG_2025.VAT_REGISTRATION_LIMIT.toLocaleString('cs-CZ') : '2000000'} Kč
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-money" />
              Důležité termíny 2025
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-money font-bold">25. 1.</div>
                <div className="text-sm text-gray-300 mt-1">DPH za prosinec</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-money font-bold">1. 4.</div>
                <div className="text-sm text-gray-300 mt-1">Daňové přiznání</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-money font-bold">1. 7.</div>
                <div className="text-sm text-gray-300 mt-1">Přehled SP a ZP</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-money font-bold">31. 12.</div>
                <div className="text-sm text-gray-300 mt-1">Konec účetního roku</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
