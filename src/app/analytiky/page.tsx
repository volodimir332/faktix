"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Calculator, 
  TrendingUp, 
  Building, 
  AlertTriangle,
  Info
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { getUserProfileFromStorage } from "@/lib/user-profile-analyzer";
import { calculateTaxes, getBusinessAdvice, getBusinessTypeDisplayName } from "@/lib/universal-tax-calculator";
import { UserProfile, TaxCalculationResult } from "@/lib/user-profile-analyzer";

export default function AnalytikyPage() {
  const router = useRouter();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [yearlyIncome, setYearlyIncome] = useState<number>(500000);
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Завантажуємо профіль користувача при завантаженні сторінки
  useEffect(() => {
    const profile = getUserProfileFromStorage();
    console.log('Analytics page - loaded profile:', profile);
    setUserProfile(profile);
    setIsLoading(false);
  }, []);

  // Розраховуємо податки при зміні доходу або профілю
  useEffect(() => {
    if (userProfile) {
      console.log('Calculating taxes for user type:', userProfile.userType);
      const calculation = calculateTaxes(userProfile, yearlyIncome);
      console.log('Tax calculation result:', calculation);
      setTaxCalculation(calculation);
    }
  }, [userProfile, yearlyIncome]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-money mx-auto mb-4"></div>
            <p className="text-gray-400">Načítání analýzy...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Profil nebyl nalezen
              </h2>
              <p className="text-gray-400 mb-6">
                Pro zobrazení analýzy je nutné vyplnit údaje v sekci &quot;Můj profil&quot;.
              </p>
              <button
                onClick={() => router.push('/profil')}
                className="bg-money hover:bg-money-light text-black px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Vyplnit profil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Analýza podnikání</h1>
            <p className="text-gray-400">
              Automatická analýza vašeho podnikání a daňových povinností
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profil podnikání */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-money/20 rounded-lg">
                  <Building className="w-5 h-5 text-money" />
                </div>
                <h3 className="text-xl font-semibold text-white">Profil podnikání</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Typ podnikání
                  </label>
                  <div className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    {getBusinessTypeDisplayName(userProfile)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Název
                  </label>
                  <div className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                         {userProfile.tradeName || userProfile.companyName || "—"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    IČO
                  </label>
                  <div className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    {userProfile.ico}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    DIČ
                  </label>
                  <div className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    {userProfile.dic || "Neplátce DPH"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Roční obrat (Kč)
                  </label>
                  <input
                    type="number"
                    value={yearlyIncome}
                    onChange={(e) => setYearlyIncome(Number(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-money"
                    placeholder="500000"
                  />
                </div>
              </div>
            </div>

            {/* Rychlý výpočet daní */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-money/20 rounded-lg">
                  <Calculator className="w-5 h-5 text-money" />
                </div>
                <h3 className="text-xl font-semibold text-white">Rychlý výpočet daní</h3>
              </div>

              {taxCalculation && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Daň z příjmů
                    </label>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-semibold">
                      {typeof taxCalculation.incomeTax === 'number' 
                        ? `${taxCalculation.incomeTax.toLocaleString()} Kč`
                        : taxCalculation.incomeTax
                      }
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sociální pojištění
                    </label>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-semibold">
                      {typeof taxCalculation.social === 'number' 
                        ? `${taxCalculation.social.toLocaleString()} Kč`
                        : taxCalculation.social
                      }
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Zdravotní pojištění
                    </label>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-semibold">
                      {typeof taxCalculation.health === 'number' 
                        ? `${taxCalculation.health.toLocaleString()} Kč`
                        : taxCalculation.health
                      }
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-600">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Celkem k úhradě
                    </label>
                    <div className="bg-money/20 border border-money/30 rounded-lg px-3 py-2 text-money font-bold text-lg">
                      {typeof taxCalculation.total === 'number' 
                        ? `${taxCalculation.total.toLocaleString()} Kč`
                        : taxCalculation.total
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Měsíční platby - тільки для OSVČ */}
          {userProfile.userType === 'OSVC' && taxCalculation?.monthlyPayments && (
            <div className="mt-8 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-money/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-money" />
                </div>
                <h3 className="text-xl font-semibold text-white">Měsíční platby</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sociální pojištění (měsíčně)
                  </label>
                  <div className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-semibold">
                    {taxCalculation.monthlyPayments.social.toLocaleString()} Kč
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Zdravotní pojištění (měsíčně)
                  </label>
                  <div className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white font-semibold">
                    {taxCalculation.monthlyPayments.health.toLocaleString()} Kč
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chytrá rada */}
          <div className="mt-8 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Chytrá rada</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {getBusinessAdvice(userProfile)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 