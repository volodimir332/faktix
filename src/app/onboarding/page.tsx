"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaktixLogo } from "@/components/FaktixLogo";
import { Check, Loader2, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface OnboardingData {
  company: {
    name: string;
    ico: string;
    dic: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    subjectType: string; // Fyzická osoba / Právnická osoba
    vatPayer: boolean;
  };
  banking: {
    accountNumber: string;
    bankCode: string;
    iban: string;
    swift: string;
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    company: {
      name: "",
      ico: "",
      dic: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Česká republika",
      subjectType: "Fyzická osoba",
      vatPayer: false,
    },
    banking: {
      accountNumber: "",
      bankCode: "",
      iban: "",
      swift: "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/prihlaseni");
    }
  }, [isAuthenticated, router]);

  const update = (section: keyof OnboardingData, field: string, value: string | boolean) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value } as Record<string, string>,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (typeof window !== "undefined") {
        // Зберігаємо у спільний профіль, щоб відобразилося в кабінеті
        const mergedProfile = {
          personal: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: data.company.address,
            city: data.company.city,
            postalCode: data.company.postalCode,
            country: data.company.country,
          },
          company: {
            name: data.company.name,
            ico: data.company.ico,
            dic: data.company.dic,
            address: data.company.address,
            city: data.company.city,
            postalCode: data.company.postalCode,
            country: data.company.country,
            website: "",
            businessType: data.company.subjectType,
            typZivnosti: "",
          },
          banking: {
            accountNumber: data.banking.accountNumber,
            bankName: data.banking.bankCode,
            iban: data.banking.iban,
            swift: data.banking.swift,
            currency: "CZK",
          },
          preferences: {
            language: "cs",
            currency: "CZK",
            timezone: "Europe/Prague",
            notifications: true,
          },
        };
        localStorage.setItem("faktix-profile", JSON.stringify(mergedProfile));
      }
      router.push("/dashboard");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-gray-900/50 border border-gray-700 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <FaktixLogo size="xl" className="justify-center" />
          <h1 className="text-2xl font-bold mt-4">Potvrďte správnost svých údajů</h1>
          <p className="text-gray-400 mt-2">Údaje si zde můžete ještě upravit. Vše uložíme do vašeho profilu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Firemní údaje</h2>
            <div>
              <label className="text-sm text-gray-300">Firma/Jméno *</label>
              <input className="minimal-input w-full px-3 py-2" value={data.company.name} onChange={e=>update('company','name',e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-sm text-gray-300">IČ *</label>
                <input className="minimal-input w-full px-3 py-2" value={data.company.ico} onChange={e=>update('company','ico',e.target.value)} placeholder="Vyhledat české IČ" />
              </div>
              <div className="flex items-end">
                <button className="px-3 py-2 bg-money text-black rounded-lg w-full" type="button">
                  <Search className="w-4 h-4 inline mr-1" /> Vyhledat
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-300">Ulice a číslo popisné *</label>
              <input className="minimal-input w-full px-3 py-2" value={data.company.address} onChange={e=>update('company','address',e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-300">Město *</label>
                <input className="minimal-input w-full px-3 py-2" value={data.company.city} onChange={e=>update('company','city',e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-300">PSČ *</label>
                <input className="minimal-input w-full px-3 py-2" value={data.company.postalCode} onChange={e=>update('company','postalCode',e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-300">Typ subjektu</label>
                <select className="minimal-input w-full px-3 py-2 bg-black" value={data.company.subjectType} onChange={e=>update('company','subjectType',e.target.value)}>
                  <option>Fyzická osoba</option>
                  <option>Právnická osoba</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300">Plátce DPH</label>
                <select className="minimal-input w-full px-3 py-2 bg-black" value={data.company.vatPayer? 'yes':'no'} onChange={e=>update('company','vatPayer', e.target.value==='yes')}>
                  <option value="no">Ne</option>
                  <option value="yes">Ano</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-300">DIČ</label>
              <input className="minimal-input w-full px-3 py-2" value={data.company.dic} onChange={e=>update('company','dic',e.target.value)} />
            </div>
          </div>

          {/* Banking */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Bankovní účet</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-300">Číslo účtu</label>
                <input className="minimal-input w-full px-3 py-2" value={data.banking.accountNumber} onChange={e=>update('banking','accountNumber',e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-300">Kód banky</label>
                <input className="minimal-input w-full px-3 py-2" value={data.banking.bankCode} onChange={e=>update('banking','bankCode',e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-300">IBAN</label>
              <input className="minimal-input w-full px-3 py-2" value={data.banking.iban} onChange={e=>update('banking','iban',e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-300">SWIFT</label>
              <input className="minimal-input w-full px-3 py-2" value={data.banking.swift} onChange={e=>update('banking','swift',e.target.value)} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button className="px-5 py-2 bg-gray-700 rounded-lg">Odhásit</button>
          <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 bg-money text-black rounded-lg flex items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
            Potvrzuji
          </button>
        </div>
      </div>
    </div>
  );
}







