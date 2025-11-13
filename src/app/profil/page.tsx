"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Edit3,
  User,
  Building,
  CreditCard,
  Check,
  X,
  FileText,
  Users,
  Activity,
  Settings,
  Search,
  Loader2,
  Euro
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { searchByICO, determineBusinessType } from "@/lib/ares-api";

interface ProfileData {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  company: {
    name: string;
    ico: string;
    dic: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    website: string;
    businessType: string;
    typZivnosti: string;
  };
  banking: {
    accountNumber: string;
    bankName: string;
    iban: string;
    swift: string;
    currency: string;
  };
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    notifications: boolean;
  };
}

export default function ProfilPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [icoInput, setIcoInput] = useState("");
  const [profileData, setProfileData] = useState<ProfileData>({
    personal: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Česká republika"
    },
    company: {
      name: "",
      ico: "",
      dic: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Česká republika",
      website: "",
      businessType: "",
      typZivnosti: ""
    },
    banking: {
      accountNumber: "",
      bankName: "",
      iban: "",
      swift: "",
      currency: "CZK"
    },
    preferences: {
      language: "cs",
      currency: "CZK",
      timezone: "Europe/Prague",
      notifications: true
    }
  });

  // Rozšířený seznam živností pro ruční výběr (skupiny + příklady)
  const ZIVNOST_OPTIONS: { group: string; options: string[] }[] = [
    { group: 'Hlavní kategorie', options: [
      'Živnost volná',
      'Řemeslná živnost',
      'Vázaná živnost',
      'Koncesovaná živnost'
    ] },
    { group: 'Řemeslné (příklady)', options: [
      'Zednictví',
      'Tesařství',
      'Truhlářství',
      'Malířství a natěračství',
      'Instalatérství a topenářství',
      'Holičství a kadeřnictví',
      'Pekařství a cukrářství'
    ] },
    { group: 'Vázané (příklady)', options: [
      'Projektová činnost ve výstavbě',
      'Geologické práce',
      'Masérské, rekondiční a regenerační služby',
      'Poskytování tělovýchovných a sportovních služeb',
      'Oční optika'
    ] },
    { group: 'Koncesované (příklady)', options: [
      'Silniční motorová doprava',
      'Ostraha majetku a osob',
      'Zprostředkování zaměstnání',
      'Výroba a prodej zbraní a střeliva',
      'Provádění pyrotechnického průzkumu'
    ] }
  ];

  const isZivnostCompany = (value?: string) => {
    const s = (value || '').toLowerCase();
    return s.includes('živnost') || s.includes('osvč') || s.includes('fyzická');
  };

  // Завантажуємо дані профілю при ініціалізації
  useEffect(() => {
    const savedData = loadProfileData();
    if (savedData) {
      setProfileData(savedData);
    }
    
    // Якщо є користувач, оновлюємо email
    if (user?.email) {
      setProfileData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          email: user.email || prev.personal.email
        }
      }));
    }
  }, [user]);

  const saveProfileData = (data: ProfileData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('faktix-profile', JSON.stringify(data));
    }
  };

  const loadProfileData = (): ProfileData | null => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('faktix-profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Error loading profile data:', error);
        }
      }
    }
    return null;
  };

  const handleSave = (section: keyof ProfileData) => {
    saveProfileData(profileData);
    setIsEditing(null);
  };

  const handleCancel = () => {
    const savedData = loadProfileData();
    if (savedData) {
      setProfileData(savedData);
    }
    setIsEditing(null);
  };

  const updateData = (section: keyof ProfileData, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAutoFillCompany = async () => {
    if (!icoInput) {
      alert("Prosím zadejte IČ pro vyhledání");
      return;
    }

    setIsLoadingCompany(true);
    setLoadingStep('Vyhledávám firmu...');

    try {
      const result = await searchByICO(icoInput);
      
      if (result.success && result.data) {
        const companyData = result.data;
        
        setProfileData(prev => ({
          ...prev,
          company: {
            ...prev.company,
            name: companyData.obchodniJmeno,
            ico: companyData.ico,
            dic: companyData.dic || "",
            address: `${companyData.adresa.ulice} ${companyData.adresa.cisloOrientacni || companyData.adresa.cisloEvidencni || ""}`.trim(),
            city: companyData.adresa.mesto,
            postalCode: companyData.adresa.psc,
            // Автоматично визначимо тип підприємства (чи це ОСВЧ)
            businessType: determineBusinessType(companyData.pravniForma),
            // Тип живності користувач обере вручну (за замовчуванням порожньо)
            typZivnosti: prev.company.typZivnosti || ""
          }
        }));

        setLoadingStep('Firma nalezena a vyplněna!');
        setTimeout(() => setLoadingStep(''), 2000);
      } else {
        setLoadingStep('Firma nebyla nalezena');
        setTimeout(() => setLoadingStep(''), 3000);
      }
    } catch (error) {
      console.error('ARES API error:', error);
      setLoadingStep('Chyba při vyhledávání');
      setTimeout(() => setLoadingStep(''), 3000);
    } finally {
      setIsLoadingCompany(false);
    }
  };

  const renderField = (
    section: keyof ProfileData,
    field: string,
    label: string,
    value: string,
    type: string = "text",
    placeholder?: string
  ) => (
    <div key={field} className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      {isEditing === section ? (
        <input
          type={type}
          value={value}
          onChange={(e) => updateData(section, field, e.target.value)}
          className="minimal-input w-full px-3 py-2"
          placeholder={placeholder || label}
        />
      ) : (
        <div className="minimal-input w-full px-3 py-2 bg-gray-800/50 text-gray-300">
          {value || "Není vyplněno"}
        </div>
      )}
    </div>
  );

  const renderSection = (
    section: keyof ProfileData,
    title: string,
    icon: React.ReactNode,
    fields: { key: string; label: string; type?: string; placeholder?: string }[]
  ) => (
    <div key={section} className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-money/10 rounded-lg">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="flex space-x-2">
          {isEditing === section ? (
            <>
              <button
                onClick={() => handleSave(section)}
                className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                title="Uložit"
              >
                <Check className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                title="Zrušit"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(section)}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              title="Upravit"
            >
              <Edit3 className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
      
      {/* Спеціальний блок для компанії з ARES пошуком – ПЕРЕНЕСЕНО ВГОРУ і ЗМЕНШЕНО В ШИРИНУ */}
      {section === 'company' && (
        <div className="mt-2 p-3 bg-gray-800/30 rounded-lg border border-gray-600/50 md:w-1/2">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Automatické vyplnění z ARES
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={icoInput}
              onChange={(e) => setIcoInput(e.target.value)}
              placeholder="Zadejte IČ firmy"
              className="minimal-input flex-1 px-3 py-2 text-sm"
              disabled={isLoadingCompany}
            />
            <button
              onClick={handleAutoFillCompany}
              disabled={!icoInput || isLoadingCompany}
              className="px-3 py-2 text-sm bg-money hover:bg-money/80 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoadingCompany ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Najít
            </button>
          </div>
          {loadingStep && (
            <p className="text-xs text-gray-400 mt-2">{loadingStep}</p>
          )}
        </div>
      )}

      {/* Pole "Typ živnosti" bylo na žádost uživatele odstraněno z UI */}
      {/* Vlastní spodní řádek pro firemní typy: vlevo "Typ podnikání", vpravo
          (jen pro OSVČ) výběr "Typ živnosti". */}
      {section === 'company' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Typ podnikání */}
          {renderField('company', 'businessType', 'Typ podnikání', profileData.company.businessType)}

          {/* Typ živnosti jen pro OSVČ/Živnostník */}
          {isZivnostCompany(profileData.company.businessType) && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Typ živnosti</label>
              {isEditing === 'company' ? (
                <select
                  value={profileData.company.typZivnosti}
                  onChange={(e) => updateData('company', 'typZivnosti', e.target.value)}
                  className="minimal-input w-full px-3 py-2 bg-black text-white"
                >
                  <option value="">Vyberte typ…</option>
                  {ZIVNOST_OPTIONS.map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              ) : (
                <div className="minimal-input w-full px-3 py-2 bg-gray-800/50 text-gray-300">
                  {profileData.company.typZivnosti || 'Nedefinováno'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {fields.map(({ key, label, type, placeholder }) =>
          renderField(section, key, label, profileData[section][key as keyof typeof profileData[typeof section]], type, placeholder)
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      
      <div className="ml-16 pt-40 px-8 pb-8 pull-up-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl font-bold">Profil uživatele</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Přihlášen jako</p>
              <p className="font-medium">{user?.displayName || user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-8">
          {/* Personal Information */}
          {renderSection(
            'personal',
            'Osobní údaje',
            <User className="w-5 h-5 text-money" />,
            [
              { key: 'firstName', label: 'Jméno' },
              { key: 'lastName', label: 'Příjmení' },
              { key: 'email', label: 'E-mail', type: 'email' },
              { key: 'phone', label: 'Telefon', type: 'tel' },
              { key: 'address', label: 'Ulice a číslo popisné', placeholder: 'Cihelní 2674/91' },
              { key: 'city', label: 'Město' },
              { key: 'postalCode', label: 'PSČ' },
              { key: 'country', label: 'Země' }
            ]
          )}

          {/* Company Information */}
           {renderSection(
            'company',
            'Firemní údaje',
            <Building className="w-5 h-5 text-money" />,
            [
              { key: 'name', label: 'Název firmy' },
              { key: 'ico', label: 'IČ' },
              { key: 'dic', label: 'DIČ' },
              { key: 'address', label: 'Ulice a číslo popisné', placeholder: 'Technologická 377/8' },
              { key: 'city', label: 'Město' },
              { key: 'postalCode', label: 'PSČ' },
              { key: 'country', label: 'Země' },
               { key: 'website', label: 'Webové stránky', type: 'url' }
            ]
          )}

          {/* Banking Information */}
          {renderSection(
            'banking',
            'Bankovní údaje',
            <CreditCard className="w-5 h-5 text-money" />,
            [
              { key: 'accountNumber', label: 'Číslo účtu' },
              { key: 'bankName', label: 'Název banky' },
              { key: 'iban', label: 'IBAN' },
              { key: 'swift', label: 'SWIFT/BIC' },
              { key: 'currency', label: 'Měna' }
            ]
          )}

          {/* Preferences */}
          {renderSection(
            'preferences',
            'Nastavení',
            <Settings className="w-5 h-5 text-money" />,
            [
              { key: 'language', label: 'Jazyk' },
              { key: 'currency', label: 'Měna' },
              { key: 'timezone', label: 'Časové pásmo' }
            ]
          )}
        </div>

        {/* Statistics Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Celkem faktur</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <FileText className="w-8 h-8 text-money" />
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Celkem klientů</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <Users className="w-8 h-8 text-money" />
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Celkový obrat</p>
                <p className="text-2xl font-bold text-white">125,000 Kč</p>
              </div>
              <Euro className="w-8 h-8 text-money" />
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Nezaplacené</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <Activity className="w-8 h-8 text-money" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 